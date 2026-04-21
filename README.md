# LaundryStrap

Multi-tenant laundry operations + customer portal.

## Architecture
- **apps/web**: Customer marketing site + portal (Next.js 14)
- **apps/ops**: Laundry staff operations app (Next.js 14)
- **packages/db**: Supabase schema + client + types
- **packages/utils**: Shared helpers
- **worker/** (coming next): Railway cron + Termii SMS reminders

## Multi-tenancy
Each tenant is resolved by **subdomain**:
- `demo-abuja.laundrystrap.com`
- `demo-jos.laundrystrap.com`

In local dev you can emulate with:
- `http://localhost:3000/?tenant=demo-abuja`

## Getting started
```bash
pnpm install
pnpm --filter web dev
```

## Database
Run these in Supabase SQL editor:
- `packages/db/schema.sql`
- `packages/db/rls.sql`
- `packages/db/seed.sql` (Abuja)
- `packages/db/seed-jos.sql` (Jos)

## Env
Create env files (see app-specific `.env.example` in upcoming PRs).
