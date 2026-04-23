# Karaoke Map Wisconsin (Milestone 3)

A beginner-friendly, mobile-first Next.js starter for the **Karaoke Map Wisconsin** MVP.

This milestone includes:
- Milestone 1 app scaffold (Next.js App Router, TypeScript, Tailwind, placeholder pages)
- Milestone 2 schema and Supabase connectivity check page
- Milestone 3 private admin login/logout and admin CRUD for venues/events
- Milestone 3 RLS policies for read-public/admin-write access

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Vercel-ready project structure

## Folder structure (Milestone 3 additions)

```text
app/
  admin/
    login/
      page.tsx                    # Admin email/password login
    (protected)/
      layout.tsx                  # Protects admin routes except /admin/login
      page.tsx                    # Admin landing page + logout
      venues/
        page.tsx                  # List venues
        new/page.tsx              # Create venue
        [id]/edit/page.tsx        # Edit/delete venue
      events/
        page.tsx                  # List upcoming events
        new/page.tsx              # Create event
        [id]/edit/page.tsx        # Edit event
components/
  admin/
    auth-gate.tsx                 # Client auth check + redirect to /admin/login
    logout-button.tsx             # Logout action
    venue-form.tsx                # Venue form
    event-form.tsx                # Event form
supabase/
  schema/
    milestone-2.sql               # Tables + indexes + timestamps
    milestone-3.sql               # RLS policies for venues/events
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

7. **Test admin flow**
   - Visit `http://localhost:3000/admin/login`
   - Sign in with the admin user created in Supabase
   - Confirm protected routes redirect when logged out

## Validation commands

Run these before pushing:

```bash
npm run lint
npm run build
```

## Notes
- `/admin/login` is the only unprotected admin route.
- This milestone intentionally does not add signup, password reset, roles, map features, public browsing features, recurring logic, or monetization.
