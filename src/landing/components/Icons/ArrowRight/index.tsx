interface ArrowRightProps {
    className?: string;
    color?: string;
}

const ArrowRight: React.FC<ArrowRightProps> = ({ className, color = "#3A5AFF" }) => {
    return (
        <svg className={className} width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.8727 1.16406L13.6179 5.90926M13.6179 5.90926L8.8727 10.6555M13.6179 5.90926L1.75391 5.91026" 
                stroke={color} 
                strokeWidth="2.00304" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    );
};

export default ArrowRight;
