// const BlogPage = () => {

//     return (
//         <div className="min-h-80 bg-gradient-to-br from-slate-50 to-blue-50">
//             {/* Hero Section */}
//             <div className="container mx-auto px-4 py-20 text-center mt-20">
//                 <div className="max-w-4xl mx-auto">
//                     {/* Icon */}
//                     <div className="mb-8">
//                         <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                             <svg 
//                                 className="w-12 h-12 text-blue-600" 
//                                 fill="none" 
//                                 stroke="currentColor" 
//                                 viewBox="0 0 24 24"
//                                 aria-hidden="true"
//                             >
//                                 <path 
//                                     strokeLinecap="round" 
//                                     strokeLinejoin="round" 
//                                     strokeWidth={2} 
//                                     d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
//                                 />
//                             </svg>
//                         </div>
//                     </div>

//                     {/* Main Heading */}
//                     <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//                         Blog Coming
//                         <span className="text-blue-600 block">Soon</span>
//                     </h1>

//                     {/* Subtitle */}
//                     <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
//                         Our blog is coming soon. Stay tuned for updates.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BlogPage;


import { Suspense } from 'react'
import type { Metadata } from 'next'
import BlogContent from './content'
import BlogLoader from './loader'
import { fetchBlogPosts, fetchCategories, fetchLastArticles } from '@landing/lib/api/blog'
import { PAGE_SETTINGS } from '@landing/constants/Global'
import { getDefaultOgImageUrl, getSiteUrl } from '@landing/lib/seo/site'

export const dynamic = 'force-dynamic'

interface BlogPageProps {
    searchParams: Promise<{
        search?: string
        category?: string
        sort?: string
    }>
}

const buildBlogIndexMetadata = async (
    sp: Awaited<BlogPageProps['searchParams']>
): Promise<Metadata> => {
    const search = sp.search?.trim() || ''
    const categoryId = sp.category?.trim() || ''
    const baseTitle = PAGE_SETTINGS.blog.title
    const baseDesc = PAGE_SETTINGS.blog.desc

    let categoryLabel: string | undefined
    if (categoryId) {
        const categories = await fetchCategories()
        categoryLabel = categories.find((c) => c.id.toString() === categoryId)?.attributes
            .title
    }

    let title = baseTitle
    if (search && categoryLabel) {
        title = `“${search}” in ${categoryLabel} | Field Blog`
    } else if (search) {
        title = `Search: “${search}” | Field Blog`
    } else if (categoryLabel) {
        title = `${categoryLabel} | Field Blog`
    }

    let description = baseDesc
    if (search) {
        const q = search.length > 80 ? `${search.slice(0, 80)}…` : search
        description = `Blog articles matching “${q}”. ${baseDesc}`
    } else if (categoryLabel) {
        description = `Articles in ${categoryLabel}. ${baseDesc}`
    }

    const canonicalUrl = new URL('/blogs', getSiteUrl())
    if (search) canonicalUrl.searchParams.set('search', search)
    if (categoryId) canonicalUrl.searchParams.set('category', categoryId)
    if (sp.sort === 'asc') canonicalUrl.searchParams.set('sort', 'asc')

    const canonicalHref =
        canonicalUrl.pathname + (canonicalUrl.search ? canonicalUrl.search : '')
    const defaultOg = getDefaultOgImageUrl()

    return {
        title,
        description,
        alternates: {
            canonical: canonicalHref,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl.toString(),
            siteName: 'Field',
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: defaultOg,
                    width: 1200,
                    height: 630,
                    alt: 'Field — Document intelligence',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [defaultOg],
        },
    }
}

export const generateMetadata = async ({
    searchParams,
}: BlogPageProps): Promise<Metadata> => {
    const resolved = await searchParams
    return buildBlogIndexMetadata(resolved)
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    // Await the searchParams
    const resolvedSearchParams = await searchParams

    const categories = await fetchCategories()
    const categoryLookup = new Map(categories.map((c) => [c.id, c.attributes.title]))
    const sortOrder = resolvedSearchParams.sort === 'asc' ? 'asc' : 'desc'

    const [initialPosts, lastArticles] = await Promise.all([
        fetchBlogPosts({
            search: resolvedSearchParams.search,
            category: resolvedSearchParams.category,
            limit: 100,
            sort: sortOrder,
            categoryLookup,
        }),
        fetchLastArticles(categoryLookup),
    ])

    return (
        <div className="min-h-screen py-24 bg-natural-gray-bg">
            <Suspense fallback={<BlogLoader />}>
                <BlogContent
                    initialPosts={initialPosts}
                    categories={categories}
                    lastArticles={lastArticles}
                    searchParams={resolvedSearchParams}
                />
            </Suspense>
        </div>
    )
}