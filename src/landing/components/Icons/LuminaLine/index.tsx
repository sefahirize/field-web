interface LuminaLineProps {
    className?: string;
    type?: 'thin' | 'standart';
}

const LuminaLine = ({ className, type = 'standart' }: LuminaLineProps) => {


    if (type === 'thin') {
        return (
            <svg className={className} width="9" height="221" viewBox="0 0 9 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_5246_16187)">
                    <line x1="4.5" y1="212.797" x2="4.5" y2="0.796875" stroke="url(#paint0_linear_5246_16187)" shapeRendering="crispEdges" />
                </g>
                <defs>
                    <filter id="filter0_d_5246_16187" x="0" y="0.796875" width="9" height="220" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5246_16187" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5246_16187" result="shape" />
                    </filter>
                    <linearGradient id="paint0_linear_5246_16187" x1="5.5" y1="212.797" x2="5.5" y2="0.796875" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8DEFF" stopOpacity="0.6" />
                        <stop offset="1" stopColor="#D8DEFF" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        )
    }


    return (
        <svg className={className} width="9" height="162" viewBox="0 0 9 162" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_5246_16119)">
                <line x1="4.5" y1="154" x2="4.5" stroke="url(#paint0_linear_5246_16119)" shapeRendering="crispEdges" />
            </g>
            <defs>
                <filter id="filter0_d_5246_16119" x="0" y="0" width="9" height="162" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.26 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5246_16119" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5246_16119" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_5246_16119" x1="5.5" y1="154" x2="5.5" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D8DEFF" />
                    <stop offset="1" stopColor="#D8DEFF" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default LuminaLine;