import { ROUTE_PATHS } from '@dashboard/data/paths';

/**
 * Where the Help page lives. Kept here rather than in `data/paths.js`, which is
 * left alone as part of the integration layer.
 */
export const HELP_PATH = `${ROUTE_PATHS.DASHBOARD}/help`;

/** `/app/help?open=<id>` opens one question; `/app/help?q=<text>` searches. */
export const helpPath = ({ open, q } = {}) => {
  const params = new URLSearchParams();
  if (open) params.set('open', open);
  if (q) params.set('q', q);
  const query = params.toString();
  return query ? `${HELP_PATH}?${query}` : HELP_PATH;
};
