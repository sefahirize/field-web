import { CheckIcon } from "@landing/components/Icons";
import { SolutionsGridItemProps } from "@landing/interfaces/global/Solutions.interfaces";
import { ALink } from "@landing/components/Ui";

const SolutionsGridItem = ({ feature, index, className }: SolutionsGridItemProps) => {

    const parentClassName = `px-4 sm:px-7 py-8 sm:py-11 border border-natural-gray-border ${className ?? ""}`;


    if (feature.html) {
        return (
            <div
                key={index}
                className={parentClassName}
                disable-data-aos="fade-down"
                disable-data-aos-delay={`${index * 200}`}
            >
                {feature.html}
            </div>
        );
    }


    return (
        <div key={index} className={parentClassName}
            disable-data-aos="fade-down"
            disable-data-aos-delay={`${index * 200}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full ${feature.icon.bg} flex items-center justify-center blur-[4px]`}>
                    {/* <div className={`w-2.5 h-2.5 ${feature.icon.dot} rounded-full backdrop-blur-[10px]`} /> */}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold leading-7 sm:leading-8 text-natural-navy min-h-[64px] flex items-center">{feature.title}</h3>
            </div>
            <div className={`mt-10 sm:mt-12 ${feature.pParentClassName ?? ""}`}>
                {feature.type === "list" ? (
                    <div className="space-y-3">
                        {feature.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className={`w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#D7FAE3] flex items-center justify-center`}>
                                    <CheckIcon className="text-natural-navy w-[12px] sm:w-auto" />
                                </div>
                                <span className={`text-sm sm:text-base text-natural-navy font-medium leading-5 sm:leading-6 ${feature.pClassName ?? ""}`}>{item}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm sm:text-base text-natural-navy font-normal leading-5 sm:leading-6 ${feature.pClassName ?? ""}`}>{feature.content}</p>
                )}


                {feature.link && (
                    <ALink className="mt-12" href={feature.link.href} target={feature.link.target}>{feature.link.text}</ALink>
                )}
            </div>
        </div>
    );
};

export default SolutionsGridItem;
