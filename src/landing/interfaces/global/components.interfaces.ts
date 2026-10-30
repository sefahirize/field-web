export type ButtonVariant = "white" | "black" | "green" | "transparent" | "transparent-white" | "transparent-black";

export interface ButtonProps {
    hideIcon?: boolean;
    className?: string;
    children?: React.ReactNode;
    link?: boolean;
    href?: string;
    target?: string;
    inline?: boolean;
    iconClass?: string;
    variant?: ButtonVariant;
    iconHoverClass?: string;
    hoverClassName?: string;
    noBorder?: boolean;
}