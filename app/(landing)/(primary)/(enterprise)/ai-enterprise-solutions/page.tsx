import { AiSolutions, CallToAction, Feature, GetStarted, Security, Testimonials, Integration } from "@landing/components/Layout";
import { Hero } from "@landing/components/Layout";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";
import { JobText, Dashboard, Star } from "@landing/components/Icons";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { ALink, Button } from "@landing/components/Ui";
import { Section } from "@landing/components/Global";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.enterprise);


const luminaContent = () => {
    return (
        <>
            Add the power of generative AI to your firm with Field Lumina. Ask complex questions, increase FTE and work faster.
            <ALink as="span" className="mt-8 block sm:inline" href={PAGE_SETTINGS.ai_agents.href}>
                Get early access to Field Lumina
            </ALink>
        </>
    )
}


const featureData: FeatureCardProps[] = [
    {
        type: "vertical",
        title: "Make your business run at its best",
        titleClassName: "mb-[75px]",
        image: {
            bg: {
                src: "/assets/images/feature/enterprise-bg.png",
                alt: "Field Parser",
                width: 1064,
                height: 364,
                className: "transform scale-[1.04]"
            },
            // inner: {
            //     src: "/assets/images/feature/inner-3.png",
            //     alt: "Field Parser",
            //     width: 1064,
            //     height: 364,
            //     className: "bottom-9"
            // }, Get early access to Field Lumina 
            // }, 
        },
        contentList: [
            {
                borderTop: true,
                head: "Field Parser",
                icon: <JobText className="text-[#A7A9A9] w-6 h-6" />,
                content: "You AI strategy is as good as your data, Field Leads in data retrieval/parsing accuracy.",
                headClassName: "sm:text-xl",
                contentClassName: "text-sm sm:text-base",
                link: PAGE_SETTINGS.resume_parser.href
            },
            {
                borderTop: true,
                head: "Field Automate",
                icon: <Dashboard className="text-[#A7A9A9] w-6 h-6" />,
                content: "Field IQ and Field AI matching helps your HR team to hire faster, we provide you generative AI that helps you hire without specialist knowledge",
                headClassName: "sm:text-xl",
                contentClassName: "text-sm sm:text-base",
                link: PAGE_SETTINGS.ai_matching.href
            },
            {
                borderTop: true,
                head: "Field Lumina ",
                icon: <Star className="text-[#A7A9A9] w-6 h-6" />,
                content: <>{luminaContent()}</>,
                html: true,
                headClassName: "sm:text-xl",
                contentClassName: "text-sm sm:text-base",
                link: PAGE_SETTINGS.ai_agents.href
            }
        ]
    },
]


const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "Integrates with large platforms",
        content: "Field integrates easily with large platforms through our powerful API, allowing businesses to leverage our advanced AI technology without disrupting their existing workflows.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Helps you solve workflow hick-ups",
        content: "Field provides advanced AI work flow solutions to avoid common hiccups.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "Extensive Support",
        content: "Field offers extensive support. Our dedicated team is available 24/7 to answer questions.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[linear-gradient(179.71deg,_rgba(36,_36,_133,_0.2)_44.82%,_rgba(129,_136,_152,_0.2)_99.75%)]",
        }
    },
]


const AiEnterpriseSolutions: React.FC = () => {
    return (
        <div>
            <Hero
                title="Who says you can’t innovate  at scale?"
                description="For companies with extensive AI needs, advanced solutions are crucial. Field is tailored to provide the most accurate insights right when you need it."
                bgImage="/assets/images/hero/enterprise.png"
                subHero
                overlay
            />

            <Section className="!pb-0">
                <AiSolutions
                    title="AI designed with your needs in mind"
                    features={solutionsFeatures}
                    sectionClassName="bg-natural-gray-bg"
                />
            </Section>
            <Feature data={featureData} />
            <Testimonials />
            <div className="pb-36 md:pt-24">
                <Integration />
                <div className="mt-14 text-center">
                    <Button link href={PAGE_SETTINGS.ai_agents.href} variant="black" inline>Get early access to Field Lumina</Button>
                </div>
            </div>

            <GetStarted />
            <Security />
            <CallToAction />
        </div>
    )
}

export default AiEnterpriseSolutions;