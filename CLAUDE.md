# field-web

Product: **Field**. Domain: `joinfield.ai` (the domain stays "joinfield"; the product name is "Field" everywhere a user can see it).

This repo will hold both the landing (marketing site) and the dashboard front end in one Next.js app.
Read `HANDOFF.md` first: it has the full plan, the source projects, the decisions already made and the open questions.

## Working rules

- **One step at a time.** Do not do several migration steps at once. Finish a step, report, wait for the go-ahead.
- **Analyse first.** The first job in a new session is to read both source projects (see `HANDOFF.md`) and report, before writing code.
- **Newest *stable and secure* versions** for every package. Verify with `npm view` / `pnpm view` on the day; never pin from memory. Check peer-dependency compatibility before adding a package. Optimise the code to fit the new versions when needed.
- **The landing will change again later.** The dashboard must not break when it does (isolation rules below). Design every step with that in mind.
- **No design loss.** Port first, compare visually against the source projects, upgrade second. Do a risky upgrade (e.g. Tailwind 3 → 4) as its own reversible step.
- **Git is the user's job.** Do not commit, push or create branches unless the user asks in that message. When asked, no `Co-Authored-By`/Claude line in the commit message, never push. Otherwise finish each turn with a `git status` summary.
- **Do not touch the source repos** (`joinfield-landing`, `joinfield-dashboard`). They are read-only references.
- Reply to the user in Turkish, short and concrete; code, comments and commit messages in English.

## Isolation rules (so the landing can change without breaking the dashboard)

1. Layout groups: `app/(landing)/…` and `app/(app)/…` (dashboard), each with its own layout and its own CSS.
2. Layers: `src/landing/`, `src/dashboard/`, `src/shared/`. `landing` and `dashboard` never import each other, only `shared`. Enforce with an ESLint `no-restricted-imports` rule so a violation fails the build.
3. Tailwind and its preflight load only in the landing layout. MUI + SCSS load only in the app layout. Neither stylesheet may leak into the other.
4. `shared` holds only the contract: route constants, app URL / env, brand name and logo, colour tokens if wanted, and the landing → dashboard entry points (login, sign-up, `/checkout?...` with the pricing parameters). Keep that contract in one file.
5. Root-path redirects (`/?token=…` from the verification email, `/?session_id=…` from Stripe) are handled at root level (middleware), not inside a landing page, so they keep working whatever the landing looks like.
6. Tests live per layer. The dashboard's tests must run without the landing present.
