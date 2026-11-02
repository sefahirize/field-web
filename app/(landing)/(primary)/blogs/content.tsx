"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Post, Category } from '@landing/types/blog'
import { HirizeImage } from "@landing/components/Global/HirizeImage";
import { getStrapiMedia, formatDate, sortBlogData } from "@landing/utils/global";
import Link from 'next/link';
import { Button, Select } from "@landing/components/Ui";
import { APP_URL } from "@landing/utils/api";
import { DATA_SOCIAL_MEDIA } from "@landing/constants/Global";
import { useIsMobile } from "@landing/hooks/use-mobile";
import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    SearchIcon,
    SortIcon
} from "@landing/components/Icons";

export const SELECT_LIST_SORT_BLOG_LIST = [
    {
        id: 'desc',
        label: 'Recently',
    },
    {
        id: 'asc',
        label: 'Oldest to newest',
    },
];


interface BlogContentProps {
    initialPosts: {
        data: Post[]
        meta: {
            pagination: {
                total: number
            }
        }
    }
    lastArticles: {
        data: Post[]
        meta: {
            pagination: {
                total: number
            }
        }
    }
    categories: Category[]
    searchParams: {
        search?: string
        category?: string
        sort?: string
    }
}


const titleIcon = () => {
    return (
        <svg className="w-14 h-14 md:w-[80px] md:h-[80px] " width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_5246_9707)">
                <rect x="10" y="10" width="56" height="56" rx="28" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M29.3012 28.9225C30.7786 27.7746 32.6244 27.2055 34.4917 27.3223C36.3591 27.439 38.1196 28.2335 39.4426 29.5565C40.1997 30.3136 40.7837 31.2139 41.1667 32.1956C41.1914 32.3747 41.252 32.5432 41.3413 32.6931C41.5244 33.278 41.638 33.8868 41.6768 34.5073C41.7935 36.3747 41.2245 38.2205 40.0766 39.6979C38.9286 41.1754 37.2808 42.1829 35.4425 42.5313C33.6042 42.8797 31.702 42.545 30.0931 41.59C29.7778 41.4029 29.3994 41.3538 29.0469 41.4544L26.9455 42.0535L27.5447 39.9522C27.6452 39.5996 27.5962 39.2213 27.4091 38.906C26.4541 37.2971 26.1193 35.3949 26.4677 33.5566C26.8161 31.7183 27.8237 30.0704 29.3012 28.9225ZM44.2748 33.6733C44.3031 33.8945 44.3243 34.1172 44.3383 34.341C44.4956 36.8568 43.7289 39.3435 42.1824 41.334C40.6358 43.3246 38.4157 44.682 35.9391 45.1514C35.8241 45.1731 35.709 45.1929 35.5938 45.2108C35.8719 45.6348 36.1924 46.0313 36.5511 46.3941C37.3482 47.2001 38.3144 47.819 39.3799 48.2061C40.4454 48.5932 41.5835 48.7387 42.7121 48.6323C43.8407 48.5259 44.9316 48.1701 45.9059 47.5906C46.2214 47.403 46.6002 47.3537 46.9531 47.4544L49.0544 48.0535L48.4553 45.9522C48.3545 45.5989 48.404 45.2198 48.592 44.9042C49.2668 43.7715 49.6376 42.4837 49.6684 41.1656C49.6992 39.8476 49.389 38.5439 48.7679 37.3809C48.1468 36.2179 47.2358 35.2351 46.1233 34.5277C45.5455 34.1603 44.9236 33.8737 44.2748 33.6733ZM32.5748 45.2319C31.4202 45.0699 30.2947 44.7129 29.2481 44.1699L26.6656 44.9063L26.6609 44.9076C26.3047 45.0078 25.9282 45.0113 25.5702 44.9177C25.2121 44.8241 24.8855 44.6369 24.6239 44.3752C24.3622 44.1136 24.175 43.7869 24.0814 43.4289C23.9878 43.0709 23.9913 42.6944 24.0914 42.3382L24.0928 42.3335L24.8291 39.751C23.7643 37.6987 23.4151 35.3428 23.8477 33.06C24.3171 30.5834 25.6745 28.3633 27.6651 26.8167C29.6556 25.2702 32.1423 24.5035 34.6581 24.6608C37.1739 24.8181 39.5458 25.8884 41.3282 27.6709C42.229 28.5716 42.9479 29.6229 43.459 30.7672C44.9126 30.9724 46.3094 31.486 47.5541 32.2774C49.0543 33.2313 50.2827 34.5565 51.1202 36.1246C51.9577 37.6928 52.3759 39.4507 52.3343 41.228C52.2974 42.8077 51.8983 44.3551 51.1712 45.7521L51.9086 48.3382C52.0087 48.6944 52.0122 49.0709 51.9186 49.4289C51.825 49.7869 51.6378 50.1136 51.3761 50.3752C51.1145 50.6369 50.7879 50.8241 50.4298 50.9177C50.0718 51.0113 49.6953 51.0078 49.3391 50.9076L49.3344 50.9063L46.7524 50.1701C45.5745 50.7822 44.2878 51.1622 42.9625 51.2872C41.4407 51.4307 39.906 51.2344 38.4694 50.7125C37.0327 50.1905 35.7298 49.356 34.655 48.2692C33.7836 47.3879 33.0796 46.3587 32.5748 45.2319Z" fill="#242729" />
            </g>
            <defs>
                <filter id="filter0_d_5246_9707" x="0" y="0" width="80" height="80" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="2" dy="2" />
                    <feGaussianBlur stdDeviation="6" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5246_9707" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5246_9707" result="shape" />
                </filter>
            </defs>
        </svg>
    )
}

export default function BlogContent({
    initialPosts,
    lastArticles,
    categories,
    searchParams
}: BlogContentProps) {
    const router = useRouter()
    const [postLimit, setPostLimit] = useState(6)
    const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.category || null)
    const [searchValue, setSearchValue] = useState(searchParams.search || '')
    const [debouncedValue, setDebouncedValue] = useState(searchValue);
    const [sortValue, setSortValue] = useState(() => (searchParams.sort === 'asc' ? 'asc' : 'desc'));

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(searchValue);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchValue]);

    useEffect(() => {
        if (debouncedValue !== searchParams.search) {
            const params = new URLSearchParams()
            if (debouncedValue) params.set('search', debouncedValue)
            if (activeCategory) params.set('category', activeCategory)
            if (sortValue !== 'desc') params.set('sort', sortValue)
            router.push(`/blogs?${params.toString()}`)
        }
    }, [debouncedValue, activeCategory, sortValue, searchParams.search, router]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmed = searchValue.trim()
        setDebouncedValue(trimmed)

        const params = new URLSearchParams()
        if (trimmed) params.set('search', trimmed)
        if (activeCategory) params.set('category', activeCategory)
        if (sortValue !== 'desc') params.set('sort', sortValue)

        const qs = params.toString()
        router.push(qs ? `/blogs?${qs}` : '/blogs')
    }

    const handleCategoryChange = (categoryId: string | null) => {
        setActiveCategory(categoryId)
        const params = new URLSearchParams()
        if (categoryId) params.set('category', categoryId)
        if (searchValue) params.set('search', searchValue)
        if (sortValue !== 'desc') params.set('sort', sortValue)

        router.push(`/blogs?${params.toString()}`)
    }

    const onChangeSortBlogList = (value: string | { id: string; label: string }) => {
        const newSortValue = typeof value === 'string' ? value : value.id;
        setSortValue(newSortValue);
        const params = new URLSearchParams()
        if (searchValue) params.set('search', searchValue)
        if (activeCategory) params.set('category', activeCategory)
        if (newSortValue !== 'desc') params.set('sort', newSortValue)

        router.push(`/blogs?${params.toString()}`)
    }

    const value_data_blog_list = {
        data: sortBlogData([...initialPosts.data], sortValue),
        meta: initialPosts.meta,
    };

    const total_blog_post = value_data_blog_list.meta.pagination.total;

    const loadMore = () => {
        setPostLimit(prev => prev + 2)
    }

    const featuredArticle = lastArticles.data[0] || null;

    const categoryButton = "flex justify-between items-center w-full text-left py-4 border-b border-natural-gray-border"
    const categoryButtonHover = "text-natural-gray-default hover:text-black transition-all duration-300"

    const isFilteredView = Boolean(
        searchParams.search?.trim() || searchParams.category
    )
    const allArticlesSectionTop = isFilteredView ? 'mt-6 sm:mt-8' : 'mt-[76px]'
    
    return (
        <div>
            {!isFilteredView ? (
            <div className="relative">
                <div className="absolute inset-0 bg-linear-to-b/srgb from-white to-[#D8DEFF] h-5/6 max-h-[612px]"></div>
                <div className="max-w-1304 mx-auto pt-14 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                        {/* First/Featured Article */}
                        <div>
                            {featuredArticle && (
                                <BlogCard size="large" orientation="vertical" article={featuredArticle} />
                            )}
                        </div>

                        {/* Rest of the Articles */}
                        <div className="space-y-4">
                            {lastArticles.data.slice(1, 4).map((article) => (
                                <BlogCard size="small" key={article.id} article={article} orientation="horizontal" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            ) : null}


            <div className="max-w-1304 mx-auto scroll-mt-28" id="blog-results">



                <div className={`md:flex justify-between items-center ${allArticlesSectionTop} px-3 xl:px-0 mb-6`}>
                    <div className="justify-center md:justify-start flex items-center gap-x-1">
                        {titleIcon()}
                        <h1 className="text-natural-navy font-semibold text-2xl sm:text-[40px]">All articles</h1>
                    </div>

                    <div>
                        <form
                            role="search"
                            aria-label="Search articles"
                            className="text-center md:text-right"
                            onSubmit={handleSearchSubmit}
                        >
                            <div className="relative inline-block md:block">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-navy" />
                                <input
                                    type="search"
                                    name="search"
                                    enterKeyHint="search"
                                    value={searchValue}
                                    onChange={handleSearchInputChange}
                                    className="border border-natural-gray-border ring-natural-navy focus:ring-natural-navy text-natural-navy font-medium text-sm placeholder:text-natural-gray-default py-3 px-4 pl-12 rounded-xl"
                                    placeholder="Search..."
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-natural-gray-border" />

                <div className="mt-[92px] grid sm:grid-cols-2 lg:grid-cols-[270px_1fr] xl:grid-cols-[356px_1fr] gap-x-10 px-3 xl:px-0">
                    <div className="mb-10 sm:mb-0">
                        <div className="rounded-lg bg-white p-6">
                            <div>
                                <h2
                                    className={`${categoryButton} font-medium text-lg text-natural-navy`}>
                                    Categories
                                </h2>

                                <button
                                    onClick={() => handleCategoryChange(null)}
                                    className={`${categoryButton} ${categoryButtonHover}`}>
                                    <span className="text-current font-normal text-lg">All Content</span>
                                    <span className="text-natural-navy font-medium text-lg"></span>
                                </button>

                                {categories.map((category, index) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id.toString())}
                                        className={`${categoryButton} ${categoryButtonHover} 
                                        ${activeCategory === category.id.toString() ? 'text-black' : 'text-natural-gray-default'} 
                                        ${index === categories.length - 1 ? 'pb-0! border-b-0!' : ''}`}
                                    >
                                        <span className="text-current font-normal text-lg">{category.attributes.title}</span>
                                        <span className="text-natural-navy font-medium text-lg"></span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 bg-[#D8DEFF] rounded-lg px-6 py-8 text-center">
                            <h5 className="text-natural-navy font-semibold text-2xl">Start your document journey here</h5>
                            <p className="mt-2.5 text-[#6B7280] font-medium text-base">Market leading accuracy, easy set-up</p>
                            <Button link href={APP_URL} className="mt-8 max-w-[239px] mx-auto">
                                Start free trial
                            </Button>
                        </div>
                        <div className="mt-6 p-6 bg-white rounded-lg">
                            <h4 className="text-natural-navy font-semibold text-2xl">Follow us</h4>
                            <ul className="mt-4 flex items-center gap-x-3">
                                {DATA_SOCIAL_MEDIA.map((social) => (
                                    <li key={social.id}>
                                        <Link
                                            className="transition-all duration-300 rounded-xl w-10 h-10 border border-natural-gray-border flex items-center justify-center group hover:bg-natural-navy"
                                            href={social.href}
                                            target="_blank"
                                            aria-label={social?.label}>
                                            {social.id === "linkedin" && <LinkedinIcon className="text-natural-navy group-hover:text-white transition-all duration-300" />}
                                            {social.id === "facebook" && <FacebookIcon className="text-natural-navy group-hover:text-white transition-all duration-300  " />}
                                            {social.id === "instagram" && <InstagramIcon className="text-natural-navy group-hover:text-white transition-all duration-300" />}
                                            {social.id === "twitter" && <TwitterIcon className="text-natural-navy group-hover:text-white transition-all duration-300" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                    <div>
                        {/* Posts Grid */}

                        <div className="lg:flex justify-between items-center space-y-4 lg:space-y-0">
                            <span className="block text-natural-navy font-medium text-lg">
                                Results <span className="font-semibold">1-{total_blog_post > postLimit ? postLimit : total_blog_post}</span> out of <span className="font-semibold">{total_blog_post}</span> items
                            </span>
                            <Select
                                options={SELECT_LIST_SORT_BLOG_LIST}
                                valueKey="id"
                                labelKey="label"
                                addLine
                                preventIcon={<div className="flex items-center gap-x-2 mr-1">
                                    <SortIcon className="text-natural-navy" />
                                    <span className="text-natural-gray-default font-medium text-sm">Sort by:{" "}</span>
                                </div>}
                                textClassNames={{
                                    selected: "text-natural-navy text-base font-semibold",
                                    notSelected: "text-natural-gray-default text-base font-semibold"
                                }}
                                onChange={onChangeSortBlogList}
                                value={sortValue}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            {value_data_blog_list.data.slice(0, postLimit).map((post) => (
                                <BlogCard key={post.id} isflex size="normal" article={post} orientation="vertical" />
                            ))}
                        </div>

                        {/* Load More */}
                        {value_data_blog_list.data.length > postLimit && (
                            <Button variant="white" onClick={loadMore} className="mt-8 max-w-[239px] mx-auto">
                                See more posts
                            </Button>
                        )}
                    </div>
                </div>



            </div>
        </div>
    )
}



const BlogCard = ({ article, orientation, size = "normal", isflex = false }: { article: Post, orientation: 'vertical' | 'horizontal', size?: "normal" | "large" | "small", isflex?: boolean }) => {

    const { title, description, categories, image, publishedAt, slug, Time } = article?.attributes || {};


    const imgWidth = size === "small" ? 224 : size === "normal" ? 394 : 584
    const imgHeight = size === "small" ? 126 : size === "normal" ? 248 : 400
    const articleInfo = "text-natural-gray-default font-medium text-sm"


    const titleSize = size === "large" ? "text-[28px]" : "text-lg"
    const descSize = size === "large" ? "text-lg" : "text-base"

    const isMobile = useIsMobile();

    if (isMobile) {
       orientation = "vertical"
    }


    return (
        <Link
            href={`/blogs/${slug}`}
            className={`block ${size === "small" ? 'p-4' : 'p-6'} bg-white rounded-lg hover:shadow-lg transition-shadow`}
            aria-labelledby={`article-${slug}`}
        >
            <article className={`${isflex ? 'h-full' : ''}`}>
                <div className={`${orientation === "vertical" ? '' : 'flex items-center'} ${isflex ? 'flex flex-col h-full justify-between' : ''}`}>
                    <div className={`${orientation === "vertical" ? 'w-full' : 'w-[224px] h-[126px]'}`}>
                        <HirizeImage
                            unoptimized
                            // Was untyped (any) before the port; a post without an image is still unhandled.
                            src={getStrapiMedia(image && image) as string}
                            alt={title}
                            width={imgWidth}
                            height={imgHeight}
                            className="object-cover w-full h-full rounded-sm"
                        />
                    </div>
                    <div className={`${orientation === "vertical" ? 'mt-8' : 'mt-0 flex-1 pl-8'}  ${isflex ? 'flex flex-col flex-1 justify-between' : ''}`}>
                        <h3
                            id={`article-${slug}`}
                            className={`${titleSize} text-natural-navy font-semibold leading-normal hover:text-primary-600
                            ${orientation === "horizontal" && 'text-[16px]! leading-[normal]!'}
                            `}
                        >
                            {title}
                        </h3>
                        <p className={`${descSize} text-natural-gray-default font-normal mt-6 leading-normal
                            ${orientation === "horizontal" && 'text-[14px]! leading-[normal]! mt-2!'}
                        `}>
                            {description}
                        </p>
                        <div className={`flex items-center gap-x-2 mt-8 ${orientation === "horizontal" && 'mt-3!'}`}>
                            <span className={articleInfo} aria-label="Category">
                                {categories?.data?.[0]?.attributes.title}
                            </span>
                            <span className="w-1 h-1 bg-black/10 rounded-full" aria-hidden="true"></span>
                            <time
                                dateTime={publishedAt}
                                className={articleInfo}
                            >
                                {formatDate(publishedAt)}
                            </time>
                            <span className="w-1 h-1 bg-black/10 rounded-full" aria-hidden="true"></span>
                            <span className={articleInfo}>
                                <span className="sr-only">Reading time:</span>
                                {Time?.split(':')[1].replace('0', '') || 4} min read
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}