import { APP_URL } from "@landing/constants/Global";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";

export const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "HR Vendors",
        content: "Offer your customers with state-of-the-art parsing and matching technology that sets the standard for speed, accuracy, and reliability.",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Enterprise",
        content: "The Field API is simple to integrate with major corporate ATS’s, allowing you to enhance your current hiring tech stack while saving time.",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "Staffing Agencies",
        content: "Field solutions will maximize your resume database by finding 30% more qualified candidates from the same resume pool.",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        // pParentClassName: "lg:mt-6",
        icon: {
            bg: "bg-gradient-to-b from-[rgba(36,36,133,0.2)] from-[44.82%] to-[rgba(129,136,152,0.2)] to-[99.75%]",
        }
    },
]

export const featureData: FeatureCardProps[] = [
    {
        type: "horizontal",
        image: {
            bg: {
                src: "/assets/images/feature/bg-7.png",
                alt: "Field Ai Matching",
                width: 506,
                height: 583,
            },
            // inner: {
            //     src: "/assets/images/feature/inner-7.png",
            //     alt: "Field Ai Matching",
            //     width: 495,
            //     height: 590,
            //     className: "w-full h-auto",
            // },
        },
        contentList: [
            {
                spaceX: true,
                borderTop: true,
                head: "Field IQ",
                content: "Create tailor made candidate summaries and interviews questions with Generative AI! - all in record time.",
            },
            {
                spaceX: true,
                borderTop: true,
                head: "Interview Questions",
                content: "Field IQ creates up to 8 customized, highly technical interview questions"
            },
            {
                spaceX: true,
                borderTop: true,
                head: "Summary",
                content: "Create customized summaries by assessing candidate qualifications, skill sets, and experience to determine which candidate is best suited for success in this specific role."
            }
        ],
        buttons: [
            {
                spaceX: true,
                variant: "black",
                type: "link",
                text: "Try now",
                href: APP_URL,
                link: true,
            },
        ]
    },
    {
        type: "horizontal-reverse",
        // titleClassName: "md:mb-10 xl:mb-14",
        // contentMainClassName: "lg:block",
        image: {
            bg: {
                src: "/assets/images/feature/bg-8.png",
                alt: "Field Ai Matching",
                width: 506,
                height: 583,
            },
            // inner: {
            //     src: "/assets/images/feature/inner-8.png",
            //     alt: "Field Ai Matching",
            //     width: 495,
            //     height: 590,
            //     className: "w-full h-auto",
            // },
        },
        contentList: [
            {
                spaceX: true,
                borderTop: true,
                head: "Field IQ",
                headClassName: "!font-semibold xl:!text-[64px] xl:!leading-normal",
                html: true,
                content: "Utilize the power of Generative AI to create highly relevant interview questions tailored precisely for your desired candidates. Field IQ harnesses data-driven insights to generate custom questions that hone in on exactly what you need. <br> <br> Unlock a full range of hiring potential with our cutting edge solution.",
            }
        ],
        buttons: [
            {
                spaceX: true,
                variant: "black",
                type: "link",
                text: "Get Started",
                href: APP_URL,
                link: true,
            },
        ]
    }
]