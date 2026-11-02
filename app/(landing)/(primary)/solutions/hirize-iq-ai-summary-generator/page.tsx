import { Hero, AiSolutions, CallToAction, Feature, Testimonials } from "@landing/components/Layout";
import { Section, SectionHeader } from "@landing/components/Global";
import { ReactIcon } from "@landing/components/Icons";
// import Image from "next/image";
import { solutionsFeatures, featureData } from "./data";
import type { Metadata } from "next";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.hirize_iq);

const HirizeIqAiSummaryGenerator: React.FC = () => {
    return (
        <div className="">
            <Hero
                subHero
                title="Generative AI Enabled  Hiring"
                titleClassName="max-w-[600px]!"
                description="Generated automated candidate summaries and interview questions"
                bgImage="/assets/images/hero/hirizeIq.png" />


            <Section>
                <SectionHeader
                    title={"The First API for Intelligent Candidate Insights"}
                    titleClassName="max-w-[870px] mx-auto"
                    text="Generative AI enabled Work flow automation APIs"
                    tagText="Field IQ"
                    tagIcon={<ReactIcon className="text-[#121212]" />}
                >

                </SectionHeader>
                <Feature resetSectionMobilePad sectionClassName="" data={featureData} />
            </Section>



            <Section>
                <SectionHeader
                    title="Supercharge your recruitment"
                />
                <AiSolutions
                    features={solutionsFeatures}
                />
            </Section>

            <Testimonials type="alternate" />
            <CallToAction />
        </div>
    )
}

export default HirizeIqAiSummaryGenerator;