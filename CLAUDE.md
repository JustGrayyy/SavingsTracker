# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite, default port 5173; auto-falls-back to next free port)
- **Production build**: `npm run build` — bundles every HTML entry listed in `vite.config.js` (main, signin, login, tasks, schedule, notes, savings, profile). Run after touching CSS or JS to confirm syntax.
- **Preview built assets**: `npm run preview`

There are no tests, no linter, and no formatter configured. `npm run build` is the only correctness check.

## Stack & Architecture

Vanilla JS multi-page Vite app on a single Supabase backend. No framework, no router, no bundler config beyond `vite.config.js`'s multi-input rollup list.

- **Pages** (each a separate HTML entry, all share `src/theme.css` + `src/nav.css`):
  `index.html`, `login.html`, `signin.html`, `tasks.html`, `schedule.html`, `notes.html`, `savings.html`, `profile.html`
- **Auth**: Supabase Auth. Sign-in uses synthetic emails of the form `<username>@users.savingstracker.app` — username is the user-facing credential, the email suffix is invisible. Username validation lives in `src/auth.js` (`signUp` / `signIn`).
- **Shared shell**: `src/theme.css` defines all CSS tokens (colors, spacing, radius, motion) plus component classes. `src/nav.css` holds the sticky top-nav used by every authed page. Inline `<style>` blocks on each page only add page-specific layout.
- **Backend**: one Supabase project. Tables are snake_case (`savings_goal`, `academic_task`, `class_slot`, `daily_event`, `daily_todo`, `study_note`, `user_profile`). Row-Level Security restricts every read/write to `auth.uid() = user_id` — see `supabase/productivity_suite.sql`. Run SQL changes directly in the Supabase SQL editor; there is no migration tooling.
- **Schema source of truth**: `supabase/productivity_suite.sql` (DB) + `src/database.types.ts` (hand-mapped camelCase types, not generated). Service files own the runtime row → object mapping.

## Service Module Pattern

Every domain module in `src/` follows the same shape:

```
fetchXxx()                    → array of mapped camelCase objects
createXxx(payload)            → { success, item?, error? }
updateXxx(id, payload)        → { success, item?, error? }
deleteXxx(id)                 → { success, error? }
```

Examples: `src/goals.js`, `src/tasks.js`, `src/schedule.js`, `src/events.js`, `src/todos.js`, `src/notes.js`. Each module starts with a private `mapRow(row)` that converts DB columns (snake_case, nullable timestamps) into the camelCase object the UI consumes. Keep this transformation inside the module — pages must never see snake_case.

The `src/database.types.ts` file mirrors the table shapes but is **not imported by the JS code**; it exists for editor type hints and reference. When you add a column, update both that file and the `mapRow` in the matching service.

## Hard Rules (don't relax these)

- **Deletes must force RLS evaluation**: always chain `.delete().eq('id', id).select('id')` and treat an empty returned array as a failure (do not show success). Without `.select('id')`, Supabase returns no rows and a missing-RLS delete is indistinguishable from a no-op.
- **No optimistic UI**: mutate the frontend array state only after the Supabase response confirms success. On failure, keep the original items and surface `alert(error)`.
- **Auth domain is fixed**: synthetic emails always append `@users.savingstracker.app`. Don't try to use real emails.
- **No new component styles** unless the page genuinely needs something the shared system lacks. Reuse `var(--*)` tokens from `src/theme.css`; do not introduce hex colors inline.

## Design System

`DESIGN.md` and `PRODUCT.md` are the binding spec — they target an impeccable.style aesthetic: dark surfaces (`#0A0A0A` → `#1A1A1A`), gold accent (`#F5C518`), Plus Jakarta Sans (UI) + Outfit (display) + JetBrains Mono, large whitespace, semantic color over decoration. **Do not add violet/rose, gradients, glassmorphism, or pill-shaped kickers** — those were the old light theme and have been fully removed. If you find any leftover in the repo, treat it as a bug.

Token names live in `src/theme.css`. To change colors or spacing, edit tokens there — never hardcode hex values in pages.

## Environment & Secrets

Supabase URL and anon key live in `src/supabaseClient.js` with fallbacks to `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. The anon key is publishable; do not add service-role keys or personal credentials anywhere in this repo.

## Things that don't exist yet

No CI, no tests, no storybook, no component library, no `package-lock.json` integrity check, no accessibility audit tooling. Don't suggest adding them unless the user asks — the codebase intentionally stays minimal.
