/**
 * Canonical origin for this marketing site (metadata, OG, canonicals, sitemap, robots).
 * Production serves at www.joinfield.ai — the apex joinfield.ai should 301 to it at the
 * hosting layer. Product app links use APP_URL in constants (app.hirize.hr placeholder).
 * Override via NEXT_PUBLIC_SITE_URL in production env if the canonical changes.
 */
export const getSiteUrl = () => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.joinfield.ai'
  return raw.replace(/\/$/, '')
}

export const getDefaultOgImageUrl = () => `${getSiteUrl()}/assets/images/seo/og.png`

export const toAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${getSiteUrl()}${path}`
}
