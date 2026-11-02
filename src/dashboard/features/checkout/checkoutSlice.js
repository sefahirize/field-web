import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productsApi } from '@dashboard/features/products/productsApi';
import { checkoutApi } from './checkoutApi';
import { savePendingPayment } from './pendingPayment';
import { toApiError } from '@dashboard/libs/apiError';

/**
 * The basket the user is assembling, as `{ [productId]: usageCount }`.
 *
 * Holding the whole basket in one place is what keeps us honest about
 * /products/price replacing a basket rather than adding to it: every quote is
 * built from all of `lines`, so a line can never be dropped by being left out
 * of a request. Nothing here computes a price — the server tiers it by quantity
 * and its answer is the only one that counts.
 *
 * Buying is three steps on the API: price (creates the basket), checkout (opens
 * a Stripe Checkout session and hands back its URL), then the user pays on
 * Stripe and comes back to /checkout/success or /checkout/cancel, where
 * `checkPayment` / `cancelPayment` take over.
 */
const initialState = {
  lines: {},
  basketId: null,
  items: [],
  totalPrice: 0,
  quoteStatus: 'idle', // idle | loading | ready | error
  quoteError: null,
  quoteErrorProductId: null, // the line a failed quote points at, when the API names one
  orderStatus: 'idle', // idle | loading | redirecting | placed | error
  orderError: null,
  order: null,
  payment: {
    status: 'idle', // idle | loading | ready | error
    state: null, // paid | pending | expired — see checkoutApi.status
    error: null,
  },
};

/** `lines` -> the `details` array the API expects, skipping empty quantities. */
const toDetails = lines =>
  Object.entries(lines)
    .map(([productId, usageCount]) => ({ product_id: Number(productId), usage_count: Number(usageCount) }))
    .filter(line => line.usage_count > 0);

/** Priced items -> `lines`, for a basket that arrives already built. */
const toLines = items =>
  items.reduce((acc, line) => {
    if (line.productId && line.usageCount > 0) acc[line.productId] = line.usageCount;
    return acc;
  }, {});

const sameLines = (a = {}, b = {}) => {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => Number(a[key]) === Number(b[key]));
};

/** Applies a priced basket (from a quote or a claim) to the state. */
const applyBasket = (state, payload) => {
  // Keep the id: the next quote reuses this basket instead of leaving a
  // trail of abandoned ones, and it is what checkout is given.
  state.basketId = payload.basketId ?? state.basketId;
  state.items = payload.items;
  state.totalPrice = payload.totalPrice;
  state.quoteStatus = 'ready';
  state.quoteError = null;
  state.quoteErrorProductId = null;
  state.orderError = null;
};

export const quoteBasket = createAsyncThunk('checkout/quote', async (_, { getState, rejectWithValue }) => {
  const { lines, basketId } = getState().checkout;
  const details = toDetails(lines);

  if (details.length === 0) {
    return rejectWithValue({ message: 'Add a quantity to at least one product first.' });
  }

  try {
    // `requestedLines` travels back with the answer so the reducer can tell a
    // quote for the basket as it is from one for the basket as it was.
    return { ...(await productsApi.price({ details, basketId })), requestedLines: { ...lines } };
  } catch (error) {
    // Per-line failures ("Price not found for usage count", "Product cannot be
    // added twice") come back naming the product in `product_id`.
    return rejectWithValue({
      ...toApiError(error),
      productId: error?.response?.data?.product_id ?? null,
      requestedLines: { ...lines },
    });
  }
});

/**
 * Takes over a basket priced somewhere else (the pricing page, or this app
 * before the user signed in) by its id, and loads it as the current basket.
 */
export const claimBasket = createAsyncThunk('checkout/claim', async ({ basketId }, { rejectWithValue }) => {
  try {
    return await productsApi.assignBasket({ basketId });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/**
 * Opens a Stripe Checkout session for the priced basket.
 *
 * Does not navigate: the page redirects to `checkoutUrl` once this resolves.
 * The session is stored first, because the redirect unloads the app and the
 * result page needs something to check when Stripe sends the user back.
 */
export const submitOrder = createAsyncThunk('checkout/submit', async (_, { getState, rejectWithValue }) => {
  const { basketId, lines, totalPrice } = getState().checkout;

  // The basket only exists once it has been priced; there is no other way to
  // make one, so checking out before quoting is a bug, not a user error.
  if (!basketId) {
    return rejectWithValue({ message: 'Get a price before checking out.' });
  }

  try {
    const order = await checkoutApi.submit({ basketId });

    if (order.checkoutUrl) {
      savePendingPayment({
        sessionId: order.sessionId,
        paymentId: order.paymentId,
        // Lets a payment left open on Stripe be picked up again.
        checkoutUrl: order.checkoutUrl,
        amount: order.amount ?? totalPrice,
        currency: order.currency,
        basketId,
        lines,
      });
    }

    return order;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/** Asks the API whether a Stripe session has been paid. */
export const checkPayment = createAsyncThunk('checkout/checkPayment', async ({ sessionId }, { rejectWithValue }) => {
  try {
    return await checkoutApi.status({ sessionId });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/** Tells the API the user backed out of Stripe. Best effort — never fails the page. */
export const cancelPayment = createAsyncThunk('checkout/cancelPayment', async ({ sessionId, basketId } = {}) => {
  try {
    return await checkoutApi.cancel({ sessionId, basketId });
  } catch {
    return null;
  }
});

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    /**
     * Sets one product's quantity. The existing quote is marked stale rather
     * than kept: it belongs to the basket as it was, and showing yesterday's
     * total next to today's basket is how people buy the wrong thing.
     */
    setLine: (state, { payload: { productId, usageCount } }) => {
      const count = Number(usageCount);

      if (!count || count <= 0) delete state.lines[productId];
      else state.lines[productId] = count;

      state.items = [];
      state.totalPrice = 0;
      state.quoteStatus = 'idle';
      state.quoteError = null;
      state.quoteErrorProductId = null;
    },

    /**
     * Replaces the basket with a set of lines — a plan handed over from the
     * pricing page, or the basket a cancelled payment left behind. `basketId`
     * is kept when given so the next quote reuses that basket. Needs a fresh
     * quote either way: nothing here knows the price.
     */
    restoreBasket: (state, { payload: { lines = {}, basketId = null } }) => {
      state.lines = { ...lines };
      state.basketId = basketId;
      state.items = [];
      state.totalPrice = 0;
      state.quoteStatus = 'idle';
      state.quoteError = null;
      state.quoteErrorProductId = null;
      state.orderStatus = 'idle';
      state.orderError = null;
    },

    /** Clears the basket and forgets the server's copy of it. */
    resetBasket: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(quoteBasket.pending, state => {
        state.quoteStatus = 'loading';
        state.quoteError = null;
        state.quoteErrorProductId = null;
      })
      .addCase(quoteBasket.fulfilled, (state, { payload }) => {
        // The basket changed while this was in flight: its price is for lines
        // that are gone. Keep the id (the next quote reuses that basket) and
        // let the page ask again for the lines it has now.
        if (!sameLines(payload.requestedLines, state.lines)) {
          state.basketId = state.basketId ?? payload.basketId;
          return;
        }
        applyBasket(state, payload);
      })
      .addCase(quoteBasket.rejected, (state, { payload }) => {
        if (payload?.requestedLines && !sameLines(payload.requestedLines, state.lines)) return;
        state.quoteStatus = 'error';
        state.quoteError = payload?.message ?? 'Could not price this basket.';
        state.quoteErrorProductId = payload?.productId ?? null;
      })

      .addCase(claimBasket.pending, state => {
        state.quoteStatus = 'loading';
        state.quoteError = null;
      })
      .addCase(claimBasket.fulfilled, (state, { payload }) => {
        state.lines = toLines(payload.items);
        applyBasket(state, payload);
      })
      .addCase(claimBasket.rejected, (state, { payload }) => {
        state.quoteStatus = 'error';
        state.quoteError = payload?.message ?? 'Could not load that basket.';
      })

      .addCase(submitOrder.pending, state => {
        state.orderStatus = 'loading';
        state.orderError = null;
      })
      .addCase(submitOrder.fulfilled, (state, { payload }) => {
        state.order = payload;

        if (payload.checkoutUrl) {
          // The page is about to leave for Stripe. The basket stays as it is
          // until the payment is confirmed; a cancel brings it back from the
          // stored copy anyway, since this state does not survive the redirect.
          state.orderStatus = 'redirecting';
          return;
        }

        // No payment step in the answer: the order went through as it stood.
        // The basket is spent, so the next visit starts clean.
        state.orderStatus = 'placed';
        state.basketId = null;
        state.lines = {};
      })
      .addCase(submitOrder.rejected, (state, { payload }) => {
        state.orderStatus = 'error';
        state.orderError = payload?.message ?? 'Could not complete the checkout.';
      })

      .addCase(checkPayment.pending, state => {
        state.payment.status = 'loading';
        state.payment.error = null;
      })
      .addCase(checkPayment.fulfilled, (state, { payload }) => {
        state.payment.status = 'ready';
        state.payment.state = payload.state;
      })
      .addCase(checkPayment.rejected, (state, { payload }) => {
        state.payment.status = 'error';
        state.payment.error = payload?.message ?? 'Could not check this payment.';
      });
  },
});

export const { setLine, restoreBasket, resetBasket } = checkoutSlice.actions;

export const selectBasketLines = state => state.checkout.lines;
export const selectBasketCount = state => Object.keys(state.checkout.lines).length;

export default checkoutSlice.reducer;
