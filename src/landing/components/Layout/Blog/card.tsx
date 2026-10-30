import Image from "next/image";

interface BlogCardProps {
    image: string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    href: string;
    className?: string;
}

const BlogCard = ({ image, title, description, category, date, readTime, href, className }: BlogCardProps) => {
    return (
        <div className={`flex flex-col justify-between relative bg-natural-gray-bg rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-8 max-w-[408px] ${className || ''}`}>
            {href && <a href={href} className="absolute inset-0"></a>}
            <div className="">
                <div className="overflow-hidden">
                    <Image
                        unoptimized
                        src={image}
                        width={344}
                        height={280}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="mt-6">
                    <div>
                        <h3 className="text-xl font-semibold leading-6 mb-3 text-natural-navy">{title}</h3>
                        <p className="text-natural-gray-default font-normal text-lg leading-6 mt-4">{description}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center mt-6 text-base font-medium text-natural-gray-default gap-2">
                <span>{category}</span>
                <span>•</span>
                <span>{date}</span>
                <span>•</span>
                <span>{readTime}</span>
            </div>
        </div>
    );
};

export default BlogCard;