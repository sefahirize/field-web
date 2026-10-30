const TrashCircle = () => {
    return (
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_dd_5634_109733)">
                <rect x="2" y="1" width="31" height="31" rx="15.5" fill="#DF1C3F" />
                <rect x="2" y="1" width="31" height="31" rx="15.5" fill="url(#paint0_linear_5634_109733)" fillOpacity="0.12" />
                <rect x="2.5" y="1.5" width="30" height="30" rx="15" stroke="url(#paint1_linear_5634_109733)" strokeOpacity="0.16" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.4442 11.832H10.8333V13.1654H12.2095L12.8762 23.1654H22.1236L22.7903 13.1654H24.1666V11.832H20.5557C20.0414 10.655 18.8674 9.83203 17.4999 9.83203C16.1324 9.83203 14.9585 10.655 14.4442 11.832ZM16.009 11.832H18.9908C18.6244 11.4228 18.0919 11.1654 17.4999 11.1654C16.908 11.1654 16.3755 11.4228 16.009 11.832ZM21.454 13.1654H13.5458L14.1236 21.832H20.8762L21.454 13.1654ZM16.8333 15.1654V19.832H15.4999V15.1654H16.8333ZM19.4999 15.1654V19.832H18.1666V15.1654H19.4999Z" fill="white" />
            </g>
            <defs>
                <filter id="filter0_dd_5634_109733" x="0" y="0" width="35" height="35" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_5634_109733" />
                    <feOffset />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.87451 0 0 0 0 0.109804 0 0 0 0 0.247059 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5634_109733" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_5634_109733" result="effect2_dropShadow_5634_109733" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_5634_109733" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_5634_109733" x1="17.5" y1="1" x2="17.5" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_5634_109733" x1="17.5" y1="1" x2="17.5" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default TrashCircle;