interface ChevronRightProps {
    className?: string;
}

const ChevronRight: React.FC<ChevronRightProps> = ({ className }) => {
    return (
        <svg className={`${className || ''}`} width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1.02925 1.02729C1.2896 0.766944 1.71171 0.766944 1.97206 1.02729L6.97206 6.02729C7.23241 6.28764 7.23241 6.70975 6.97206 6.9701L1.97206 11.9701C1.71171 12.2305 1.2896 12.2305 1.02925 11.9701C0.768897 11.7098 0.768897 11.2876 1.02925 11.0273L5.55784 6.4987L1.02925 1.9701C0.768897 1.70975 0.768897 1.28764 1.02925 1.02729Z" />
        </svg>
    );
};

export default ChevronRight;
