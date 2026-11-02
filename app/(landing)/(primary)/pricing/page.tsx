import { Brands } from "@landing/components/Layout";
import PlanContent from "./plan-content";
import { Section } from "@landing/components/Global";
import { Security, Faq, GetStarted } from "@landing/components/Layout";
import Explore from "./explore";
import type { Metadata } from "next";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.pricing);

const PricingPage = () => {

    return (
        <div>
            <Section className="pb-0">

                <div className="py-[78px] max-w-(--breakpoint-lg) mx-auto text-center">
                    <h1 className="text-6xl font-semibold text-natural-green">Choose your plan</h1>
                    <p className="mt-6 text-lg font-medium text-natural-gray-default">
                        Take your business to the next level with a subscription <br className="hidden md:block" />
                        or customize the perfect bundle tailored for your specific needs
                    </p>
                </div>

            </Section>

            <Section className="pt-0">
                <PlanContent />
            </Section>
            <Explore />
            <Brands title="Trusted by leading brands" cardType="bordered" />
            <Security />
            <Faq />
            <GetStarted />

        </div>
    )
}

export default PricingPage;