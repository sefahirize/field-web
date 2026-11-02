import { Tag } from "@landing/components/Ui";

interface SectionHeaderProps {
    className?: string;
    title?: string | React.ReactNode;
    titleClassName?: string;
    text?: string | React.ReactNode;
    textClassName?: string;
    tagIcon?: React.ReactNode;
    tagText?: string;
    bottomSpace?: boolean;
    children?: React.ReactNode;
    tagClassName?: string;
    topSpace?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    className = "",
    title = "",
    titleClassName = "",
    text = "",
    textClassName = "",
    tagIcon,
    tagText = "",
    bottomSpace = false,
    topSpace = false,
    tagClassName = "",
    children
}) => {
    return (
        <div className={`text-center ${bottomSpace ? 'mb-14' : ''} ${topSpace ? 'mt-14' : ''} ${className} px-3 lg:px-0`}>
            {tagText && <Tag className={tagClassName} icon={tagIcon} text={tagText} />}
            {title && <h2 className={`text-[#041527] text-2xl sm:text-3xl lg:text-5xl font-semibold mt-3 text-center leading-[1.2] sm:leading-9 lg:leading-none ${titleClassName}`}>{title}</h2>}
            {text && <p className={`mt-4 sm:mt-14 text-[#223140] text-sm sm:text-base lg:text-lg font-normal text-center leading-5 sm:leading-6 lg:leading-7 ${textClassName}`}>
                {text}
            </p>}
            {children}
        </div>
    );
};

export default SectionHeader;
