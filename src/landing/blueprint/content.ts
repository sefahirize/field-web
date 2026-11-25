import { ROUTES } from "@shared/contract";

/**
 * Copy and links of the Blueprint pages (header, footer, home), kept apart
 * from the markup so the boss's notes can be applied in one place.
 */

/** A page of the new landing that is not built yet. Search for it to find them all. */
const NOT_BUILT = "#";

export const LINKS = {
  home: "/",
  signUp: ROUTES.register,
  logIn: ROUTES.login,
  dashboard: ROUTES.dashboard,
  // Old-design pages that exist today; they move to the new design later.
  pricing: "/pricing",
  contact: "/contact",
  about: "/about-us",
  blog: "/blogs",
  // Sections of the home page.
  how: "#how",
  products: "#products",
  industries: "#industries",
  // Pages of the Blueprint that are not built yet.
  useCase: NOT_BUILT,
  docs: NOT_BUILT,
  developers: NOT_BUILT,
  security: NOT_BUILT,
  status: NOT_BUILT,
  docDebt: NOT_BUILT,
  customers: NOT_BUILT,
  careers: NOT_BUILT,
  announcements: NOT_BUILT,
  privacy: NOT_BUILT,
  terms: NOT_BUILT,
  dpa: NOT_BUILT,
  llms: NOT_BUILT,
  sitemap: NOT_BUILT,
} as const;

const ICONS = "/assets/icons/products";

export type Product = { name: string; desc: string; icon: string };

export const PRODUCTS: Product[] = [
  { name: "CV Parser", desc: "Structured data from CVs and résumés.", icon: `${ICONS}/cv-parser.png` },
  { name: "Invoice Parser", desc: "Invoice data, extracted and structured automatically.", icon: `${ICONS}/invoice-parser.png` },
  { name: "Document Parser", desc: "Structured data from PDF, Word and other documents.", icon: `${ICONS}/document-parser.svg` },
  { name: "OCR", desc: "Text from images and scanned documents.", icon: `${ICONS}/ocr.svg` },
  { name: "Text Summarizer", desc: "Long text, summarised by AI.", icon: `${ICONS}/text-summarizer.svg` },
  { name: "Translation", desc: "AI-assisted text translation.", icon: `${ICONS}/translation.svg` },
  { name: "Speech to Text", desc: "Audio recordings, turned into text.", icon: `${ICONS}/speech-to-text.svg` },
  { name: "Image Analysis", desc: "Images analysed by AI.", icon: `${ICONS}/image-analysis.svg` },
  { name: "Embedding", desc: "Text turned into vector embeddings for search.", icon: `${ICONS}/embedding.svg` },
  { name: "AI Model", desc: "General-purpose AI model access.", icon: `${ICONS}/ai-model.svg` },
];

export type Industry = { name: string; desc: string; icon: string; docs: string[]; href: string };

export const INDUSTRIES: Industry[] = [
  {
    name: "HR and recruiting",
    desc: "CVs and applications, turned into candidate profiles.",
    icon: `${ICONS}/cv-parser.png`,
    docs: ["CVs", "Cover letters", "Certificates"],
    href: LINKS.useCase,
  },
  {
    name: "Finance",
    desc: "Invoices and receipts, read into line items and totals.",
    icon: `${ICONS}/invoice-parser.png`,
    docs: ["Invoices", "Receipts", "Statements"],
    href: LINKS.useCase,
  },
  {
    name: "Healthcare",
    desc: "Forms, referrals and reports, as structured records.",
    icon: `${ICONS}/document-parser.svg`,
    docs: ["Intake forms", "Referrals", "Lab reports"],
    href: LINKS.useCase,
  },
  {
    name: "Insurance",
    desc: "Claim forms and photos, read and sorted.",
    icon: `${ICONS}/image-analysis.svg`,
    docs: ["Claim forms", "Policies", "Damage photos"],
    href: LINKS.useCase,
  },
  {
    name: "Legal",
    desc: "Contracts and filings, summarised and searchable.",
    icon: `${ICONS}/text-summarizer.svg`,
    docs: ["Contracts", "Filings", "NDAs"],
    href: LINKS.useCase,
  },
  {
    name: "Real estate",
    desc: "Leases and deeds, searchable by what they say.",
    icon: `${ICONS}/embedding.svg`,
    docs: ["Leases", "Deeds", "Listings"],
    href: LINKS.useCase,
  },
  {
    name: "Supply chain",
    desc: "Delivery notes and customs papers, in any layout.",
    icon: `${ICONS}/ocr.svg`,
    docs: ["Delivery notes", "Bills of lading", "Customs forms"],
    href: LINKS.useCase,
  },
];

export type IconName =
  | "code"
  | "shield"
  | "pulse"
  | "pen"
  | "layers"
  | "people"
  | "book"
  | "flag"
  | "briefcase"
  | "chat"
  | "megaphone";

export type MenuLink = { label: string; desc: string; href: string; icon: IconName };

export const RESOURCES_MENU: { title: string; links: MenuLink[] }[] = [
  {
    title: "Build",
    links: [
      { label: "Developers", desc: "API keys, requests and examples.", href: LINKS.developers, icon: "code" },
      { label: "Security", desc: "How your files and keys are handled.", href: LINKS.security, icon: "shield" },
      { label: "Changelog and status", desc: "What shipped, and how the API is running.", href: LINKS.status, icon: "pulse" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Blog", desc: "Notes on documents, data and the product.", href: LINKS.blog, icon: "pen" },
      { label: "Document debt", desc: "What data stuck in documents costs a team.", href: LINKS.docDebt, icon: "layers" },
      { label: "Customers", desc: "How teams put Field to work.", href: LINKS.customers, icon: "people" },
    ],
  },
];

export const ABOUT_MENU: MenuLink[] = [
  { label: "Team and story", desc: "Who builds Field, and why.", href: LINKS.about, icon: "flag" },
  { label: "Careers", desc: "Open roles on the team.", href: LINKS.careers, icon: "briefcase" },
  { label: "Contact and demo", desc: "Talk to us or book a demo.", href: LINKS.contact, icon: "chat" },
  { label: "Announcements", desc: "News from the company.", href: LINKS.announcements, icon: "megaphone" },
];

export const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "CV Parser", href: LINKS.products },
      { label: "Invoice Parser", href: LINKS.products },
      { label: "Document Parser", href: LINKS.products },
      { label: "OCR", href: LINKS.products },
      { label: "All ten products", href: LINKS.products },
    ],
  },
  {
    title: "Use cases",
    links: INDUSTRIES.map(industry => ({ label: industry.name, href: industry.href })),
  },
  {
    title: "Resources",
    links: [
      { label: "Developers", href: LINKS.developers },
      { label: "Docs", href: LINKS.docs },
      { label: "Security", href: LINKS.security },
      { label: "Changelog and status", href: LINKS.status },
      { label: "Blog", href: LINKS.blog },
      { label: "Document debt", href: LINKS.docDebt },
      { label: "Customers", href: LINKS.customers },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team and story", href: LINKS.about },
      { label: "Careers", href: LINKS.careers },
      { label: "Contact and demo", href: LINKS.contact },
      { label: "Announcements", href: LINKS.announcements },
      { label: "Pricing", href: LINKS.pricing },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: "Privacy", href: LINKS.privacy },
  { label: "Terms", href: LINKS.terms },
  { label: "DPA", href: LINKS.dpa },
  { label: "llms.txt", href: LINKS.llms },
  { label: "Sitemap", href: LINKS.sitemap },
];

export const CONTROLS = [
  {
    icon: "lock",
    title: "Test and Production keys",
    text: "Separate keys for building and for live traffic, each with the expiry you choose, or none.",
  },
  {
    icon: "shieldCheck",
    title: "Secrets shown once",
    text: "A key's secret appears only when it is created. Regenerate it any time and the old one stops working.",
  },
  {
    icon: "document",
    title: "Every document on record",
    text: "Each file keeps its status, its result and an activity log. Identical files are answered from cache.",
  },
  {
    icon: "chart",
    title: "Spend you can follow",
    text: "Analytics shows usage by product over time, and Credit history lists every credit added or spent.",
  },
] as const;

export const CREDIT_POINTS = [
  "The unit price falls as the quantity rises",
  "See the total before you pay; pay by card through Stripe",
  "Run out on one product and credits from another are converted, so files keep going",
];

export const FAQ = [
  {
    q: "Which files can I send, and how large?",
    a: "PDF, JPG, PNG, DOC and DOCX, up to 6 MB each. Send several at once; a file of the wrong type or size is turned away on its own and the rest still go through.",
  },
  {
    q: "How do credits work?",
    a: "Each product has its own credit balance, and every file spends credits from the product you chose. If that product has none left, credits from another one are converted so the file can still be processed.",
  },
  {
    q: "Do I need a developer?",
    a: "No. Drag files into the dashboard and open each result there. Developers send the same files with an API key in the X-API-Key header.",
  },
  {
    q: "What is the difference between Test and Production keys?",
    a: "Test keys are for building and trying things out, Production keys for applications that are live. You choose when you create a key, and you can give each one an expiry.",
  },
  {
    q: "Where can I see what I have used?",
    a: "Analytics shows usage and spend by week, month or year with a breakdown by product. Credit history lists every credit added to or taken from your account.",
  },
];
