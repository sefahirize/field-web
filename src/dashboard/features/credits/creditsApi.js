import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';

export const creditsApi = {
  /**
   * GET /credits/balance -> { data: [...], success }
   *
   * One row per product — all ten, including the ones with no allowance — each
   * `{ product_id, product_key, product_name, total_credits, used_credits,
   * remaining_credits }`. Verified against the live API on 2026-09-14.
   *
   * GET /profile carries the same ledger under `credits`, but only as part of
   * the whole user; this is the endpoint to call when only the balance changed.
   */
  async balance() {
    const { data } = await axios.get('credits/balance');
    return unwrap(data, []);
  },

  /**
   * GET /credits/balance?product_key= -> { data: {row}, success }
   *
   * The same endpoint narrowed to one product — and then `data` is a single
   * object, not an array. An unknown key is not an error; check for null.
   */
  async balanceFor(productKey) {
    const { data } = await axios.get('credits/balance', { params: { product_key: productKey } });
    const row = unwrap(data, null);
    return Array.isArray(row) ? row.find(r => r.product_key === productKey) ?? null : row;
  },

  /**
   * GET /credits -> { data: [...], success }
   *
   * Verified 2026-10-08: the same ten rows, same fields, as /credits/balance.
   * Both collections list it separately, so it is kept as its own call.
   */
  async list() {
    const { data } = await axios.get('credits');
    return unwrap(data, []);
  },

  /**
   * POST /credits/use { product_key, units, reference_key } — spends credits
   * directly, the way an API consumer would.
   *
   * NOT on the server: 404 `page not found` under GET, POST and PUT, with and
   * without a token (re-checked 2026-10-08). The body is the master
   * collection's; the dashboard collection lists it as a GET with no body.
   * Uploads spend credits on their own, so nothing else depends on this.
   */
  async use({ productKey, units, referenceKey }) {
    const body = { product_key: productKey, units: Number(units) };
    if (referenceKey) body.reference_key = referenceKey;
    const { data } = await axios.post('credits/use', body);
    return data;
  },

  /**
   * GET /credits/history?page&limit -> { data: [...], meta: { page, limit, total }, success }
   *
   * Each entry: `{ id, product_id, product: {...}, type, amount, unit_price,
   * balance_before, balance_after, description, reference_key, created_at }`.
   * Types seen: `welcome_bonus` (+50 at registration), `usage` (a document
   * processed with that product's own credits, amount -1) and `cross_usage`
   * (credits of another product converted at an exchange rate). `reference_key`
   * of a usage entry is the document's uuid. A purchase entry has not been
   * observed yet.
   *
   * Verified 2026-09-14: `page` and `limit` are echoed in `meta`. Unlike
   * /documents, `meta` has NO `total_pages`, so it is derived here. `type` and
   * `product_id` query params are silently ignored (product_id=2 still returns
   * the AI Model row), so no filters are offered.
   */
  async history({ page = 1, limit = 20 } = {}) {
    const { data } = await axios.get('credits/history', { params: { page, limit } });
    const meta = data?.meta ?? { page, limit, total: 0 };
    const perPage = meta.limit > 0 ? meta.limit : limit;

    return {
      items: data?.data ?? [],
      meta: { ...meta, total_pages: Math.max(1, Math.ceil((meta.total ?? 0) / perPage)) },
    };
  },
};
