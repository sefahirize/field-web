import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { creditsApi } from './creditsApi';
import { toApiError } from '@dashboard/libs/apiError';

export const fetchCreditBalance = createAsyncThunk('credits/fetchBalance', async (_, { rejectWithValue }) => {
  try {
    return await creditsApi.balance();
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const fetchCreditHistory = createAsyncThunk('credits/fetchHistory', async (query, { rejectWithValue }) => {
  try {
    return await creditsApi.history(query);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const fetchAllCredits = createAsyncThunk('credits/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await creditsApi.list();
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const fetchProductBalance = createAsyncThunk(
  'credits/fetchProductBalance',
  async (productKey, { rejectWithValue }) => {
    try {
      return { productKey, row: await creditsApi.balanceFor(productKey) };
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

/** POST /credits/use. Not "useCredits": that name reads as a React hook. */
export const spendCredits = createAsyncThunk('credits/spend', async (values, { dispatch, rejectWithValue }) => {
  try {
    const result = await creditsApi.use(values);
    dispatch(fetchCreditBalance());
    return result;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

const initialState = {
  balance: [],
  balanceStatus: 'idle',
  balanceError: null,
  history: [],
  historyMeta: { page: 1, limit: 20, total: 0, total_pages: 1 },
  historyStatus: 'idle',
  historyError: null,
  all: [],
  allStatus: 'idle',
  allError: null,
  // One product's row from /credits/balance?product_key=, by key.
  byProduct: {},
  spend: { status: 'idle', result: null, error: null },
};

export const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCreditBalance.pending, state => {
        state.balanceStatus = 'loading';
        state.balanceError = null;
      })
      .addCase(fetchCreditBalance.fulfilled, (state, { payload }) => {
        state.balance = payload ?? [];
        state.balanceStatus = 'ready';
      })
      .addCase(fetchCreditBalance.rejected, (state, { payload }) => {
        state.balanceStatus = 'error';
        state.balanceError = payload?.message ?? 'Could not load your credits.';
      })
      .addCase(fetchCreditHistory.pending, state => {
        state.historyStatus = 'loading';
        state.historyError = null;
      })
      .addCase(fetchCreditHistory.fulfilled, (state, { payload, meta }) => {
        // The first page replaces the list; later pages are added to it ("Load more").
        if ((meta.arg?.page ?? 1) > 1) {
          const seen = new Set(state.history.map(entry => entry.id));
          state.history = [...state.history, ...payload.items.filter(entry => !seen.has(entry.id))];
        } else {
          state.history = payload.items;
        }
        state.historyMeta = payload.meta;
        state.historyStatus = 'ready';
      })
      .addCase(fetchCreditHistory.rejected, (state, { payload }) => {
        state.historyStatus = 'error';
        state.historyError = payload?.message ?? 'Could not load your credit history.';
      })
      .addCase(fetchAllCredits.pending, state => {
        state.allStatus = 'loading';
        state.allError = null;
      })
      .addCase(fetchAllCredits.fulfilled, (state, { payload }) => {
        state.all = payload ?? [];
        state.allStatus = 'ready';
      })
      .addCase(fetchAllCredits.rejected, (state, { payload }) => {
        state.allStatus = 'error';
        state.allError = payload?.message ?? 'Could not load your credits.';
      })
      .addCase(fetchProductBalance.fulfilled, (state, { payload }) => {
        state.byProduct[payload.productKey] = payload.row;
      })
      .addCase(spendCredits.pending, state => {
        state.spend = { status: 'loading', result: null, error: null };
      })
      .addCase(spendCredits.fulfilled, (state, { payload }) => {
        state.spend = { status: 'done', result: payload, error: null };
      })
      .addCase(spendCredits.rejected, (state, { payload }) => {
        state.spend = { status: 'error', result: null, error: payload?.message ?? 'Could not use credits.' };
      });
  },
});

/**
 * The credit ledger. GET /credits/balance is the source once it has answered;
 * until then (or if it fails) the copy GET /profile brought with the session
 * stands in, so the page never flashes "No credits" while the balance loads.
 */
export const selectCredits = state =>
  state.credits.balanceStatus === 'ready' ? state.credits.balance : state.auth.user?.credits ?? [];

export default creditsSlice.reducer;
