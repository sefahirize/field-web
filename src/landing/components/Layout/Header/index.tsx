"use client";
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@landing/components/Ui';
import { DATA_MENU_SOLUTIONS, DATA_HEADER_MENU_PRODUCTS, DATA_MENU_LEARN_CONNECT, DATA_MENU_HELP_SUPPORT, DATA_MENU_COMPANY } from '@landing/constants/Global';
import { PAGE_SETTINGS, APP_URL } from '@landing/constants/Global';

import Image from 'next/image';

interface MenuItem {
    label: string;
    headerLabel?: string;
    footerLabel?: string;
    desc: string;
    href: string;
    icon?: string;
    circle?: string;
    isExternal?: boolean;
    hoverIcon?: string;
}

interface MenuSection {
    type: "menu";
    title: string;
    className?: string;
    menuItems: MenuItem[];
}

interface ImageSection {
    type: "image";
    title: string;
    image: string;
    desc: string;
    href: string;
    width?: number;
    height?: number;
    subTitle?: string;
    buttonText?: string;
    buttonClassName?: string;
}

interface LineSection {
    type: "line";
}

interface HeaderDataItem {
    label: string;
    headerLabel?: string;
    footerLabel?: string;
    href?: string;
    position?: "center" | "left" | "right";
    items?: (MenuSection | ImageSection | LineSection)[];
}

const headerData: HeaderDataItem[] = [
    {
        label: "Solutions",
        position: "right",
        items: [
            {
                type: "menu",
                title: "By Industry",
                menuItems: DATA_MENU_SOLUTIONS,
                // className: "grid grid-cols-2 gap-x-6"
            },
            {
                type: "line"
            },
            {
                type: "image",
                title: "",
                image: "/assets/images/header/solutions.png",
                subTitle: "The future of Enterprise AI",
                desc: "Get to know the Field product suit and read customer stories",
                buttonText: "Blog Read more",
                buttonClassName: "text-sm font-medium bg-natural-navy text-white",
                href: "/startup-growth",
                width: 348,
                height: 240,
            },
        ]
    },
    {
        label: "Products",
        position: "center",
        items: [
            {
                type: "menu",
                title: "Products",
                menuItems: DATA_HEADER_MENU_PRODUCTS,
                className: "grid grid-cols-2 gap-x-6"
            },
            {
                type: "line"
            },
            {
                type: "image",
                title: "Blog",
                image: "/assets/images/header/products.png",
                subTitle: "The future of Enterprise AI",
                desc: "Get to know the Field product suit and read customer stories",
                buttonText: "Blog Read more",
                buttonClassName: "text-sm font-medium bg-natural-navy text-white",
                href: PAGE_SETTINGS.blog.href,
                width: 348,
                height: 240,
            },
        ]
    },
    {
        label: "Resources",
        position: "center",
        items: [
            {
                type: "menu",
                title: "Learn & Connect",
                menuItems: DATA_MENU_LEARN_CONNECT,
            },
            {
                type: "line"
            },
            {
                type: "menu",
                title: "Help & Support",
                menuItems: DATA_MENU_HELP_SUPPORT,
            },
        ]
    },
    {
        label: "Pricing",
        href: "/pricing",
    },
    {
        label: "Company",
        position: "right",
        items: [
            {
                type: "menu",
                title: "",
                menuItems: DATA_MENU_COMPANY,
            },
        ]
    },

]

interface HeaderItemContentProps {
    className?: string;
    data: (MenuSection | ImageSection | LineSection)[];
}

const ButtonCTA = ({ isDark = false }: { isDark?: boolean }) => {
    return (
        <>
            <Button
                hideIcon
                inline
                link
                variant={isDark ? 'transparent-white' : 'transparent-black'}
                className='!px-4 !py-2 xl:!py-2.5 xl:!px-5 !flex lg:!inline-flex'
                href={APP_URL}
            >
                Sign in
            </Button>
            <Button
                inline
                link
                variant={isDark ? 'green' : 'black'}
                className="!px-4 !py-2 xl:!py-2.5 xl:!px-5 !flex lg:!inline-flex"
                href={PAGE_SETTINGS.contact.href}
            >
                Request demo
            </Button>
        </>
    )
}

const HeaderItemContent: React.FC<HeaderItemContentProps> = ({ className, data }) => {
    return (
        <div className={`inline-block w-max p-6 rounded-[32px] bg-white border border-natural-gray-border shadow-[2px_2px_12px_0px_rgba(0,0,0,0.05)] ${className || ''}`}>
            <div className='flex item-center gap-x-6'>
                {data.map((item, index) => (
                    <div key={index}>
                        {item.type === "menu" && (
                            <div>
                                <h3 className='text-sm font-medium text-natural-gray-default'>{item.title}</h3>
                                <ul className={`mt-3 ${item.className || ''}`}>
                                    {item.menuItems.map((menuItem, index) => (
                                        <li className='group/menu mt-5 p-3 -mx-3 relative rounded-lg transition-all hover:bg-natural-navy' key={index}>
                                            <Link href={menuItem.href} target={menuItem.isExternal ? '_blank' : '_self'} className='absolute inset-0 z-10'></Link>
                                            <div className='flex items-start gap-x-2'>
                                                {menuItem.icon && (
                                                    <div className={`relative w-[24px] ${menuItem.hoverIcon ? 'mt-1' : ''}`}>
                                                        <img className='max-w-[24px] mx-auto' src={menuItem.icon} alt={menuItem.label} />
                                                        {menuItem.hoverIcon && <img className='max-w-[24px] absolute top-0 left-[50%] translate-x-[-50%] opacity-0 group-hover/menu:opacity-100 transition-opacity' src={menuItem.hoverIcon} alt={menuItem.label} />}
                                                    </div>
                                                )}
                                                {menuItem.circle && <div className='w-[10px] h-[10px] rounded-full' style={{ background: menuItem.circle }} />}
                                                <div>
                                                    <span className='text-base font-normal text-natural-black transition-colors group-hover/menu:text-white'>{menuItem.headerLabel || menuItem.label}</span>
                                                    <p className='font-normal text-xs text-natural-gray-default transition-colors mt-2 max-w-52 xl:max-w-80 group-hover/menu:text-white'>{menuItem.desc}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}


                        {item.type === "line" && (
                            <div className='relative w-[1px] -mt-6 bg-natural-gray-border' style={{ height: 'calc(100% + 48px)' }} />
                        )}


                        {item.type === "image" && (
                            <div className='w-full max-w-[348px]'>
                                {item.title && item.title !== '' && <h3 className='text-sm font-medium text-natural-gray-default'>{item.title}</h3>}
                                <Image
                                    unoptimized
                                    className={`max-w-[348px] w-full ${item.title && item.title !== '' ? 'mt-3' : ''}`}
                                    src={item.image}
                                    alt={item.title}
                                    width={item.width || 300}
                                    height={item.height || 300}
                                />
                                {item.subTitle && item.subTitle !== '' && <h3 className='text-lg font-semibold text-natural-black mt-4'>{item.subTitle}</h3>}
                                {item.desc && item.desc !== '' && <p className='text-sm font-medium text-natural-gray-default mt-3'>{item.desc}</p>}
                                {item.href && <Button
                                    hideIcon
                                    link
                                    inline
                                    href={item.href}
                                    className={`${item.buttonClassName || ''} mt-3`}
                                >
                                    {item.buttonText}
                                </Button>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

interface HeaderProps {
    className?: string;
    isDark?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDark = false }) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);



    const navItemClass = `font-medium text-sm ${isDark ? 'text-white' : 'text-natural-navy'} flex items-center gap-1 xl:gap-2`

    return (
        <header className={`h-24 fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 shadow-sm ${isDark ? 'bg-natural-green' : 'bg-white'}`}>
            <div className="max-w-[1304px] px-4 2xl:px-0 mx-auto h-full flex items-center justify-between">

                <div className='flex items-center gap-x-14'>
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2" aria-label="Field home">
                            <Image
                                unoptimized
                                src={isDark ? "/assets/images/landing/logo-white.svg" : "/assets/images/logo/dark.svg"}
                                alt="Field"
                                width={668}
                                height={575}
                                className="h-12 w-12"
                            />
                            <span className={`text-2xl font-semibold leading-none ${isDark ? 'text-white' : 'text-natural-navy'}`}>
                                Field
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav aria-label="Main navigation" className="hidden lg:block h-full">
                        <ul className="flex h-full items-center gap-x-7 xl:gap-x-8" role="menubar">

                            {headerData.map((item, index) => (
                                <li key={index} className={`${item.position === 'left' || item.position === 'right' ? 'relative' : ''} h-full flex items-center group`}>
                                    {
                                        item.href && (<Link href={item.href} className={navItemClass}>{item.headerLabel || item.label}</Link>)
                                    }

                                    {
                                        item.items && item.items.length > 0 && (
                                            <>
                                                <button
                                                    type="button"
                                                    className={`${navItemClass} relative`}
                                                    aria-expanded="false"
                                                    aria-haspopup="true"
                                                >
                                                    {item.headerLabel || item.label}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>

                                                    {/* div to fix the issue of the dropdown menu not showing when hovering over the button */}
                                                    <div className='absolute top-full left-0 w-full h-1 group-hover:h-8 bg-transparent'></div>
                                                </button>
                                                <div className={`absolute invisible pointer-events-none group-hover:visible group-hover:pointer-events-auto top-full pt-9 
                                                    opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0
                                                    transition-all duration-200 ease-out
                                                    ${item.position === 'center' ? 'left-1/2 -translate-x-1/2 -mt-9' : item.position === 'right' ? 'left-0' : 'right-0'}`}>
                                                    <HeaderItemContent data={item.items} />
                                                </div>

                                            </>
                                        )
                                    }
                                </li>
                            ))}

                        </ul>
                    </nav>
                </div>

                {/* Hamburger Menu Button */}
                <button
                    type="button"
                    className="lg:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke={isDark ? "white" : "currentColor"} viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>



                {/* Desktop CTA Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <ButtonCTA isDark={isDark} />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} fixed inset-0 top-24 ${isDark ? 'bg-natural-green' : 'bg-white'} z-50 overflow-y-auto min-h-[calc(100vh-6rem)]`}>
                <div className="container mx-auto px-4 py-6 h-full">
                    <nav className="space-y-6">
                        {headerData.map((headerItem, index) => (
                            <div key={index}>
                                {headerItem.href ? (
                                    <Link href={headerItem.href} className={`block py-2 ${isDark ? 'text-white' : 'text-natural-navy'} font-medium`}>
                                        {headerItem.headerLabel || headerItem.label}
                                    </Link>
                                ) : headerItem.items ? (
                                    <div>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-between w-full py-2 ${isDark ? 'text-white' : 'text-natural-navy'}`}
                                            onClick={() => setOpenDropdown(openDropdown === headerItem.label ? null : headerItem.label)}
                                            aria-expanded={openDropdown === headerItem.label}
                                            aria-controls={`mobile-${headerItem.label.toLowerCase()}-menu`}
                                        >
                                            <span className="font-medium">{headerItem.headerLabel || headerItem.label}</span>
                                            <svg
                                                className={`w-4 h-4 transform transition-transform ${openDropdown === headerItem.label ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openDropdown === headerItem.label && (
                                            <div id={`mobile-${headerItem.label.toLowerCase()}-menu`} className="mt-2 pl-4">
                                                {headerItem.items.map((section, sectionIndex) => (
                                                    section.type === "menu" && (
                                                        <div key={sectionIndex} className="mb-6">
                                                            {section.title && (
                                                                <h3 className={`text-sm font-medium ${isDark ? 'text-auxiliary-blue-tint' : 'text-natural-gray-default'} mb-2`}>{section.title}</h3>
                                                            )}
                                                            <ul className="space-y-4">
                                                                {section.menuItems.map((menuItem, menuItemIndex) => (
                                                                    <li key={menuItemIndex}>

                                                                        <Link href={menuItem.href} className="block py-2" target={menuItem.isExternal ? '_blank' : '_self'} onClick={() => setIsMobileMenuOpen(false)} >

                                                                            <div className="flex items-start gap-x-2">
                                                                                {menuItem.icon && (
                                                                                    <img className="max-w-[24px]" src={menuItem.icon} alt={menuItem.label} />
                                                                                )}
                                                                                {menuItem.circle && <div className='w-[10px] h-[10px] rounded-full' style={{ background: menuItem.circle }} />}
                                                                                <div>
                                                                                    <div className={`font-medium ${isDark ? 'text-auxiliary-blue-tint' : 'text-natural-navy'}`}>{menuItem.headerLabel || menuItem.label}</div>
                                                                                    <div className={`text-sm ${isDark ? 'text-white' : 'text-natural-gray-default'}`}>{menuItem.desc}</div>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {/* Mobile CTA Buttons */}
                        <div className="space-y-4 pt-6">
                            <ButtonCTA isDark={isDark} />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
