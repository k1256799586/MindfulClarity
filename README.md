# Mindful Productivity

Mindful Productivity is a calm, editorial productivity app built with Expo and React Native. This repository now contains both:

- the mobile/web frontend
- a lightweight Vercel API layer
- Supabase migration files for persistent storage

It is designed as a personal, single-user MVP.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- React Native SVG
- Vercel Functions
- Supabase Postgres
- Zod
- Jest Expo + React Native Testing Library

## Local Development

Install dependencies:

```bash
npm install
```

Run verification:

```bash
npm test -- --runInBand
npx tsc --noEmit
npx expo-doctor
```

Start the app locally:

```bash
npx expo start
```

Run the web build locally:

```bash
npx expo export --platform web
```

## Environment Variables

Create a local `.env` from `.env.example`.

### Frontend

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_APP_WRITE_TOKEN`

### Server

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_WRITE_TOKEN`

For this personal MVP deployment, `EXPO_PUBLIC_APP_WRITE_TOKEN` and `APP_WRITE_TOKEN` are expected to match.

## Supabase Setup

1. Create a Supabase project
2. Open the SQL editor
3. Run the migration in:

`supabase/migrations/20260331_initial_schema.sql`

This creates:

- `tasks`
- `focus_sessions`
- `check_ins`
- `app_limits`
- `usage_snapshots`
- `settings`
- `streak_state`
- `insight_summary`

## Vercel Deployment

1. Import this repository into Vercel
2. Set the environment variables listed above
3. Use the included [vercel.json](./vercel.json)
4. Deploy

Vercel will:

- build the Expo web app into `dist`
- serve the static web build
- expose the `api/` directory as serverless functions

## Product Honesty

### Real in the current build

- task creation, editing, grouping, and completion
- focus session lifecycle
- check-in and streak logic
- settings toggles and reset flow
- API-backed bootstrap and backend route layer
- Supabase schema and persistence path

### Still mocked or abstracted on purpose

- device-wide distracting app monitoring
- forced interruption of third-party apps
- fully native Screen Time enforcement

These remain honest abstractions because Expo and iOS do not provide unrestricted cross-app control.

## Security Caveat

This repository is intentionally designed as a personal, no-login MVP.

That means:

- it is suitable for owner-controlled deployment
- it is not a safe public multi-user product
- if you later want real public usage, you must replace the write-token model with real authentication and authorization

## Notes

- The app ships under the name `Mindful Productivity` even though the reference artwork uses placeholder names such as `Mindful Clarity` and `Digital Sanctuary`.
- If `EXPO_PUBLIC_API_BASE_URL` is not configured, the app falls back to local-first behavior for development and tests.
