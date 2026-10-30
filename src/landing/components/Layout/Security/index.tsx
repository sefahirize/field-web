import { Section, SectionHeader } from "@landing/components/Global";
import { SecurityIcon, CheckIcon } from "@landing/components/Icons";

const securityFeatures = [
    {
        title: "Data Encryption",
        content: "All Field servers are within our virtual private cloud secured data encryption at rest (AES-256) and in transit (TLS).",
        icon: {
            bg: "bg-[#CFE1FE]",
            dot: "bg-[#6A53F8]"
        }
    },
    {
        title: "Total Transparency",
        content: "No training on user data",
        icon: {
            bg: "bg-[#FEE3DD]",
            dot: "bg-[#FDA29B]"
        }
    },
    {
        title: "Complete Security",
        content: "Our API follows industry-standard security protocols, such as OAuth 2.0 authentication and HTTPS encryption.",
        icon: {
            bg: "bg-[#E1DDFE]",
            dot: "bg-[#6A53F8]"
        }
    },
    {
        title: "Compliance",
        type: "list",
        items: ["SOC 2", "ISO27001", "GDPR"],
        icon: {
            bg: "bg-[#F1FFE8]",
            dot: "bg-[#6CE9A6]"
        }
    }
];

const Security = () => {
    return (
        <Section>
            <SectionHeader
                title="Security By Design"
                text="Reliability Trusted by Top-Tier Organizations"
                tagIcon={<SecurityIcon className="text-[#6A53F8]" />}
                tagText="Security"
                bottomSpace
            />
            <div className="px-3 xl:px-0">
                <div className="max-w-[840px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-[30px] gap-y-5">
                    {securityFeatures.map((feature, index) => (
                        <div key={index} className="px-4 sm:px-7 py-8 sm:py-11 border border-natural-gray-border"
                            disable-data-aos="zoom-in"
                            disable-data-aos-delay={`${index * 200}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full ${feature.icon.bg} flex items-center justify-center blur-[4px]`}>
                                    {/* <div className={`w-2.5 h-2.5 ${feature.icon.dot} rounded-full backdrop-blur-[10px]`} /> */}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold leading-7 sm:leading-8 text-natural-navy">{feature.title}</h3>
                            </div>
                            <div className="mt-10 sm:mt-14">
                                {feature.type === "list" ? (
                                    <div className="space-y-3">
                                        {feature.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={`w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#D7FAE3] flex items-center justify-center`}>
                                                    <CheckIcon className="text-natural-navy w-[12px] sm:w-auto" />
                                                </div>
                                                <span className="text-sm sm:text-base text-natural-gray-default font-normal leading-5 sm:leading-6">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm sm:text-base text-natural-gray-default font-normal leading-5 sm:leading-6">{feature.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}

export default Security;