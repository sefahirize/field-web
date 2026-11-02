import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';

/**
 * Verified against the API: weekly returns 8 points, monthly 31, yearly 13.
 * `daily` is NOT supported — it silently falls back to monthly, so it is
 * deliberately absent here rather than offered and quietly wrong.
 */
export const ANALYTICS_PERIODS = ['weekly', 'monthly', 'yearly'];

export const analyticsApi = {
  /**
   * GET /analytics?period= -> { data: { period, start_date, end_date, summary, product_breakdown, time_series } }
   *
   * Re-verified 2026-09-14, identical keys for every period:
   *   summary            { total_credits_used, total_cost, total_transactions,
   *                        total_documents, active_products, growth_percentage }
   *   product_breakdown  [{ product_id, product_key, product_name, analitic_color, icon,
   *                         total_credits_used, total_cost, transaction_count,
   *                         document_count, usage_percentage }]
   *   time_series        [{ label, date, total_credits, total_cost, document_count }]
   *
   * An unknown or missing period answers monthly. `icon` paths (/icons/*.png)
   * 404 on the API host, so they are not rendered.
   *
   * `product_key` narrows everything — summary, breakdown and series — to one
   * product (verified 2026-10-08: ai_model kept its 6 credits, cv_parser and
   * ocr answered 0, and the breakdown shrank to that product alone).
   */
  async summary({ period = 'monthly', productKey } = {}) {
    const params = { period };
    if (productKey) params.product_key = productKey;
    const { data } = await axios.get('analytics', { params });
    return unwrap(data, null);
  },

  /**
   * GET /analytics/summary -> { data: { weekly, monthly, yearly } }
   *
   * All three periods in one call, each `{ period, start_date, end_date,
   * total_credits, total_cost, total_documents, top_product, products: [10] }`.
   * No time series — that stays on GET /analytics. `monthly` is a rolling 30
   * days ending now, not the calendar month.
   *
   * `top_product` is named even when nothing was used (it answers "AI Model"
   * on an account with zero usage), so it only means something alongside a
   * non-zero `total_credits`.
   *
   * Ignores `product_key` — always all products.
   */
  async overview() {
    const { data } = await axios.get('analytics/summary');
    return unwrap(data, null);
  },
};
