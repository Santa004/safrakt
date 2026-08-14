# Project Instructions

## Main goal
Premium svensk kundapp + webb för Mantorps Smådjursklinik. Hög konvertering, mobil-first, snabbt, tryggt. Känsla värd 30–150 000 SEK. Inte en kedje-app, inte en leksak.

## Product boundary
THIS PHASE = kundapp + publik webb.
NOT THIS PHASE = journalsystem, kassa, e-recept, labb, Fortnox, direktreglering, admin för veterinärjournal.

Datamodellen ska kunna växa till journal senare. Bygg inte journal-UI.

## Stack (do not change unless asked)
- Next.js App Router + TypeScript strict + Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Svenska i all UI-copy
- PWA (ska kunna “lägg till på hemskärmen”)
- Package manager: pnpm

## Workflow (saves usage)
- Inspect relevant files before editing. Never rewrite the project.
- One milestone per chat. Smallest complete change.
- Do not create extra docs, README novels, or unused components.
- Do not install packages unless required for the current milestone.
- Do not run `pnpm install` more than once per chat unless lockfile changed.
- Do not explore unrelated folders. Max 8 files read before you start editing, unless blocked.
- If blocked: stop and ask. Do not guess clinic facts.
- Prefer editing existing patterns over new abstractions.
- No comments that narrate the code. No placeholder lorem.
- Do not commit secrets. Never put service-role keys in client code.

## Code style
- Server Components by default. Client only for interactivity.
- Zod at API/form boundaries.
- RLS on every table. Auth required for owner data.
- Reuse UI primitives in `components/ui` before creating new ones.
- Accessible: labels, focus, tap targets ≥ 44px, contrast.

## Definition of done (each milestone)
- Builds (`pnpm build`) and types (`pnpm typecheck`)
- Mobile 390px looks intentional
- Swedish copy, real clinic facts from PROJECT_CONTEXT.md
- No dead code, no unused deps

## Do not touch
- `.env*` except documenting required keys in `.env.example`
- Unrelated files
- Package manager / framework unless the milestone requires it
