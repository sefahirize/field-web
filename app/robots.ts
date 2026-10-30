import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@landing/lib/seo/site'
import { APP_BASE } from '@shared/contract'

const robots = (): MetadataRoute.Robots => {
  const base = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The dashboard is private; its pages are also marked noindex.
      disallow: [APP_BASE, '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}

export default robots
