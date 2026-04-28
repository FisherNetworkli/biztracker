# Business Buying Tracker

A private business buying team dashboard built with Next.js, Supabase, and Vercel.

The app replaces the original Google Sheet workflow with:

- A shared-password login
- A latest-record dashboard with one card per person
- A daily entry form
- A high-urgency help feed
- A consistency leaderboard
- Stuck detection when someone logs the same deal stage 5+ times

## Getting Started

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
TRACKER_PASSWORD=your-shared-password
```

4. Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy on Vercel

Create a Vercel project from this repository and add the same environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `TRACKER_PASSWORD`

The app reads Supabase only from server-side code. Do not expose private service-role keys with a `NEXT_PUBLIC_` prefix.

## Data Model

The main table is `daily_entries`. `phase` is generated from `day`, so days 1-30 are `Phase 1 - Deal Flow` and day 31 onward is `Phase 2 - Closing`.

The homepage fetches recent records, groups them by normalized person name, and shows the newest record for each person.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
