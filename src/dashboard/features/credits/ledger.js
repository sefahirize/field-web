/**
 * Reading the credit ledger (GET /credits/history rows).
 *
 * The sign comes from the balance movement, falling back to `amount`. Both
 * agree on what has been observed — a usage entry carries amount -1 and a
 * balance that drops by one — but a purchase entry has not been seen yet.
 */
export const entryDelta = entry => {
  const delta = (entry.balance_after ?? 0) - (entry.balance_before ?? 0);
  return delta !== 0 ? delta : entry.amount ?? 0;
};

export const formatDelta = entry => {
  const value = entryDelta(entry);
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString()}`;
};

/** `welcome_bonus` -> `Welcome bonus` */
export const humanizeType = type => {
  if (!type) return 'Credit change';
  const text = String(type).replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const mentions = (text, phrase) => String(text).toLowerCase().includes(String(phrase).toLowerCase());

/** What to call an entry: its own description, with its type added unless the description already says it. */
export const entryTitle = entry => ({
  title: entry.description || humanizeType(entry.type),
  type: entry.description && !mentions(entry.description, humanizeType(entry.type)) ? humanizeType(entry.type) : null,
});

/**
 * Which icon an entry gets. Types seen so far are welcome_bonus, usage and
 * cross_usage; anything else (a purchase will arrive as something) is told apart
 * by whether credits came in or went out.
 */
export const entryKind = entry => {
  const type = String(entry.type ?? '').toLowerCase();
  if (type.includes('cross')) return 'swap';
  if (type.includes('bonus') || type.includes('gift') || type.includes('welcome')) return 'gift';
  if (type.includes('usage') || type.includes('use') || type.includes('spend')) return 'spend';
  return entryDelta(entry) >= 0 ? 'add' : 'spend';
};

const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today", "Yesterday", then "Mon, Oct 8" (with the year once it is not this one). */
export const dayLabel = (value, now = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Earlier';

  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  });
};

/** Entries (newest first, as the API sends them) folded into `[{ label, entries }]` by day. */
export const groupByDay = (entries, now = new Date()) => {
  const groups = [];
  entries.forEach(entry => {
    const label = dayLabel(entry.created_at, now);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.entries.push(entry);
    else groups.push({ label, entries: [entry] });
  });
  return groups;
};

export const formatTime = value => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
};
