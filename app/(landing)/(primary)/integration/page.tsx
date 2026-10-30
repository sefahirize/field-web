import { AiSolutions, CallToAction, GetStarted, Security, Testimonials, Integration, Join, TestimonialsShort } from "@landing/components/Layout";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { CheckFill } from "@landing/components/Icons";
import { PAGE_SETTINGS, DOCUMENTATION_URL, APP_URL } from "@landing/constants/Global";
import { Button } from "@landing/components/Ui";
import { SectionHeader } from "@landing/components/Global";
import { Section } from "@landing/components/Global";
import Image from "next/image";
import type { Metadata } from "next";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.integration);


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
                href={DOCUMENTATION_URL}
                target="_blank"
                className="w-max mx-auto mt-auto" inline variant="transparent-white">Documentation</Button>
        </div>
    )
}

const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "HR parser",
        content: "Our API follows industry-standard security protocols, such as OAuth 2.0 authentication and HTTPS encryption, to prevent unauthorized access and ensure secure data transmission.",
        className: "bg-white min-h-[300px]",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#E1DDFE]",
        }
    },
    {
        title: "Field Fin, Finance parser",
        content: "All Field servers are within our virtual private cloud encrypt data at rest.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#CFE1FE]",
        }
    },
    {
        title: "Work flow automation",
        content: "Support for single sign-on (Google SSO, SAML), two-factor authentication, and user roles and permissions.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#FEE3DD]",
        }
    },
    {
        title: "Field IQ",
        content: "Field API offers regional data hosting and storage to ensure compliance with local data regulations and optimize performance.",
        className: "bg-white",
        pClassName: "text-natural-gray-default",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Compliance",
        type: "list",
        className: "bg-white",
        items: ["SOC 2", "ISO27001", "GDPR"],
        icon: {
            bg: "bg-[#F1FFE8]",
            dot: "bg-[#6CE9A6]"
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


const integrationSteps = [
    {
        text: "Create an account"
    },
    {
        line: true
    },
    {
        text: "Test the products"
    },
    {
        line: true
    },
    {
        noSpace: true,
        text: "Create an API key to get started"
    },
    {
        line: true
    },
    {
        text: "You're all set!"
    }
]



const onePlatformFeatures = [
    {
        text: "Extract data from any file format, no restrictions, pdf, jpeg, even hardcopy"
    },
    {
        text: "Highest accuracy in the industry research based"
    },
    {
        text: "Team collaboration intuitive dashboard"
    },
    {
        text: "Easy integration and support"
    },
    {
        text: "Supported by zonal OCR"
    },
    {
        text: "Extract over Json output 150 fields"
    }
]


const IntegrationPage = () => {
    return (
        <div>


            <Section className="pb-0 md:pb-24">
                <div className="min-h-[400px] md:min-h-[556px] max-w-[1380px] mx-auto relative overflow-hidden">
                    <Image
                        unoptimized
                        src="/assets/images/hero/integration-hero-tp.png"
                        alt="integration"
                        className="absolute bottom-7 sm:bottom-0 lg:-bottom-[100px] left-1/2 -translate-x-1/2 w-auto object-cover"
                        width={1380}
                        height={556}
                    />
                    <div className="relative z-10 mt-6 pt-6 md:pt-[68px] px-4 md:px-0">
                        <h1 className="text-natural-navy text-3xl md:text-[70px] font-semibold text-center leading-normal md:leading-[81px]">
                            Seamless API Integration with <br className="hidden md:block" /> Industry-Leading Document Parsing
                        </h1>
                        <p className="text-natural-gray-default text-center text-base md:text-lg font-medium mt-4 md:mt-6">Easily connect Field with the industry's best tools.</p>
                        <div className="mt-16 md:mt-[60px] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-x-16">
                            <Button link href={PAGE_SETTINGS.contact.href} inline variant="white">Book a 15 min demo</Button>
                            <Button link href={DOCUMENTATION_URL} target="_blank" inline variant="black">Documentation</Button>
                        </div>
                    </div>
                </div>
            </Section>


            <AiSolutions
                title="Start your product-building journey with us!"
                titleClassName="max-w-[650px] mx-auto"
                text="We'll be with you every step of the way as your partner in product success. From concept to completion, we offer expert support and guidance"
                features={solutionsFeatures}
                textClassName="max-w-[630px] mx-auto"
            >
                <div className="mt-14 flex justify-center items-center gap-x-3"
                    disable-data-aos="fade-down"
                    disable-data-aos-delay={`${solutionsFeatures.length * 200}`}
                >
                    <Button hideIcon link href={APP_URL} inline variant="transparent-black">Start Free Trial</Button>
                    <Button link href={PAGE_SETTINGS.contact.href} inline variant="black">Book a Demo call</Button>
                </div>
            </AiSolutions>



            <Section className="bg-natural-gray-bg">
                <SectionHeader
                    title="Getting started with Field is easy"
                    text="Extract data from Word, PDF, and image-based documents using OCR technology, advanced pattern recognition, and the help of anchor keywords."
                    textClassName="max-w-[730px] mx-auto text-[#696A72] lg:text-xl !font-light"
                    bottomSpace
                />
                <div className="max-w-lg mx-auto relative p-3 md:p-11 rounded-lg overflow-hidden">
                    <Image
                        unoptimized
                        src="/assets/images/pages/integration-bg.png"
                        alt="integration"
                        className="absolute inset-0 w-full h-full object-cover"
                        width={1080}
                        height={680}
                    />
                    <div className="bg-white/90 rounded-lg px-5 md:px-10 pt-10 md:pt-40 pb-10 md:pb-20 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between relative">
                            {integrationSteps.map((step, index) => (
                                <div key={index} className={`my-2 md:my-0 flex flex-col items-center relative ${step.text ? 'w-[130px] h-[130px] lg:w-[150px] lg:h-[150px]' : 'flex-1 h-[1.5px]'}`}
                                    disable-data-aos="fade-right"
                                    disable-data-aos-delay={`${index * 100}`}
                                >
                                    {step.line && (
                                        <div className="hidden md:block absolute h-full w-full left-0 top-0" style={{ background: 'linear-gradient(270deg, #F17300 0%, rgba(216, 222, 255, 0) 100%)', boxShadow: '0px 4px 4px 0px rgba(255, 255, 255, 0.26)' }} />
                                    )}
                                    {
                                        step.text && (
                                            <div className="flex justify-center items-center w-full h-full rounded-full bg-[#FCFDFE] shadow-[inset_-1px_-1px_2px_0px_rgba(91,92,94,0.5),inset_1px_1px_2px_0px_rgba(255,255,255,0.3),inset_0px_4px_4px_0px_rgba(211,213,216,0.25)] relative z-10">
                                                <p className={`text-[#696A72] text-sm md:text-base font-medium text-center ${step.noSpace ? 'max-w-[100%]' : 'max-w-[80%]'}`}>{step.text}</p>
                                            </div>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 md:mt-40 md:flex justify-center items-center gap-x-10">
                            <Button link href={PAGE_SETTINGS.contact.href} inline variant="black" className="w-full md:w-max">Book a Demo call</Button>
                            <Button hideIcon link href={APP_URL} inline variant="transparent-black" className="w-full md:w-max mt-5 md:mt-0">Start Trial</Button>
                        </div>
                    </div>
                </div>
            </Section>


            <Section className="bg-natural-gray-bg">
                <SectionHeader
                    title="One platform that has it all"
                    text="Work on all your potential leads from a single list. Leverage product usage and marketing data to qualify leads."
                    textClassName="max-w-[730px] mx-auto text-[#696A72] lg:text-xl !font-light"
                    bottomSpace
                />
                <div className="max-w-[1304px] mx-auto relative px-5 md:px-24 rounded-lg overflow-hidden bg-white py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 mt-24">
                        {onePlatformFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-x-[14px] py-[42px] px-2 border-t border-[#24272966]"
                                disable-data-aos="flip-up"
                                disable-data-aos-delay={`${index * 100}`}
                            >
                                <div className="w-[22px] h-[22px]">
                                    <CheckFill />
                                </div>
                                <p className="text-natural-navy text-xl font-normal">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 md:mt-40 md:flex justify-center items-center gap-x-10">
                        <Button link href={APP_URL} inline variant="black" className="w-full md:w-max">Book a Demo call</Button>
                        <Button link href={PAGE_SETTINGS.contact.href} inline variant="transparent-black" className="w-full md:w-max mt-5 md:mt-0">Start Trial</Button>
                    </div>

                </div>
            </Section>

            <Section>
                <Join />
            </Section>

            <Security />

            <Section>
                <TestimonialsShort />
            </Section>


            <Section>
                <Integration />
                <div className="mt-14 flex justify-center items-center">
                    <Button link href={APP_URL} inline variant="black">Start Free Trial</Button>
                </div>
            </Section>



            <GetStarted />
            <Testimonials />
            <CallToAction />

        </div>
    )
}

export default IntegrationPage;