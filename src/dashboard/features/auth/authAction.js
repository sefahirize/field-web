import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { clearSession, setSession } from '@dashboard/libs/tokenStorage';
import { toApiError } from '@dashboard/libs/apiError';
import { clearPendingPayment } from '@dashboard/features/checkout/pendingPayment';

/**
 * The API reports failures three ways — `{errors:[...]}` for validation,
 * `{error:"..."}` for business rules like "email already exists", and a bare
 * status with no body. The shared normaliser handles all three; reading only
 * `.message` (as this did) turned every one of them into "Something went wrong".
 */
const toError = toApiError;

export const login = createAsyncThunk('auth/login', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const data = await authApi.login({ email, password });
    setSession(data);

    // Login answers with a narrower user than GET /profile: no credits, no
    // is_verified, no timestamps. Upgrade to the full record straight away so
    // the app is not holding a half-populated user until the next reload.
    dispatch(fetchSession());

    return data;
  } catch (error) {
    return rejectWithValue(toError(error));
  }
});

export const register = createAsyncThunk('auth/register', async (body, { rejectWithValue }) => {
  try {
    const data = await authApi.register(body);
    // Some backends sign the user in on register, some don't. Only persist a
    // session if one actually came back.
    if (data?.access_token) setSession(data);
    return data;
  } catch (error) {
    return rejectWithValue(toError(error));
  }
});

/** Re-hydrates the current user from a token that survived a page reload. */
export const fetchSession = createAsyncThunk('auth/fetchSession', async (_, { rejectWithValue }) => {
  try {
    return await authApi.getSession();
  } catch (error) {
    return rejectWithValue(toError(error));
  }
});

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({ email }, { rejectWithValue }) => {
    try {
      return await authApi.requestPasswordReset({ email });
    } catch (error) {
      return rejectWithValue(toError(error));
    }
  },
);

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async ({ token }, { rejectWithValue }) => {
  try {
    return await authApi.verifyEmail({ token });
  } catch (error) {
    return rejectWithValue(toError(error));
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (body, { rejectWithValue }) => {
  try {
    return await authApi.resetPassword(body);
  } catch (error) {
    return rejectWithValue(toError(error));
  }
});

/**
 * Always clears local state, even if the server call fails — a user who clicks
 * "log out" must end up logged out regardless of the network.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    /* ignore — local session is cleared either way */
  } finally {
    clearSession();
    // An unfinished Stripe payment belongs to this account; the next one to
    // sign in on this browser must not be offered it.
    clearPendingPayment();
  }
});
