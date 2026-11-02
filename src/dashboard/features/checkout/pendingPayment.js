/**
 * The payment the user was sent to Stripe for, kept across the redirect.
 *
 * Leaving for checkout.stripe.com unloads the app, and Redux with it. What comes
 * back is whatever URL the backend gave Stripe as its return address — which may
 * or may not carry `session_id`. Keeping the session here means the result page
 * can still check the payment when it does not, and a cancelled payment can put
 * the basket back the way the user left it.
 *
 * The key starts with `jf_` so signing out clears it with the rest of the
 * session; another account on the same browser never sees it.
 */
const STORAGE_KEY = 'jf_pending_payment';

// Stripe Checkout sessions expire after 24 hours; nothing older can be paid.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const savePendingPayment = payment => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payment, createdAt: Date.now() }));
  } catch {
    /* storage unavailable — the result page falls back to the URL alone */
  }
};

export const readPendingPayment = () => {
  try {
    const payment = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!payment || typeof payment !== 'object') return null;
    if (!payment.createdAt || Date.now() - payment.createdAt > MAX_AGE_MS) {
      clearPendingPayment();
      return null;
    }
    return payment;
  } catch {
    return null;
  }
};

export const clearPendingPayment = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
};

/**
 * The Stripe page a stored payment can be resumed on, or null.
 *
 * The URL comes out of localStorage, so it is only followed when it is an https
 * address on stripe.com — nothing else is ever navigated to from here.
 */
export const readResumeUrl = payment => {
  try {
    const url = new URL(payment?.checkoutUrl);
    const onStripe = url.hostname === 'stripe.com' || url.hostname.endsWith('.stripe.com');
    return url.protocol === 'https:' && onStripe ? url.href : null;
  } catch {
    return null;
  }
};
