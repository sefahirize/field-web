# Landing reference: runpulse.com

The new landing takes **runpulse.com** (Pulse AI) as its model: the same logic,
actions and overall design, not a copy. Studied on 2026-11-03. Pulse sells
document processing / OCR to enterprises, which is close to what Field sells.

Do not copy their text, illustrations, Lottie files, logos or icons: we build
our own in the same spirit.

## How the site is built

- **Webflow** behind Cloudflare. It loads a lot of scripts:
  - jQuery, GSAP 3.15 (ScrollTrigger, Flip), lottie-web 5.10 and Swiper 12;
  - KaTeX (for the blog);
  - HubSpot (forms, tracking), Google Analytics, and the Finsweet cookie consent.
- **Pages:**

  | Page | URL | Notes |
  | --- | --- | --- |
  | Home | `/` | |
  | Pricing | `/pricing` | |
  | Industry pages | `/industry/{finance,healthcare,insurance,legal,real-estate,supply-chain}` | 6 pages from one template |
  | Comparisons | `/comparison/pulse-vs-<competitor>` | 19 pages from one template; SEO |
  | Blog | `/blog` | 92 posts |
  | Security | `/security` | |
  | Contact sales | `/contact-sales` | HubSpot form |
  | Other | careers, terms, privacy | |
  | Docs | `docs.runpulse.com` | external |
  | Product | `platform.runpulse.com` | "Log in" goes here |

- **Section components.** Pages are assembled from a small set of section
  components that every page reuses: `section_big-hero`, `section_marquee`,
  `section_cases`, `section_testimonials`, `section_security`, `section_blog`
  and `section_faq`. An industry page is the home page with a different hero
  and a "use cases" grid instead of the pipeline.

## Visual design

### Overall look

- A technical, blueprint look.
- One white content column, framed by thin vertical lines along its full height.
- Sections are separated by 1 px lines and thin dotted or hatched strips.
- A dark band always starts with a thin blue line along its top edge.

### Colour

| Role | Value |
| --- | --- |
| Page | white |
| Hero background | very light blue wash (gradient) |
| Dark bands | slate `#273344` |
| Text | `#374151` |
| Secondary text | `#737373` |
| Brand blue | `#2d62ff` |
| Light blue (illustrations) | `#d9e5ff` |
| Accent | pink `#dd23bb`, barely used |
| Primary button | `#1f2937` |

Light and dark bands alternate down the page:

1. hero: light
2. pipeline: dark
3. deployment: light
4. security: light
5. testimonials: dark
6. blog: light
7. FAQ: light
8. CTA and footer: dark

### Type (three families)

| Use | Font | Size and style |
| --- | --- | --- |
| H1 | Inria Serif 400 | 56/64 px, letter-spacing −2.8 px |
| H2 | Inria Serif 400 | 48/48 px, letter-spacing −1.9 px |
| Body | Geist | 16 px; lead paragraph 18 px in grey |
| Small titles | Geist 500 | 16 px |
| Eyebrows | Martian Mono 500 | uppercase, with a small pixel icon (e.g. `DOCUMENT VISION PIPELINE`, `SECURITY`, `FAQS`) |

### Shapes

- Square corners everywhere (radius 0).
- Small buttons: 14 px text, about 10×20 px padding, 41 px tall.
- Primary button: dark fill. Secondary button: white with a 1 px dark outline.

### Illustrations and icons

- Isometric line drawings in light blue: a stack of documents, tables, charts
  and compliance badges as tiles.
- Icons are small pixel/dotted line icons.

### Layout

- Content column about 1170 px wide inside a 1440 px frame.
- Breakpoints 991, 767 and 479 px.

## Home page, section by section, and what each one does

1. **Navigation bar**
   - Left: logo, a "Use cases" dropdown, a "Resources" dropdown, Pricing, and "Docs ↗" (external).
   - Right: "Log in" as a text button and "Chat with Sales" as the primary button.
   - The dropdowns are full-width mega menus that open on hover: a 3-column grid of icon, title and one-line description.
   - On mobile: a burger menu.
2. **Announcement pill** above the H1 ("Introducing … • Read more"), linking to a blog post.
3. **Hero**
   - H1 on two lines, a lead paragraph, and two buttons: *Chat with Sales* (primary) and *Try for free* (outline).
   - The isometric illustration on the right is a Lottie animation.
   - On mobile the illustration moves below the text.
4. **Proof strip**
   - "We've processed over 1 billion pages…" on the left.
   - An endless logo marquee on the right.
5. **Pipeline scroll story** (dark; the signature piece)
   - The section is pinned while you scroll through 5 steps; the steps are also clickable (`#step1…5`).
   - Left column: the step list, with an indicator line on the active step.
   - Centre: a stack of isometric layers. The active layer lifts and lights up, animated with GSAP Flip.
   - Right column: a document preview, a Lottie animation per step, showing what that step extracts (text lines → reading order → tables → charts).
   - Below it: 3 feature columns, each with an icon, title and text.
6. **Deployment**
   - Left (sticky): eyebrow, H2, text and a CTA.
   - Right: 4 stacked feature rows, each with an icon, title and text.
7. **Security**
   - H2, text, and a 2×2 list of certifications (SOC 2, GDPR, ISO 27001, HIPAA).
   - An isometric badge illustration.
8. **Testimonials** (dark)
   - A centred serif H2.
   - Industry tabs (Finance, Healthcare, …); each tab shows its own quote and its own illustration.
9. **Blog**
   - "Read our latest updates" and "View all posts".
   - A card slider with arrows (Swiper: 3.5 cards on desktop, 1.15 on mobile).
   - Each card cover is generated: the title on a blue grid.
10. **FAQ**
    - Left: H2, text and "Get in touch".
    - Right: an accordion with + icons.
11. **Final CTA band** (dark): "Start scaling with Pulse", one sentence and one button.
12. **Footer** (dark)
    - Logo.
    - Link columns: Company, Security, Legal, Social and News.
    - Copyright line, with LinkedIn and X icons.

### Pricing page

- Two plan cards side by side:
  - **Free** (Self Serve): free credits, then a link to credit pricing.
  - **Custom** (Enterprise).
- Each card has a checklist of features.
- Below: a feature comparison table grouped by "Core & usage", "Business & support" and "Security & deployment".

### Comparison page

- A centred serif statement and two CTAs.
- A comparison table: capability, Pulse (highlighted column), competitor; ✓ and ✗ per row.
- Then the shared sections: marquee, testimonials, security and FAQ.

## What converts: the sales logic

- **Two calls to action everywhere.**
  - "Chat with Sales" for enterprise.
  - "Try for free" for self-serve.
  - Every section ends with one of them.
- **Proof early and often:** the volume figure, logos, certifications, a named-role quote, and industry tabs.
- **"How it works" is shown, not told:** the pipeline story makes the technology tangible.
- **SEO surface:**
  - an industry page per vertical, comparison pages per competitor, and a very active blog.
  - Every page reuses the same sections, so a new page is cheap to make.

## Weak spots seen (do better)

- **Copy mistakes left by the templates:**
  - The Textract comparison describes "Tesseract".
  - The "Supply chain" menu entry reuses a security sentence.
  - Both pricing cards carry a hidden "Most popular".
- **FAQ answers** are only a `mailto:` link, not real answers.
- **Heavy JavaScript** for what it does (jQuery, GSAP, Lottie, KaTeX, Swiper, HubSpot).
- **Pipeline on mobile:** the pinned section turns into long empty dark space in a full-page capture (seen in our headless shots).

## How it maps to Field (proposal, to confirm with the user)

### Content

- **Home**
  - Hero with "Try for free" (→ `ROUTES.register`) and "Talk to sales".
  - A pipeline story of Field's own steps: upload → OCR → parsing (CV, invoice …) → structured JSON / API.
  - A products grid (CV Parser, OCR, AI Model, …) instead of "deployment".
  - Security, testimonials, blog, FAQ and the CTA band.
- **Pricing**
  - Plan cards, plus our existing credit calculator, which sends a basket to `ROUTES.checkout`.
- **Templates**
  - Industry / use-case pages and comparison pages, both later.
- **Proof content must be real:**
  - customer logos, volume figures, certifications and quotes come from the user.
  - Nothing is invented: no SOC 2 / ISO claim unless Field has it.

### Implementation

- **Stack:** Next.js + Tailwind 4, in `src/landing` and `app/(landing)` only.
- **Fonts:** `next/font` (Geist, a serif, a mono). Inria Serif, Geist and Martian Mono are all on Google Fonts; pick our own trio.
- **Fewer packages, same effect:**
  - Pinned steps: CSS `position: sticky` + IntersectionObserver + CSS transitions on our own SVG layers. No GSAP or Lottie needed.
    - GSAP 3.15 is free under its own "standard no-charge" license; that is a fallback only.
  - Marquee: CSS only.
  - FAQ: `<details>`.
  - Blog slider: CSS scroll-snap instead of Swiper.
- **Design tokens** go in the landing's Tailwind theme, separate from the dashboard (isolation rules).
