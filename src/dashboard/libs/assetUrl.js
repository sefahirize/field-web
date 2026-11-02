/**
 * Resolves a file path the API returns (e.g. the avatar's
 * "/uploads/avatars/<uuid>.jpg") into something an <img> can load.
 *
 * By default NEXT_PUBLIC_API_BASE_URL is "/api/v1/", so the path is already
 * same-origin and the /uploads rewrite forwards it — return it untouched. When
 * the base URL is set to an absolute one, the file needs the API's origin in
 * front of it; the uploads are served from the API root, not from under /api/v1.
 */
export const assetUrl = path => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!/^https?:\/\//i.test(base)) return path;

  const origin = new URL(base).origin;
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
};
