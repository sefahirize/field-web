// English on purpose: the interface text around it ("just now", the tab names) is English.
const RELATIVE = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;

/**
 * "just now", "5 minutes ago", "yesterday", "3 days ago" — and from a week on,
 * the plain date. The caller keeps the full date for a tooltip.
 */
export const timeAgo = (value, now = Date.now()) => {
  const time = new Date(value).getTime();
  if (!value || Number.isNaN(time)) return '—';

  const seconds = Math.round((time - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return 'just now';
  if (!RELATIVE) return new Date(time).toLocaleDateString();

  if (abs < 3600) return RELATIVE.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return RELATIVE.format(Math.round(seconds / 3600), 'hour');
  if (abs < 7 * 86400) return RELATIVE.format(Math.round(seconds / 86400), 'day');
  return new Date(time).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const fullDate = value => {
  const d = new Date(value);
  return !value || Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
};
