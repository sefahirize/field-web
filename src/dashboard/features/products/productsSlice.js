import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productsApi } from './productsApi';
import { toApiError } from '@dashboard/libs/apiError';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await productsApi.list();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    // The catalogue is effectively static, and several pages need it. Skip the
    // request when it is already loaded or in flight rather than refetching on
    // every navigation.
    condition: (_, { getState }) => {
      const { status } = getState().products;
      return status !== 'ready' && status !== 'loading';
    },
  },
);

const initialState = { items: [], status: 'idle', error: null };

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.items = payload ?? [];
        state.status = 'ready';
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not load products.';
      });
  },
});

export const selectProducts = state => state.products.items;
/** Only the ones the API marks for listing — `is_show_list` is its own flag, not `is_active`. */
export const selectListedProducts = state => state.products.items.filter(p => p.is_show_list);

export default productsSlice.reducer;
