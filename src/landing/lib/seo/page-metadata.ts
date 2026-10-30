import type { Metadata } from 'next'
import { getDefaultOgImageUrl, getSiteUrl } from '@landing/lib/seo/site'

export type PageSettingMeta = {
  title: string
  desc: string
  /** Site path, e.g. `/contact`. Omit for pages with no canonical (e.g. global 404). */
  href?: string
}

/**
 * Standard marketing-page metadata from a PAGE_SETTINGS entry (href must be a site path).
 */
export const buildPageMetadata = (page: PageSettingMeta): Metadata => {
  const site = getSiteUrl()
  const rawHref = page.href?.trim()
  const path =
    rawHref && rawHref.length > 0
      ? rawHref.startsWith('/')
        ? rawHref
        : `/${rawHref}`
      : null
  const url = path ? `${site}${path}` : site
  const ogUrl = getDefaultOgImageUrl()

  return {
    title: page.title,
    description: page.desc,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: page.title,
      description: page.desc,
      url,
      siteName: 'Field',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.desc,
      images: [ogUrl],
    },
  }
}
