import { Section, SectionHeader } from "@landing/components/Global";
import { SolutionsGrid } from "@landing/components/Global";
import { Button } from "@landing/components/Ui";
import { ButtonVariant } from "@landing/interfaces/global/components.interfaces";
interface Feature {
    title: string;
    content?: string;
    type?: "list";
    items?: string[];
    className?: string;
    pClassName?: string;
    icon: {
        bg: string;
        dot?: string;
    };
}

interface Link {
    text: string;
    href: string;
    target?: string;
    linkClass?: string;
    variant?: ButtonVariant;
}

interface Props {
    title?: string;
    titleClassName?: string;
    text?: string;
    textClassName?: string;
    link?: Link;
    features?: Feature[];
    sectionClassName?: string;
    children?: React.ReactNode;
}

const AiSolutions: React.FC<Props> = ({ title, titleClassName, link, features, sectionClassName, children, text, textClassName }) => {
    return (
        <Section className={sectionClassName}>
            <SectionHeader
                title={title}
                titleClassName={titleClassName}
                bottomSpace={title ? true : false}
                text={text}
                textClassName={textClassName}
            >
                {link && <Button variant={link.variant || "black"} className={`mt-10 ${link.linkClass}`} inline link href={link.href} target={link.target}>{link.text}</Button>}
            </SectionHeader>
            <div className="px-3 xl:px-0">
                <SolutionsGrid columns={3} data={features || []} />
            </div>
            {children}
        </Section>
    )
}

export default AiSolutions;