import Link from 'next/link'
import type { Post } from '@landing/types/blog'
import { SearchIcon } from '@landing/components/Icons'

interface BlogArticleSidebarProps {
  recentPosts: Post[]
}

export const BlogArticleSidebar = ({ recentPosts }: BlogArticleSidebarProps) => {
  return (
    <aside className="space-y-8 lg:sticky lg:top-28">
      <div className="rounded-lg bg-white p-6 border border-natural-gray-border shadow-sm">
        <h2 className="text-natural-navy font-semibold text-lg">Search</h2>
        <search className="mt-4" aria-label="Search blog articles">
          <form action="/blogs" method="get" role="search" className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label htmlFor="blog-detail-search" className="sr-only">
              Search articles
            </label>
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-natural-navy" />
              <input
                id="blog-detail-search"
                name="search"
                type="search"
                autoComplete="off"
                className="w-full border border-natural-gray-border text-natural-navy font-medium text-sm placeholder:text-natural-gray-default py-3 pr-3 pl-10 rounded-xl ring-natural-navy focus:outline-none focus:ring-2 focus:ring-natural-navy"
                placeholder="Search…"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-natural-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-natural-navy-dark focus:outline-none focus:ring-2 focus:ring-natural-navy focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </search>
      </div>

      <div className="rounded-lg bg-white p-6 border border-natural-gray-border shadow-sm">
        <h2 className="text-natural-navy font-semibold text-lg">Recent posts</h2>
        {recentPosts.length === 0 ? (
          <p className="mt-4 text-sm text-natural-gray-default">No other posts yet.</p>
        ) : (
          <ul className="mt-4 space-y-5 border-t border-natural-gray-border pt-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blogs/${post.attributes.slug}`}
                  className="group block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-natural-navy focus-visible:ring-offset-2"
                >
                  <span className="font-semibold text-natural-navy text-base leading-snug group-hover:text-app-blue transition-colors">
                    {post.attributes.title}
                  </span>
                  {post.attributes.description ? (
                    <p className="mt-1.5 text-sm text-natural-gray-default leading-relaxed line-clamp-2">
                      {post.attributes.description}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
