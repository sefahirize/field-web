export default function Blog() {
    return (
        <></>
    )
}

// import { Section, SectionHeader } from "@landing/components/Global";
// import { EditPencilIcon } from "@landing/components/Icons";
// import { API_DOMAIN } from "@landing/utils/api";
// import BlogCard from "./card";
// import qs from "qs";

// interface BlogImage {
//     data: {
//         attributes: {
//             url: string;
//         };
//     } | null;
// }

// interface BlogCategory {
//     data: Array<{
//         attributes: {
//             title: string;
//         };
//     }>;
// }

// interface BlogPost {
//     attributes: {
//         title: string;
//         description: string;
//         categories: BlogCategory;
//         image: BlogImage;
//         publishedAt: string;
//         slug: string;
//         Time: string;
//     };
// }

// interface BlogResponse {
//     data: BlogPost[];
// }

// const getBlogPosts = async (): Promise<BlogResponse | undefined> => {
//     try {
//         const query = qs.stringify(
//             {
//                 filters: {},
//                 sort: { publishedAt: 'desc' },
//                 populate: '*',
//                 pagination: {
//                     pageSize: 3,
//                 },
//             },
//             {
//                 encodeValuesOnly: true,
//             },
//         );
//         const response = await fetch(`${API_DOMAIN}/api/blogs/?${query}`);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// };

// const imageUrl = (imageData: BlogImage): string => {
//     if (!imageData?.data?.attributes?.url) return '';
//     return `${API_DOMAIN}${imageData.data.attributes.url}`;
// }

// const BlogDetail = (data: { data: BlogPost }) => {
//     const { title, description, categories, image, publishedAt, slug, Time } = data?.data?.attributes || {};

//     const imgSrc = `${imageUrl(image)}`;
//     const category = categories?.data?.[0]?.attributes.title;
//     const time = `${Time?.split(':')[1].replace('0', '') || 4} min read`;

//     // Format the date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
//     };

//     const publish = publishedAt ? formatDate(publishedAt) : "";

//     return (
//         <BlogCard
//             className="mb-10 lg:mb-0 mx-auto"
//             image={imgSrc}
//             title={title}
//             description={description}
//             category={category}
//             date={publish}
//             readTime={time}
//             href={slug}
//         />
//     )
// };

// const Blog = async () => {
//     const blogPosts = await getBlogPosts();


//     return (
//         <Section className="!pb-0">
//             <SectionHeader
//                 title="Case studies and Blog posts"
//                 tagIcon={<EditPencilIcon className="text-black" />}
//                 tagText="Blog"
//                 bottomSpace
//             />
//             <div className="py-14 px-3 sm:px-6 lg:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 lg:gap-x-10">
//                         {blogPosts && blogPosts.data.map((post: BlogPost, index: number) => (
//                             <BlogDetail
//                                 key={index}
//                                 data={post}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </Section>
//     );
// };

// export default Blog;