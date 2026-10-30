import { ChevronRight } from "@landing/components/Icons";
import { ButtonProps } from "@landing/interfaces/global/components.interfaces";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type NativeAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const Button: React.FC<ButtonProps & (NativeButtonProps | NativeAnchorProps)> = ({
    hideIcon = false,
    className,
    children = 'Start Trial',
    link = false,
    href,
    target,
    inline = false,
    iconClass,
    variant = "black",
    noBorder = false,
    ...restProps
}) => {

    const baseClassName = "flex items-center justify-center text-sm font-medium py-2.5 px-5 rounded-xl transition-all duration-300 ease-in-out";


    const variantBorderClassName = {
        "transparent-white": "border border-white",
        "transparent-black": "border border-natural-navy",
    }

    const variantClassName = {
        white: "bg-white text-nature-black hover:bg-nature-black hover:text-white",
        black: "bg-natural-navy text-white hover:bg-white hover:text-natural-navy border border-transparent hover:border-natural-navy",
        green: "bg-[linear-gradient(0deg,#82FF57,#82FF57),linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-nature-black hover:brightness-95",
        transparent: "bg-transparent text-natural-navy hover:bg-natural-gray-bg",
        "transparent-white": "bg-transparent text-white hover:bg-white hover:text-natural-navy",
        "transparent-black": "bg-transparent text-natural-navy hover:bg-natural-gray-bg",
    }


    const iconBaseClassName = `ml-3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1`;


    const btnClassNames = `${baseClassName} ${variantClassName[variant]} ${noBorder ? '' : (variantBorderClassName[variant as keyof typeof variantBorderClassName] || '')}`;


    const sharedClassName = `${inline ? 'w-auto inline-flex' : 'w-full flex'} ${btnClassNames} ${className}`;

    if (link) {
        return <>
            <a href={href} target={target} className={`group ${sharedClassName}`} {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
                {!hideIcon && <ChevronRight className={`${iconBaseClassName} ${iconClass || ''}`} />}
            </a>
        </>;
    }

    return <>
        <button 
            type="button"
            className={`group ${sharedClassName}`} 
            {...(restProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
            {!hideIcon && <ChevronRight className={`${iconBaseClassName} ${iconClass || ''}`} />}
        </button>
    </>;
};

export default Button;
