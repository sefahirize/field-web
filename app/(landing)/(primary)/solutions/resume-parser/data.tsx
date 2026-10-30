import { Feature as ISolutionsFeature } from "@landing/interfaces/global/Solutions.interfaces";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";
import { DOCUMENTATION_URL, APP_URL } from "@landing/constants/Global";

export const solutionsFeatures: ISolutionsFeature[] = [
    {
        title: "95% Accuracy",
        content: "Highest accuracy in data extraction",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "150+ Data points",
        content: "Make data strategic",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "1000 (req) parsing parallelism",
        content: "Unmatched parallelism capability",
        className: "bg-white",
        pClassName: "!text-natural-gray-default ml-8 text-base !font-normal",
        // pParentClassName: "lg:mt-6",
        icon: {
            bg: "bg-gradient-to-b from-[rgba(36,36,133,0.2)] from-[44.82%] to-[rgba(129,136,152,0.2)] to-[99.75%]",
        }
    },
]


export const worldMostAccurateParserFeatures: ISolutionsFeature[] = [
    {
        title: "HR Parser",
        content: "Field integrates easily with large platforms through our powerful API, Integration is under 1 hour and value is realized on the fly.",
        className: "bg-[#FFECDB]",
        icon: {
            bg: "bg-[#F87153]",
        }
    },
    {
        title: "Field Fin",
        content: "Field AI is leading in accuracy not only with text but also with numbers.",
        className: "bg-[#F2FFEE]",
        icon: {
            bg: "bg-[#39E674]",
        }
    },
    {
        title: "Customize own",
        content: "Customize your own parser based on the documents you have. Contact our AI expert team to start.",
        className: "bg-[#D8DEFF]",
        icon: {
            bg: "bg-[linear-gradient(179.71deg,rgba(36,36,133,0.2)_44.82%,rgba(129,136,152,0.2)_99.75%)]",
        }
    },
    {
        title: "HR SaaS",
        content: "Field API’s parser extracts data from resumes and job descriptions, enhancing candidate search with 95% accuracy.",
        className: "",
        icon: {
            bg: "bg-[#DDFCFE]",
        }
    },
    {
        title: "Fintech SaaS",
        content: "Boost your Fintech platform with Field API’s invoice parser, extracting data from financial documents with 95% accuracy.",
        className: "",
        icon: {
            bg: "bg-[#F1FFE8]",
        }
    },
    {
        title: "Enterprise",
        content: "Field APIs streamline data extraction and parsing, optimizing your enterprise’s data management and automating workflows.",
        className: "",
        icon: {
            bg: "bg-[linear-gradient(179.71deg,_rgba(36,36,133,0.2)_44.82%,_rgba(129,136,152,0.2)_99.75%)]",
        }
    },
]



export const featureData: FeatureCardProps[] = [
    {
        type: "horizontal",
        image: {
            bg: {
                src: "/assets/images/feature/bg-4.png",
                alt: "Field Parser",
                width: 506,
                height: 583,
            },
            inner: {
                src: "/assets/images/feature/inner-4.png",
                alt: "Field Parser",
                width: 439,
                height: 508,
                className: "w-full h-auto",
            },
        },
        contentList: [
            {
                borderTop: true,
                head: "Field API",
                content: "Field Resume Parser is easy to integrate with a simple POST call to our API. Code examples in all the major programming languages are available in our documentation.",
            }
        ],
        buttons: [
            {
                hideIcon: true,
                variant: "transparent-black",
                type: "link",
                text: "Start Trial",
                href: APP_URL,
                link: true,
            },
            {
                variant: "black",
                type: "link",
                text: "Documentation",
                href: DOCUMENTATION_URL,
                link: true,
                target: "_blank",
            }
        ]
    }
]