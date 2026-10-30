import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchBlogPostBySlug, fetchFeaturedPosts } from '@landing/lib/api/blog'
import { HirizeImage } from '@landing/components/Global/HirizeImage'
import { getStrapiMedia, formatDate } from '@landing/utils/global'
import { BlogArticleSidebar } from '../BlogArticleSidebar'
import { getDefaultOgImageUrl, getSiteUrl, toAbsoluteUrl } from '@landing/lib/seo/site'

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({
  params,
}: BlogArticlePageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article not found | Field Blog',
      robots: { index: false, follow: true },
    }
  }

  const title = post.attributes.title
  const rawDesc = post.attributes.description.replace(/\s+/g, ' ').trim()
  const description =
    rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}…` : rawDesc
  const metaDescription =
    description ||
    `Read “${title}” on the Field blog — document intelligence and data extraction.`

  const categoryName = post.attributes.categories?.data?.[0]?.attributes.title
  const imgFromPost = getStrapiMedia(
    post.attributes.image && post.attributes.image
  )
  const ogImage = imgFromPost
    ? toAbsoluteUrl(imgFromPost)
    : getDefaultOgImageUrl()

  const pageUrl = `${getSiteUrl()}/blogs/${slug}`
  const published = post.attributes.publishedAt
  const modified = post.attributes.updatedAt || published
  const metaTitle = `${title} | Field Blog`

  return {
    title: metaTitle,
    description: metaDescription,
    // keywords: [
    //   ...(categoryName ? [categoryName] : []),
    //   'document intelligence',
    //   'Hirize',
    //   'data extraction',
    //   'AI document processing',
    // ],
    authors: [{ name: 'Field', url: getSiteUrl() }],
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: 'Field',
      locale: 'en_US',
      type: 'article',
      publishedTime: published,
      modifiedTime: modified,
      ...(categoryName ? { section: categoryName } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  const [post, recentBundle] = await Promise.all([
    fetchBlogPostBySlug(slug),
    fetchFeaturedPosts(8),
  ])

  if (!post) {
    notFound()
  }

  const recentPosts = recentBundle.data
    .filter((item) => item.attributes.slug !== slug)
    .slice(0, 5)

  const { title, publishedAt, categories, image, body, Time, description } =
    post.attributes
  const categoryName = categories?.data?.[0]?.attributes.title
  const imgSrc = getStrapiMedia(image && image)
  const minutesRead =
    Time?.split(':')[1]?.replace('0', '') || '4'

  const jsonLdDescription =
    description ||
    `Read “${title}” on the Field blog — document intelligence and data extraction.`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: jsonLdDescription,
    datePublished: publishedAt,
    dateModified: post.attributes.updatedAt || publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Field',
      url: getSiteUrl(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Field',
      url: getSiteUrl(),
      logo: {
        '@type': 'ImageObject',
        url: getDefaultOgImageUrl(),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${getSiteUrl()}/blogs/${slug}`,
    },
    image: [imgSrc ? toAbsoluteUrl(imgSrc) : getDefaultOgImageUrl()],
    ...(categoryName ? { articleSection: categoryName } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so a WordPress title cannot close the script tag.
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
    <div className="min-h-screen py-24 bg-natural-gray-bg">
      <div className="max-w-1304 mx-auto px-3 xl:px-0">
        <Link
          href="/blogs"
          className="inline-flex items-center text-natural-gray-default font-medium text-sm hover:text-natural-navy transition-colors"
        >
          ← All articles
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_min(340px,100%)] xl:grid-cols-[minmax(0,1fr)_356px] lg:items-start">
          <article className="min-w-0">
            <header className="max-w-3xl">
              {categoryName ? (
                <p className="text-app-blue font-semibold text-sm uppercase tracking-wide">
                  {categoryName}
                </p>
              ) : null}
              <h1 className="mt-3 text-natural-navy font-semibold text-3xl sm:text-4.5 leading-tight">
                {title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-natural-gray-default font-medium text-sm">
                <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                <span className="w-1 h-1 bg-black/10 rounded-full" aria-hidden />
                <span>
                  <span className="sr-only">Reading time:</span>
                  {minutesRead} min read
                </span>
              </div>
              {description ? (
                <p className="mt-6 text-natural-gray-default text-lg leading-relaxed">
                  {description}
                </p>
              ) : null}
            </header>

            {imgSrc ? (
              <div className="mt-10 rounded-lg overflow-hidden bg-white max-w-4xl">
                <HirizeImage
                  unoptimized
                  src={imgSrc}
                  alt={title}
                  width={1200}
                  height={630}
                  className="object-cover w-full h-auto max-h-[480px]"
                />
              </div>
            ) : null}

            <div
              className="blog-post-content mt-12 max-w-3xl text-natural-navy text-base leading-relaxed
                [&_p]:mb-4 [&_p]:leading-[1.7]
                [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[1.125rem] [&_h2]:font-bold [&_h2]:text-natural-navy
                [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold
                [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold
                [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1
                [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1
                [&_li]:whitespace-normal [&_li]:break-words
                [&_a]:text-app-blue [&_a]:underline
                [&_figure]:my-8 [&_figure>img]:rounded-lg
                [&_img]:max-w-full [&_img]:h-auto
                [&_pre]:my-4 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:bg-natural-gray-bg [&_pre]:overflow-x-auto [&_pre]:text-sm
                [&_code]:text-sm
                [&_blockquote]:border-l-4 [&_blockquote]:border-natural-gray-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
                [&_hr]:my-8 [&_hr]:border-natural-gray-border"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </article>

          <BlogArticleSidebar recentPosts={recentPosts} />
        </div>
      </div>
    </div>
    </>
  )
}
