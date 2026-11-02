import { Hero, AiSolutions, Blog, CallToAction, Feature, GetStarted, Security, Testimonials, Faq } from "@landing/components/Layout";
import { Button } from "@landing/components/Ui";
import { Section, SectionHeader } from "@landing/components/Global";
import { ReactIcon } from "@landing/components/Icons";
import Image from "next/image";
import { PAGE_SETTINGS, APP_URL } from "@landing/constants/Global";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

import { solutionsFeatures, worldMostAccurateParserFeatures, featureData } from "./data";
import TestimonialsShort from "@landing/components/Layout/TestimonialsShort";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.resume_parser);


interface DescItemProps {
    className?: string;
    title?: string;
    desc?: string;
    link?: boolean;
}

const DescItem: React.FC<DescItemProps> = ({ className = "", title, desc, link = false }) => {
    return (
        <div className={`inline-block lg:block mx-auto border-t border-[#24272966] pt-6 ${className}`}>
            <div className="p-6">
                <div className={`max-w-80`}>
                    <h3 className="text-xl font-medium text-natural-navy">{title}</h3>
                    {desc && <p className="mt-2.5 text-base font-normal text-natural-gray-default">{desc}</p>}
                    {link && <Button inline variant="transparent-black" className="mt-10" target="_blank" link href={"https://www.researchgate.net/publication/378698002_Comparative_Analysis_of_ML_Machine_Learning_and_LLM_Large_Language_Models_in_Resume_Parsing_A_Paradigm_Shift_in_Talent_Acquisition?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InByb2ZpbGUiLCJwYWdlIjoicHJvZmlsZSJ9fQ"}>Go to research paper</Button>}
                </div>
            </div>
        </div>
    )
}

const ResumeParserPage: React.FC = () => {
    return (
        <div>
            <Hero
                subHero
                title="Leading Accuracy in Document Data Extraction"
                titleClassName="max-w-[900px]!"
                description="Effortlessly Parse Any File Format and 24+ Languages with unmatched accuracy"
                bgImage="/assets/images/hero/parser.png"
                overlay
            />
            <AiSolutions
                features={solutionsFeatures}
            />


            <Section mobileSpace>
                <SectionHeader
                    title="World's most accurate parser"
                    bottomSpace
                />
                <div className="max-w-lg mx-auto">
                    <div className="flex flex-col lg:flex-row justify-start gap-y-6 lg:gap-x-4">
                        <div className="flex justify-center order-first lg:order-2">
                            <Image unoptimized src="/assets/images/pages/parser-img-1.png" alt="Field Parser" width={320} height={528}
                                className="max-w-[320px]"
                                disable-data-aos="zoom-in-down"
                                disable-data-aos-delay="100"
                            />
                        </div>
                        <div className="lg:mt-28 w-full lg:w-auto order-2 lg:order-1 text-center lg:text-left">
                            <DescItem
                                title="Our parser technology"
                                desc="Extract data from Resumes, Job Descriptions, Invoices, Receipts, Healthcare files and more in over 27+ languages." />
                            <DescItem
                                className="lg:mt-5"
                                title="Format friendly: no exceptions"
                                desc="Field's document Parser effortlessly processes all file formats - JPG, PNG, PDF, DOCX, even hard copy files. Ensuring seamless parsing every time."
                            />
                        </div>
                        <div className="lg:mt-28 w-full lg:w-auto order-3 text-center lg:text-left">
                            <DescItem
                                link={true}
                                title="Peak Accuracy"
                                desc="Field HR parser and Field Fin Extract data from any file format, with 95% accuracy. Research backed!"
                            />
                        </div>
                    </div>
                </div>
            </Section>



            <AiSolutions
                title="A Parser for Every Industry"
                features={worldMostAccurateParserFeatures}
            >
                <div className="mt-14 flex justify-center items-center gap-x-3">
                    <Button variant="transparent-black" hideIcon inline link href={APP_URL}>Start Free Trial</Button>
                    <Button variant="black" inline link href={PAGE_SETTINGS.contact.href}>Book a Demo Call</Button>
                </div>
            </AiSolutions>

            <Section>
                <SectionHeader
                    className="mb-14! lg:mb-0!"
                    title={"Seamless API integration with RESTFul API"}
                    titleClassName="max-w-[600px] mx-auto"
                    text="Start integrating your product with Field right away!"
                    tagText="API"
                    tagIcon={<ReactIcon className="text-[#465BCC]" />}
                >

                </SectionHeader>
                <Feature sectionClassName="" data={featureData} resetSectionMobilePad={true} />
            </Section>


            <Section>
                <TestimonialsShort />
            </Section>

            <Security />
            <Testimonials />
            <GetStarted />
            <Blog />
            <Faq />
            <CallToAction />

        </div>
    );
};

export default ResumeParserPage;
