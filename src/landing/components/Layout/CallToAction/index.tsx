import Image from "next/image";
import { Button } from "@landing/components/Ui";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { ROUTES } from "@shared/contract";

interface Props {
    type?: 'standart' | 'lumina';
}

const CallToAction: React.FC<Props> = ({ type = 'standart' }) => {
    return (
        <div className={`relative sm:py-16 sm:px-20 mx-auto py-16 px-3 md:px-7 ${type === 'lumina' ? 'bg-transparent' : 'bg-natural-navy'}`}>
            {type === 'lumina' && (
                <Image
                    src="/assets/images/callToAction/bg-lumina.png"
                    fill
                    alt="call to action"
                    className="w-full h-full absolute inset-0 object-cover"
                />
            )}
            <div className={`relative z-10 rounded-lg px-12 py-14 max-w-[1300px] mx-auto ${type === 'lumina' ? 'bg-natural-green' : 'bg-[url("/assets/images/callToAction/bg.png")] bg-cover bg-center'}`}>
                <p className={`text-2xl sm:text-4xl lg:text-6xl font-medium ${type === 'lumina' ? 'text-white' : 'text-[#0A1C20]'} leading-[42px] sm:leading-[63px] lg:leading-[83px] text-center`}
                    disable-data-aos="fade-down"
                    disable-data-aos-delay="100"
                >
                    The New Age of <br className="hidden sm:block" /> Document Intelligence Starts here
                </p>
                <div className="mt-12">
                    <div className="flex flex-col sm:flex-row justify-center gap-y-6 sm:gap-x-6"
                        disable-data-aos="fade-up"
                        disable-data-aos-delay="200"
                    >
                        <Button
                            inline
                            variant={type === 'lumina' ? 'green' : 'black'}
                            link
                            href={ROUTES.register}
                        >
                            Start Trial
                        </Button>
                        <Button
                            inline
                            variant={type === 'lumina' ? 'transparent-white' : 'transparent-black'}
                            link
                            href={PAGE_SETTINGS.contact.href}
                        >
                            Request demo
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CallToAction;