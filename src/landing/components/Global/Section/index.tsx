interface SectionProps {
    className?: string;
    mobileSpace?: boolean;
    children?: React.ReactNode;
    bgGray?: boolean;
}

const Section: React.FC<SectionProps> = ({ className = "", children, mobileSpace = false, bgGray = false }) => {
    return <div className={`py-24 ${mobileSpace ? "px-3 xl:px-0" : ""} ${className} ${bgGray ? "bg-natural-gray-bg" : ""}`}>{children}</div>;
};

export default Section;
