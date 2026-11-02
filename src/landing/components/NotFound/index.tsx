import Section from "@landing/components/Global/Section";
import { Button } from "@landing/components/Ui";
import Image from "next/image";
import { Header } from "@landing/components/Layout";
import type { Metadata } from "next";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const notFoundMetadata: Metadata = {
  ...buildPageMetadata({
    title: PAGE_SETTINGS.NotFound404.title,
    desc: PAGE_SETTINGS.NotFound404.desc,
  }),
  robots: { index: false, follow: true },
};

const NotFound = () => {
    return (
        <div>
            <Header />
            <Section className="pb-0 md:pb-24">
                <div className="min-h-[400px] md:min-h-[556px] max-w-[1380px] mx-auto relative overflow-hidden">
                    <Image
                        unoptimized
                        src="/assets/images/hero/integration-hero-tp.png"
                        alt="integration"
                        className="absolute bottom-7 sm:bottom-0 lg:bottom-[-100px] left-1/2 -translate-x-1/2 w-auto object-cover"
                        width={1380}
                        height={556}
                    />
                    <div className="relative z-10 mt-6 pt-6 md:pt-[68px] px-4 md:px-0">
                        <h1 className="mt-3 text-natural-navy text-3xl md:text-[70px] font-semibold text-center leading-normal md:leading-[81px]">
                            Oops!
                        </h1>
                        <p className="text-natural-gray-default text-center text-base md:text-lg font-medium mt-4 md:mt-6">
                            404- page not found <br className="hidden md:block" /> We can’t to seem to find the page you’re looking for.
                        </p>
                        <div className="mt-16 md:mt-[60px] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-x-16">
                            <Button link href={"/"} inline variant="black">Back to Homepage</Button>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}

export default NotFound;