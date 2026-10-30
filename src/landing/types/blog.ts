interface ImageFormat {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: null | string
    size: number
    width: number
    height: number
}

interface ImageAttributes {
    name: string
    alternativeText: string
    caption: string
    width: number
    height: number
    formats: {
        large: ImageFormat
        small: ImageFormat
        medium: ImageFormat
        thumbnail: ImageFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: null | string
    provider: string
    provider_metadata: unknown
    createdAt: string
    updatedAt: string
}

interface CategoryData {
    id: number
    attributes: {
        title: string
        createdAt: string
        updatedAt: string
        publishedAt: string
    }
}

export interface Post {
    id: number
    attributes: {
        title: string
        slug: string
        body: string
        description: string
        createdAt: string
        updatedAt: string
        publishedAt: string
        Time: string
        youtube_video: string | null
        image: {
            data: {
                id: number
                attributes: ImageAttributes
            }
        } | null
        categories: {
            data: CategoryData[]
        }
    }
}

export interface Category {
    id: number
    attributes: {
        title: string
        createdAt: string
        updatedAt: string
        publishedAt: string
    }
} 