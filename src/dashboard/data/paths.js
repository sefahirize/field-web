import { APP_BASE } from '@shared/contract';

// Every dashboard address lives under APP_BASE ("/app"); the landing owns the
// rest of the domain. Build paths from it, never write the prefix by hand.
const app = path => `${APP_BASE}${path}`;

export const ROUTE_PATHS = {
  // Protected
  DASHBOARD: APP_BASE,
  DOCUMENTS: app('/documents'),
  DOCUMENT_DETAIL: app('/documents/:uuid'),
  PRODUCTS: app('/products'),
  CREDIT_HISTORY: app('/credits'),
  API_CREDENTIALS: app('/api-keys'),
  ANALYTICS: app('/analytics'),
  PROFILE: app('/profile'),

  // Checkout
  // /checkout is where the pricing page hands a plan over (?plan= or
  // ?basket_id=); success and cancel are where Stripe sends the user back.
  CHECKOUT: app('/checkout'),
  CHECKOUT_SUCCESS: app('/checkout/success'),
  CHECKOUT_CANCEL: app('/checkout/cancel'),

  // Auth
  LOGIN: app('/login'),
  REGISTER: app('/register'),
  FORGOT_PASSWORD: app('/forgot-password'),
  RESET_PASSWORD: app('/reset-password'),
  VERIFY_EMAIL: app('/verify-email'),
};

/**
 * Other addresses Stripe may be told to return to.
 *
 * The return URLs live in the backend's Stripe configuration, which nobody on
 * this side has seen. These are the likely spellings — including the old Hirize
 * dashboard's /checkout/payment-result — so a return lands on the result page
 * whichever one the backend picked, instead of on a 404.
 */
export const CHECKOUT_SUCCESS_ALIASES = ['/checkout/payment-result', '/payment-result', '/payment/success'].map(app);
export const CHECKOUT_CANCEL_ALIASES = ['/payment/cancel', '/checkout/cancelled'].map(app);

/** `/app/documents/:uuid` for one document. */
export const documentPath = uuid => app(`/documents/${encodeURIComponent(uuid)}`);
