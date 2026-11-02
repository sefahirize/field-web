/**
 * The auth API boundary.
 *
 * Every network shape the auth flow depends on lives here. While
 * NEXT_PUBLIC_USE_MOCK_AUTH is "true" these resolve against an in-memory mock so
 * the whole app runs end-to-end with no backend. To go live:
 *
 *   1. set NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_USE_MOCK_AUTH=false
 *   2. adjust the paths / response mapping in the `real` object below
 *
 * Nothing outside this file needs to change.
 */
import axios from 'axios';

// Opt-IN, deliberately. This used to read `!== 'false'`, which meant an unset
// variable turned the mock ON — a production build with no env config would have
// accepted any email with the password "password". It is also never on in a
// production build, whatever the variable says.
const USE_MOCK = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

/* ------------------------------------------------------------------ mock -- */

const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@joinfield.com',
  name: 'Demo',
  surname: 'User',
  roles: ['ROLE_ADMIN'],
};

const MOCK_PASSWORD = 'password';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Mirrors the shape of a rejected axios call so callers handle both the same way.
const mockError = message => {
  const error = new Error(message);
  error.response = { status: 401, data: { message } };
  throw error;
};

const mockSession = () => ({
  access_token: `mock-access-${Date.now()}`,
  refresh_token: `mock-refresh-${Date.now()}`,
  expires_in: 3600,
  user: MOCK_USER,
});

const mock = {
  async login({ email, password }) {
    await delay();
    if (!email || !password) mockError('Email and password are required.');
    if (password !== MOCK_PASSWORD) {
      mockError(`Mock auth: sign in with any email and the password "${MOCK_PASSWORD}".`);
    }
    return { ...mockSession(), user: { ...MOCK_USER, email } };
  },

  async register({ email, name, surname }) {
    await delay();
    if (!email) mockError('Email is required.');
    // Mirrors the real backend: registering does not sign you in.
    return { requiresVerification: true, user: { ...MOCK_USER, email, name, surname } };
  },

  async getSession() {
    await delay(200);
    return MOCK_USER;
  },

  async requestPasswordReset({ email }) {
    await delay();
    if (!email) mockError('Email is required.');
    return { message: `Mock auth: a reset link would be sent to ${email}.` };
  },

  async verifyEmail({ token }) {
    await delay();
    if (!token) mockError('Verification token is missing.');
    return { message: 'Mock auth: email verified.' };
  },

  async resetPassword() {
    await delay();
    return { message: 'Password updated.' };
  },

  async refreshSession() {
    await delay(200);
    return mockSession();
  },

  async logout() {
    await delay(100);
    return { message: 'Signed out.' };
  },
};

/* ------------------------------------------------------------------ real -- */
/*
 * Verified against the running API on 2026-09-03 by calling it, not by reading
 * the Postman collection — the collection has no saved responses and its
 * `{{url}}` variable is undefined.
 *
 * Two things the collection does not tell you:
 *   - there is no `/auth/me`; `GET /profile` is the session endpoint
 *   - login returns `token`, but refresh returns `access_token`
 * Both are normalised here so nothing downstream has to know.
 */

// The JWT carries exp - iat = 900s. Sent as expires_in so tokenStorage can
// record an absolute expiry instead of trusting the token forever.
const ACCESS_TOKEN_TTL = 900;

/** The API says `lastname`; the app says `surname`. Normalised once, here. */
const toUser = u => (u ? { ...u, surname: u.surname ?? u.lastname ?? '' } : u);

/**
 * login/refresh payload -> the { access_token, refresh_token, expires_in, user }
 * the slice expects.
 *
 * The user object arrives under a different key depending on the endpoint:
 * login nests it under `data`, register under `user`. Both are read here.
 */
const toSession = (payload, fallbackRefresh) => ({
  access_token: payload.token ?? payload.access_token,
  refresh_token: payload.refresh_token ?? fallbackRefresh,
  expires_in: ACCESS_TOKEN_TTL,
  user: toUser(payload.data ?? payload.user),
});

const real = {
  async login({ email, password }) {
    const { data } = await axios.post('auth/login', { email, password });
    return toSession(data);
  },

  /**
   * Registering sends a verification email and answers with a token pair — but
   * the backend refuses to log in an unverified account ("account is not
   * verified"), so those tokens buy nothing. They are deliberately dropped and
   * the caller is told to wait for the email instead of being signed into a
   * session that cannot outlive its access token.
   */
  async register({ name, surname, email, password }) {
    // The API calls it `lastname`; the form calls it `surname`.
    const { data } = await axios.post('auth/register', { name, lastname: surname, email, password });
    return { requiresVerification: true, user: toUser(data.user ?? data.data) };
  },

  /** No /auth/me on this API — the profile endpoint is what rehydrates a session. */
  async getSession() {
    const { data } = await axios.get('profile');
    return toUser(data.data);
  },

  async requestPasswordReset({ email }) {
    const { data } = await axios.post('auth/forgot-password', { email });
    return data;
  },

  async resetPassword({ token, password }) {
    const { data } = await axios.post('auth/reset-password', { token, password });
    return data;
  },

  /**
   * POST /auth/verify-email with the token from the emailed link.
   * A bad token answers 400 {"error":"invalid token"} — confirmed against the API.
   */
  async verifyEmail({ token }) {
    const { data } = await axios.post('auth/verify-email', { token });
    return data;
  },

  /** Returns only a new access_token — the existing refresh token stays valid. */
  async refreshSession({ refresh_token }) {
    const { data } = await axios.post('auth/refresh-token', { refresh_token });
    return toSession(data, refresh_token);
  },

  async logout() {
    const { data } = await axios.post('auth/logout');
    return data;
  },
};

export const authApi = USE_MOCK ? mock : real;
export const isMockAuth = USE_MOCK;
