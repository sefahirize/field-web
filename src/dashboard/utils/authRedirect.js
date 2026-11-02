import { APP_BASE } from '@shared/contract';
import { ROUTE_PATHS } from '@dashboard/data/paths';

const STORAGE_KEY = 'post_auth_redirect';

// Only dashboard paths: blocks absolute URLs, protocol-relative ("//host")
// targets and pages outside APP_BASE.
const isSafeInternalPath = path =>
  typeof path === 'string' && !path.startsWith('//') && (path === APP_BASE || path.startsWith(`${APP_BASE}/`) || path.startsWith(`${APP_BASE}?`));

const AUTH_PATHS = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.REGISTER, `${APP_BASE}/verification`];

export const saveAuthRedirect = path => {
  if (!isSafeInternalPath(path)) return;
  if (AUTH_PATHS.some(authPath => path.startsWith(authPath))) return;
  sessionStorage.setItem(STORAGE_KEY, path);
};

export const peekAuthRedirect = () => {
  const path = sessionStorage.getItem(STORAGE_KEY);
  return isSafeInternalPath(path) ? path : null;
};

export const clearAuthRedirect = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const takeAuthRedirect = () => {
  const path = peekAuthRedirect();
  clearAuthRedirect();
  return path;
};
