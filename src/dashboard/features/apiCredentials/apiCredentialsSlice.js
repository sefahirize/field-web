import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiCredentialsApi } from './apiCredentialsApi';
import { processApi } from './processApi';
import { fetchCreditBalance } from '@dashboard/features/credits/creditsSlice';
import { toApiError } from '@dashboard/libs/apiError';

const guard = fn => async (arg, thunkApi) => {
  try {
    return await fn(arg, thunkApi);
  } catch (error) {
    return thunkApi.rejectWithValue(toApiError(error));
  }
};

export const fetchApiCredentials = createAsyncThunk('apiCredentials/fetch', guard(() => apiCredentialsApi.list()));

/** One key, read fresh — what the edit form starts from. */
export const fetchApiCredential = createAsyncThunk('apiCredentials/fetchOne', guard(id => apiCredentialsApi.get(id)));

/**
 * Sends one file (bare base64 — see libs/files) to POST /process with a key,
 * the way an API consumer would.
 * An HTTP error is an answer here, not a failure: the point is to see what the
 * endpoint says to that key, so status and body come back either way.
 */
export const runProcess = createAsyncThunk(
  'apiCredentials/runProcess',
  async ({ apiKey, productKey, fileName, data }, { dispatch, rejectWithValue }) => {
    try {
      const result = await processApi.run({ apiKey, productKey, fileName, data });
      dispatch(fetchCreditBalance());
      return { ok: true, ...result };
    } catch (error) {
      if (error?.response) return { ok: false, status: error.response.status, body: error.response.data };
      return rejectWithValue(toApiError(error));
    }
  },
);

// Every mutation reads the list back: none of them is known to return the row
// it changed, so the server's list is the only reliable picture.
export const createApiCredential = createAsyncThunk(
  'apiCredentials/create',
  guard(async (values, { dispatch }) => {
    const result = await apiCredentialsApi.create(values);
    dispatch(fetchApiCredentials());
    return { ...result, name: values.name };
  }),
);

export const updateApiCredential = createAsyncThunk(
  'apiCredentials/update',
  guard(async ({ id, values }, { dispatch }) => {
    const result = await apiCredentialsApi.update(id, values);
    dispatch(fetchApiCredentials());
    return result;
  }),
);

export const regenerateApiCredential = createAsyncThunk(
  'apiCredentials/regenerate',
  guard(async ({ id, values }, { dispatch }) => {
    const result = await apiCredentialsApi.regenerate(id, values);
    dispatch(fetchApiCredentials());
    return { ...result, name: values.name };
  }),
);

export const deleteApiCredential = createAsyncThunk(
  'apiCredentials/delete',
  guard(async (id, { dispatch }) => {
    const result = await apiCredentialsApi.remove(id);
    dispatch(fetchApiCredentials());
    return result;
  }),
);

const initialState = {
  items: [],
  status: 'idle', // idle | loading | ready | error
  error: null,
  saving: false,
  actionError: null,
  message: null,
  // The one-time secret from the last create/regenerate: { name, secret, raw }.
  revealed: null,
  process: { status: 'idle', result: null, error: null }, // idle | running | done | error
};

const MUTATIONS = [
  [createApiCredential, 'API key created.'],
  [updateApiCredential, 'API key updated.'],
  [regenerateApiCredential, 'API key regenerated. The old key no longer works.'],
  [deleteApiCredential, 'API key deleted.'],
];

export const apiCredentialsSlice = createSlice({
  name: 'apiCredentials',
  initialState,
  reducers: {
    dismissRevealed: state => {
      state.revealed = null;
    },
    // A success message is shown once, as a toast; this takes it off the state.
    consumeApiCredentialsMessage: state => {
      state.message = null;
    },
    clearApiCredentialsFeedback: state => {
      state.actionError = null;
      state.message = null;
      state.process = initialState.process;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchApiCredentials.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchApiCredentials.fulfilled, (state, { payload }) => {
        state.items = Array.isArray(payload) ? payload : [];
        state.status = 'ready';
      })
      .addCase(fetchApiCredentials.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not load your API keys.';
      })
      .addCase(fetchApiCredential.rejected, (state, { payload }) => {
        state.actionError = payload?.message ?? 'Could not load that key.';
      })
      .addCase(runProcess.pending, state => {
        state.process = { status: 'running', result: null, error: null };
      })
      .addCase(runProcess.fulfilled, (state, { payload }) => {
        state.process = { status: 'done', result: payload, error: null };
      })
      .addCase(runProcess.rejected, (state, { payload }) => {
        state.process = { status: 'error', result: null, error: payload?.message ?? 'Could not reach the API.' };
      });

    MUTATIONS.forEach(([thunk, message]) => {
      builder
        .addCase(thunk.pending, state => {
          state.saving = true;
          state.actionError = null;
          state.message = null;
        })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.saving = false;
          state.message = message;
          if (thunk === createApiCredential || thunk === regenerateApiCredential) state.revealed = payload;
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.saving = false;
          state.actionError = payload?.message ?? 'That did not work. Please try again.';
        });
    });
  },
});

export const { dismissRevealed, clearApiCredentialsFeedback, consumeApiCredentialsMessage } = apiCredentialsSlice.actions;
export default apiCredentialsSlice.reducer;
