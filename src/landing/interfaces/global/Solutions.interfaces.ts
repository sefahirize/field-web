export interface Icon {
    bg: string;
    dot?: string;
}

export interface Feature {
    title: string;
    content?: string;
    type?: "list";
    items?: string[];
    icon: Icon;
    className?: string;
    pClassName?: string;
    pParentClassName?: string;
    html?: React.ReactNode | null;
    link?: {
        href: string;
        target: string;
        text: string;
    }
}

export interface SolutionsGridItemProps {
    feature: Feature;
    index: number;
    className?: string;
}