import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';

/**
 * A priced basket line.
 *
 * The API serialises these from Go structs with no json tags, so they come back
 * PascalCase (`ProductID`, `UsageCount`) while every other endpoint answers
 * snake_case. Normalising here keeps that inconsistency from spreading into the
 * slice and the page.
 */
const toLine = item => ({
  productId: item?.ProductID ?? null,
  usageCount: item?.UsageCount ?? 0,
  unitPrice: item?.UnitPrice ?? 0,
  totalPrice: item?.TotalPrice ?? 0,
  product: item?.Product ?? null,
});

export const productsApi = {
  /** GET /products -> { data: [...], success }. Ten products, each with its own analytics colour. */
  async list() {
    const { data } = await axios.get('products');
    return unwrap(data, []);
  },

  /**
   * POST /products/price — prices a basket, and is also the only way to get one.
   *
   * Verified against the live API. Four things the name does not suggest:
   *
   *  1. Omit `basket_id` and it CREATES a basket, returning its id. There is no
   *     basket endpoint to call first and none to read one back — GET /basket,
   *     /baskets and /cart are all 404. This response is where a `basket_id`
   *     comes from, and it is exactly what POST /checkout wants.
   *  2. Pass a `basket_id` back and it REPLACES that basket's contents with
   *     `details` — it does not merge. Send every line every time, or the ones
   *     left out are silently dropped from the basket.
   *  3. A basket id belongs to the basket the server made. An id from anywhere
   *     else answers 404 `{ error: "Basket not found" }`.
   *  4. It answers at the top level — `{ basket_id, items, total_price, user_id }`,
   *     no `data` wrapper — so `unwrap` would throw the whole response away.
   *
   * The quantity field is `usage_count`. `credit` and `quantity` are accepted
   * without complaint and priced as zero, which reads as "Price not found for
   * usage count" rather than as a validation error.
   *
   * Unit price is tiered by quantity and decided server-side, so the total is
   * never computed in the client — ask for a price whenever the basket changes.
   */
  async price({ details, basketId } = {}) {
    const body = { details };
    if (basketId) body.basket_id = basketId;

    const { data } = await axios.post('products/price', body);

    return {
      basketId: data?.basket_id ?? null,
      items: (data?.items ?? []).map(toLine),
      totalPrice: data?.total_price ?? 0,
    };
  },

  /**
   * POST /products/assign-basket { basket_id } — claims a basket for the
   * signed-in user.
   *
   * Verified on 5 Oct 2026. A basket priced without a token has no owner
   * (`user_id: null`), and POST /checkout answers such a request with 401
   * `auth_required` plus the `basket_id`. After signing in, this call attaches
   * it to the account, and checkout then works. A basket priced while signed in
   * is already owned and never needs it.
   *
   * Answers `{ data: { basket_id, items, user_id }, message, success }` — the
   * basket comes back under `data`, unlike /products/price, and with no
   * `total_price`, so the total is summed from the server's own line totals.
   * An unknown id answers 404 `{ error: "Basket not found" }`.
   */
  async assignBasket({ basketId }) {
    const { data } = await axios.post('products/assign-basket', { basket_id: basketId });
    const basket = data?.data ?? data ?? {};
    const items = (basket.items ?? []).map(toLine);

    return {
      basketId: basket.basket_id ?? basketId,
      items,
      totalPrice: basket.total_price ?? items.reduce((sum, line) => sum + Number(line.totalPrice || 0), 0),
    };
  },
};
