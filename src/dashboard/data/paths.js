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

/** `/app/documents/:uuid` for one document. */
export const documentPath = uuid => app(`/documents/${encodeURIComponent(uuid)}`);
