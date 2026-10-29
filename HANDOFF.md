# Handoff — field-web

Written 2026-10-30 at the end of a long session in `joinfield-dashboard`. A new session (Opus 5.5, high effort) starts here.

## Goal

One repo, **`field-web`**, one Next.js app containing the **landing** (landing) and the **dashboard**. Start from scratch with the newest stable, secure packages. Port the landing first, then the dashboard. One step at a time.

## Source projects (read-only references)

| | Path | Notes |
|---|---|---|
| Landing | `/Users/ebuer/Developer/Hirize/joinfield-landing` | Next.js 15.0.7 (old), React 19, TypeScript, Tailwind 3 (preflight on), pnpm. ~8.5k lines of tsx. |
| Dashboard | `/Users/ebuer/Developer/Hirize/joinfield-dashboard` | Create React App (react-scripts 5), React 18, JavaScript, MUI 5 + emotion, SCSS, Redux Toolkit, react-router 6. ~13k lines js/jsx, ~9.5k lines scss. 94 Jest/RTL tests. |
| Older | `hirize-ai-landing-v2`, `hirize-api-dashboard` (same folder) | Ancestors; only for history. |

### Landing facts
- App Router groups: `(primary)`, `(secondary)`; pages: home, pricing, about-us, contact, integration, tutorials, blogs (+ `[slug]`), solutions/*, enterprise pages, ai-agents. `docs/seo-active-pages-table.txt` lists the pages that are actually in the navigation.
- Server pieces: 3 route handlers (`api/contact` with reCAPTCHA v3 + Mailchimp, `api/parser-lead`, `api/calculate`), blog fetched from a WordPress REST API (`lib/api/blog.ts`), SEO helpers (`lib/seo/*`, sitemap, robots), `next/image` (21 uses), `next/font` (Inter + local Eudoxus Sans woff2), AOS animations.
- Tailwind: `tailwind.config.ts` has custom colours (`app-blue` #3A5AFF …), `lgx` breakpoint, custom spacing/sizes. `globals.css` has `.app-input`, `.card-price`.
- Pricing page (`pricing/plan-content.tsx`) builds a hand-off URL `${APP_URL}/checkout?...` that the dashboard's `/checkout` replays (see `docs/pricing-flow-analysis.md`). `APP_URL` is still the placeholder `https://app.hirize.hr`.
- Leftover Hirize items are listed in `QUESTIONS.md` (Q1–Q6) and `REBRAND_PLAN.md`: legal entity, address/founder, support emails, social links, orphaned JSON-LD files, a press link about Hirize, logo/favicon/OG image. Product URL slugs still contain `hirize` on purpose.
- `.env` holds reCAPTCHA keys: do not copy secrets into this repo or print them.

### Dashboard facts
- Routes (`src/libs/routes.js`): protected (`RequireAuth`): dashboard, documents, document detail, products, credit history, API credentials, analytics, profile, profile/edit, help, checkout, payment success/cancel (+ aliases). Public: `/` (RootEntry), login, register, forgot/reset password, verify-email, 404.
- `RootEntry` forwards `/?token=` to `/verify-email` and `/?session_id=` to the checkout success page, else to `/dashboard`. The backend's verification email and Stripe return URLs hit the **root**.
- API: `http://api.joinfield.ai/api/v1` (HTTP, not HTTPS). CRA `"proxy"` in package.json and `vercel.json` rewrites `/api` and `/uploads` to `http://api.joinfield.ai`. `vercel.json` also has a catch-all to `index.html` and `/demo` rewrites. API notes: the memory/artifact "Joinfield API field notes" (https://claude.ai/code/artifact/e0d0cbaa-e0e7-4e15-a45e-98efc990055a) has the verified endpoint shapes and traps.
- Theme: design "G — Mono" (black/white/grey, red only for danger). CSS custom properties in `src/styles/_tokens.scss` (`$jf-tokens` light/dark pairs), `variables.scss` maps `$Color-*` to `var(--jf-*)`. Axis 1 `data-theme` = light/dark/system (`libs/themeMode.jsx`, key `joinfield-theme`, pre-paint script in `public/index.html`). Axis 2 `data-layout` = classic/rail (key `joinfield-layout`). Rail = dark sidebar, icon-only collapse (`joinfield-sidebar`), cream canvas in light mode; styles in `_Rail.scss`. Classic is the default and the one the user prefers. Keep both.
- Libraries that may break on React 19 / newer majors: `react-input-mask`, `notistack` 2, `react-date-range`, MUI 5 → current major, `@mui/lab`. Check each before choosing versions.
- Code uses absolute imports from `src` (`baseUrl: src`) and `window`/`localStorage`/`document` in ~37 files, so most dashboard pages will be client components.
- Storage keys keep the `joinfield-` prefix on purpose (renaming would reset users' saved preferences).
- Design reference: Claude Design canvas "Joinfield Dashboard Theme" https://claude.ai/code/artifact/61fbbd1d-0cc1-4668-acf4-32563f978163 (page 1 = G — Mono). Static demo of it in the dashboard repo: `public/demo/`.

### Dashboard branches (not merged to main; the user merges and pushes)
`mono-design` (Mono redesign, usage button, profile + edit screen) ⊂ `mono-dark-sidebar` ⊂ `mono-view-switch` (Classic/Rail switch + rename to "Field", head `f7f6236`). **Port from `mono-view-switch`**, not `main`.

## Plan (one step at a time, wait for approval between steps)

0. **Analyse** both source projects (structure, dependencies, risky libraries, pages in use vs unused) and report. Verify current stable versions of Next, React, TypeScript, Tailwind, MUI, Sass, ESLint, etc. with the package manager and report them with their peer-dependency implications. Propose the folder layout. No code yet.
1. **Skeleton**: pnpm, Next.js (latest stable), TypeScript, ESLint with the isolation rule, `(landing)` / `(app)` groups, `src/landing|dashboard|shared`, env handling, a trivial page in each group. Run lint/build.
2. **Port the landing** (only pages in `seo-active-pages-table.txt` unless told otherwise) using Tailwind **3** first so the look is identical; port fonts, images, SEO, route handlers. Compare visually against `joinfield-landing`. Remove dead code (`plan-content-old`, orphan JSON-LD) only after asking.
3. **Upgrade step** (separate, reversible): Tailwind 3 → latest, other upgrades deferred from step 2, with a visual diff.
4. **Port the dashboard** from `mono-view-switch`: first as `.jsx` client components, MUI + SCSS loaded only in `(app)`; one page first (login), then the rest; move the 94 tests; recreate the `RootEntry` / token / `session_id` logic at root level (middleware); recreate `/api` and `/uploads` rewrites; replace `vercel.json` logic. The old repos stay untouched.
5. **Wire the contract**: `shared` route constants and the landing → dashboard entry points; set `APP_URL` correctly.
6. Later: TypeScript migration of the dashboard, landing redesign (the landing WILL change again — keep the isolation rules), Documents create flow, etc.

## Open questions to remind the user of (ask one by one, not all at once)

1. **Documents → Create**: "ever daha önce kayıt yapılmış ise success popup, create modal açılınca kapansın". Unclear: is it (a) a warning when the same file was uploaded before, or (b) a success popup after upload plus closing the create modal? Needs an example scenario.
2. **Logo mark**: the wordmark now says "Field" but the "J" mark and the blue square are from the old brand. Is there a new mark? (Landing also needs logo, favicon and a 1200×630 OG image.)
3. **Demo pages** (`public/demo*` in the dashboard repo): rename to "Field" too, or drop them from the new repo?
4. **Landing colours**: keep the landing blue, or bring it to the Mono palette? Affects shared tokens.
5. **Landing leftovers** (`QUESTIONS.md` Q1–Q6): legal entity name, address/founder/phone, support and privacy emails, social accounts, JSON-LD files, Hirize press link.
6. **Domains**: how will it be served (`www.joinfield.ai` for landing, dashboard on the same host or `app.`)? With one Next app this can be one domain; the backend's verification-email and Stripe return URLs must point to the right host.
7. Which landing pages to port (all, or only the active ones in the SEO table)?
8. Pages still to restyle in the dashboard: document detail, Analytics. Rail layout still needs a real-page walk-through on the cream background and in dark theme.
9. Which design is the main one: Classic (current default, the one the user prefers) vs Rail (optional).

## Reminders

- The product name is **Field**; only the domain stays joinfield.
- Never print or copy secrets (`.env` of the landing).
- The user said: do not do all tasks at once; the newest and most secure package versions; optimise code if the new versions require it; the landing will change later, so the dashboard must stay independent of it.
