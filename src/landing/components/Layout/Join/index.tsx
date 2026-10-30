import { Tag } from "@landing/components/Ui";
import { ReactIcon } from "@landing/components/Icons";
import { PAGE_SETTINGS, companyLogos } from "@landing/constants/Global";
import { Button } from "@landing/components/Ui";
import Image from "next/image";

const Join = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-11 rounded-3xl overflow-hidden relative">
            <Image
                unoptimized
                src="/assets/images/pages/developer-join.png"
                alt="join"
                fill
                className="object-cover"
            />

            <div className="flex flex-col lg:flex-row justify-start gap-x-[18px] gap-y-8 md:gap-y-0 relative z-10">
                <div className="bg-white rounded-3xl max-w-[419px] py-14 px-9 mx-auto lg:mx-0">
                    <div>
                        <Tag icon={<ReactIcon />} text="Build" className="text-dark-secondary" />
                        <h2 className="text-4xl md:text-5xl font-semibold text-natural-navy mt-3">Join brands who build with Field</h2>
                        <p className="mt-6 text-base md:text-lg font-medium text-natural-gray-default">Everything you need to know about Field APIs, integrations and pricing.</p>
                    </div>
                    <div className="pb-10">
                        <Button
                            link
                            href={PAGE_SETTINGS.contact.href}
                            className="w-max mx-auto mt-16 md:mt-28"
                            inline
                            variant="black"
                        >Book a Demo call</Button>
                    </div>
                </div>
                <div className="mt-8 md:mt-16 flex-grow">
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-9">
                        {companyLogos.map((icon, index) => (
                            <li key={index} className="min-h-[72px] rounded-2xl bg-white overflow-hidden shadow-[2px_2px_12px_0px_#00000005] flex item-center justify-center">
                                <div className="flex items-center justify-center">
                                    <img src={icon.src}
                                        alt={icon.alt}
                                        style={{ maxWidth: icon.width }}
                                        className="w-4/5 sm:w-auto h-auto max-w-none max-h-none"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Join;