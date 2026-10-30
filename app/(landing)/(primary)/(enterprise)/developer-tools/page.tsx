import { AiSolutions, CallToAction, Feature, GetStarted, Security, Testimonials, Integration } from "@landing/components/Layout";
import { Hero } from "@landing/components/Layout";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";
import { ReactIcon } from "@landing/components/Icons";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { Button } from "@landing/components/Ui";
import { SectionHeader } from "@landing/components/Global";
import { Section } from "@landing/components/Global";
import { Join } from "@landing/components/Layout";
import Image from "next/image";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.for_developers);

const customFeatureContent = () => {
    return (
        <div className="flex flex-col justify-between text-center h-full">
            <Image
                unoptimized
                src="/assets/images/pages/developer-link.png"
                alt="link"
                className="mx-auto max-h-[119px] w-auto"
                width={145}
                height={139}
            />
            <Button
                link
                href={PAGE_SETTINGS.integration.href}
                className="w-max mx-auto mt-auto" inline variant="transparent-white">Easy API integration</Button>
        </div>
    )
}


const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "HR parser",
        content: "Field integrates easily with large platforms through our powerful API, Integration is under 1 hour and value is realized on the fly.",
        className: "bg-white min-h-[300px]",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#E1DDFE]",
        }
    },
    {
        title: "Field Fin",
        content: "Field delivers unmatched accuracy in financial parsing, expertly handling both textual and numerical data with precision.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#CFE1FE]",
        }
    },
    {
        title: "Field Matching",
        content: "Match candidates to jobs with Deep Learning based AI",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#FEE3DD]",
        }
    },
    {
        title: "Field IQ",
        content: "Generated automated candidate summaries and interview questions",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Field Lumina",
        content: "Build Enterprise search AI Agents in days with Field Lumina API.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        link: {
            href: PAGE_SETTINGS.ai_agents.href,
            target: "_self",
            text: "Get early access to Field Lumina "
        },
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "",
        className: "bg-[#465BCC] min-h-[300px]",
        html: <>{customFeatureContent()}</>,
        icon: {
            bg: "",
        }
    },
]



const featureData: FeatureCardProps[] = [
    {
        type: "horizontal-reverse",
        image: {
            bg: {
                src: "/assets/images/feature/bg-9.png",
                alt: "Field Parser",
                width: 506,
                height: 583,
            },
            // inner: {
            //     src: "/assets/images/feature/inner-9.png",
            //     alt: "Field Parser",
            //     width: 439,
            //     height: 508,
            //     className: "w-full h-auto",
            // },
        },
        contentList: [
            {
                borderTop: true,
                spaceX: true,
                head: "Integrate for speed",
                contentClassName: "xl:pb-14 xl:mt-2.5",
                content: "Add the power of generative AI to your firm with Field Lumina. Ask complex questions, increase FTE and work faster.",
            },
            {
                borderTop: true,
                spaceX: true,
                head: "Build the best",
                contentClassName: "xl:pb-14 xl:mt-2.5",
                content: "OCR, computer vision, Deep learning AI, RAQ and NLP supported AI models. We used all the latest AI technology while developing our API’s",
            },
            {
                borderTop: true,
                spaceX: true,
                head: "24/7 support",
                contentClassName: "xl:pb-14 xl:mt-2.5",
                content: "Enhance your experience with Field - our 24/7 tech support team keeps you up and running any time of day.",
            }
        ],
        buttons: [
            {
                variant: "black",
                type: "link",
                text: "Request demo",
                // spaceX: true,
                href: PAGE_SETTINGS.contact.href,
                link: true,
                target: "_self",
            }
        ]
    }
]


const DeveloperTools: React.FC = () => {
    return (
        <div>
            <Hero
                title="Create big solutions with Field"
                titleClassName="max-w-[595px]"
                description="For companies with extensive AI needs, advanced solutions are crucial. Field is tailored to provide the most accurate insights right when you need it."
                bgImage="/assets/images/hero/developer-tools.png"
                subHero
                bottomSpace
                overlay
            />


            <AiSolutions
                title="Start your product-building journey with us!"
                titleClassName="max-w-[650px] mx-auto"
                text="We'll be with you every step of the way as your partner in product success. From concept to completion, we offer expert support and guidance"
                features={solutionsFeatures}
                textClassName="max-w-[630px] mx-auto"
                sectionClassName="bg-natural-gray-bg"
            />


            <Section>
                <Join />
            </Section>




            <Section>
                <SectionHeader
                    title="Enhancing User Satisfaction, Accelerating Product Innovation"
                    titleClassName="max-w-[1200px] mx-auto"
                    text="Drive User Engagement and Speed Up Innovation with Intelligent AI Solutions for SaaS"
                    tagIcon={<ReactIcon />}
                    tagText="SaaS"
                />
                <Feature sectionClassName="" data={featureData} resetSectionMobilePad={true} />
            </Section>
            <Integration />
            <Security />
            <GetStarted />
            <Testimonials type="alternate" />
            <CallToAction />
        </div>
    )
}

export default DeveloperTools;  