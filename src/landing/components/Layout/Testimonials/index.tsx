import { Flash } from "@landing/components/Icons";
import Image from "next/image";
import { Button } from "@landing/components/Ui";
import { Section, SectionHeader } from "@landing/components/Global";
import { APP_URL } from "@landing/constants/Global";
import { ALink } from "@landing/components/Ui";

interface Props {
    className?: string;
    type?: "standard" | "alternate";
}

const Testimonials: React.FC<Props> = ({ className, type = "standard" }) => {



    const testimonials = type === "standard" ? "What Our Clients Say" : "Customer stories";
    const desc = type === "standard" ? "Hear directly from those who have transformed their businesses with Field" : "Companies love using joinfield ";
    const iconColor = type === "standard" ? "text-[#40C4AA]" : "text-black";
    // const tagBgColor = type === "standard" ? "bg-[#40C4AA]" : "bg-natural-gray-bg";
    const bgColor = type === "standard" ? "bg-white" : "bg-natural-gray-bg";

    return (
        <Section className={`${bgColor} text-center ${className}`}>
            <SectionHeader
                title={testimonials}
                text={desc}
                tagIcon={<Flash className={iconColor} />}
                tagText="Testimonials"
                tagClassName={"bg-white"}
                bottomSpace

            />
            <div className="activate-aos max-w-lg mx-auto px-3 xl:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className={`${type === "alternate" ? "border border-natural-gray-border" : "bg-natural-gray-bg"} min-h-96 py-10 px-7 text-left flex flex-col justify-between`}>
                        <div>
                            <h3 className="text-natural-gray-text text-xl font-bold">
                                Bring AI into your platform
                            </h3>
                            <p className="text-natural-gray-text text-lg font-normal mt-3">
                                An API built for all your platform&lsquo;s AI needs—start your free trial today!
                            </p>
                        </div>
                        <div>
                            <Button variant="transparent-black" link href={APP_URL} target="_blank">Start Trial</Button>
                        </div>
                    </div>
                    <div className="relative w-full h-full min-h-96">
                        <Image
                            unoptimized
                            src={`/assets/images/testimonials/image1.png`}
                            alt="testimonials"
                            width={380}
                            height={380}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* <div className={`${type === "alternate" ? "bg-white" : ""} border border-natural-gray-border min-h-96 py-10 px-7 text-left flex flex-col justify-between`}>
                        <div>
                            <h3 className="text-natural-gray-text text-2xl font-bold">
                                Amplitude
                            </h3>
                            <p className="text-natural-gray-text text-xl font-normal mt-3">
                                Something about the company uses joinfield to do xyz, and has succes in xyz
                            </p>
                        </div>
                        <div className="border-t border-natural-navy pt-5">
                            <h3 className="text-natural-gray-text text-2xl font-bold">
                                John Doe
                            </h3>
                            <p className="text-natural-gray-text text-base font-normal mt-3">
                                CEO and title
                            </p>
                        </div>
                    </div> */}
                    <div className={`relative w-full h-full flex justify-center items-center border border-[#E1E1E2] min-h-96 ${type === "alternate" ? "bg-white" : ""}`}>
                        <Image
                            data-aos="flip-left"
                            data-aos-delay="100"
                            src={`/assets/images/testimonials/greenhouse.png`}
                            alt="testimonials greenhouse"
                            width={252}
                            height={76}
                            className="w-auto h-auto"
                            unoptimized
                        />
                    </div>
                    <div className={`relative w-full h-full flex justify-center items-center border border-[#E1E1E2] min-h-96 ${type === "alternate" ? "bg-white" : ""}`}>
                        <Image
                            data-aos="flip-left"
                            data-aos-delay="200"
                            src={`/assets/images/testimonials/amazon.png`}
                            alt="testimonials amazon"
                            width={252}
                            height={76}
                            className="w-auto h-auto"
                            unoptimized
                        />
                    </div>
                    <div className="relative w-full h-full min-h-96">
                        <Image
                            src={`/assets/images/testimonials/image2.png`}
                            alt="Jason Bilyeu"
                            width={380}
                            height={380}
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    </div>
                    <div className="bg-[#D8DEFF] min-h-96 py-10 px-7 text-left flex flex-col justify-between">
                        <div>
                            <h3 className="text-natural-gray-text text-xl font-bold">
                                Amplitude
                            </h3>
                            <p className="text-natural-gray-text text-lg font-normal mt-3">
                                Choosing Field over building in-house allowed us to ship products at record speed while delivering best-in-class performance.
                            </p>
                        </div>
                        <div className="border-t border-natural-navy pt-5">
                            <h3 className="text-natural-gray-text text-xl font-bold">
                                Jason Bilyeu
                            </h3>
                            <p className="text-natural-gray-text text-base font-normal mt-3">
                                AI/ML Product Leader, Betterworks
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-14 text-center">
                <ALink target="_blank" href="https://www.researchgate.net/publication/378708427_Comparative_Analysis_of_ML_Machine_Learning_and_LLM_Large_Language_Models_in_Resume_Parsing_A_Paradigm_Shift_in_Talent_Acquisition?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InByb2ZpbGUiLCJwYWdlIjoicHJvZmlsZSJ9fQ">
                    See More Customer Testimonials and Use Cases
                </ALink>
            </div>

        </Section>
    );
};

export default Testimonials;
