"use client";

import { useState } from "react";

interface FaqItemProps {
    question: string;
    answer: string;
    className?: string;
}

const FaqItem = ({ question, answer, className = "" }: FaqItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-white rounded-lg px-6 py-5 ${className}`}>
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-base sm:text-lg font-medium text-natural-navy leading-6 sm:leading-7">{question}</h3>
                <span className={`ml-3 shrink-0 py-[11px] px-[14px] transition-transform duration-200 text-natural-gray-default border rounded-full border-natural-gray-border ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div
                className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <p className="pb-6 text-gray-600 mt-5">{answer}</p>
            </div>
        </div>
    );
};


export default FaqItem;