import { Section, SectionHeader } from "@landing/components/Global";
import { Hero, TestimonialsShort, CallToAction } from "@landing/components/Layout";
import { Button } from "@landing/components/Ui";
import Image from "next/image";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { Quotes } from "@landing/components/Icons";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.about);

const leadershipData = [
    {
        name: "Esranur Kaygin",
        role: "Founder & CEO",
        image: "/assets/images/pages/about-us/profile-1.png"
    },
    {
        name: "Eren Yasarkurt",
        role: "Co-Founder & Head of Engineering",
        image: "/assets/images/pages/about-us/profile-2.png"
    }
]


const investorsData = [
    {
        alt: "japx",
        image: "/assets/images/pages/about-us/investor-logo-1.png",
        maxWidth: 96
    },
    {
        alt: "domino",
        image: "/assets/images/pages/about-us/investor-logo-2.png",
        maxWidth: 96
    },
    // {
    //     alt: "Laurant Caraffa",
    //     image: "/assets/images/pages/about-us/investor-logo-3.png",
    //     maxWidth: 145
    // },
    {
        alt: "ankh",
        image: "/assets/images/pages/about-us/investor-logo-6.png",
        maxWidth: 96
    },
    // {
    //     alt: "David Goubert",
    //     image: "/assets/images/pages/about-us/investor-logo-5.png",
    //     maxWidth: 134
    // },
    {
        alt: "startupfon",
        image: "/assets/images/pages/about-us/investor-logo-4.png",
        maxWidth: 96
    }
]

const partnersData = [
    {
        alt: "startupfon",
        image: "/assets/images/pages/about-us/partner-logo-1.png",
        maxWidth: 60
    },
    {
        alt: "startupfon",
        image: "/assets/images/pages/about-us/partner-logo-2.png",
        maxWidth: 128
    },
    {
        alt: "startupfon",
        image: "/assets/images/pages/about-us/partner-logo-3.png",
        maxWidth: 152
    },
    {
        alt: "startupfon",
        image: "/assets/images/pages/about-us/partner-logo-4.png",
        maxWidth: 168
    }
]



const newsData = [
    {
        image: "/assets/images/pages/about-us/news-1.png",
        category: "BarChart",
        title: "The Era of Female AI Founders: Breaking Barriers and Leading the Future of Tech",
        text: "A significant shift is underway as more women rise to leadership roles in artificial intelligence (AI). Despite persistent underrepresentation, a new wave of female founders is breaking barriers and redefining the industry's landscape",
        link: "https://www.barchart.com/story/news/29254471/the-era-of-female-ai-founders-breaking-barriers-and-leading-the-future-of-tech"
    },
    {
        image: "/assets/images/pages/about-us/news-2.png",
        category: "Refresh Miami",
        title: "Field is revolutionizing job recruitment through AI",
        text: "Almost all HR apps out there use a parser and a matching tool,” HR tech entrepreneur Esranur Kaygin told Refresh Miami. “The problem is that the accuracy is so low – between 60 and 80%.”",
        link: "https://refreshmiami.com/news/hirize-is-revolutionizing-job-recruitment-through-ai/"
    }
]



const AboutUs: React.FC = () => {


    const pClass = "text-natural-navy text-base md:text-lg font-normal"
    const cardClass = "w-full max-w-[321px] h-[151px] flex items-center justify-center bg-white border border-natural-gray-border mx-auto"


    return (
        <div>
            <Hero
                subHero
                overlay
                className="min-h-[527px]!"
                title={
                    <>
                        <span className="lg:text-[70px]! xl:text-[71px] font-semibold xl:leading-[72px]! md:mt-[73px] block">Taking Document <br className="hidden lg:block" /> Intelligence to the next level</span>
                    </>
                }
                titleClassName=" mx-auto text-center"
                description="We know how hard it is to start, grow and manage your startup all at the same time. Startups get 60% discount at the Field startup program."
                descClassName="mx-auto text-center md:px-11 mt-0! w-full! max-w-[800px]! border-0!"
                hideButtons
                bgImage="/assets/images/hero/about-us.png" >
                <div className="flex justify-center items-center mt-2.5">
                    <Button link href={PAGE_SETTINGS.contact.href} className="mt-6 md:mt-[45px]" inline variant="black">
                        Book a Demo call
                    </Button>
                </div>
            </Hero>

            <Section>
                <div className="max-w-lg mx-auto bg-natural-gray-bg p-12">
                    <h2 className="text-[28px] md:text-[32px] lg:text-[40px] font-semibold text-natural-navy">Our company</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 mt-8">
                        <div>
                            <p className={pClass}>
                                After exploring available technologies in the human resources industry, we discovered a state of stagnation where even the most cutting-edge technology has failed to improve the hiring process that has remained largely unchanged for decades
                            </p>
                            <p className={`${pClass} mt-7`}>
                                Thus, we built Field, an AI-driven API that saves time for hiring teams and allows them to focus on attracting and retaining top talent.
                            </p>
                        </div>
                        <div className="mt-7 lg:mt-0">
                            <p className={pClass}>
                                After exploring available technologies in the human resources industry, we discovered a state of stagnation where even the most cutting-edge technology has failed to improve the hiring process that has remained largely unchanged for decades
                            </p>
                            <p className={`${pClass} mt-7`}>
                                Thus, we built Field, an AI-driven API that saves time for hiring teams and allows them to focus on attracting and retaining top talent.
                            </p>
                        </div>
                    </div>
                    <div className="mt-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <Image src="/assets/images/pages/about-us/about-us-1.png" alt="about-us" width={486} height={335} className="w-full h-full object-cover"
                                disable-data-aos="fade-right"
                                disable-data-aos-delay="100"
                                unoptimized
                            />
                            <Image src="/assets/images/pages/about-us/about-us-2.png" alt="about-us" width={497} height={335} className="w-full h-full object-cover"
                                disable-data-aos="fade-left"
                                disable-data-aos-delay="100"
                                unoptimized
                            />
                        </div>
                    </div>

                </div>
            </Section>



            <Section>
                <TestimonialsShort />
            </Section>

            <Section mobileSpace>

                <SectionHeader
                    title="Our leadership"
                    bottomSpace
                />

                <div className="max-w-lg mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                        {leadershipData.map((item, index) => (
                            <div className="relative w-full mb-3 lg:my-0" key={index}>
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-b/srgb from-transparent via-transparent to-white/80 h-[206px]"
                                    disable-data-aos="fade-up"
                                    disable-data-aos-delay={`${50}`}
                                />
                                <div className="absolute bottom-0 left-0 right-0 flex items-center p-[18px] text-center"
                                    disable-data-aos="zoom-out-left"
                                    disable-data-aos-delay={`${200}`}
                                >
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-natural-gray-text">{item.name}</h3>
                                    <span className="block h-5 sm:h-6 lg:h-7 w-[2px] bg-natural-gray-text mx-2 sm:mx-3 lg:mx-3.5"></span>
                                    <h4 className="text-sm sm:text-base lg:text-base font-normal text-natural-gray-text">{item.role}</h4>
                                </div>
                                <Image unoptimized src={item.image} alt={item.name} width={519} height={530} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

            </Section>


            <Section className="bg-natural-gray-bg">

                <SectionHeader
                    title="Our investors"
                    bottomSpace
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[20px] max-w-lg mx-auto px-7">
                    {investorsData.map((item, index) => (
                        <div className={cardClass} key={index}
                            disable-data-aos="fade-down"
                            disable-data-aos-delay={`${index * 100}`}
                        >
                            <img src={item.image} alt={item.alt} style={{ maxWidth: item.maxWidth }} />
                        </div>
                    ))}
                </div>

                <SectionHeader
                    title="Partners"
                    topSpace
                    bottomSpace
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[20px] max-w-lg mx-auto px-7">
                    {partnersData.map((item, index) => (
                        <div className={cardClass} key={index}
                            disable-data-aos="fade-down"
                            disable-data-aos-delay={`${index * 100}`}
                        >
                            <img src={item.image} alt={item.alt} style={{ maxWidth: item.maxWidth }} />
                        </div>
                    ))}
                </div>

            </Section>


            <Section mobileSpace>
                <div className="max-w-lg mx-auto border border-natural-gray-border p-10 relative overflow-hidden">
                    <Quotes className="absolute bottom-0 right-0 transform translate-y-5 opacity-30" />
                    <div className="flex flex-col lg:flex-row items-start gap-y-8 lg:gap-x-[72px]">
                        <Image src="/assets/images/pages/about-us/profile-3.png" alt="about-us" width={407} height={407} className="mx-auto"
                            disable-data-aos="flip-left"
                            disable-data-aos-delay="100"
                            unoptimized
                        />
                        <div>
                            <p className="text-base md:text-2xl leading-10! font-normal text-natural-navy">
                                AI is more than just coding and algorithms; it's a powerful tool that can transform the way we work and live. At Field, our devoted team leverages AI's potential to transform the enterprise AI landscape. We're not here to maintain the status quo; we're committed to taking bold risks and making a meaningful impact.
                            </p>
                            <h3 className="text-lg md:text-lg font-semibold text-[#0D68FC] mt-8">
                                Esranur Kaygin
                            </h3>
                            <h4 className="text-base font-normal text-natural-gray-default mt-2.5">
                                CEO and Founder Field
                            </h4>
                        </div>
                    </div>

                </div>
            </Section>






            <Section className="bg-natural-gray-bg">

                <SectionHeader
                    title="Field in the news"
                    bottomSpace
                />


                <div className="max-w-lg mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-lg mx-auto px-7">
                        {newsData.map((item, index) => (
                            <div className="relative py-10 px-7 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-natural-navy group will-change-transform" key={index}>
                                <Link className="absolute inset-0 z-10" href={item.link} />
                                <Image unoptimized src={item.image} alt={item.title} width={520} height={256} className="w-full object-cover" />
                                <h4 className="text-lg font-semibold text-natural-navy mt-4 group-hover:text-white">{item.category}</h4>
                                <h3 className="text-xl font-semibold text-natural-navy mt-2 min-h-[56px] group-hover:text-white">{item.title}</h3>
                                <p className="text-base font-normal text-natural-gray-default mt-2 group-hover:text-white">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </Section>


            <CallToAction />

        </div>
    )
}

export default AboutUs;