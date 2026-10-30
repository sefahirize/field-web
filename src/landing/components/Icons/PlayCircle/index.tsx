const PlayCircle = ({ className = "" }: { className?: string }) => {
    return (
        <svg className={className} width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_1_199)">
                <rect width="56" height="56" rx="28" fill="#020F4E" fillOpacity="0.4" />
                <path fillRule="evenodd" clipRule="evenodd" d="M22.648 18.2223C22.92 18.0707 23.2274 17.9944 23.5387 18.0013C23.8492 18.0081 24.1522 18.0975 24.4168 18.2602C24.4174 18.2606 24.4181 18.261 24.4187 18.2614L37.9011 26.5064C38.158 26.6601 38.371 26.8775 38.5193 27.1376C38.6692 27.4003 38.748 27.6976 38.748 28C38.748 28.3025 38.6692 28.5997 38.5193 28.8625C38.3709 29.1226 38.158 29.34 37.9011 29.4937L24.4187 37.7386C24.4182 37.739 24.4176 37.7394 24.417 37.7397C24.1524 37.9025 23.8493 37.9919 23.5387 37.9988C23.2274 38.0057 22.92 37.9294 22.648 37.7778C22.376 37.6262 22.1494 37.4048 21.9916 37.1365C21.8337 36.8681 21.7503 36.5625 21.75 36.2511V19.7489C21.7503 19.4376 21.8337 19.132 21.9916 18.8636C22.1494 18.5952 22.376 18.3738 22.648 18.2223ZM23.3687 19.9636L23.3704 19.9646ZM23.75 20.1968L36.5101 28L23.75 35.8033V20.1968Z" fill="white" />
            </g>
            <defs>
                <filter id="filter0_b_1_199" x="-12" y="-12" width="80" height="80" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="6" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1_199" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1_199" result="shape" />
                </filter>
            </defs>
        </svg>
    );
};

export default PlayCircle;