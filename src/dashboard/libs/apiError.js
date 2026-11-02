/**
 * Normalises anything a rejected request can throw into one `{ message, status }`
 * shape, so every slice's `rejected` case can read the same fields.
 *
 * This API reports failures three different ways — `{message}`, `{errors:[...]}`
 * (see POST /products/price) and a bare status with no body — so all three are
 * handled here rather than in each thunk.
 */
export const toApiError = error => {
  const res = error?.response;
  const data = res?.data;
  const status = res?.status ?? null;

  let message =
    data?.message ||
    (Array.isArray(data?.errors) ? data.errors.join(' · ') : null) ||
    unpackError(data?.error) ||
    // No usable body. Unknown routes answer a plain-text "404 page not found",
    // and axios's own message ("Request failed with status code 404") is not
    // something to put in front of a user.
    statusMessage(status) ||
    'Something went wrong. Please try again.';

  if (!res) message = 'Could not reach the API. Check your connection.';

  return { message, status };
};

/**
 * `error` is usually a short string, but GET /checkout/success passes Stripe's
 * own error through as a serialised JSON object —
 * `"{\"code\":\"resource_missing\",…,\"message\":\"No such checkout.session…\"}"`
 * — which would otherwise reach the user verbatim, request log URL and all.
 */
const unpackError = error => {
  if (typeof error !== 'string' || !error.trim().startsWith('{')) return error || null;
  try {
    const parsed = JSON.parse(error);
    return parsed?.message || parsed?.error || null;
  } catch {
    return null;
  }
};

const statusMessage = status => {
  if (!status) return null;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have access to this.';
  if (status === 404) return 'This is not available right now.';
  // nginx in front of the API answers 413 with an HTML page when a body is too big.
  if (status === 413) return 'That is too large to send. Try a smaller file.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  // 502/503/504 from the proxy, 521 from Cloudflare when the origin is down.
  if ([502, 503, 504, 521].includes(status)) return 'The service is unavailable right now. Please try again shortly.';
  if (status >= 500) return 'The server ran into a problem. Please try again.';
  return null;
};

/**
 * GET /invoices answers 200 with an empty body, which axios hands over as ''.
 * Reading `.data.data` off that throws, so unwrap defensively.
 */
export const unwrap = (payload, fallback = null) => {
  if (!payload || typeof payload !== 'object') return fallback;
  return payload.data ?? fallback;
};
