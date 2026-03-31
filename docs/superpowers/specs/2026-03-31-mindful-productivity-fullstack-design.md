# Mindful Productivity Full-Stack MVP Design Spec

Date: 2026-03-31
Status: Approved in conversation, pending written-spec review

## 1. Overview

This spec defines the deployable full-stack MVP of Mindful Productivity.

The current repository already contains an Expo-based frontend MVP. This phase extends that app into a deployable personal system with:

- Expo frontend
- Vercel-hosted API layer
- Supabase Postgres as the system of record

The product remains a calm, focused productivity app for personal use. It helps a single owner plan tasks, run focus sessions, record check-ins, review stats, and manage distraction limits without pretending to offer impossible iOS-level monitoring behavior.

## 2. Product Boundary

This deployment target is a single-user, personal MVP.

### Included

- task management
- focus session lifecycle
- check-in and streak tracking
- weekly stats
- settings and app limits
- local-friendly UI with remote persistence
- deployable backend API
- deployable database schema and migrations
- export and reset flows

### Excluded

- public multi-user product behavior
- self-service user registration
- collaborative features
- AI recommendations
- multi-device sync semantics beyond the single owner account
- false claims of device-wide iOS app surveillance

## 3. Deployment Architecture

Recommended architecture:

- `Expo App`
- `Vercel Functions`
- `Supabase Postgres`

### Rationale

This is the lowest-cost practical stack for the current requirements.

- `Vercel Hobby` can host the API layer cheaply
- `Supabase Free` is sufficient for a personal MVP
- frontend and API can live in one repository
- the API layer can keep sensitive Supabase credentials off the client

## 4. Security Model

This app is intentionally designed for a personal, single-owner deployment.

There will be no end-user login flow. The app should behave as a private personal tool. Because of that, the client must not directly hold any privileged Supabase credentials.

### Security boundary

- the Expo app may only talk to the Vercel API
- the Vercel API holds the Supabase service credentials
- write operations must be protected by a server-side application token
- the deployment assumes the owner controls the deployed environment

### Explicit caveat

This is not an internet-safe anonymous multi-user security model. If the app later becomes a public product, the architecture must be upgraded to a real authentication and authorization model.

## 5. Frontend Responsibilities

The Expo app keeps the current navigation and visual system but shifts its data model.

### Frontend role

- render the UI
- manage transient UI state
- call the backend API
- cache fetched data locally where useful
- present loading, empty, active, completed, interrupted, and no-data states

### Frontend data strategy

The current Zustand store should stop being the primary database and become a UI/cache layer. Server responses become the source of truth.

Recommended additions:

- `src/lib/api-client.ts`
- request helpers per domain
- bootstrap fetch on app load
- mutation flows that revalidate local UI state after writes

## 6. Backend Responsibilities

The backend should be intentionally thin and live inside the same repository.

### Structure

- `api/` for Vercel route handlers
- `src/server/` or `lib/server/` for shared server utilities

### Server responsibilities

- validate requests
- enforce the app write token on protected operations
- read/write Supabase tables
- compute server-side summaries for dashboard and stats
- return stable JSON contracts to the client

The server should not contain unnecessary framework complexity. A simple route-based Vercel Functions structure is enough for this MVP.

## 7. Data Model

The data model should stay close to the current frontend entities.

### Tables

#### `tasks`

- `id`
- `title`
- `subtitle`
- `status`
- `lane`
- `scheduled_label`
- `duration_minutes`
- `reminder_enabled`
- `high_focus`
- `progress_ratio`
- `completed_at`
- `created_at`
- `updated_at`

#### `focus_sessions`

- `id`
- `task_id`
- `task_title_snapshot`
- `duration_minutes`
- `remaining_seconds`
- `status`
- `started_at`
- `ends_at`
- `paused_at`
- `completed_at`
- `created_at`
- `updated_at`

#### `check_ins`

- `id`
- `session_id`
- `note`
- `created_at`

#### `app_limits`

- `id`
- `app_name`
- `daily_limit_minutes`
- `created_at`
- `updated_at`

#### `usage_snapshots`

- `id`
- `app_name`
- `minutes_used`
- `daily_limit_minutes`
- `is_distracting`
- `category_label`
- `captured_on`

#### `settings`

Single-row table for the owner configuration:

- `deep_work_mode`
- `zen_notifications`
- `visual_clarity`
- `monitoring_enabled`
- `reminders_enabled`
- `updated_at`

#### `streak_state`

Single-row table:

- `current_days`
- `longest_days`
- `last_check_in_date`
- `updated_at`

#### `insight_summary`

Single-row table:

- `title`
- `body`
- `updated_at`

## 8. API Design

The frontend should consume product-oriented endpoints rather than talking directly to table shapes.

### Required endpoints

- `GET /api/bootstrap`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `POST /api/tasks/:id/toggle`
- `GET /api/focus-session/current`
- `POST /api/focus-session/start`
- `POST /api/focus-session/pause`
- `POST /api/focus-session/resume`
- `POST /api/focus-session/complete`
- `POST /api/focus-session/abandon`
- `POST /api/check-ins`
- `GET /api/stats`
- `GET /api/settings`
- `PATCH /api/settings`
- `POST /api/reset`
- `GET /api/export`

### API principles

- validate all inputs
- return stable JSON envelopes
- keep handlers thin
- centralize Supabase access helpers
- centralize stats aggregation helpers

## 9. Usage Tracking Honesty

The full-stack version still must not lie about iOS capabilities.

### Real

- persistence of usage snapshots
- app-limit configuration
- over-limit evaluation
- stats presentation

### Still mocked or abstracted

- true device-wide, unrestricted monitoring
- forced interruption of third-party apps

The app may store usage snapshots in the database so the owner gets persistence and consistent UI, but the underlying monitoring source remains an honest MVP abstraction.

## 10. Runtime Flow

### App boot

1. frontend calls `GET /api/bootstrap`
2. server returns tasks, current focus session, settings, streak, limits, snapshots, insight, and derived summaries
3. frontend hydrates its UI/cache store from that payload

### Task flow

- create/edit/toggle task through API
- refresh local cache after mutation
- keep task rows responsive and optimistic only when safe

### Focus flow

- start, pause, resume, complete, and abandon all go through API
- timestamps remain the canonical source for timer recovery
- completion can open check-in flow

### Check-in flow

- submitting a note creates a `check_ins` row
- linked task is marked done if appropriate
- streak is updated server-side
- stats are refreshed

### Reset flow

- API clears user data tables
- API reseeds the default starter state
- frontend reloads bootstrap data

## 11. Environment and Deployment

### Required environment variables

Frontend:

- `EXPO_PUBLIC_API_BASE_URL`

Server:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_WRITE_TOKEN`

### Repository additions

- `.env.example`
- `vercel.json`
- `supabase/migrations/`
- deployment instructions in `README.md`

### Deployment goal

After configuration, the owner should be able to:

1. create a Supabase project
2. run the migrations
3. set environment variables in Vercel
4. deploy the repository
5. point the Expo app to the deployed API

## 12. Testing Strategy

### Frontend

- preserve current screen and state tests
- add tests for API-backed flows where needed

### Backend

- endpoint contract tests
- input validation tests
- stats aggregation tests
- streak update tests
- reset/export tests

### Deployment verification

- build frontend
- typecheck frontend and backend
- verify API endpoints locally
- verify Vercel route compatibility

## 13. Implementation Phases

1. Add database schema, migrations, and server utilities
2. Add Vercel API routes for bootstrap, tasks, focus, settings, stats, reset, and export
3. Refactor frontend store into API-backed state
4. Replace seed-only flows with remote bootstrap and mutations
5. Add deployment config and environment examples
6. Run full verification for frontend, backend, and deployment build

## 14. Risks and Non-Goals

- no-login personal MVP is acceptable only for owner-controlled deployment
- this should not be marketed as secure for public anonymous use
- iOS monitoring limits remain real and must be documented honestly
- avoid over-engineering with a heavy backend framework

## 15. Approval Gate

Once this spec is reviewed and accepted, the next step is to write the implementation plan for the full-stack migration and deployment work.
