# Decisions

## Design decisions
- Premium svensk kundapp + publik webb för Mantorps Smådjursklinik (inte kedje-app-känsla).

## Technical decisions
- Stack låst: Next.js App Router, TypeScript strict, Tailwind CSS, Supabase (Auth + Postgres + RLS), PWA, pnpm.
- Denna fas: kundapp + publik webb. Inte journal, kassa, e-recept, labb, Fortnox, direktreglering eller journal-admin.
- Datamodellen ska kunna växa till journal senare; bygg inte journal-UI nu.

## Client-specific decisions
- Officiellt projektnamn: Mantorps smådjursklinik app
- All UI-copy på svenska
- Klinikfakta får endast komma från PROJECT_CONTEXT.md (inga gissningar)
