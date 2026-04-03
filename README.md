# Karaoke Map Wisconsin (Milestone 1)

A beginner-friendly, mobile-first Next.js starter for the **Karaoke Map Wisconsin** MVP.

This milestone only includes:
- Basic Next.js App Router setup
- Tailwind CSS setup
- Shared app layout
- Placeholder public home page (`/`)
- Placeholder admin login page (`/admin/login`)
- Supabase client scaffolding and environment variable setup

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Vercel-ready project structure

## Folder structure (simple and clear)

```text
app/
  admin/
    login/
      page.tsx        # Placeholder admin login page
  globals.css         # Global Tailwind styles
  layout.tsx          # Shared layout for all routes
  page.tsx            # Public homepage
components/
  site-header.tsx     # Reusable shared header component
lib/
  supabase/
    client.ts         # Browser/client-side Supabase utility
    server.ts         # Server-side Supabase utility factory
.env.example          # Required environment variables template
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

4. **Start the app**
   ```bash
   npm run dev
   ```

5. Open:
   - http://localhost:3000
   - http://localhost:3000/admin/login

## Validation commands

Run these before pushing:

```bash
npm run lint
npm run build
```

## Notes
- Supabase is scaffolded but not wired into pages yet.
- No auth flows, database schema, map features, or CRUD pages are implemented in this milestone.
