/* import IconAgency from '@public//assets/icons/menu/agency.svg';
import IconCode from '@public//assets/icons/menu/code.svg';
import IconEnterprise from '@public//assets/icons/menu/enterprise.svg';
import IconVendors from '@public//assets/icons/menu/vendors.svg';

import IconIntegration from '@public//assets/icons/menu/integration.svg';
import IconDocuments from '@public//assets/icons/menu/documents.svg'; */

/* import IconBlog from '@public//assets/icons/menu/blog.svg';
import IconTutorial from '@public//assets/icons/menu/tutorial.svg';
import IconLifeBuoy from '@public//assets/icons/menu/lifebuoy.svg';
import IconHeadset from '@public//assets/icons/menu/headset.svg';

import IconContact from '@public//assets/icons/menu/contact.svg';
import IconInfo from '@public//assets/icons/menu/info.svg';
import IconJoinUs from '@public//assets/icons/menu/join-us.svg'; */

import IconFacebook from '@public/assets/icons/facebook.svg';
import IconInstagram from '@public/assets/icons/instagram.svg';
import IconLinkedin from '@public/assets/icons/linkedin.svg';
import IconTwitter from '@public/assets/icons/twitter.svg';
import IconLink from '@public/assets/icons/link.svg';
import IconEmail from '@public/assets/icons/email.svg';
import IconCopy from '@public/assets/icons/copy.svg';

import LogoMahired from '@public/assets/images/landing/brands/mahired.svg';
import LogoPairedSourcing from '@public/assets/images/landing/brands/paired-sourcing.svg';

// Mailchimp settings live in the server-only src/landing/lib/mailchimp.ts.

/** Public marketing site (this repo). App product URLs use APP_URL (.hr). */
export const WEBSITE_DOMAIN = 'https://www.joinfield.ai';
export const API_DOMAIN = 'https://blog.hirize.ai';
/** WordPress REST API base (no trailing slash), e.g. https://blog.hirize.ai/wp-json/wp/v2 */
export const WORDPRESS_REST_API_BASE = 'https://blog.hirize.ai/wp-json/wp/v2';
// Product app URL. Defaults to prod (.hr). For local dev against a locally
// running dashboard, set NEXT_PUBLIC_APP_URL in .env.local (e.g.
// NEXT_PUBLIC_APP_URL=http://localhost:3001). .env.local is gitignored.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.hirize.hr';
export const APP_TEST_URL = 'http://localhost:3001/';
export const API_URL_PROD = 'https://connect.hirize.hr';
export const API_URL_DEV = 'https://dashboard.dev.hirize.hr:8443';

export const DOCUMENTATION_URL = 'https://hirize.gitbook.io/hirize';

export const RESUME_PARSER_DEMO_URL = '/solutions/resume-parser';

export const WARNING_REQUIRED = 'This is required!';
export const DASHBOARD_API_URL = 'https://connect.hirize.hr/api';
export const DASHBOARD_API_URL_DEV = 'https://dashboard.dev.hirize.hr:8443/api';
export const HELP_CENTER_URL = 'https://intercom.help/hirize/en/';
export const PAGE_SETTINGS = {
  homepage: {
    name: 'Home',
    href: '/',
    title: 'Field | AI-Powered Document Data Extraction',
    desc: 'AI-powered document intelligence platform for resume, invoice and enterprise data extraction with high-accuracy parsing and workflow automation.',
    keywords: 'ai data extraction, document parsing, pdf to json, workflow automation, enterprise api, healthcare, finance'
  },
  ai_agents: {
    name: 'Lumina/AI agent',
    href: '/ai-agents',
    title: 'Field Lumina | AI Agents for Document Workflows',
    desc: 'Automate multi-step enterprise workflows with AI agents built for document intelligence and data operations.',
    keywords: 'lumina, ai agent, workflow automation, enterprise search, gpt-based solutions'
  },
  hirize_parser_demo: {
    name: 'Parser Demo',
    href: '/hirize-parser-demo',
    title: 'Field Parser Demo | Field',
    desc: 'Field Parser Demo | Field',
  },
  contact: {
    name: 'Contact',
    href: '/contact',
    title: 'Contact Us | Field',
    desc: 'Talk to the Field team about AI-powered document intelligence, automation and enterprise integrations.',
    keywords: 'contact, sales, support, partnership, ai data extraction, solutions'
  },
  blog: {
    name: 'Blog',
    href: '/blogs',
    title: 'AI & Data Extraction Blog | Field',
    desc: 'Insights on AI document processing, OCR, workflow automation and enterprise document intelligence.',
    keywords: 'ai blog, data extraction tips, multi-industry solutions, pdf to json, insights'
  },
  pricing: {
    name: 'Pricing',
    href: '/pricing',
    title: 'Pricing | Field',
    desc: 'Choose the plan that best fits your data extraction needs—whether you’re a startup or an enterprise. Try our free trial for AI-based document parsing.',
    keywords: 'pricing, ai data extraction plans, pay-as-you-go, enterprise, free trial, pdf to json'
  },
  // PRODUCTS
  resume_parser: {
    name: 'Parser',
    href: '/solutions/resume-parser',
    title: 'AI Document Parser | Field',
    desc: 'Convert resumes, invoices and unstructured documents into structured JSON with industry-leading AI parsing accuracy.',
    keywords: 'parser, ai document parsing, data extraction, pdf to json, finance, healthcare, hr'
  },
  ai_matching: {
    name: 'AI Matching',
    href: '/solutions/ai-matching-api',
    title: 'AI Document Matching | Field',
    desc: `AI-powered candidate matching API to rank, score and identify the best-fit talent for every role instantly.`,
    keywords: 'ai matching, document matching, data classification, multi-industry, machine learning'
  },
  hr_docs: {
    name: 'Field Docs',
    href: '/solutions/data-extraction-hr-docs-api',
    title: 'Field HR Docs API | Data Extraction & Streamlined Operations',
    desc: `Effortlessly extract valuable data from HR documents with Field HR Docs' API and improve your HR operations with ease`,
  },
  data_ai: {
    name: 'Field DataAI',
    href: '/solutions/hiring-retention-data-ai',
    title: `Field DataAI | Predictive Analytics for Hiring & Retention`,
    desc: `Field DataAI, Predictive analytics & AI reveal how long your top candidate will stay, Make informed hiring decisions and reduce turnover`,
  },
  hirize_iq: {
    name: 'IQ',
    href: '/solutions/hirize-iq-ai-summary-generator',
    title: `Field IQ | Generate Summaries & Insights`,
    desc: 'Generate AI-powered interview questions, summaries and hiring insights from resumes and job descriptions.',
    keywords: 'field iq, ai summaries, generative ai, data insights, multi-industry'
  },
  logic: {
    name: 'Field Logic',
    href: '/solutions/hirize-logic-data-enrichment',
    title: `Enriching Resume Data for Superior Matches | Field Logic`,
    desc: `Enhance your recruitment process with Field Logic, Unlock 60% more skills & gain deeper insights with our AI-powered software`,
  },
  // LANDING PAGE
  landing_hirize_iq: {
    name: 'Field IQ',
    href: '/landing/hirize-automated-interview-questions',
    title: `Create interview question and summaries | Field IQ`,
    desc: `Revolutionize your recruitment process with Field IQ - the ultimate AI-powered tool for creating tailored candidate summaries and interview questions in record time`,
  },
  landing_parser: {
    name: 'Parser',
    href: '/landing/ai-resume-parser',
    title: `Resume Parsing Software | Field`,
    desc: `Parse resumes effectively with Field's advanced Resume Parser API and tools, Our software utilizes GPT, AI, NLP and OCR`,
  },
  landing_for_developers: {
    name: 'For Developers',
    href: '/landing/developers-advanced-hr-ai',
    title: `"Build Smarter HR Solutions | Field for Developers"`,
    desc: `Transform HR solutions with Field's advanced AI technology, Join our developer community & access top-notch tools to build smarter faster`,
  },
  // OTHER PAGES
  integration: {
    name: 'Integration',
    href: '/integration',
    title: 'Integration | AI Document Parsing by Field',
    desc: 'Seamlessly integrate Field’s AI document parsing into your existing systems. Automate workflows, trigger data extractions, and enhance productivity.',
    keywords: 'integration, ai api, workflow automation, data extraction, webhooks, pdf to excel/json'
  },
  enterprise: {
    name: 'Enterprise',
    href: '/ai-enterprise-solutions',
    title: 'Enterprise Data Extraction | Field',
    desc: 'Enterprise-grade AI document processing platform built for scalable automation, accuracy and security.',
    keywords: 'enterprise solutions, large-scale document parsing, data automation, compliance, ai-based extraction'
  },
  startups: {
    name: 'Startup',
    href: '/startup-growth',
    title: 'AI Solutions for Startups | Field',
    desc: 'Launch AI-powered document parsing and workflow automation faster with scalable APIs built for startups.',
    keywords: 'startup solutions, ai data parsing, cost-effective, pdf to json, innovation, early-stage'
  },
  for_developers: {
    name: 'Developers',
    href: '/developer-tools',
    title: 'Developer Tools & APIs | Field',
    desc: 'Developer-first document intelligence APIs for parsing, OCR, extraction and enterprise AI automation.',
    keywords: 'developer api, ai-based data extraction, dev tools, integration, rest api, multi-industry'
  },
  hr_vendors_agencies: {
    name: 'Developers',
    href: '/ml-ocr-hr-solution',
    title: 'Developer Tools & APIs | Field',
    desc: 'Build powerful integrations using Field’s AI-based data extraction APIs. Access documentation, sample code, and developer tools for a seamless workflow in any sector.',
    keywords: 'developer api, ai-based data extraction, dev tools, integration, rest api, multi-industry'
  },
  join_us: {
    name: 'Join Us',
    href: '/careers',
    title: `Join the Field Team| Field`,
    desc: `Join the Field team and revolutionize recruitment, explore our career opportunities to drive innovation in the industry!`,
  },
  api_documentation: {
    name: 'Documentation',
    href: DOCUMENTATION_URL,
    title: 'API Documentation | Field',
    desc: 'Explore our comprehensive API docs. Learn how to implement Field’s AI-driven data extraction.',
    keywords: 'api documentation, data extraction api, dev guide, finance, healthcare, hr'
  },
  tutorials: {
    name: 'Tutorials',
    href: '/tutorials',
    /*    href: COMING_SOON_URL, */
    title: 'AI Data Extraction Tutorials | Field',
    desc: 'Follow step-by-step tutorials to master Field’s AI data extraction. Perfect for finance, healthcare, HR, and beyond—no coding experience required.',
    keywords: 'ai tutorials, data extraction guides, pdf to json, no-code solutions, multi-industry'
  },
  about: {
    name: 'About',
    href: '/about-us',
    title: `About Us | Field`,
    desc: 'Discover Field’s mission, values, and team behind our advanced AI document parsing platform—serving finance, healthcare, HR, and more.',
    keywords: 'about field, company mission, data extraction, ai solutions, multi-industry'
  },
  NotFound404: {
    name: '404',
    title: `404 Not Found | Field`,
    desc: `404 Not Found | Field`,
  },
  // STATIC PAGES
  PrivacyNotice: {
    name: 'Privacy notice',
    href: '/privacy-notice',
    title: 'Privacy Notice | Field',
    desc: 'Discover how Field handles your data with the utmost care. Learn about our commitment to privacy, GDPR compliance, and data security.',
    keywords: 'privacy notice, data protection, gdpr, compliance, security, field'
  },
  TermOfUse: {
    name: 'Term of Use',
    href: '/terms-of-use',
    title: 'Term of Use | Field',
    desc: 'Review our legal terms and conditions. By using Field, you agree to our guidelines for AI-based data extraction services.',
    keywords: 'terms of use, legal, agreement, field, policies'
  },

  CookiePolicy: {
    name: 'Cookie policy',
    href: '/cookie-policy',
    title: `Cookie Policy | Field`,
    desc: 'Understand how Field uses cookies to enhance your browsing experience. Learn how to manage and customize your preferences.',
    keywords: 'cookie policy, data collection, user preferences, compliance, field'
  },
  Security: {
    name: 'Security',
    href: '/security',
    title: `Security | Field`,
    desc: 'Explore how Field protects your data with robust encryption, compliance measures, and best-in-class security protocols—across industries.',
    keywords: 'security, data encryption, secure processing, compliance, field, enterprise'
  },
  TermsOfServiceAgreement: {
    name: 'Term of Use',
    href: '/terms-of-service-agreement',
    title: 'Term of Use | Field',
    desc: 'Review our legal terms and conditions. By using Field, you agree to our guidelines for AI-based data extraction services.',
    keywords: 'terms of use, legal, agreement, field, policies'
  },
};
export const DATA_CUSTOMER_STORIES = [
  {
    id: 0,
    name: 'paired-sourcing',
    title: 'PAIRED SOURCING',
    logo: LogoPairedSourcing,
    customer_message: `"With Field, we experienced an impressive increase in qualified applicants - a massive 30% jump! Streamlining our recruiting process has never been more successful."`,
    customer_name: 'Jer Langhans',
    customer_title: 'Paired Sourcing',
    customer_picture: '/images/customer-story-1.png',
  },
  {
    id: 1,
    name: 'mahired',
    title: 'mahired',
    logo: LogoMahired,
    customer_message: `"The integration process was seamless, thanks to the dedicated 24/7 support team at Field. The convenience provided made it possible for us to reach our goals quickly and with ease!"`,
    customer_name: 'Patricia Jones',
    customer_title: 'Mahired',
    customer_picture: '/images/customer-story-2.png',
  },
];

export const DATA_MENU_SOLUTIONS = [
  {
    id: 1,
    href: PAGE_SETTINGS.enterprise.href,
    label: PAGE_SETTINGS.enterprise.name,
    desc: 'Solutions for large HR teams who innovate at scale',
    /* icon: <IconEnterprise />, */
    // icon: '/assets/icons/menu/enterprise.svg',
    circle: "#3A5AFF"
  },
  {
    id: 2,
    href: PAGE_SETTINGS.startups.href,
    label: PAGE_SETTINGS.startups.name,
    title: 'Startups',
    desc: `Fast-Track Your HR Startup launch with Field API's`,
    /* icon: <IconAgency />, */
    // icon: '/assets/icons/menu/agency.svg',
    circle: "#40C4AA"
  },
  {
    id: 3,
    href: PAGE_SETTINGS.for_developers.href,
    label: PAGE_SETTINGS.for_developers.name,
    headerLabel: "SaaS Vendors and Developers",
    footerLabel: "Developers & SaaS",
    desc: `Developing revolutionary HR products? We've got the solutions!`,
    /* icon: <IconCode />, */
    // icon: '/assets/icons/menu/code.svg',
    circle: "#FFA24C"
  },
  // {
  //   id: 4,
  //   href: PAGE_SETTINGS.hr_vendors_agencies.href,
  //   label: PAGE_SETTINGS.hr_vendors_agencies.name,
  //   desc: `Unlock your team's recruitment potential with the right tools`,
  //   /* icon: <IconVendors />, */
  //   icon: '/assets/icons/menu/vendors.svg',
  // },
];

export const DATA_HEADER_MENU_PRODUCTS = [
  {
    href: PAGE_SETTINGS.resume_parser.href,
    headerLabel: "Field Parser",
    label: PAGE_SETTINGS.resume_parser.name,
    desc: 'Industries most developed parser, turn resumes into structured data',
    icon: '/assets/icons/menu/hirize-parser.png',
  },
  {
    href: PAGE_SETTINGS.ai_agents.href,
    headerLabel: "Field Lumina",
    label: PAGE_SETTINGS.ai_agents.name,
    desc: 'Predict turnover with the power of predictive analytics',
    icon: '/assets/icons/menu/lumina.png',
  },
  // {
  //   href: PAGE_SETTINGS.data_ai.href,
  //   label: PAGE_SETTINGS.data_ai.name,
  //   icon: '/assets/icons/menu/hirize-data-ai.png',
  //   desc: 'Predict turnover with the power of predictive analytics',
  // },
  {
    href: PAGE_SETTINGS.ai_matching.href,
    headerLabel: "AI Matching",
    label: PAGE_SETTINGS.ai_matching.name,
    desc: 'Search, score and match the most relevant profiles instantly',
    icon: '/assets/icons/menu/ai-matching.png',
  },
  // {
  //   href: PAGE_SETTINGS.logic.href,
  //   label: PAGE_SETTINGS.logic.name,
  //   desc: 'Enrich resume data, unlock up to 60% more skills from resumes and gain deeper insights for superior matches.',
  //   icon: '/assets/icons/menu/hirize-logic.png',
  // },
  {
    href: PAGE_SETTINGS.hirize_iq.href,
    headerLabel: "Field IQ",
    label: PAGE_SETTINGS.hirize_iq.name,
    desc: 'Generate tailored interview questions and summaries based on resume and job description with GPT',
    icon: '/assets/icons/menu/hirize-iq.png',
  },
  // {
  //   href: PAGE_SETTINGS.hr_docs.href,
  //   label: PAGE_SETTINGS.hr_docs.name,
  //   desc: 'Transform your HR documents into meaningful, actionable data with ease!',
  //   icon: '/assets/icons/menu/hirize-docs.png',
  // },
];

export const DATA_MENU_CONNECT = [
  {
    id: 1,
    href: PAGE_SETTINGS.integration.href,
    label: PAGE_SETTINGS.integration.name,
    /* icon: <IconIntegration />, */
    icon: '/assets/icons/menu/integration.svg',
  },
  {
    id: 2,
    href: DOCUMENTATION_URL,
    isExternal: true,
    label: 'Documentation',
    /* icon: <IconDocuments />, */
    icon: '/assets/icons/menu/documents.svg',
  },
];

export const DATA_MENU_LEARN_CONNECT = [
  {
    id: 1,
    href: PAGE_SETTINGS.integration.href,
    label: `${PAGE_SETTINGS.integration.name}s`,
    desc: '',
    /* icon: <IconBlog />, */
    icon: '/assets/icons/menu/link.svg',
    hoverIcon: '/assets/icons/menu/link-white.svg',
  },
  {
    id: 2,
    href: DOCUMENTATION_URL,
    isExternal: true,
    label: 'Documentation',
    desc: 'Master Field products and integrate with ease',
    /* icon: <IconBlog />, */
    icon: '/assets/icons/menu/code.svg',
    hoverIcon: '/assets/icons/menu/code-white.svg',
  },
  {
    id: 3,
    href: PAGE_SETTINGS.tutorials.href,
    label: PAGE_SETTINGS.tutorials.name,
    desc: 'Master Field products and integrate with ease',
    /* icon: <IconTutorial />, */
    icon: '/assets/icons/menu/tutorial.svg',
    hoverIcon: '/assets/icons/menu/tutorial-white.svg',
  },
];

export const DATA_MENU_HELP_SUPPORT = [
  // {
  //   id: 1,
  //   href: HELP_CENTER_URL,
  //   label: 'Help Center',
  //   desc: 'Connect with our support team',
  //   /* icon: <IconLifeBuoy />, */
  //   icon: '/assets/icons/menu/headset.svg',
  //   hoverIcon: '/assets/icons/menu/headset-white.svg',
  //   isExternal: true,
  // },
  {
    id: 2,
    href: PAGE_SETTINGS.contact.href,
    label: 'Support',
    desc: 'Find solutions in the Field knowledge center',
    /* icon: <IconHeadset />, */
    icon: '/assets/icons/menu/lifebuoy.svg',
    hoverIcon: '/assets/icons/menu/lifebuoy-white.svg',
  },
  {
    id: 3,
    href: PAGE_SETTINGS.blog.href,
    label: PAGE_SETTINGS.blog.name,
    desc: 'Get thought leadership and news about AI and more',
    /* icon: <IconBlog />, */
    icon: '/assets/icons/menu/blog.svg',
    hoverIcon: '/assets/icons/menu/blog-white.svg',
  },
];

export const DATA_MENU_COMPANY = [
  {
    id: 1,
    href: PAGE_SETTINGS.about.href,
    label: PAGE_SETTINGS.about.name,
    headerLabel: "About Us",
    desc: 'Get to know the team behind Field',
    /* icon: <IconInfo />, */
    icon: '/assets/icons/menu/dashboard.svg',
    hoverIcon: '/assets/icons/menu/dashboard-white.svg',
  },
  {
    id: 2,
    href: PAGE_SETTINGS.contact.href,
    label: PAGE_SETTINGS.contact.name,
    headerLabel: "Contact",
    desc: 'Connect with us!',
    /* icon: <IconContact />, */
    icon: '/assets/icons/menu/chat.svg',
    hoverIcon: '/assets/icons/menu/chat-white.svg',
  },
  // {
  //   id: 3,
  //   href: PAGE_SETTINGS.join_us.href,
  //   label: PAGE_SETTINGS.join_us.name,
  //   desc: 'Be part of our mission',
  //   /* icon: <IconJoinUs />, */
  //   icon: '/assets/icons/menu/chat.svg',
  //   hoverIcon: '/assets/icons/menu/chat-white.svg',
  // },
];

export const DATA_FOOTER_MENU_PRODUCTS = [
  {
    href: PAGE_SETTINGS.resume_parser.href,
    label: "Field Parser"
  },
  {
    href: PAGE_SETTINGS.ai_matching.href,
    label: "AI Matching",
  },
  // {
  //   href: PAGE_SETTINGS.hr_docs.href,
  //   label: PAGE_SETTINGS.hr_docs.name,
  // },
  {
    href: PAGE_SETTINGS.hirize_iq.href,
    label: "Field IQ",
  },
  // {
  //   href: PAGE_SETTINGS.logic.href,
  //   label: PAGE_SETTINGS.logic.name,
  // },
  {
    href: PAGE_SETTINGS.ai_agents.href,
    label: "Field Lumina",
  },
];

export const DATA_SOCIAL_MEDIA_SHARE = [
  {
    id: 'link',
    title: 'Copy Link',
    tooltip: 'Copy Link',
    icon: IconCopy,
    shareLink: '',
  },
  {
    id: 'mail',
    title: 'Mail',
    tooltip: 'Share via Email!',
    icon: IconEmail,
    shareLink: 'mailto:?Subject=SubjectHere&body=ThisIsTheMailtext',
  },

  {
    id: 'twitter',
    title: 'Twitter',
    tooltip: 'Share via Twitter!',
    icon: IconTwitter,
    shareLink: 'https://twitter.com/intent/tweet?url=',
  },
  {
    id: 'linkedin',
    title: 'Linkedin',
    tooltip: 'Share via Linkedin!',
    icon: IconLinkedin,
    shareLink: 'https://www.linkedin.com/sharing/share-offsite/?url=',
  },
  {
    id: 'link',
    title: 'Copy Link!',
    tooltip: 'Copy Link!',
    icon: IconLink,
    shareLink: '',
  },
];

export const DATA_SOCIAL_MEDIA = [
  {
    id: 'linkedin',
    label: 'Linkedin',
    href: 'https://www.linkedin.com/company/80397060/',
    icon: IconLinkedin,
  },

  {
    id: 'twitter',
    label: 'Twitter',
    href: 'https://twitter.com/FieldAi',
    icon: IconTwitter,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/hirize.hr/',
    icon: IconInstagram,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/Field.hr/',
    icon: IconFacebook,
  },
];

export const DATA_PRICING_PRODUCTS = [
  {
    id: 1,
    name: 'Resume Parser',
    description: 'Industries most developed parser, turn resumes into structured data.',
    icon: '/assets/icons/menu/hirize-parser.png',
    price: '1.0',
    tooltip: {
      title: 'Resume Parser - 1.0 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
  {
    id: 2,
    name: 'Job Parser',
    description: 'Transform job specs into structured data.',
    icon: '/assets/icons/menu/job-parser.png',
    price: '.8',
    tooltip: {
      title: 'Job Parser - .8 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
  {
    id: 3,
    name: 'AI Matcher',
    description: 'Search, score and match the most relevant profiles instantly.',
    icon: '/assets/icons/menu/ai-matching.png',
    price: '.0',
    tooltip: {
      title: 'AI Matcher - .0 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
  {
    id: 8,
    name: 'Field IQ',
    description: 'Generate tailored interview questions and summaries based on resume and job description with GPT.',
    icon: '/assets/icons/menu/hirize-iq.png',
    price: '.2',
    tooltip: {
      title: 'Field IQ - .2 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
];

export const DATA_PRICING_USEFUL_FEATURES = [
  {
    id: 5,
    name: 'Field DataAI',
    description: 'Predict turnover with the power of predictive analytics.',
    icon: '/assets/icons/menu/hirize-data-ai.png',
    price: '.0',
    tooltip: {
      title: 'Field DataAI - .0 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
  {
    id: 6,
    name: 'Field Logic',
    description:
      'Enrich resume data, unlock up to 60% more skills from resumes and gain deeper insights for superior matches.',
    icon: '/assets/icons/menu/hirize-logic.png',
    price: '.2',
    tooltip: {
      title: 'Field Logic - .2 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
  {
    id: 4,
    name: 'Field Docs',
    description: 'Transform your HR documents into meaningful, actionable data with ease!',
    icon: '/assets/icons/menu/hirize-docs.png',
    price: '.8',
    tooltip: {
      title: 'Field Docs - .8 credit per request',
      description: 'These prices are the max price credit costs decrease with larger packages. ',
    },
    is_active: true,
  },
];

export const companyLogos = [
  {
    src: "/assets/images/hero/logo1.png",
    alt: "Microsoft",
    width: 115,
    height: 48,
    className: "!min-w-[115px]"
  },
  {
    src: "/assets/images/hero/logo2.png",
    alt: "Amazon",
    width: 110,
    height: 27,
  },
  {
    src: "/assets/images/hero/logo3.png",
    alt: "Amplitude",
    width: 135,
    height: 48
  },
  {
    src: "/assets/images/hero/logo4.png",
    alt: "Neuralink",
    width: 134,
    height: 44
  },
  {
    src: "/assets/images/hero/logo5.png",
    alt: "greenhouse",
    width: 143,
    height: 32
  },
  {
    src: "/assets/images/hero/logo6.png",
    alt: "LSE",
    width: 134,
    height: 48
  },
];


export const DATA_TUTORIAL_LIST = [
  {
    title: 'Field API connection',
    desc: `In this tutorial, we'll guide you on connecting to the Field API to maximize the potential of our recruiting AI models.`,
    id: 'laJsE66_5kc',
  },
  {
    title: 'Field x Greenhouse integration set up | Greenhouse Integration',
    desc: `Here is a step-by-step video of how to integrate Field's advanced candidate matching system into your Greenhouse ATS.`,
    id: 'hcjO6y4ANhg',
  },
  {
    title: 'Field X Zapier X Google Sheets Integration',
    desc: `Welcome to our step-by-step tutorial on automating the export of parsed resume data to Google Sheets using Field and Zapier! This integration will streamline your recruitment process, making it easier and more efficient to manage candidate information.`,
    id: 'zWs60vhDXb4',
  },
];
