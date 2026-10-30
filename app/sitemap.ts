import type { MetadataRoute } from 'next'
import { fetchAllBlogPostSlugsForSitemap } from '@landing/lib/api/blog'
import { getSiteUrl } from '@landing/lib/seo/site'
import { STATIC_SITEMAP_PATHS } from '@landing/lib/seo/sitemap-static-paths'

/** Regenerate sitemap periodically; aligns with WordPress fetch revalidation in blog API. */
export const revalidate = 3600

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const base = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_SITEMAP_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))

  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const rows = await fetchAllBlogPostSlugsForSitemap()
    blogEntries = rows.map((row) => ({
      url: `${base}/blogs/${row.slug}`,
      lastModified: row.modified ? new Date(row.modified) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch {
    /* WordPress unreachable (e.g. offline build): ship static URLs only */
  }

  return [...staticEntries, ...blogEntries]
}

export default sitemap
