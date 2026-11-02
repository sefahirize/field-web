import Image from "next/image";

import {
    DATA_FOOTER_MENU_LIST_COMPANY,
    DATA_FOOTER_MENU_LIST_EXTRAS,
    DATA_FOOTER_MENU_LIST_RESOURCES,
} from "@landing/constants/Footer";
import { DATA_FOOTER_MENU_PRODUCTS, DATA_MENU_SOLUTIONS, DATA_SOCIAL_MEDIA } from '@landing/constants/Global';

interface FooterLink {
    href?: string;
    label?: string;
    footerLabel?: string;
}

interface FooterMenu {
    title: string;
    links: FooterLink[];
}

const footerMenus: FooterMenu[] = [
    {
        title: "Products",
        links: DATA_FOOTER_MENU_PRODUCTS as FooterLink[]
    },
    {
        title: "Solutions",
        links: DATA_MENU_SOLUTIONS as FooterLink[]
    },
    {
        title: "Resources",
        links: DATA_FOOTER_MENU_LIST_RESOURCES as FooterLink[]
    },
    {
        title: "Company",
        links: DATA_FOOTER_MENU_LIST_COMPANY as FooterLink[]
    }
];

const Footer = () => {

    return (
        <div className="bg-natural-navy px-4 sm:px-6 md:px-20 pb-8">
            <div className="max-w-8xl mx-auto pt-8 md:pt-16">
                <div className="flex items-center gap-2">
                    <Image
                        unoptimized
                        src={"/assets/images/landing/logo-white.svg"}
                        alt="Field"
                        width={668}
                        height={575}
                        className="h-10 w-10"
                    />
                    <span className="text-xl font-semibold leading-none text-white">Field</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 justify-between mt-8">
                    <div>
                        <p className="text-white text-base md:text-lg font-semibold leading-6 md:leading-7">
                            Build by a team of AI experts <br />
                            <span className="text-[#CFE1FE]">Headquartered in Miami</span>
                        </p>
                        {/* <p className="text-sm font-semibold text-white mt-12 md:mt-[169px]">
                            Backed by leading brands
                        </p>
                        <Image src={"/assets/images/landing/nvidia-inception-program-badge.svg"}
                            alt="NVIDIA Inception Program Badge"
                            width={572}
                            height={216}
                            className="mt-6 max-w-[152px]" /> */}
                        {/* <Image src={"/assets/images/footer/techstars.png"}
                            alt="Techstars"
                            width={158}
                            height={72}
                            className="mt-1 max-w-[158px]" /> */}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-14">
                        {footerMenus.map((menu: FooterMenu, index: number) => (
                            <div key={index}>
                                <h3 className="text-white text-xl font-bold leading-6">{menu.title}</h3>
                                <nav className="mt-3">
                                    {menu.links.map((link: FooterLink, linkIndex: number) => (
                                        <a key={linkIndex} href={link.href} className="text-natural-gray-tint text-sm font-semibold leading-5 py-2 block transition-colors hover:text-white">
                                            {link.footerLabel || link.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="mt-10 md:mt-[-24px]">
                        <p className="text-sm font-semibold text-white">
                            Backed by leading brands
                        </p>
                        <Image unoptimized src={"/assets/images/landing/nvidia-inception-program-badge.svg"}
                            alt="NVIDIA Inception Program Badge"
                            width={572}
                            height={216}
                            className="mt-6 max-w-[152px]" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Image unoptimized src={"/assets/images/footer/techstars.png"}
                            alt="Techstars"
                            width={158}
                            height={72}
                            className="mt-1 max-w-[158px]" />
                    </div>
                    <div>
                        <a href="https://hirize.statuspage.io" target="_blank" className="inline-block py-1 px-2 rounded-full bg-white bg-linear-to-b/srgb from-white/0 to-[#A4ACB9]/2 shadow-[0_1px_2px_rgba(164,172,185,0.24),0_0_0_1px_rgba(19,28,43,0.08)]">
                            <div className="flex items-center gap-x-1">
                                <span className="mr-2 w-4 h-4 rounded-full bg-[#00C744]/30 flex justify-center items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A9544]"></span>
                                </span>
                                <span className="text-[10px] font-normal text-nature-black">All systems operational</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="text-white text-sm font-semibold mt-8 pt-10 border-t border-white/10">
                    <p className="text-natural-gray-tint text-sm font-medium text-center sm:text-left">
                        &copy; {new Date().getFullYear()} All Rights Reserved.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4 sm:gap-x-4">
                        <div className="flex items-center gap-x-3 flex-wrap justify-center">
                            {DATA_FOOTER_MENU_LIST_EXTRAS.map((social, index) => (
                                <a key={index} href={social?.href} className="text-natural-gray-tint text-sm font-medium">
                                    {social?.label}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-x-3">
                            {DATA_SOCIAL_MEDIA.map((social, index) => (
                                <a
                                    key={index}
                                    href={social?.href}
                                    aria-label={social?.label}
                                    className="text-natural-gray-tint text-sm font-medium w-10 h-10 flex items-center justify-center rounded-lg border border-transparent hover:border-white transition-colors">
                                    <img src={social?.icon.src} alt={social?.label} width={16} height={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;