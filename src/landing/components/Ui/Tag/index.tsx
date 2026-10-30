interface TagProps {
    icon?: React.ReactNode;
    text: string;
    className?: string;
}

const Tag: React.FC<TagProps> = ({ icon, text, className }) => {
    return (
        <div className={`relative inline-flex justify-center items-center gap-2 px-2.5 py-2 rounded-full border border-[#F1F1F1] ${className || ''}`}>
            {icon && <>{icon}</>}
            <span className="text-base font-medium text-dark-secondary">{text}</span>
        </div>
    );
};

export default Tag;
