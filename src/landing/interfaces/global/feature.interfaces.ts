import { ButtonProps } from "@landing/interfaces/global/components.interfaces";

export interface ContentListItem {
    icon?: React.ReactNode;
    borderTop?: boolean;
    head: string;
    content?: string | React.ReactNode;
    html?: boolean;
    className?: string;
    children?: string | React.ReactNode;
    contentClassName?: string;
    headClassName?: string;
    link?: string;
    spaceX?: boolean;
}

export interface Button extends ButtonProps {
    text: string;
    type: 'link' | 'button';
    spaceX?: boolean;
}

export interface Image {
    html?: React.ReactNode;
    parentClass?: string;
    bg?: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
        className?: string;
    };
    inner?: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
        className?: string;
    };
}

export interface FeatureCardProps {
    type?: 'vertical' | 'horizontal' | 'horizontal-reverse';
    title?: string;
    titleClassName?: string;
    gridClassName?: string;
    image?: Image;
    customImage?: React.ReactNode;
    contentList: ContentListItem[];
    buttons?: Button[];
    contentMainClassName?: string;
    endCustomHtml?: React.ReactNode;
}
