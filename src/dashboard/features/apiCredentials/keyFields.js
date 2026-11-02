const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The list row's shape is only partly known (see apiCredentialsApi), so every
 * optional field is read under the names it is likely to have and left out of
 * the screen when none is there, rather than shown as an empty column.
 */
export const keyPrefix = row => {
  const prefix = row.key_prefix ?? row.prefix ?? row.masked_key ?? row.api_key_prefix;
  return prefix ? `${prefix}…` : null;
};

export const createdAt = row => row.created_at ?? row.createdAt ?? null;
export const lastUsedAt = row => row.last_used_at ?? row.last_used ?? row.lastUsedAt ?? null;

/** Whole days from now until `value`, at least 1; null when there is no date or it has passed. */
export const daysUntil = value => {
  const time = new Date(value).getTime();
  if (!value || Number.isNaN(time) || time <= Date.now()) return null;
  return Math.max(1, Math.ceil((time - Date.now()) / DAY_MS));
};

/**
 * The `expires_days` to send for a key that already expires, so saving it (or
 * regenerating it) does not quietly turn a dated key into one that never
 * expires. 0 means never.
 */
export const expiresDaysOf = row => {
  if (typeof row.expires_days === 'number' && row.expires_days > 0) return row.expires_days;
  return daysUntil(row.expires_at) ?? 0;
};

/** How to show a key's expiry: `{ text, tone }` with tone one of none | ok | soon | expired. */
export const describeExpiry = row => {
  if (!row.expires_at) return { text: 'Never', tone: 'none' };
  const date = new Date(row.expires_at);
  if (Number.isNaN(date.getTime())) return { text: '—', tone: 'none' };

  const left = daysUntil(row.expires_at);
  if (left === null) return { text: `Expired ${date.toLocaleDateString()}`, tone: 'expired' };
  if (left <= 7) return { text: left === 1 ? 'Tomorrow' : `In ${left} days`, tone: 'soon' };
  return { text: date.toLocaleDateString(), tone: 'ok' };
};

export const formatDate = value => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};
