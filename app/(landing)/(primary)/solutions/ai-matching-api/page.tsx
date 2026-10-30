import { Hero, AiSolutions, CallToAction, Feature, GetStarted, Testimonials, Faq } from "@landing/components/Layout";
import { Section, SectionHeader } from "@landing/components/Global";
import { ReactIcon } from "@landing/components/Icons";
// import Image from "next/image";
import { solutionsFeatures, featureData, worldMostAccurateParserFeatures } from "./data";
import type { Metadata } from "next";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.ai_matching);




const AiMatchingApi: React.FC = () => {
    return (
        <div>
            <Hero
                subHero
                title="Revolutionizing Recruitment with AI-Powered Matching"
                titleClassName="!max-w-[900px]"
                description="Easily reduce candidate search to seconds while maintaining accuracy. Discover a new way of reaching top talent, faster than ever before."
                bgImage="/assets/images/hero/aiMatching.png"
                overlay
            />

            <AiSolutions
                features={solutionsFeatures}
            />


            <Section>
                <SectionHeader
                    className="!mb-14 lg:!mb-0"
                    title={"Industry’s most advanced matching engine designed with self learning AI"}
                    titleClassName="max-w-[870px] mx-auto"
                    text="Empowering seamless, intelligent connections through adaptive AI technology"
                    tagText="Matching AI"
                    tagIcon={<ReactIcon className="text-[#FFAF38]" />}
                >

                </SectionHeader>
                <Feature sectionClassName="" data={featureData} resetSectionMobilePad={true} />
            </Section>

            <AiSolutions
                sectionClassName="bg-natural-gray-bg"
                title="AI matching features"
                features={worldMostAccurateParserFeatures}
            />

            <Testimonials />
            <GetStarted />
            <Faq />
            <CallToAction />
        </div>
    )
}

export default AiMatchingApi;