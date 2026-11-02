/**
 * The one place tokens are read from and written to.
 *
 * Everything else (axios interceptor, auth slice, logout) goes through here so
 * there is a single seam to change when the real backend arrives — e.g. moving
 * from localStorage to httpOnly cookies touches this file only.
 */

const ACCESS_TOKEN = 'jf_access_token';
const REFRESH_TOKEN = 'jf_refresh_token';
const EXPIRES_AT = 'jf_expires_at';

// Reads can throw in private-mode / storage-blocked browsers.
const safeGet = key => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable — session stays in memory only */
  }
};

export const getAccessToken = () => safeGet(ACCESS_TOKEN);
export const getRefreshToken = () => safeGet(REFRESH_TOKEN);

/** `expires_in` is seconds-from-now; we persist an absolute timestamp instead. */
export const setSession = ({ access_token, refresh_token, expires_in } = {}) => {
  safeSet(ACCESS_TOKEN, access_token);
  safeSet(REFRESH_TOKEN, refresh_token);
  safeSet(EXPIRES_AT, expires_in ? Date.now() + Number(expires_in) * 1000 : null);
};

export const clearSession = () => {
  safeSet(ACCESS_TOKEN, null);
  safeSet(REFRESH_TOKEN, null);
  safeSet(EXPIRES_AT, null);
};

export const isSessionExpired = () => {
  const expiresAt = safeGet(EXPIRES_AT);
  if (!expiresAt) return false; // no expiry recorded — let the API be the judge
  return Date.now() >= Number(expiresAt);
};
