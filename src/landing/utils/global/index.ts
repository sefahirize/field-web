import { API_DOMAIN } from "@landing/constants/Global";
import { Post } from '@landing/types/blog'

export function getStrapiURL(path = '') {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || API_DOMAIN}${path}`;
}

export function getStrapiMedia(image: Post['attributes']['image'] | null | undefined) {
    const { url } = image?.data?.attributes.formats.large || {};
    const imageUrl = url?.startsWith('/') ? getStrapiURL(url) : url;
    return imageUrl;
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const sortBlogData = (array: Post[], sortType: string) => {
    if (sortType === 'asc') {
        return array.sort(
            (first, second) =>
                new Date(first.attributes.publishedAt).getTime() - new Date(second.attributes.publishedAt).getTime(),
        );
    }

    if (sortType === 'desc') {
        return array.sort(
            (first, second) =>
                new Date(second.attributes.publishedAt).getTime() - new Date(first.attributes.publishedAt).getTime(),
        );
    }

    return array;
};