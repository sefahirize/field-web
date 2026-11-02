import FeatureCard from "@landing/components/Global/FeatureCard";
import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";


interface Props {
    data?: FeatureCardProps[];
    sectionClassName?: string;
    resetSectionMobilePad?: boolean;
}

const Feature: React.FC<Props> = ({ data, sectionClassName, resetSectionMobilePad = false }) => {
    return (
        <div className={sectionClassName}>
            <div className="max-w-8xl mx-auto px-3 xl:px-0">
                <div className={`grid grid-cols-1 gap-y-10 md:gap-y-24 py-24 ${resetSectionMobilePad ? "py-0! lg:py-24!" : ""}`}>
                    {data?.map((feature, index) => (
                        <div key={index} className={`px-4 lg:px-20 py-11 bg-white rounded-lg max-w-[1304px] mx-auto ${resetSectionMobilePad ? "py-0 lg:py-11!" : ""}`}>
                            <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feature;
