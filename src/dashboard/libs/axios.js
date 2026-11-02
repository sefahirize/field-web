import axios from 'axios';
import { sessionExpired } from '@dashboard/features/auth/authSlice';
import { toggleLoading } from '@dashboard/features/ui/uiSlice';
import { snackActions } from '@dashboard/libs/snackbar';
import { toApiError } from '@dashboard/libs/apiError';
import { clearSession, getAccessToken, getRefreshToken, setSession } from '@dashboard/libs/tokenStorage';

let store;

export const injectStore = _store => {
  store = _store;
};

/** Recognises the refresh call among the requests flowing through the interceptor. */
const REFRESH_PATH = 'auth/refresh-token';

/**
 * Ends a session the server has stopped honouring.
 *
 * The session lives in two places and both have to go. `clearSession()` empties
 * localStorage, but Redux holds its own `accessToken`, and that is the one
 * `selectIsAuthenticated` reads — so clearing storage alone left `RequireAuth`
 * happily rendering a protected page whose every request came back 401. The
 * app only recovered when the user reloaded and bootstrap re-read the now-empty
 * storage. Dispatching flips the guard immediately, which is what sends the
 * user to /login on the spot.
 *
 * Reading the Redux token *before* clearing also debounces the notice: when
 * several parallel requests 401 at once, the first call is the only one that
 * still sees a token, so the user gets one message instead of one per request.
 */
const expireSession = () => {
  const hadSession = Boolean(store?.getState()?.auth?.accessToken);

  clearSession();
  store?.dispatch(sessionExpired());

  if (hadSession) {
    snackActions.error('Your session has expired. Please sign in again.');
  }
};

/**
 * The refresh in flight, shared by every request that 401s while it runs.
 *
 * Without this, a page that fires several requests at once on an expired access
 * token (the dashboard sends five) started one refresh per request. Harmless on
 * a dead session, wasteful on a live one — and each refresh overwrote the token
 * the previous one had just stored. Now the first 401 starts the refresh and the
 * rest wait on the same promise.
 */
let refreshInFlight = null;

const refreshAccessToken = () => {
  if (!refreshInFlight) {
    const refreshToken = getRefreshToken();
    refreshInFlight = axios
      .post(REFRESH_PATH, { refresh_token: refreshToken })
      .then(({ data }) => {
        // This endpoint returns only a new access_token, so carry the existing
        // refresh token forward or the next 401 would have nothing to retry with.
        const accessToken = data.access_token ?? data.token;
        setSession({ access_token: accessToken, refresh_token: refreshToken, expires_in: 900 });
        return accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

/** The bearer token a request actually went out with. */
const sentToken = config => String(config?.headers?.Authorization ?? '').replace(/^Bearer\s+/, '') || null;

/*
 * Defaults to the proxied path, not to "/".
 *
 * The rewrites in next.config.ts forward /api/v1/* to the API in development
 * and production alike, so this works without any environment configuration.
 * (The old "/" fallback turned a missing variable into a silent 405: requests
 * went to /auth/login on the app's own origin, which does not accept a POST.)
 *
 * Set NEXT_PUBLIC_API_BASE_URL to an absolute URL to bypass the proxy entirely —
 * only sensible once the API has working HTTPS and CORS.
 */
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  config => {
    store?.dispatch(toggleLoading(true));
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    store?.dispatch(toggleLoading(false));
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    store?.dispatch(toggleLoading(false));
    return response;
  },
  async error => {
    store?.dispatch(toggleLoading(false));

    // A cancelled or network-level failure has no response to inspect.
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config;
    const { status, data } = error.response;

    // The refresh call is exempt from the recovery below, because it *is* the
    // recovery. An expired refresh token answers 401 too, and without this the
    // failure re-entered the branch on a brand-new config — one that had no
    // `_retry` flag yet — and fired another refresh, and another: an unbounded
    // loop of requests against a session that was already dead.
    const isRefreshCall = originalRequest?.url?.includes(REFRESH_PATH);

    if (status === 401 && !isRefreshCall) {
      // Nothing to retry with, or the retry itself came back 401 on a token the
      // server had just issued. Either way this session is over.
      if (!getRefreshToken() || originalRequest._retry) {
        expireSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // A slow request can 401 on the old token after another one has already
        // refreshed. The stored token is newer than the one it was sent with,
        // so retry with that instead of refreshing a second time.
        const current = getAccessToken();
        const accessToken = current && current !== sentToken(originalRequest) ? current : await refreshAccessToken();

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed — the session is genuinely dead.
        expireSession();
        return Promise.reject(refreshError);
      }
    }

    // Same three shapes as above — a bare `data.message` check stayed silent on
    // the two the API actually uses most. The refresh call is excluded: its
    // "invalid refresh token" is plumbing the user did not ask for, and the
    // caller above already reports the expiry in words that mean something.
    if (!isRefreshCall && data && (data.message || data.error || Array.isArray(data.errors))) {
      snackActions.error(toApiError(error).message);
    }

    return Promise.reject(error);
  },
);

export default axios;
