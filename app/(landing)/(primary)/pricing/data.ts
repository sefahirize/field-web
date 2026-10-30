interface Credit {
    title: string;
    numb: string;
    numbBold: boolean;
    desc: string;
}

export interface ExploreItem {
    title: string;
    list: string[];
    credit: Credit;
}

export interface ExploreSection {
    items: ExploreItem[];
}

export const exploreData: ExploreSection[] = [
    {
        items: [
            {
                title: "HR Parser",
                list: [
                    "Our most intelligent model to date",
                    "Supports any file format, and OCR",
                    "Market leading 95% accuracy"
                ],
                credit: {
                    title: "Credit per file",
                    numb: "1",
                    numbBold: false,
                    desc: ""
                }
            },
            {
                title: "Job Parser",
                list: [
                    "Our most intelligent model to date ",
                    "Extract soft, hard and enriched skills",
                    "Market leading 95% accuracy",
                ],
                credit: {
                    title: "Credit per file",
                    numb: "1",
                    numbBold: false,
                    desc: ""
                }
            },
            {
                title: "Finance Parser / Field Fin",
                list: [
                    "Highly accurate in parsing numbers",
                    "Supports any file format incl. receipts",
                    "Market leading 95% accuracy",
                ],
                credit: {
                    title: "Credit per file",
                    numb: "1",
                    numbBold: false,
                    desc: ""
                }
            }
        ]
    },
    {
        items: [
            {
                title: "AI Matching",
                list: [
                    "Match and rank with Deep Learning",
                    "Beyond Keyword matching",
                    "multiple integration options",
                ],
                credit: {
                    title: "Credits",
                    numb: "2+1*",
                    numbBold: false,
                    desc: "* 2 credit per search plus 1 credit for each resume  If you match 1 job against 100 candidates the total number of credits used will be 102"
                }
            },
            {
                title: "Field IQ",
                list: [
                    "Our most intelligent model to date",
                    "Summarize resumes, and create Interview question",
                    "Both in dashboard and API level"
                ],
                credit: {
                    title: "Credit per Req.",
                    numb: "2",
                    numbBold: false,
                    desc: ""
                }
            }
        ]
    },
    {
        items: [
            {
                title: "Field Lumina",
                list: [
                    "Pre-build model for AI agents and Enterprise search",
                    "Supported by RAG and Field LLM",
                    "Market leading 95% accuracy",
                ],
                credit: {
                    title: "Credit per file",
                    numb: "1",
                    numbBold: false,
                    desc: ""
                }
            }
        ]
    }
]