# Karaoke Map Wisconsin (Milestone 4)

A beginner-friendly, mobile-first Next.js starter for the **Karaoke Map Wisconsin** MVP.

This milestone includes:
- Milestone 1 app scaffold (Next.js App Router, TypeScript, Tailwind, placeholder pages)
- Milestone 2 schema and Supabase connectivity check page
- Milestone 3 private admin login/logout and admin CRUD for venues/events
- Milestone 3 RLS policies for read-public/admin-write access
- Milestone 4 public event browsing pages (`/` and `/event/[id]`)

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Vercel-ready project structure

## Folder structure (Milestone 4 additions)

```text
app/
  page.tsx                        # Public homepage with date-based event list
  event/
    [id]/
      page.tsx                    # Public event detail page
components/
  public/
    public-date-picker.tsx        # Date picker for the public homepage
lib/
  timezone.ts                     # America/Chicago date filtering + formatting helpers
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

4. **Apply SQL files in order**
   - Open your Supabase project dashboard
   - Go to **SQL Editor**
   - Run `supabase/schema/milestone-2.sql`
   - Run `supabase/schema/milestone-3.sql`

5. **Configure Supabase Auth for private admin-only login**
   - Go to **Authentication → Providers → Email**
   - Keep email/password enabled
   - Turn **off** public signups (disable "Enable email signups")
   - Go to **Authentication → Users**
   - Click **Add user** and create your single admin user email/password manually

6. **Start the app**
   ```bash
   npm run dev
   ```

7. **Test milestone 4 public pages**
   - Visit `http://localhost:3000/`
   - Confirm the date picker defaults to today in America/Chicago
   - Change the date and confirm the list updates
   - Confirm canceled events are hidden and tentative events show a badge
   - Click an event card and confirm `http://localhost:3000/event/<event-id>` opens the detail page

## Validation commands

Run these before pushing:

```bash
npm run lint
npm run build
```

## Notes
- Public browsing is read-only in Milestone 4.
- Date filtering on the homepage is based on the calendar day in **America/Chicago**.
- This milestone intentionally does not add map features, geolocation, advanced filters, user accounts, recurring logic, or monetization.
