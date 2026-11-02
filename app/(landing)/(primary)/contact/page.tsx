import { Section } from "@landing/components/Global";
import Image from "next/image";
import ContactForm from "./form";
import { Faq, GetStarted } from "@landing/components/Layout";
import ReCaptchaProvider from "@landing/components/ReCaptcha/ReCaptchaProvider";
import type { Metadata } from "next";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.contact);



const Contact = () => {
    return (
        <ReCaptchaProvider>
            <div>
            <Section className="pb-0">
                <div className="pt-[78px] max-w-(--breakpoint-lg) mx-auto text-center">
                    <h1 className="text-5xl font-medium text-natural-green">
                        Get in Touch with Our <br className="hidden md:block" />
                        product experts
                    </h1>
                </div>
            </Section>
            <Section className="pt-14 pb-0">

                <div className="xl:max-w-[1090px] px-3 xl:px-0 mx-auto grid lg:grid-cols-2 xl:grid-cols-[540px_530px] gap-x-5">
                    <div className="py-8 px-5 relative">
                        <Image
                            src={"/assets/images/landing/contact-bg.webp"}
                            alt="contact"
                            unoptimized
                            fill
                            className="absolute inset-0 object-cover"
                        />
                        <div className="bg-natural-gray-bg p-8 rounded-lg relative z-10">
                            <h4 className="text-2xl font-medium text-natural-navy">
                                Discover the next in <br className="hidden md:block" />
                                Document intelligence <br className="hidden md:block" />
                                and enterprise AI
                            </h4>
                            <p className="mt-6 text-sm font-normal text-natural-gray-default">
                                Schedule a call with our sales team to explore tailored solutions for your industry or unique use case. Discover how Field.AI can revolutionize your AI strategy.
                            </p>
                            <div className="mt-8 py-12 text-center border-t border-natural-gray-border">
                                <h4 className="text-lg font-medium">Trusted by leading brands</h4>
                                <p className="mt-1.5 text-base font-normal">
                                    We are happy to help you find what your company needs.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6">
                                <div className="h-[72px] flex items-center justify-center bg-white border border-[#D9D9D9] rounded-2xl shadow-[2px_2px_12px_0px_rgba(0,0,0,0.05)]">
                                    <Image
                                        src={"/assets/images/testimonials/greenhouse.png"}
                                        alt="greenhouse"
                                        width={127}
                                        height={29}
                                        unoptimized
                                    />
                                </div>
                                <div className="h-[72px] flex items-center justify-center bg-white border border-[#D9D9D9] rounded-2xl shadow-[2px_2px_12px_0px_rgba(0,0,0,0.05)]">
                                    <Image
                                        src={"/assets/images/testimonials/neural.png"}
                                        className="max-w-[125px]"
                                        alt="greenhouse"
                                        width={134}
                                        height={44}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 border border-natural-gray-border">
                        <div className="pb-28">
                            <ContactForm />
                        </div>
                    </div>
                </div>

            </Section>

            <Faq />
            <GetStarted />
        </div>
        </ReCaptchaProvider>
    )
}

export default Contact;