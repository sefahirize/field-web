import { Section } from "@landing/components/Global";
import Image from "next/image";

interface IntegrationCardProps {
    title: string;
    text: string;
    type?: 'basic' | 'large';
    point?: string;
    className?: string;
    mobileImg?: string;
    mobClass?: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, text, type = 'basic', point, className, mobileImg, mobClass }) => {

    return (
        <div className={`my-3 md:my-0 w-full md:w-60 relative z-20 flex flex-col justify-between ${type === 'large' ? 'p-6' : 'p-3'} min-h-44 bg-white border border-natural-gray-border rounded-lg will-change-transform group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${className}`}>
            {point && <span className={`block w-2.5 h-2.5 rounded-full mb-2.5 ${point}`} />}
            <h4 className={`font-semibold transform-gpu ${type === 'large' ? 'text-3xl' : 'text-xl'}`}>{title}</h4>
            <p className="text-natural-gray-default text-xs font-normal pt-2 mt-3 border-t border-natural-gray-border">{text}</p>
            {mobileImg && <img src={mobileImg} alt="integration" className={`absolute md:hidden -z-10 ${mobClass}`} />}
        </div>
    )

}


const Integration = () => {


    const transition = "transition-all ease-in-out duration-300"


    return (
        <Section className="py-0! md:py-24! mt-10 md:mt-[77px]">
            <div className="md:hidden text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-semibold">Hundreds of ways to integrate, and counting</h2>
                <p className="text-base md:text-lg font-medium">Add Field to your favorite tools or bring your favorite tools along</p>
            </div>
            <div className="px-3 lg:xl-0 lg:max-w-[1000px] xl:max-w-[1215px] 2xl:max-w-[1400px] mx-auto">
                <div className="md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between">
                    <div className="block md:inline-block mx-auto lg:mr-auto relative group lg:translate-y-7">
                        <Image
                            unoptimized
                            src="/assets/images/integration/icon1.png"
                            alt="google alternate icon"
                            width={70}
                            height={71}
                            className={`${transition} absolute bottom-full right-0 -translate-y-28 translate-x-20 group-hover:-translate-y-24 hidden md:block`}
                        />
                        <IntegrationCard
                            title="Greenhouse Integration"
                            text="Automatically sync candidate data from your Greenhouse account to Field. Match and rank candidates"
                            point="bg-[#619C82]"
                            mobileImg="/assets/images/integration/icon1.png"
                            mobClass="top-3 right-4"
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/blur1.png"
                            alt="Blur"
                            width={129}
                            height={148}
                            className={`${transition} absolute top-0 left-full transform -translate-x-7 -translate-y-5 group-hover:-translate-y-4 hidden md:block`}
                        />
                    </div>
                    <div className="block md:inline-block mx-auto lg:mt-[-77px] relative group">
                        <IntegrationCard
                            type="large"
                            title="1 Hour"
                            text="Easy and fast integration value in minutes"
                            mobileImg="/assets/images/integration/profile2.png"
                            mobClass="top-3 right-4 max-w-[80px]"
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/profile2.png"
                            alt="Blur"
                            width={129}
                            height={148}
                            className={`${transition} absolute bottom-full left-full transform -translate-x-7 translate-y-10 group-hover:translate-y-11 z-30 hidden md:block`}
                        />
                    </div>
                    <div className="inline-block mx-auto lg:ml-12 relative group col-span-2 lg:col-span-1">
                        <div className="relative inline-block">
                            <IntegrationCard
                                title="Zapier Integration"
                                text="Effortlessly automate workflows with our Zapier integration. Connect Field to thousands of apps, enabling seamless data transfers and streamlined processes."
                                point="bg-[#F87153]"
                                mobileImg="/assets/images/integration/icon2.png"
                                mobClass="top-3 right-4"
                            />
                            <Image
                                unoptimized
                                src="/assets/images/integration/blur2.png"
                                alt="Blur"
                                width={195}
                                height={126}
                                className={`${transition} absolute top-0 left-full transform -translate-x-7 translate-y-1 group-hover:translate-y-3 hidden md:block`}
                            />
                            <Image
                                unoptimized
                                src="/assets/images/integration/icon2.png"
                                alt="icon2"
                                width={70}
                                height={71}
                                className={`${transition} absolute top-0 right-0 -translate-y-8 translate-x-24 group-hover:-translate-y-10 hidden md:block`}
                            />
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center max-w-[800px] mx-auto pt-14 lg:pt-9 pb-14 xl:pb-0">
                    <div className="text-center my-6">
                        <h2 className="text-3xl md:text-5xl font-semibold">Hundreds of ways to integrate, and counting</h2>
                        <p className="text-base md:text-lg font-medium">Add Field to your favorite tools or bring your favorite tools along</p>
                    </div>
                </div>
                <div className="md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between">
                    <div className="block md:inline-block mx-auto lg:mr-auto relative group">
                        <Image
                            unoptimized
                            src="/assets/images/integration/profile1.png"
                            alt="profile1"
                            width={114}
                            height={113}
                            className={`${transition} -mt-10 translate-y-0 group-hover:translate-y-1 pb-8 hidden lg:block`}
                        />
                        <div className="relative">
                            <IntegrationCard
                                type="large"
                                title="1 Hour"
                                text="Easy and fast integration value in minutes"
                                mobileImg="/assets/images/integration/profile1.png"
                                mobClass="top-3 right-4 max-w-[80px]"
                            />
                            <Image
                                unoptimized
                                src="/assets/images/integration/icon3.png"
                                alt="google icon"
                                width={70}
                                height={71}
                                className={`${transition} absolute -bottom-3 left-0 translate-y-24 group-hover:-bottom-2 hidden md:block`}
                            />
                            <Image
                                unoptimized
                                src="/assets/images/integration/blur3.png"
                                alt="Blur"
                                width={186}
                                height={152}
                                className={`${transition} absolute top-0 left-0 transform -translate-x-20 translate-y-14 group-hover:translate-y-12 hidden md:block`}
                            />
                        </div>
                    </div>
                    <div className="inline-block relative group mx-auto lg:mt-[102px]">
                        <IntegrationCard
                            type="large"
                            title="Field API"
                            text="Provides unmatched flexibility, allowing you to integrate Field’s advanced parsing and data insights directly into your own platform, tailored to your unique workflows."
                            point="bg-[#0D68FC]"
                            mobileImg="/assets/images/integration/icon4.png"
                            mobClass="top-3 right-4"
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/icon4.png"
                            alt="blue icon"
                            width={70}
                            height={71}
                            className={`${transition} absolute bottom-0 -left-full translate-x-24 translate-y-7 group-hover:translate-y-5 hidden lg:block`}
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/blur4.png"
                            alt="Blur"
                            width={195}
                            height={121}
                            className={`${transition} absolute top-0 right-0 transform translate-x-11 -translate-y-10 group-hover:translate-x-14 hidden md:block`}
                        />
                    </div>
                    <div className="inline-block mx-auto lg:ml-auto relative group col-span-2 lg:col-span-1">
                        <IntegrationCard
                            title="Google Integration"
                            text=" Integrate Field directly with Google to unlock powerful insights. From parsing outputs to export or even import files in real time"
                            mobileImg="/assets/images/integration/icon3.png"
                            mobClass="top-3 right-4"
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/profile3.png"
                            alt="profile3"
                            width={114}
                            height={113}
                            className={`${transition} ml-auto mt-2.5 mr-9 group-hover:mr-7 hidden lg:block`}
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/icon3.png"
                            alt="google icon"
                            width={70}
                            height={71}
                            className={`${transition} absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-3 group-hover:-translate-y-1 hidden md:block`}
                        />
                        <Image
                            unoptimized
                            src="/assets/images/integration/blur5.png"
                            alt="Blur"
                            width={109}
                            height={149}
                            className={`${transition} absolute top-0 left-0 transform -translate-x-5 translate-y-28 group-hover:translate-y-32 hidden md:block`}
                        />
                    </div>
                </div>
            </div>
        </Section>

    )
}

export default Integration;