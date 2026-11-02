import { AiSolutions, GetStarted, Testimonials } from "@landing/components/Layout";
import { Hero } from "@landing/components/Layout";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { Dashboard, AiOutlineIcon } from "@landing/components/Icons";
import { PAGE_SETTINGS, APP_URL } from "@landing/constants/Global";
import { Button } from "@landing/components/Ui";
import { SectionHeader } from "@landing/components/Global";
import { Section } from "@landing/components/Global";
import Image from "next/image";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.startups);



const growData = [
    {
        title: "Stage: up to early stage",
        desc: "Up to $1M in funding and less than 2 years old",
    },
    {
        title: "Small size",
        desc: "Less than 05 employees",
    },
    {
        title: "User base",
        desc: "1,000 people reached per month",
    },
    {
        title: "New Customer",
        desc: "Currently not a Field customer",
    },
]


const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "Integrates with large platforms",
        content: "Field integrates easily with large platforms through our powerful API, allowing businesses to leverage our advanced hiring technology without disrupting their existing workflows.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Helps you solve workflow hick-ups",
        content: "Field provides advanced HR solutions to avoid common hiccups, enabling informed hiring decisions for business growth and success.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "Extensive Support",
        content: "Field offers extensive support to ensure effective use of our platform. Our dedicated team is available 24/7 to answer questions.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[linear-gradient(179.71deg,rgba(36,36,133,0.2)_44.82%,rgba(129,136,152,0.2)_99.75%)]",
        }
    },
]

// const featureData: FeatureCardProps[] = [
//     {
//         type: "horizontal",
//         image: {
//             bg: {
//                 src: "/assets/images/feature/bg-4.png",
//                 alt: "Field Parser",
//                 width: 506,
//                 height: 583,
//             },
//             inner: {
//                 src: "/assets/images/feature/inner-4.png",
//                 alt: "Field Parser",
//                 width: 439,
//                 height: 508,
//                 className: "w-full h-auto",
//             },
//         },
//         contentList: [
//             {
//                 borderTop: true,
//                 head: "Field API",
//                 content: "Field Resume Parser is easy to integrate with a simple POST call to our API. Code examples in all the major programming languages are available in our documentation.",
//             }
//         ],
//         buttons: [
//             {
//                 hideIcon: true,
//                 variant: "transparent-black",
//                 type: "link",
//                 text: "Start Trial",
//                 href: APP_URL,
//                 link: true,
//             },
//             {
//                 variant: "black",
//                 type: "link",
//                 text: "Documentation",
//                 href: DOCUMENTATION_URL,
//                 link: true,
//                 target: "_blank",
//             }
//         ]
//     }
// ]

interface DescItemProps {
    className?: string;
    title?: string;
    desc?: string;
    link?: boolean;
    icon?: React.ReactNode;
}

const DescItem: React.FC<DescItemProps> = ({ className = "", title, desc, link = false, icon }) => {
    return (
        <div className={`inline-block lg:block mx-auto border-t border-[#24272966] pt-6 ${className}`}>
            <div className="p-6">
                <div className={`max-w-80`}>
                    <h3 className="flex items-center gap-x-3.5 text-xl font-medium text-natural-navy justify-center lg:justify-start">
                        {icon && <>
                            {icon}
                        </>}
                        {title}
                    </h3>
                    {desc && <p className="mt-2.5 text-base font-normal text-natural-gray-default">{desc}</p>}
                    {link && <div className="flex gap-x-6 mt-10">
                        <Button inline
                            variant="black"
                            className="text-sm! px-4!"
                            link
                            href={PAGE_SETTINGS.contact.href}>
                            Schedule demo call
                        </Button>
                        <Button inline
                            variant="transparent-black"
                            className="text-sm! px-4!"
                            hideIcon
                            link
                            href={APP_URL}>
                            Start Trial
                        </Button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

const StartupGrowth = () => {
    return (
        <div>
            <Hero
                title="Building your startup works best with Field"
                titleClassName="max-w-[595px]!"
                description="We know how hard it is to start, grow and manage your startup all at the same time. Startups get 60% discount at the Field startup program."
                bgImage="/assets/images/hero/startups.png"
                subHero
                bottomSpace
                overlay
            />

            <AiSolutions
                title="Don't let outdated solutions hold you back"
                features={solutionsFeatures}
                sectionClassName="bg-natural-gray-bg"
            />

            <Section mobileSpace>
                <SectionHeader
                    title="Hack your product development journey"
                    bottomSpace
                />
                <div className="max-w-lg mx-auto">
                    <div className="flex flex-col lg:flex-row justify-start gap-y-6 lg:gap-x-4">
                        <div className="flex justify-center order-first lg:order-2">
                            <Image unoptimized src="/assets/images/pages/startup-feature.png" alt="Field Parser" width={320} height={528}
                                disable-data-aos="zoom-in-down"
                            />
                        </div>
                        <div className="lg:mt-28 w-full lg:w-auto order-2 lg:order-1 text-center lg:text-left">
                            <DescItem
                                title="Comprehensive product line"
                                desc="Field API solutions help you create the platform that is ready to compete in weeks" />
                            <DescItem
                                className="lg:mt-5"
                                icon={<Dashboard className="text-[#465BCC]" />}
                                title="Start-ups"
                                desc="Get your startup ahead with Field! Our tailored packages and discounts help you find success faster."
                            />
                        </div>
                        <div className="lg:mt-28 w-full lg:w-auto order-3 text-center lg:text-left">
                            <DescItem
                                link={true}
                                icon={<AiOutlineIcon className="text-[#465BCC]" />}
                                title="24/7 support"
                                desc="Field provides 24/7 support to ensure prompt resolution of any issues. Our dedicated team is always available to assist you with any questions or concerns you may have."
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="bg-natural-gray-bg">
                <SectionHeader
                    title="We help you grow"
                    text="Special startup package, we are with you along the way at a special discount."
                    textClassName="max-w-[400px] mx-auto mt-7!"
                    bottomSpace
                />

                <div className="flex flex-col lg:flex-row items-center justify-center gap-x-16 gap-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold">Eligibility requirements</h2>
                        <p className="text-base font-normal text-natural-gray-default mt-5">Startups receive 80% discount on the first year</p>
                        <Button inline variant="black" className="mt-8 lg:mt-12" link href={PAGE_SETTINGS.contact.href}>Apply Now</Button>
                    </div>
                    <div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 lg:gap-y-14">
                            {growData.map((item, index) => (
                                <li key={index}
                                    disable-data-aos="fade-left"
                                    disable-data-aos-delay={`${index * 200}`}
                                >
                                    <h3 className="text-lg lg:text-[20px] font-semibold text-natural-black">{item.title}</h3>
                                    <p className="text-base font-normal text-natural-gray-default mt-2 flex items-center gap-x-2">
                                        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.9721 1.0312C12.2324 1.29155 12.2324 1.71366 11.9721 1.97401L4.97206 8.97401C4.71171 9.23436 4.2896 9.23436 4.02925 8.97401L0.529247 5.47401C0.268897 5.21366 0.268897 4.79155 0.529247 4.5312C0.789596 4.27085 1.21171 4.27085 1.47206 4.5312L4.50065 7.5598L11.0292 1.0312C11.2896 0.77085 11.7117 0.77085 11.9721 1.0312Z" fill="#39E674" />
                                        </svg>
                                        {item.desc}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </Section>

            <Testimonials />
            <GetStarted />

        </div>
    )
}

export default StartupGrowth;