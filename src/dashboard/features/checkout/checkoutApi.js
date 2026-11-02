import axios from 'axios';
import { ROUTE_PATHS } from '@dashboard/data/paths';

/**
 * Reads the first non-empty value among several candidate keys.
 *
 * The checkout endpoints are young and have changed shape before (the Postman
 * collection still saves no responses), so each field is read under the name
 * it has today first and the names it is likely to take next after it. A
 * `data` wrapper is accepted too, since most of the API answers that way.
 */
const pick = (payload, keys) => {
  const sources = [payload, payload?.data].filter(source => source && typeof source === 'object');
  for (const source of sources) {
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== '') return source[key];
    }
  }
  return null;
};

/**
 * Stripe Checkout session -> one of `paid | open | pending | expired`.
 *
 * Stripe reports two fields: `status` (open | complete | expired) and
 * `payment_status` (paid | unpaid | no_payment_required). A completed session
 * can still be unpaid for a moment with delayed payment methods, so only
 * `payment_status` decides "paid".
 *
 * `open` is a session nobody has paid yet — the user opened Stripe's page and
 * left. That is not "still processing": waiting will not change it, and the
 * session can still be paid on its own page. `pending` is what is left: a
 * completed session whose payment has not settled, or an answer we cannot read.
 */
export const toPaymentState = payload => {
  const paymentStatus = String(pick(payload, ['payment_status', 'paymentStatus']) ?? '').toLowerCase();
  const status = String(pick(payload, ['status']) ?? '').toLowerCase();

  if (['paid', 'no_payment_required', 'succeeded'].includes(paymentStatus)) return 'paid';
  if (['expired', 'canceled', 'cancelled', 'failed'].includes(status)) return 'expired';
  if (['canceled', 'cancelled', 'failed'].includes(paymentStatus)) return 'expired';
  if (status === 'open') return 'open';
  return 'pending';
};

/**
 * Where Stripe sends the user afterwards, on whichever host the dashboard is
 * running.
 *
 * Without these the backend picks its own: the API's
 * https://joinfield-dashboard.vercel.app/api/v1/checkout/success and …/cancel,
 * which the Vercel rewrite hands straight to the API, so the user lands on its
 * raw JSON — and on the Vercel host even when checking out from localhost.
 * POST /checkout passes both fields through to Stripe, and Stripe fills in
 * {CHECKOUT_SESSION_ID} in each (verified 8 Oct 2026). The result page still
 * calls /checkout/success and /checkout/cancel itself, so the API hears about
 * the return either way.
 */
const returnUrls = basketId => {
  const origin = window.location.origin;
  const session = 'session_id={CHECKOUT_SESSION_ID}';
  return {
    success_url: `${origin}${ROUTE_PATHS.CHECKOUT_SUCCESS}?${session}`,
    cancel_url: `${origin}${ROUTE_PATHS.CHECKOUT_CANCEL}?${session}&basket_id=${encodeURIComponent(basketId)}`,
  };
};

export const checkoutApi = {
  /**
   * POST /checkout { basket_id, success_url, cancel_url } — opens a Stripe
   * Checkout session for a basket. See returnUrls for the two URLs.
   *
   * Verified against the live API on 5 Oct 2026. It does NOT place an order: it
   * answers 200 `{ checkout_url, session_id, payment_id, amount, currency }`
   * and the purchase only happens once the user pays on `checkout_url`
   * (checkout.stripe.com). Each call opens a new session, even for a basket
   * that already has one.
   *
   *  - 400 `{ errors: ["BasketID failed on required"] }` without an id.
   *  - 404 `{ error: "basketNotFound" }` for an id the server never made.
   *  - 401 `{ error: "auth_required", require_login, redirect_url: "/login",
   *    basket_id }` without a token. A guest basket must be claimed with
   *    POST /products/assign-basket after signing in, then checked out.
   *
   * `checkoutUrl` comes back null if a future version grants credits without a
   * payment step; the caller treats that as an order already placed.
   */
  async submit({ basketId }) {
    const { data } = await axios.post('checkout', { basket_id: basketId, ...returnUrls(basketId) });

    return {
      checkoutUrl: pick(data, ['checkout_url', 'payment_url', 'url', 'redirect_url']),
      sessionId: pick(data, ['session_id', 'sessionId']),
      paymentId: pick(data, ['payment_id', 'paymentId', 'id']),
      amount: pick(data, ['amount', 'total_price', 'total']),
      currency: pick(data, ['currency']),
      raw: data ?? null,
    };
  },

  /**
   * GET /checkout/success?session_id= — the state of a Stripe session.
   *
   * Answers 200 `{ success, status, payment_status, session_id }` for a real
   * session, and does not need a token. An unknown id answers 400 with
   * Stripe's own error serialised as a JSON *string* inside `error`
   * (`toApiError` unpacks it).
   *
   * There is no webhook route on the API, so this call is very likely what
   * grants the credits once a session is paid. It is called on every return
   * from Stripe for that reason, not just to show a status.
   */
  async status({ sessionId }) {
    const { data } = await axios.get('checkout/success', { params: { session_id: sessionId } });

    return {
      state: toPaymentState(data),
      sessionId: pick(data, ['session_id', 'sessionId']) ?? sessionId,
      raw: data ?? null,
    };
  },

  /**
   * GET /checkout/cancel — records that the user backed out of Stripe.
   *
   * Answers 200 `{ status: "cancelled", error_code: "user_cancelled", … }` and
   * echoes back whatever `session_id` and `basket_id` it is given. It does not
   * expire the Stripe session (/checkout/success still reports it "open"), so
   * it is informational for the backend; a failure here is ignored.
   */
  async cancel({ sessionId, basketId } = {}) {
    const params = {};
    if (sessionId) params.session_id = sessionId;
    if (basketId) params.basket_id = basketId;

    const { data } = await axios.get('checkout/cancel', { params });
    return data ?? null;
  },
};
