interface HeroLayoutProps {
    children: React.ReactNode;
    className?: string;
}

const HeroLayout: React.FC<HeroLayoutProps> = ({ children, className = "" }) => {
    return (
        <div className={`pt-24 h-full ${className}`}>
            {children}
        </div>
    );
};

export default HeroLayout;