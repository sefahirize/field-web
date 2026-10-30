import { WORDPRESS_REST_API_BASE } from '@landing/constants/Global'
import type { Category, Post } from '@landing/types/blog'
import { sanitizeBlogHtml } from '@landing/lib/sanitize-blog-html'

const getWpBase = () => {
  const fromEnv = process.env.NEXT_PUBLIC_WORDPRESS_REST_API_BASE
  const raw = (fromEnv || WORDPRESS_REST_API_BASE).replace(/\/$/, '')
  return raw
}

const FETCH_OPTIONS = { next: { revalidate: 3600 } as const }

type WpFeaturedMedia = {
  source_url?: string
  media_details?: {
    sizes?: Record<string, { source_url?: string }>
  }
}

type WpPost = {
  id: number
  slug: string
  date: string
  modified?: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  categories: number[]
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: WpFeaturedMedia[]
  }
}

type WpCategory = {
  id: number
  name: string
  slug: string
  count: number
}

type WpErrorBody = {
  code?: string
  message?: string
}

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const decodeBasicEntities = (input: string) =>
  input
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')

const plainTextFromHtml = (html: string) => decodeBasicEntities(stripHtml(html))

const getWpFeaturedImageUrl = (post: WpPost): string => {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) {
    return ''
  }
  const sizes = media.media_details?.sizes
  return (
    sizes?.large?.source_url ||
    sizes?.['medium_large']?.source_url ||
    sizes?.medium?.source_url ||
    media.source_url ||
    ''
  )
}

const estimateReadingTimeLabel = (html: string): string => {
  const text = plainTextFromHtml(html)
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `00:${String(minutes).padStart(2, '0')}`
}

const strapiLikeImage = (url: string): Post['attributes']['image'] => {
  if (!url) {
    return null
  }
  return {
    data: {
      id: 0,
      attributes: {
        name: '',
        alternativeText: '',
        caption: '',
        width: 0,
        height: 0,
        formats: {
          large: {
            ext: '',
            url,
            hash: '',
            mime: '',
            name: '',
            path: null,
            size: 0,
            width: 0,
            height: 0,
          },
          small: {
            ext: '',
            url,
            hash: '',
            mime: '',
            name: '',
            path: null,
            size: 0,
            width: 0,
            height: 0,
          },
          medium: {
            ext: '',
            url,
            hash: '',
            mime: '',
            name: '',
            path: null,
            size: 0,
            width: 0,
            height: 0,
          },
          thumbnail: {
            ext: '',
            url,
            hash: '',
            mime: '',
            name: '',
            path: null,
            size: 0,
            width: 0,
            height: 0,
          },
        },
        hash: '',
        ext: '',
        mime: '',
        size: 0,
        url,
        previewUrl: null,
        provider: '',
        provider_metadata: null,
        createdAt: '',
        updatedAt: '',
      },
    },
  }
}

const normalizeWpPostToPost = (wp: WpPost, categoryIdToTitle: Map<number, string>): Post => {
  const primaryCategoryId = wp.categories?.[0]
  const categoryTitle = primaryCategoryId !== undefined ? categoryIdToTitle.get(primaryCategoryId) ?? '' : ''

  return {
    id: wp.id,
    attributes: {
      title: plainTextFromHtml(wp.title.rendered),
      slug: wp.slug,
      body: sanitizeBlogHtml(wp.content.rendered),
      description: plainTextFromHtml(wp.excerpt.rendered),
      createdAt: wp.date,
      updatedAt: wp.modified ?? wp.date,
      publishedAt: wp.date,
      Time: estimateReadingTimeLabel(wp.content.rendered),
      youtube_video: null,
      image: strapiLikeImage(getWpFeaturedImageUrl(wp)),
      categories: {
        data:
          primaryCategoryId !== undefined
            ? [
                {
                  id: primaryCategoryId,
                  attributes: {
                    title: categoryTitle,
                    createdAt: '',
                    updatedAt: '',
                    publishedAt: '',
                  },
                },
              ]
            : [],
      },
    },
  }
}

const normalizeWpCategory = (wp: WpCategory): Category => ({
  id: wp.id,
  attributes: {
    title: wp.name,
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
})

const readWpTotal = (response: Response): number => {
  const raw = response.headers.get('x-wp-total')
  if (!raw) {
    return 0
  }
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : 0
}

const readWpTotalPages = (response: Response): number => {
  const raw = response.headers.get('x-wp-totalpages')
  if (!raw) {
    return 1
  }
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

type WpPostSlugRow = { slug: string; modified?: string }

/** Paginate all published posts for sitemap (slug + last modified only). */
export const fetchAllBlogPostSlugsForSitemap = async (): Promise<
  { slug: string; modified: string | null }[]
> => {
  const base = getWpBase()
  const all: { slug: string; modified: string | null }[] = []
  let page = 1
  let totalPages = 1

  do {
    const query = new URLSearchParams()
    query.set('per_page', '100')
    query.set('page', String(page))
    query.set('_fields', 'slug,modified')
    query.set('orderby', 'modified')
    query.set('order', 'desc')

    const response = await fetch(`${base}/posts?${query.toString()}`, FETCH_OPTIONS)
    if (!response.ok) {
      throw new Error(`Sitemap: failed to fetch posts (${response.status})`)
    }

    const rows = (await response.json()) as WpPostSlugRow[]
    if (!Array.isArray(rows)) {
      throw new Error('Sitemap: invalid posts response')
    }

    totalPages = readWpTotalPages(response)
    for (const row of rows) {
      if (row.slug) {
        all.push({ slug: row.slug, modified: row.modified?.trim() || null })
      }
    }
    page += 1
  } while (page <= totalPages)

  return all
}

const fetchWpPosts = async (
  query: URLSearchParams
): Promise<{ posts: WpPost[]; total: number }> => {
  const base = getWpBase()
  const url = `${base}/posts?${query.toString()}`
  const response = await fetch(url, FETCH_OPTIONS)

  if (!response.ok) {
    let message = `Failed to fetch posts (${response.status})`
    try {
      const body = (await response.json()) as WpErrorBody
      if (body?.message) {
        message = body.message
      }
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  const posts = (await response.json()) as WpPost[]
  if (!Array.isArray(posts)) {
    throw new Error('Invalid blog posts response')
  }

  return { posts, total: readWpTotal(response) }
}

const buildCategoryLookup = async (): Promise<Map<number, string>> => {
  const categories = await fetchCategories()
  return new Map(categories.map((c) => [c.id, c.attributes.title]))
}

interface FetchBlogPostsParams {
  search?: string
  category?: string
  limit?: number
  sort?: string
  categoryLookup?: Map<number, string>
}

export const fetchBlogPosts = async ({
  search,
  category,
  limit = 6,
  sort = 'desc',
  categoryLookup,
}: FetchBlogPostsParams = {}) => {
  const lookup = categoryLookup ?? (await buildCategoryLookup())

  const query = new URLSearchParams()
  query.set('_embed', '1')
  query.set('per_page', String(Math.min(Math.max(limit, 1), 100)))
  query.set('page', '1')
  query.set('orderby', 'date')
  query.set('order', sort === 'asc' ? 'asc' : 'desc')

  if (search?.trim()) {
    query.set('search', search.trim())
  }
  if (category) {
    query.set('categories', category)
  }

  const { posts, total } = await fetchWpPosts(query)

  return {
    data: posts.map((p) => normalizeWpPostToPost(p, lookup)),
    meta: {
      pagination: {
        total: total || posts.length,
      },
    },
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  const base = getWpBase()
  const query = new URLSearchParams()
  query.set('per_page', '100')

  const response = await fetch(`${base}/categories?${query.toString()}`, FETCH_OPTIONS)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  const wpCategories = (await response.json()) as WpCategory[]
  if (!Array.isArray(wpCategories)) {
    throw new Error('Invalid categories response')
  }

  return wpCategories.map(normalizeWpCategory)
}

export const fetchBlogPostBySlug = async (slug: string): Promise<Post | null> => {
  const trimmed = slug?.trim()
  if (!trimmed) {
    return null
  }
  const lookup = await buildCategoryLookup()
  const query = new URLSearchParams()
  query.set('slug', trimmed)
  query.set('_embed', '1')
  query.set('per_page', '1')

  const { posts } = await fetchWpPosts(query)
  if (!posts.length) {
    return null
  }
  return normalizeWpPostToPost(posts[0], lookup)
}

export const fetchFeaturedPosts = async (limit = 4, categoryLookup?: Map<number, string>) => {
  const lookup = categoryLookup ?? (await buildCategoryLookup())
  const query = new URLSearchParams()
  query.set('_embed', '1')
  query.set('per_page', String(Math.min(Math.max(limit, 1), 100)))
  query.set('page', '1')
  query.set('orderby', 'date')
  query.set('order', 'desc')

  const { posts, total } = await fetchWpPosts(query)

  return {
    data: posts.map((p) => normalizeWpPostToPost(p, lookup)),
    meta: {
      pagination: {
        total: total || posts.length,
      },
    },
  }
}

export const fetchLastArticles = async (categoryLookup?: Map<number, string>) => {
  return fetchFeaturedPosts(4, categoryLookup)
}
