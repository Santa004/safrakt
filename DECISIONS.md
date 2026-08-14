# Decisions

## Design decisions
- Premium svensk kundapp + publik webb för Mantorps Smådjursklinik (inte kedje-app-känsla).
- Brand: djupt skogsgrönt, varmt grädde, mörkt bläck, diskret mässing. Inga neon-accenter.
- Autodock-riktning: djur = “mina objekt”; luft, foto, tydlig typografi.
- Undvik stock-känsla, cartoon, lila/pink pet-klichéer, fake recensioner/priser.

## Technical decisions
- Stack låst: Next.js App Router, TypeScript strict, Tailwind CSS, Supabase (Auth + Postgres + RLS), PWA, pnpm.
- Denna fas: kundapp + publik webb. Inte journal, kassa, e-recept, labb, Fortnox, direktreglering eller journal-admin.
- Datamodellen ska kunna växa till journal senare; bygg inte journal-UI nu.
- MVP: content in code/MD, server actions + Zod, Vercel later, ingen analytics.

## Client-specific decisions
- Officiellt projektnamn: Mantorps smådjursklinik app
- All UI-copy på svenska
- Klinikfakta får endast komma från PROJECT_CONTEXT.md (inga gissningar)
- Öppettider i PROJECT_CONTEXT ska verifieras före launch
- Roadmap styrs av TASKS.md — en milstolpe i taget
