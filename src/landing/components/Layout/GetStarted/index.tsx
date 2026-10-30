import { Button } from "@landing/components/Ui";
import { PAGE_SETTINGS, APP_URL } from "@landing/constants/Global";
const GetStarted = () => {
    return (
        <div className="relative py-12 sm:py-24 px-6 sm:px-20 mx-auto bg-[#0E1116]">
            <div className="relative z-10 rounded-lg px-12 py-14 max-w-[1080px] mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-[#292B2D]"
                    disable-data-aos="fade-zoom-in"
                    disable-data-aos-delay="100"
                />
                <div className="mx-auto max-w-xl relative z-10">
                    <h2 className="font-semibold text-[24px] sm:text-[32px] lg:text-[40px] leading-[32px] sm:leading-[48px] text-center text-white">Ready to get started with Field?</h2>
                    <p className="mt-4 text-sm sm:text-base leading-5 sm:leading-6 font-normal text-white text-center">
                        Our robust API let you seamlessly integrate Field with your own product, tech stack, or other tools.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-y-6 sm:gap-x-6 mt-8"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="250"
                    >
                        <Button
                            inline
                            variant="green"
                            link
                            href={PAGE_SETTINGS.contact.href}
                        >
                            Schedule demo
                        </Button>
                        <Button
                            inline
                            variant="white"
                            link
                            href={APP_URL}
                        >
                            Start Trial
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default GetStarted;