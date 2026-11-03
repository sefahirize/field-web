// Prices are in US dollars (decided 2026-11-03). The API sends plain numbers
// and names no currency, so the dollar sign is added here. en-US on purpose,
// like the landing's pricing page: "$1,234.50".
const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const money = value => USD.format(Number(value ?? 0));
