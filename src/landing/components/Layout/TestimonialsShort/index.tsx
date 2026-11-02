import Image from "next/image";

const TestimonialsShort: React.FC = () => {
    return (
        <div className="max-w-lg mx-auto px-6 xl:px-0">
            <div className="flex flex-col md:flex-row items-stretch gap-6">
                <div className="w-full md:w-[325px] shrink-0 relative">
                    <p className="absolute bottom-3.5 left-4 text-white font-semibold text-2xl">
                        IVY EXEC
                    </p>
                    <Image
                        src={`/assets/images/testimonials/image3.png`}
                        alt="testimonials"
                        width={325}
                        height={335}
                        className="w-full h-auto md:h-full object-cover"
                        unoptimized
                    />
                </div>
                <div className="bg-[#D8DEFF] py-[30px] px-[35px] text-left flex flex-col justify-between grow overflow-hidden">
                    <div>
                        <p className="text-natural-gray-text text-xl font-light mt-3"
                            disable-data-aos="fade-up"
                            disable-data-aos-delay="100"
                        >
                            &quot;Field stands out where others fail. In our tests, it handled tricky resumes with unmatched accuracy—even for formats that other parsers consistently got wrong.&quot;
                        </p>
                    </div>
                    <div className="border-t border-natural-navy pt-5 w-1/2 mt-5 xl:mt-0">
                        <h3 className="text-natural-gray-text text-lg md:text-xl lg:text-2xl font-bold"
                            disable-data-aos="fade-up"
                            disable-data-aos-delay="200"
                        >
                            Jelena Slijvar
                        </h3>
                        <p className="text-natural-gray-text text-sm md:text-base font-normal mt-2 md:mt-3"
                            disable-data-aos="fade-up"
                            disable-data-aos-delay="300"
                        >
                            Product manager, Ivy Exec
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestimonialsShort;