import { createSlice } from '@reduxjs/toolkit';
import { getAccessToken, getRefreshToken, isSessionExpired, clearSession } from '@dashboard/libs/tokenStorage';
import {
  fetchSession,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from './authAction';

/**
 * A token left over from a previous visit.
 *
 * An expired access token is not the end of the session while a refresh token
 * remains: it lives 900 seconds, so dropping it here signed out anyone who
 * reloaded after a quarter of an hour. Keep it, and let the first 401 go
 * through the interceptor's refresh — which ends the session properly if the
 * refresh token is dead too.
 */
const bootstrapToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  if (isSessionExpired() && !getRefreshToken()) {
    clearSession();
    return null;
  }
  return token;
};

const initialState = {
  accessToken: bootstrapToken(),
  user: null,
  // Distinguishes "not logged in" from "haven't checked yet", so the app can
  // hold the guard until the session is resolved instead of flashing /login.
  status: 'idle', // idle | loading | authenticated | error
  error: null,
  message: null,
};

const startLoading = state => {
  state.status = 'loading';
  state.error = null;
  state.message = null;
};

const failWith = (state, { payload }) => {
  state.status = 'error';
  state.error = payload?.message ?? 'Something went wrong.';
};

const authenticate = (state, { payload }) => {
  state.accessToken = payload?.access_token ?? state.accessToken;
  state.user = payload?.user ?? state.user;
  state.status = state.accessToken ? 'authenticated' : 'idle';
  state.error = null;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
      state.message = null;
    },

    /**
     * The server rejected the session mid-visit: a refresh that failed, or a 401
     * with nothing left to retry with.
     *
     * Storage is cleared by the caller; this drops the copy Redux holds. Both
     * matter — `selectIsAuthenticated` reads the Redux copy, so clearing only
     * storage left the app rendering protected pages against a dead session
     * until the next manual reload re-read the (empty) storage.
     */
    sessionExpired: state => {
      state.accessToken = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, startLoading)
      .addCase(login.fulfilled, authenticate)
      .addCase(login.rejected, failWith)

      .addCase(register.pending, startLoading)
      .addCase(register.fulfilled, authenticate)
      .addCase(register.rejected, failWith)

      .addCase(fetchSession.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSession.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = 'authenticated';
      })
      .addCase(fetchSession.rejected, (state, { payload }) => {
        // Only the server saying no ends the session. A dropped connection or a
        // 5xx says nothing about the token, and signing the user out over a
        // network blip threw away a perfectly good session. (A 401 has already
        // been through the interceptor's refresh by the time it lands here, so
        // it really is final.)
        if (payload?.status === 401 || payload?.status === 403) {
          clearSession();
          state.accessToken = null;
          state.user = null;
          state.status = 'idle';
          return;
        }
        state.status = 'error';
        state.error = payload?.message ?? 'Could not load your account.';
      })

      .addCase(requestPasswordReset.pending, startLoading)
      .addCase(requestPasswordReset.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.message = payload?.message ?? null;
      })
      .addCase(requestPasswordReset.rejected, failWith)

      .addCase(resetPassword.pending, startLoading)
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.message = payload?.message ?? null;
      })
      .addCase(resetPassword.rejected, failWith)

      .addCase(verifyEmail.pending, startLoading)
      .addCase(verifyEmail.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.message = payload?.message ?? 'Your email is verified.';
        // If this user is already signed in, their session now reflects a
        // verified account; the next /profile read picks that up.
        if (state.user) state.user = { ...state.user, is_verified: true };
      })
      .addCase(verifyEmail.rejected, failWith)

      .addCase(logout.fulfilled, state => {
        state.accessToken = null;
        state.user = null;
        state.status = 'idle';
        state.error = null;
        state.message = null;
      });
  },
});

export const { clearAuthError, sessionExpired } = authSlice.actions;

export const selectIsAuthenticated = state => Boolean(state.auth.accessToken);
export const selectAuthUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.status === 'loading';

export default authSlice.reducer;
