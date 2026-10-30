import { Blog, CallToAction, Faq, Feature, GetStarted, Security, Testimonials } from "@landing/components/Layout";
import { Hero } from "@landing/components/Layout";
import HomeStatistics from "@landing/components/Pages/Home/statistics";

import { AiSolutions } from "@landing/components/Layout";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";
import { Button } from "@landing/components/Ui";
import type { Metadata } from "next";


import { APP_URL, PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata =>
  buildPageMetadata(PAGE_SETTINGS.homepage);


const featureData: FeatureCardProps[] = [
  {
    type: "horizontal",
    title: "Field Parser, Extract data with over 95% accuracy",
    gridClassName: "md:gap-x-4 xl:gap-x-11",
    image: {
      parentClass: "md:h-full",
      bg: {
        src: "/assets/images/feature/bg-1.png",
        alt: "Field Parser",
        width: 506,
        height: 583,
        className: "max-w-[506px] h-full"
      },
      // inner: {
      //     src: "/assets/images/feature/inner-1.png",
      //     alt: "Field Parser",
      //     width: 439,
      //     height: 508,
      // },
    },
    contentList: [
      {
        borderTop: true,
        head: "Field HR Parser",
        content: "Industry’s most advanced parser, turn resumes and job descriptions into structured data.",
        link: PAGE_SETTINGS.resume_parser.href
      },
      {
        borderTop: true,
        head: "Field Fin",
        content: "Extract data from invoices and financial documents with the greatest accuracy.",
        link: PAGE_SETTINGS.resume_parser.href
      },
      {
        borderTop: true,
        head: "Customized Parsing",
        content: "Customize our parser to extract data from your unique documents with unparalleled accuracy.",
        link: PAGE_SETTINGS.resume_parser.href
      }
    ],
    buttons: [
      {
        className: "bg-natural-navy text-white !text-xs !font-medium",
        type: "link",
        text: "Learn More",
        link: true,
        href: PAGE_SETTINGS.resume_parser.href
      }
    ]
  },
  {
    type: "horizontal-reverse",
    title: "Work flow automation API’s",
    gridClassName: "md:gap-x-4 xl:gap-x-11",
    image: {
      parentClass: "md:h-full",
      bg: {
        src: "/assets/images/feature/bg-2.png",
        alt: "Field Parser",
        width: 506,
        height: 583,
        className: "max-w-[506px] h-full"
      },
      // inner: {
      //     src: "/assets/images/feature/inner-2.png",
      //     alt: "Field Parser",
      //     width: 439,
      //     height: 508,
      // },
    },
    contentList: [
      {
        borderTop: true,
        head: "Field Matching",
        content: "Industry's most advanced candidate matching API designed with self learning AI",
        link: PAGE_SETTINGS.ai_matching.href
      },
      {
        borderTop: true,
        head: "Field IQ",
        content: "Build candidate and job specific summaries and interview questions.",
        link: PAGE_SETTINGS.hirize_iq.href
      }
    ],
    buttons: [
      {
        className: "bg-natural-navy text-white !text-xs !font-medium",
        type: "link",
        text: "Start free trial",
        link: true,
        href: APP_URL
      }
    ]
  },
  {
    type: "vertical",
    title: "Enterprise search AI by Field",
    endCustomHtml: <>
      <div className="flex justify-center mt-16">
        <Button inline link href={PAGE_SETTINGS.contact.href} iconClass="!text-white" className="!bg-[#3A5AFF] !text-white !text-xs !font-light !px-6 !py-2 !rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.5)]">Get early access</Button>
      </div>
    </>,
    image: {
      // html: <>
      //     <div className="md:absolute text-center top-20 left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 h-auto">
      //         <Button link href={PAGE_SETTINGS.contact.href} iconClass="!text-white" className="!bg-[#3A5AFF] !text-white !text-xs !font-light !px-6 !py-2 !rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.5)]">Get early access</Button>
      //     </div>
      // </>,
      bg: {
        src: "/assets/images/feature/bg-3-full.png",
        alt: "Field Parser",
        width: 1064,
        height: 364,
        className: "mt-5 md:mt-0"
      },
      // inner: {
      //     src: "/assets/images/feature/inner-3.png",
      //     alt: "Field Parser",
      //     width: 1064,
      //     height: 364,
      //     className: "bottom-9"
      // },
    },
    contentList: [
      {
        borderTop: true,
        head: "AI Search",
        content: "Synthesize volumes of information into clear, actionable insight",
        headClassName: "text-xs sm:text-xl",
        contentClassName: "text-sm sm:text-base"
      },
      {
        borderTop: true,
        head: "Knowledge Base",
        content: "Field’s accurate data extraction makes sure all data is high quality and accurate",
        headClassName: "text-xs sm:text-xl",
        contentClassName: "text-sm sm:text-base"
      },
      {
        borderTop: true,
        head: "AI Agents",
        content: "Execute your most complex multi-step workflows.",
        headClassName: "text-xs sm:text-xl",
        contentClassName: "text-sm sm:text-base"
      }
    ]
  },
]





const solutionsFeatures: ISolutionsFeature[] = [
  {
    title: "HR SaaS",
    content: "Field API’s parser extracts data from resumes and job descriptions, enhancing candidate search with 95% accuracy.",
    className: "bg-[#FFECDB]",
    icon: {
      bg: "bg-[#F87153]",
    }
  },
  {
    title: "Fintech SaaS",
    content: "Boost your Fintech platform with Field API’s invoice parser, extracting data from financial documents with 95% accuracy.",
    className: "bg-[#F2FFEE]",
    icon: {
      bg: "bg-[#39E674]",
    }
  },
  {
    title: "Enterprise",
    content: "Field APIs streamline data extraction and parsing, optimizing your enterprise’s data management and automating workflows.",
    className: "bg-[#D8DEFF]",
    icon: {
      bg: "bg-[linear-gradient(179.71deg,rgba(36,36,133,0.2)_44.82%,rgba(129,136,152,0.2)_99.75%)]",
    }
  },
]



export default function Home() {


  const heroButtonField = () => {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-x-9 justify-center mt-[77px] mb-8 lg:mb-[95px]`}
      >
        <Button className="!bg-black hover:!bg-white font-semibold" link href={"https://calendly.com/hirize/hirize-trial-demo"} target="_blank" inline>
          Schedule a 15 min demo
        </Button>
        <Button className="font-semibold" link href={APP_URL} variant="transparent-white" inline hideIcon>
          Start Trial
        </Button>
      </div>
    )
  }


  return (
    <div>
      <Hero
        title={<>AI-powered document processing <br className="hidden lg:block" /> with a one-stop API solution</>}
        titleClassName="text-center max-w-none lg:text-[56px] xl:text-[75px] font-semibold xl:!leading-[81px] md:mt-[73px]"
        description="Unmatched document intelligence for seamless data extraction and processing solutions"
        descClassName="text-center border-t-0 !max-w-none 2xl:!max-w-none !pt-0 lg:!text-[20px] !font-normal"
        bgImage="/assets/images/hero/home.png"
        showLogos={true}
        hideButtons={true}
        rounded={true}
      >
        {heroButtonField()}
      </Hero>
      <div className="py-24 md:py-[153px]">
        <h1 className="text-2xl md:text-4.5 md:leading-normal lg:text-[56px] lg:leading-[64px] font-semibold text-natural-navy mx-auto text-center px-3 lg:px-0">
          The only complete AI-first <br className="hidden lg:block" /> Document intelligence platform
        </h1>
      </div>
      <Feature sectionClassName="bg-natural-navy" data={featureData} />
      <AiSolutions
        title="Solutions for Every Industry"
        link={{
          text: "Learn more about our tools",
          href: "/solutions/resume-parser",
          target: "_self",
          linkClass: "",
          variant: "transparent-black"
        }}
        features={solutionsFeatures}
      />
      <Testimonials />
      <HomeStatistics />
      <Security />
      <GetStarted />
      <Blog />
      <Faq />
      <CallToAction />
    </div>
  );
}
