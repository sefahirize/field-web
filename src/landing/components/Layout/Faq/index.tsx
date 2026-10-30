import { Section, SectionHeader } from "@landing/components/Global";
import { ReactIcon } from "@landing/components/Icons";
import FaqItem from "./FaqItem";

const faqData = [
    {
        question: "What distinguishes Field from other HR parsing APIs?",
        answer: "Field offers superior accuracy, extensive data extraction capabilities, and specialized parsing for various resume formats. Our API provides detailed structured data including skills, experience, education, and more, with industry-leading accuracy rates."
    },
    {
        question: "How is Field priced, what is the cost of parsing a resume",
        answer: "Field uses a credit-based pricing system. Each resume parse costs one credit. We offer flexible pricing tiers based on volume, with packages starting from X credits. Contact our sales team for detailed pricing information."
    },
    {
        question: "What happens if I use more credits than the number purchased?",
        answer: "If you exceed your purchased credits, your API access will be temporarily paused until you purchase additional credits. We'll notify you before you run out of credits to ensure uninterrupted service."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. For enterprise customers, we also support wire transfers and purchase orders."
    },
    {
        question: "How can I get started with a free trial of the Field API",
        answer: "You can sign up for a free trial on our website. The trial includes X credits to test our API functionality. No credit card is required for the trial period."
    }
];

const Faq = () => {
    return (
        <Section className="!pb-0">
            <SectionHeader
                title="Frequently Asked Questions"
                text="Everything you need to know about Field APIs, integrations and pricing."
                tagIcon={<ReactIcon className="text-dark-secondary" />}
                tagText="FAQ"
                bottomSpace
            />
            <div className="bg-natural-gray-bg py-14 px-3 xl:px-0">
                <div className="max-w-4xl mx-auto">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            className={index < faqData.length - 1 ? "mb-5" : ""}
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Faq;
