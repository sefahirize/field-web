import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { analyticsApi } from './analyticsApi';
import { toApiError } from '@dashboard/libs/apiError';

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (params, { rejectWithValue }) => {
  try {
    return await analyticsApi.summary(params);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const fetchAnalyticsOverview = createAsyncThunk('analytics/fetchOverview', async (_, { rejectWithValue }) => {
  try {
    return await analyticsApi.overview();
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

const initialState = {
  period: 'monthly',
  productKey: null, // null = all products
  data: null,
  status: 'idle',
  error: null,
  overview: null,
  overviewStatus: 'idle',
  overviewError: null,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setPeriod: (state, { payload }) => {
      state.period = payload;
    },
    setAnalyticsProduct: (state, { payload }) => {
      state.productKey = payload || null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnalytics.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.status = 'ready';
      })
      .addCase(fetchAnalytics.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not load analytics.';
      })
      .addCase(fetchAnalyticsOverview.pending, state => {
        state.overviewStatus = 'loading';
        state.overviewError = null;
      })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, { payload }) => {
        state.overview = payload;
        state.overviewStatus = 'ready';
      })
      .addCase(fetchAnalyticsOverview.rejected, (state, { payload }) => {
        state.overviewStatus = 'error';
        state.overviewError = payload?.message ?? 'Could not load your usage summary.';
      });
  },
});

export const { setPeriod, setAnalyticsProduct } = analyticsSlice.actions;
export default analyticsSlice.reducer;
