import HeroLayout from "@landing/components/Global/HeroLayout";
import Button from "@landing/components/Ui/Button";
import Image from "next/image";

import { APP_URL, PAGE_SETTINGS, companyLogos } from "@landing/constants/Global";


interface Props {
    className?: string;
    showLogos?: boolean;
    bgImage?: string;
    title?: string | React.ReactNode;
    titleClassName?: string;
    description?: string;
    descClassName?: string;
    subHero?: boolean;
    bottomSpace?: boolean;
    hideButtons?: boolean;
    children?: React.ReactNode;
    rounded?: boolean;
    overlay?: boolean | string | number;
}

const Hero: React.FC<Props> = ({ className = "", showLogos = false, bgImage = "/assets/images/hero/home.png", title, titleClassName = "", description, descClassName = "", subHero = false, bottomSpace = false, hideButtons = false, children, rounded = false, overlay = false }) => {


    const contactLink = PAGE_SETTINGS.contact.href;
    const signInLink = APP_URL;






    // new settings from here
    const height = subHero ? "min-h-[calc(100vh-6rem)]" : "min-h-[calc(100vh-12rem)]";
    return (
        <HeroLayout>
            <div className={`relative mx-auto ${height} lg:px-6 lg:rounded-lg max-w-[1980px] ${subHero ? "" : ""} ${bottomSpace ? "mb-16" : ""} ${className}`}>
                <div className="relative w-full h-full">
                    <Image src={bgImage}
                        alt="HomeHero"
                        fill
                        className={`w-full h-auto object-cover lg:rounded-lg ${rounded ? "" : ""}`}
                        priority
                        unoptimized
                    />
                    {overlay && (
                        <div className="absolute inset-0 bg-black lg:rounded-lg" style={{ opacity: typeof overlay === 'boolean' ? 0.3 : overlay }}></div>
                    )}
                    <div className={`pt-8 md:pt-14 px-4 md:px-14 flex flex-col justify-between ${height} relative z-10`}>
                        <div className="flex flex-col justify-between">
                            <h1 className={`text-white text-3xl md:text-5xl lg:text-7xl lg:leading-tight md:leading-[81px] font-bold max-w-[1080px] ${titleClassName}`} disable-data-aos="fade-up">
                                {title}
                            </h1>
                            <div>
                                <p className={`pt-6 md:pt-9 mt-6 md:mt-9 !max-w-[500px] border-t border-white text-white text-sm md:text-base xl:text-lg 2xl:text-2xl font-light 2xl:!max-w-[800px] ${descClassName}`}
                                    disable-data-aos="fade-up"
                                    disable-data-aos-delay="200"
                                >
                                    {description}
                                </p>
                                {!hideButtons && (
                                    <div className={`flex flex-col sm:flex-row gap-4 sm:gap-x-9 ${!showLogos && "py-6 md:py-8"}`}
                                        disable-data-aos="fade-up"
                                        disable-data-aos-delay="300"
                                    >
                                        <Button link href={contactLink} className="mt-6 md:mt-8" inline>
                                            Request demo
                                        </Button>
                                        <Button link href={signInLink} className="mt-4 sm:mt-8" variant="transparent-white" inline hideIcon>
                                            Start Trial
                                        </Button>
                                    </div>
                                )}
                                {children && (
                                    <>
                                        {children}
                                    </>
                                )}
                            </div>
                        </div>
                        {showLogos && (
                            <div disable-data-aos="fade-up"
                                disable-data-aos-delay="400">
                                <div className="py-6 md:py-8">
                                    <p className="text-base md:text-lg text-white font-medium text-center">Trusted by great teams</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 -mb-9">
                                    {companyLogos.map((logo, index) => (
                                        <div key={index} className="bg-white rounded-2xl h-[72px] border border-[#e1e1e2] flex items-center justify-center p-2">
                                           <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={logo.width}
                                                height={logo.height}
                                                unoptimized
                                                style={{ maxWidth: logo.width }}
                                                className={`w-auto h-auto max-h-full ${logo.className || ""}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HeroLayout>
    )



    // return (
    //     <HeroLayout>
    //         <div className={`relative mx-auto ${subHero ? "max-w-lg xl:min-h-[666px] mt-16" : "max-w-8xl"} ${bottomSpace ? "mb-16" : ""} ${className}`}>
    //             <Image src={bgImage}
    //                 alt="HomeHero"
    //                 fill
    //                 className={`w-full h-auto object-cover ${rounded ? "rounded-lg" : ""}`}
    //                 priority
    //                 unoptimized
    //             />
    //             {overlay && (
    //                 <div className="absolute inset-0 bg-black" style={{ opacity: typeof overlay === 'boolean' ? 0.3 : overlay }}></div>
    //             )}
    //             <div className="pt-8 md:pt-14 px-4 md:px-14 flex flex-col justify-between relative z-10">
    //                 <h3 className={`text-white text-3xl md:text-5xl lg:text-7xl leading-tight md:leading-[81px] font-bold max-w-[1080px] ${titleClassName}`}>
    //                     {title}
    //                 </h3>
    //                 <div>
    //                     <p className={`pt-6 md:pt-9 mt-6 md:mt-9 max-w-[300px] border-t border-white text-white text-sm md:text-base font-light ${descClassName}`}>
    //                         {description}
    //                     </p>
    //                     {!hideButtons && (
    //                         <div className={`flex flex-col sm:flex-row gap-4 sm:gap-x-9 ${!showLogos && "py-6 md:py-8"}`}>
    //                             <Button link href={contactLink} className="mt-6 md:mt-8" inline>
    //                                 Request demo
    //                         </Button>
    //                         <Button link href={signInLink} className="mt-4 sm:mt-8" variant="transparent-white" inline hideIcon>
    //                             Start Trial
    //                             </Button>
    //                         </div>
    //                     )}
    //                     {children && (
    //                         <>
    //                             {children}
    //                         </>
    //                     )}
    //                     {showLogos && (
    //                         <div className="py-6 md:py-8">
    //                             <p className="text-base md:text-lg text-white font-medium text-center">Trusted by great teams</p>
    //                         </div>
    //                     )}
    //                     {showLogos && (
    //                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 -mb-9">
    //                             {companyLogos.map((logo, index) => (
    //                                 <div key={index} className="bg-white rounded-2xl h-[72px] border border-[#e1e1e2] flex items-center justify-center p-2">
    //                                     <Image
    //                                         src={logo.src}
    //                                         alt={logo.alt}
    //                                         width={logo.width}
    //                                         height={logo.height}
    //                                         className="w-auto h-auto max-w-full max-h-full"
    //                                     />
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     </HeroLayout>
    // )
}

export default Hero;