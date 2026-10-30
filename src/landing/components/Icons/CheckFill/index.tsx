const CheckFill = ({ className = "" }) => {
    return (
        <svg className={className} width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_di_5156_58519)">
                <mask id="path-1-inside-1_5156_58519" fill="white">
                    <path d="M2.5 7.98906C2.5 5.11718 4.82812 2.78906 7.7 2.78906H19.3C22.1719 2.78906 24.5 5.11718 24.5 7.98906V19.5891C24.5 22.4609 22.1719 24.7891 19.3 24.7891H7.7C4.82812 24.7891 2.5 22.4609 2.5 19.5891V7.98906Z" />
                </mask>
                <path d="M2.5 7.98906C2.5 5.11718 4.82812 2.78906 7.7 2.78906H19.3C22.1719 2.78906 24.5 5.11718 24.5 7.98906V19.5891C24.5 22.4609 22.1719 24.7891 19.3 24.7891H7.7C4.82812 24.7891 2.5 22.4609 2.5 19.5891V7.98906Z" fill="#2DC38C" />
                <path d="M2.5 2.78906H24.5H2.5ZM24.5 19.5891C24.5 23.2894 21.5003 26.2891 17.8 26.2891H9.2C5.49969 26.2891 2.5 23.2894 2.5 19.5891C2.5 21.6325 4.82812 23.2891 7.7 23.2891H19.3C22.1719 23.2891 24.5 21.6325 24.5 19.5891ZM2.5 24.7891V2.78906V24.7891ZM24.5 2.78906V24.7891V2.78906Z" fill="#2DC38C" mask="url(#path-1-inside-1_5156_58519)" />
            </g>
            <g filter="url(#filter1_d_5156_58519)">
                <path d="M8.5 12.7891L11.1149 15.927C11.4976 16.3862 12.195 16.4093 12.6073 15.9764L18.5 9.78906" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <filter id="filter0_di_5156_58519" x="1.5" y="0.289062" width="24" height="25.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_5156_58519" />
                    <feOffset />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.806057 0 0 0 0 0.943424 0 0 0 0 0.893056 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5156_58519" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5156_58519" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-2.5" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.386074 0 0 0 0 0.918896 0 0 0 0 0.723528 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_5156_58519" />
                </filter>
                <filter id="filter1_d_5156_58519" x="3.5" y="6.78906" width="20" height="16.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5156_58519" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5156_58519" result="shape" />
                </filter>
            </defs>
        </svg>
    )
}

export default CheckFill;