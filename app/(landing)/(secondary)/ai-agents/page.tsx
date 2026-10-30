import Image from "next/image";
import { Button } from "@landing/components/Ui";
import { LuminaLine } from "@landing/components/Icons";
import { CallToAction } from "@landing/components/Layout";
import { APP_URL, PAGE_SETTINGS } from "@landing/constants/Global";
import EmailForm from "./email-form";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.ai_agents);

const cardList = [
    {
        text: "Financial Institution Streamlines Regulatory Compliance Audits",
        icon: '/assets/images/pages/lumina/chart.png',
    },
    {
        text: "Manufacturing Company Enhances Supply Chain Visibility",
        icon: '/assets/images/pages/lumina/grid.png',
    },
    {
        text: "Consulting Firm Accelerates Client Proposal Development",
        icon: '/assets/images/pages/lumina/support.png',
    },
    {
        text: "Investment Bank Optimizes Deal Sourcing Processes",
        icon: '/assets/images/pages/lumina/analytics.png',
    }
]


const AiAgents = () => {
    return (
        <div className="bg-natural-green pt-24">
            <div className="relative h-full">
                <Image unoptimized src="/assets/images/pages/lumina/hero-bg.png" alt="AI Agents"
                    width={1440} height={750}
                    className="absolute inset-0 w-full h-full object-cover"
                    disable-data-aos="fade-in"
                    disable-data-aos-duration="1000" />

                <div className="relative z-10 pt-16 md:pt-20 lg:pt-28 mt-3">
                    <h1 className="text-auxiliary-blue-tint text-center text-3xl md:text-5xl lg:text-[64px] font-semibold px-4"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="200"
                        disable-data-aos-duration="800">
                        API Based Enterprise Search
                    </h1>
                    <p className="text-white text-center text-base md:text-lg font-medium mt-2 md:mt-3 lg:mt-4 px-4"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="400"
                        disable-data-aos-duration="800">
                        The easiest way to bring AI in your product suit
                    </p>
                    <div className="mt-10 text-center"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="600"
                        disable-data-aos-duration="800">
                        <Button
                            inline
                            link
                            href={APP_URL}
                            variant="white"
                            className="!rounded-full mx-auto !py-1">
                            Sign up for early access
                        </Button>
                    </div>
                    <div className="mt-12 text-center"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="800"
                        disable-data-aos-duration="1000">
                        <Image src="/assets/images/pages/lumina/hero-content.png" alt="Lumina AI Agents"
                            width={910} height={374}
                            unoptimized
                            className="mx-auto max-w-[1425px] w-full hidden lg:block" />
                        <Image src="/assets/images/pages/lumina/hero-content-mobile.png" alt="Lumina AI Agents"
                            width={910} height={374}
                            unoptimized
                            className="mx-auto max-w-[1425px] w-full block lg:hidden" />
                    </div>
                </div>
            </div>


            <div className="py-5 mt-14 flex justify-center items-center overflow-hidden">
                <span disable-data-aos="fade-down" disable-data-aos-delay="100" disable-data-aos-duration="500" disable-data-aos-easing="ease-in-sine">
                    <LuminaLine />
                </span>
            </div>



            {/* Enterprise Search */}
            <div className="max-w-[1132px] mx-auto px-3 md:px-0 pb-24">
                <h2 className="text-auxiliary-blue-tint text-center text-3xl md:text-5xl lg:text-[56px] font-medium px-4">
                    Enterprise Search By Field
                </h2>
                <p className="text-white text-center text-xl md:text-lg font-light mt-2 md:mt-4 lg:mt-9 px-4">
                    Build Enterprise level AI agents in Minutes not Months
                </p>


                <div className="mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between">
                        {cardList.map((item, index) => (
                            <div className="relative px-8 md:pt-7 md:pb-8 md:mt-5 lg:mt-0 overflow-hidden" key={index}>
                                <div className="hidden md:block">
                                    <div className="hidden md:block absolute left-0 top-0" disable-data-aos="fade-right" disable-data-aos-delay={index * 200} disable-data-aos-duration="800">
                                        <LuminaLine type="thin" />
                                    </div>
                                    <img src={item.icon} alt={item.text} disable-data-aos="fade-up" disable-data-aos-delay={index * 200} disable-data-aos-duration="800" />
                                    <p className="text-white text-base md:text-lg font-normal mt-2 md:mt-3 lg:mt-8" disable-data-aos="fade-up" disable-data-aos-delay={index * 200 + 200} disable-data-aos-duration="800">
                                        {item.text}
                                    </p>
                                    {index === cardList.length - 1 && (
                                        <div className="hidden lg:block absolute right-0 top-0" disable-data-aos="fade-left" disable-data-aos-delay={index * 200} disable-data-aos-duration="800">
                                            <LuminaLine type="thin" />
                                        </div>
                                    )}
                                </div>


                                <div className="md:hidden">
                                    <div className="flex items-center gap-x-4">
                                        <img className="md:hidden" src={item.icon} alt={item.text} />
                                        <p className="text-white text-base md:text-lg font-normal mt-2 md:mt-3 lg:mt-8">
                                            {item.text}
                                        </p>
                                    </div>
                                    <div className="md:hidden text-center flex justify-center items-center h-[110px] my-3 overflow-hidden">
                                        <LuminaLine className="h-full" />
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                    <Image src="/assets/images/pages/lumina/search-img.png"
                        alt="Lumina AI Agents"
                        disable-data-aos="zoom-in"
                        disable-data-aos-delay="300"
                        disable-data-aos-duration="1000"
                        unoptimized
                        width={1132} height={388}
                        className="mx-auto max-w-[1132px] w-full mt-14" />
                </div>
            </div>



            {/* how to become sign up */}
            <div className="relative pt-24">
                <div className="text-center px-3 md:px-0">
                    <div className="inline-block mx-auto w-max border border-[#FFFFFF14] rounded-full px-4 py-1.5 bg-white/10"
                        disable-data-aos="fade-down"
                        disable-data-aos-duration="800"
                    >
                        <span className="text-white text-sm font-normal">Waitlist Field Enterprise search</span>
                    </div>

                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl md:leading-[1.5] lg:text-[40px] font-medium mt-2 leading-relaxed"
                        disable-data-aos="fade-up"
                        disable-data-aos-duration="800"
                        disable-data-aos-delay="200"
                    >Sign up now to become the <br className="hidden sm:block" /> first to use the Field AI agent</h3>
                    <p className="text-white text-lg font-normal mt-5"
                        disable-data-aos="fade-up"
                        disable-data-aos-duration="800"
                        disable-data-aos-delay="400"
                    >Supercharge your AI development with the Field AI agent</p>
                </div>

                <div className="mt-28 relative z-10 px-3 md:px-0">
                    <EmailForm className="max-w-[398px] mx-auto" />
                </div>
                <div className="text-center -mt-20">
                    <Image unoptimized src="/assets/images/pages/lumina/section-img.png" alt="Lumina AI Agents"
                        width={1380} height={556}
                        disable-data-aos="fade-up"
                        disable-data-aos-duration="1000"
                        disable-data-aos-delay="800"
                        className="mx-auto" />
                </div>
            </div>


            {/* search and chat */}
            <div className="py-20 max-w-[1132px] mx-auto px-3 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5">
                    <div className="pt-16 text-center md:text-left"
                        disable-data-aos="fade-right"
                        disable-data-aos-duration="800">
                        <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-medium lg:leading-[56px]">AI that goes beyond search and chat</h3>
                    </div>
                    <div className="mt-6 md:mt-0"
                        disable-data-aos="fade-left"
                        disable-data-aos-duration="800"
                        disable-data-aos-delay="200">
                        <Image src="/assets/images/pages/lumina/search-1.png" className="mx-auto md:mx-0" alt="Security is priority" width={547} height={339} unoptimized />
                    </div>
                    <div className="mt-6"
                        disable-data-aos="fade-right"
                        disable-data-aos-duration="800"
                        disable-data-aos-delay="400">
                        <Image src="/assets/images/pages/lumina/search-2.png" className="mx-auto md:mx-0" alt="Operations" width={547} height={366} unoptimized />
                    </div>
                    <div className="mt-6"
                        disable-data-aos="fade-left"
                        disable-data-aos-duration="800"
                        disable-data-aos-delay="600">
                        <Image src="/assets/images/pages/lumina/search-3.png" className="mx-auto md:mx-0" alt="Tasks and Actions" width={547} height={366} unoptimized />
                    </div>


                </div>
            </div>


            <CallToAction type="lumina" />
        </div>
    )
}

export default AiAgents;