# Karaoke Map Wisconsin (Milestone 2)

A beginner-friendly, mobile-first Next.js starter for the **Karaoke Map Wisconsin** MVP.

This milestone includes:
- Milestone 1 app scaffold (Next.js App Router, TypeScript, Tailwind, placeholder pages)
- Supabase utilities for browser/server usage
- Initial database schema with `venues` and `events` tables
- Temporary dev page for a simple Supabase read check

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Vercel-ready project structure

## Folder structure (Milestone 2 additions)

```text
app/
  dev/
    supabase-check/
      page.tsx                 # Temporary dev-only Supabase read check
supabase/
  schema/
    milestone-2.sql            # SQL schema for venues + events
```

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create local environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Fill in Supabase values in `.env.local`**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Apply Milestone 2 SQL in Supabase**
   - Open your Supabase project dashboard
   - Go to **SQL Editor**
   - Open `supabase/schema/milestone-2.sql` from this repo and copy its contents
   - Paste into SQL Editor and click **Run**

5. **Start the app**
   ```bash
   npm run dev
   ```

6. **Test the temporary connectivity page**
   - Visit: http://localhost:3000/dev/supabase-check
   - Success state should show: **"Connection check succeeded."**
   - If there is a problem, the page shows the Supabase error message

## Validation commands

Run these before pushing:

```bash
npm run lint
npm run build
```

## Notes
- The `/dev/supabase-check` route is temporary and dev-oriented.
- This milestone intentionally does not include auth, CRUD, map features, recurring logic, or submission flows.
