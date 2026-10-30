import Image from "next/image";
import { companyLogos } from "@landing/constants/Global";

const Brands = ({ title, cardType = 'normal' }: { title?: string, cardType?: string }) => {
    return (
        <div className="py-24 bg-white px-3 lg:px-0">
            <h2 className="text-natural-navy text-2xl xl:text-[40px] font-semibold text-center">
                {title ? title : <>Some brands that work <span className="bg-gradient-to-b from-[#242485] via-[#242485] to-[#818898] text-transparent bg-clip-text">with us</span></>}
            </h2>
            <div className={`grid ${cardType === 'bordered' ? 'mt-14 grid-cols-1 sm:grid-cols-2 gap-x-3 xl:gap-x-6' : 'mt-10 grid-cols-2 gap-x-10 xl:gap-x-20'} lg:flex flex-wrap justify-center items-center`}>
                {companyLogos.map((logo, index) => (
                    <div key={index} className={`${cardType === 'bordered' ? 'border border-natural-gray-default rounded-2xl w-[184px] h-[72px] flex items-center justify-center' : ''}
                        ${cardType === "bordered" ? `${index % 2 === 0 ? 'mx-auto sm:ml-auto' : 'mx-auto sm:mr-auto'} mt-5 lg:ml-0 lg:mr-0 lg:mt-0` : ""}`}>
                        {/* bordered */}
                        <Image
                            unoptimized
                            src={logo.src}
                            alt={logo.alt}
                            width={logo.width}
                            height={logo.height}
                            className={`${logo.className} ${cardType === "normal" ? `${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} mt-5 lg:ml-0 lg:mr-0 lg:mt-0` : ""}`}
                        />
                    </div>

                ))}
            </div>
        </div>
    )
}

export default Brands;