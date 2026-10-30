import { ArrowRight } from "@landing/components/Icons";

const ALink = ({ href, children, className, as = 'a', target = "_self" }: { href: string, children: React.ReactNode, className?: string, as?: 'a' | 'span' | 'div', target?: string }) => {
    const Component = as;
    return (
        <Component 
            {...(as === 'a' ? { href, target } : {})}
            className={`text-[#3A5AFF] text-sm font-semibold leading-5 sm:inline-flex items-center ${className || ''}`}
        >
            {children}
            <ArrowRight className="ml-2.5 text-[#3A5AFF] inline" />
        </Component>
    )
}

export default ALink