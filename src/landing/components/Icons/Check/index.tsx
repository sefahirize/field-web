interface CheckIconProps {
    className?: string;
}

const CheckIcon = ({ className = "" }: CheckIconProps) => {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M13.7178 0.56342C14.0107 0.856313 14.0107 1.33119 13.7178 1.62408L5.84283 9.49908C5.54994 9.79197 5.07506 9.79197 4.78217 9.49908L0.84467 5.56158C0.551777 5.26869 0.551777 4.79381 0.84467 4.50092C1.13756 4.20803 1.61244 4.20803 1.90533 4.50092L5.3125 7.90809L12.6572 0.56342C12.9501 0.270527 13.4249 0.270527 13.7178 0.56342Z" fill="currentColor"/>
        </svg>
    );
};

export default CheckIcon;
