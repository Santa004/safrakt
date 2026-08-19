# Mantorps smådjursklinik app

## Kör lokalt
1. `cp .env.example .env.local` och fyll i Supabase (+ valfritt Resend/CRON)
2. Kör SQL i `supabase/migrations/20260314120000_fas1_schema.sql` mot ditt projekt
3. `pnpm install && pnpm dev`

Se `AGENTS.md` och `PROJECT_CONTEXT.md`.
