import { APP_URL, PAGE_SETTINGS } from "@landing/constants/Global";
import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";

export const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "+ 50 Million Resumes",
        content: "AI model trained with over 6 million datasets.",
        className: "bg-white",
        pClassName: "text-natural-gray-default! ml-8 text-base font-normal!",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "< 1 sec",
        content: "Screen and match resumes under a second.",
        className: "bg-white",
        pClassName: "text-natural-gray-default! ml-8 text-base font-normal!",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "1000+ integrations",
        content: "Easily integrate with most of HR software.",
        className: "bg-white",
        pClassName: "text-natural-gray-default! ml-8 text-base font-normal!",
        pParentClassName: "lg:mt-6",
        icon: {
            bg: "bg-linear-to-b/srgb from-[rgba(36,36,133,0.2)] from-[44.82%] to-[rgba(129,136,152,0.2)] to-[99.75%]",
        }
    },
]

export const featureData: FeatureCardProps[] = [
    {
        type: "horizontal-reverse",
        image: {
            bg: {
                src: "/assets/images/feature/bg-5.png",
                alt: "Field Ai Matching",
                width: 506,
                height: 583,
            },
            inner: {
                src: "/assets/images/feature/inner-5.png",
                alt: "Field Ai Matching",
                width: 495,
                height: 590,
                className: "w-full h-auto",
            },
        },
        contentList: [
            {
                spaceX: true,
                borderTop: true,
                head: "Unlock your talent pool",
                content: "Achieve 95% parsing accuracy across all file formats, powered by Field's advanced OCR, NLP, and RAG technology—bringing top talent to you faster than ever.",
            },
            {
                spaceX: true,
                borderTop: true,
                head: "Leverage Deep Learning AI",
                content: "Supported by deep learning AI, Field understands resumes that rivals human accuracy. Making data extraction and matching effortless."
            }
        ]
    },
    {
        type: "horizontal",
        title: "Seamless to implement while using State of the art technology",
        titleClassName: "md:mb-10 xl:mb-14",
        contentMainClassName: "lg:block",
        image: {
            bg: {
                src: "/assets/images/feature/bg-6.png",
                alt: "Field Ai Matching",
                width: 506,
                height: 583,
            },
            inner: {
                src: "/assets/images/feature/inner-6.png",
                alt: "Field Ai Matching",
                width: 495,
                height: 590,
                className: "w-full h-auto",
            },
        },
        contentList: [
            {
                borderTop: false,
                head: "Field API",
                html: true,
                content: "Field AI Match can be easily accessed via a RESTFul API call, enabling you to quickly process documents and raw text for an accurate score. <br> <br> Maximizing your efficiency with data without complex setup or hassle!",
            }
        ],
        buttons: [
            {
                variant: "black",
                type: "link",
                text: "Integrations",
                href: PAGE_SETTINGS.integration.href,
                link: true,
            },
            {
                hideIcon: true,
                variant: "transparent-black",
                type: "link",
                text: "Start Trial",
                href: APP_URL,
                link: true,
            }
        ]
    }
]


export const worldMostAccurateParserFeatures: ISolutionsFeature[] = [
    {
        title: "Industry Agnostic",
        content: "A single technology that understands both blue-collar and white-collar jobs, junior and senior positions, in all industries.",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[#E1DDFE]",
        }
    },
    {
        title: "Multiple Languages",
        content: "Parse resumes and job descriptions in 24 + Languages including Arabic, Hebrew, and Hindi",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[#CFE1FE]",
        }
    },
    {
        title: "Custom AI Algorithms",
        content: "Your culture and company are unique, so should your matching engine.",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[#FEE3DD]",
        }
    },
    {
        title: "Data Debasing",
        content: "Long-standing prejudices bias training data. A biased training set will cause an algorithm to codify and magnify bias. We designed auditing algorithms to identify and remove data biases.",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Algorithmic Auditing",
        content: "Machine learning algorithms are not fair by default. We designed inclusive models to assure fairness and reduce biases (allocation, representation, gender, ethnicity, stereotypes, and more.)",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "Continuous Retraining",
        content: "Our algorithms learn with every data point, interaction, and feedback using online learning.",
        pClassName: "text-natural-gray-default! text-base font-normal!",
        className: "bg-white",
        icon: {
            bg: "bg-[linear-gradient(179.71deg,rgba(36,36,133,0.2)_44.82%,rgba(129,136,152,0.2)_99.75%)]",
        }
    },
]