/**
 * How much of a product's credits have been used, per product — never across
 * products (the API converts between them at a rate, so a sum would not be in
 * one unit). Shared by the Credit history page and the header's usage menu.
 */

/** A product counts as running low once this share of what it received is used. */
export const LOW_SHARE = 85;

export const usedShare = row => {
  const received = row.total_credits ?? 0;
  return received > 0 ? Math.min(100, Math.round(((row.used_credits ?? 0) / received) * 100)) : 0;
};

/** `out` (nothing left), `low` (85% or more used) or `ok`. */
export const usageLevel = row => {
  if ((row.remaining_credits ?? 0) <= 0) return 'out';
  return usedShare(row) >= LOW_SHARE ? 'low' : 'ok';
};

/** The products that have received credits, the biggest balance first. */
export const fundedProducts = credits =>
  credits
    .filter(row => (row.total_credits ?? 0) > 0)
    .sort((a, b) => (b.remaining_credits ?? 0) - (a.remaining_credits ?? 0));
