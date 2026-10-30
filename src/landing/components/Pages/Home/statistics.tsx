import { Joan } from "next/font/google";
import { Section, SectionHeader } from "@landing/components/Global";
import { AiIcon } from "@landing/components/Icons";
import Image from "next/image";
import { Button } from "@landing/components/Ui";
import { FeatureCard } from "@landing/components/Global";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";

const joan = Joan({
    weight: '400',
    subsets: ['latin'],
});


const featureData: FeatureCardProps = {
    type: "vertical",
    contentList: [
        {
            borderTop: true,
            head: "Market leading 95% accuracy",
            content: "You AI strategy is as good as your data, Field Leads in data retrieval/parsing accuracy.",
            headClassName: "text-xs sm:text-xl min-h-[56px]",
            contentClassName: "text-sm sm:text-base"
        },
        {
            borderTop: true,
            head: "Real-Time, Context-Aware Responses",
            content: "RAG enables Field to provide real-time, context-rich outputs, essential for clients in rapidly changing fields like HR, finance, and legal.",
            headClassName: "text-xs sm:text-xl",
            contentClassName: "text-sm sm:text-base"
        },
        {
            borderTop: true,
            head: "Efficient Processing of Large, Unstructured Data",
            content: "Quickly parse vast amounts of unstructured text data by efficiently locating relevant information",
            headClassName: "text-xs sm:text-xl",
            contentClassName: "text-sm sm:text-base"
        }
    ]
}



const statsData = [
    {
        title: "Field",
        titleClass: "bg-clip-text text-transparent bg-[radial-gradient(202.5%_158.2%_at_50%_83.95%,#BB53F8_0%,#F1DDFE_100%)] leading-normal text-3xl md:text-5xl font-normal relative z-10 transform translate-x-3 translate-y-2 md:translate-y-5",
        percentage: 95,
        percentageClass: "h-[197px]",
    },
    {
        title: "Model 2",
        titleClass: "text-white text-2xl md:text-4xl font-normal transform translate-x-6",
        percentage: 82,
        percentageClass: "h-[160px]",
    },
    {
        title: "Model 3",
        titleClass: "text-white text-2xl md:text-4xl font-normal transform translate-x-6",
        percentage: 67,
        percentageClass: "h-[98px]",
    }
]




const statisticsContent = () => {
    return (
        <>
            <div className="relative mx-auto w-full max-w-full min-h-[528px] flex items-end justify-center pb-[21px]">
                <Image unoptimized src="/assets/images/statistics/home.png" alt="statistics" fill className="object-cover" />
                <div className="relative z-10 w-full h-full max-w-[852px] mx-auto">
                    <div className="rounded-lg bg-natural-navy py-7 max-w-[95%] md:max-w-full mx-auto">
                        <div className="flex items-center gap-2 px-2.5">
                            <AiIcon className="transform translate-y-2 translate-x-2" />
                            <h3 className="text-white text-2xl font-semibold leading-8 text-center md:text-left">Research based data retrieval accuracy</h3>
                        </div>
                        <div className="mt-6 px-4 sm:px-8 lg:px-16">
                            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">

                                <div className="flex items-end gap-4 md:gap-16">
                                    {statsData.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <span className={`mt-2  ${joan.className} ${item.titleClass}`}>{item.percentage}%</span>
                                            <div className={`w-[30px] mr-auto rounded-[1px] ${item.percentageClass} shadow-[0px_4px_4px_0px_#00000040] bg-gradient-to-b from-white to-[#E1E1E2] to-[159.82%]`}></div>
                                            <p className="text-white text-base font-medium leading-7 mt-4 mr-auto">{item.title}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 max-w-[320px]">
                                    <h4 className="text-white text-base leading-5 font-bold">Enhanced Document Parsing Accuracy</h4>
                                    <p className="text-white text-sm leading-5 font-normal mt-4">
                                        RAG combines retrieval techniques with generation, allowing Field to pull in accurate, contextually relevant information from large document databases. This hybrid approach can improve accuracy, particularly when parsing complex documents with nuanced language.
                                    </p>
                                    <Button link target="_blank" href={"https://www.researchgate.net/publication/378698002_Comparative_Analysis_of_ML_Machine_Learning_and_LLM_Large_Language_Models_in_Resume_Parsing_A_Paradigm_Shift_in_Talent_Acquisition"} inline variant="white" className="mt-9 bg-natural-gray-border text-natural-navy">
                                        Go to Research paper
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


const HomeStatistics = () => {
    return (
        <Section>
            <SectionHeader
                title="We’re leading the competition in every category"
                bottomSpace
            />

            <div className="relative max-w-lg mx-auto">
                <FeatureCard {...featureData} customImage={<>
                    {statisticsContent()}
                </>} />
            </div>
        </Section>
    );
};

export default HomeStatistics;