# Mindful Productivity Full-Stack MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current Expo-only MVP into a deployable personal full-stack app backed by Vercel Functions and Supabase while preserving the existing UI and honest product behavior.

**Architecture:** Keep the current Expo Router app and component system, add a thin API layer under `api/`, add Supabase migrations and server utilities, then refactor the frontend store from local-only persistence into API-backed bootstrap and mutation flows. Preserve honest mocked usage tracking, but persist its snapshots in Supabase like the rest of the app data.

**Tech Stack:** Expo, Expo Router, TypeScript, Zustand, Jest, Vercel Functions, Supabase Postgres, Supabase JS, Zod

---

## Planned File Structure

- `package.json`: add server-side and validation dependencies plus any scripts needed for local verification
- `.env.example`: frontend and backend environment variable documentation
- `vercel.json`: Vercel route/runtime configuration if needed
- `supabase/migrations/20260331_initial_schema.sql`: core schema and starter seed data
- `src/types/models.ts`: shared client/server domain types, adjusted for remote persistence
- `src/lib/api-client.ts`: typed frontend HTTP client
- `src/lib/api-types.ts`: shared API request/response shapes
- `src/store/app-store.ts`: shift from persisted-source store to API-backed UI/cache store
- `src/store/selectors.ts`: keep derived summaries working on API-backed state
- `src/data/seed.ts`: repurpose as server-side reset/bootstrap seed source or remove client-only assumptions
- `src/server/env.ts`: server env validation
- `src/server/supabase-admin.ts`: Supabase admin client
- `src/server/http.ts`: JSON response helpers and shared request guards
- `src/server/auth.ts`: app-token verification helpers
- `src/server/validation.ts`: Zod schemas for mutations
- `src/server/bootstrap.ts`: bootstrap payload assembly
- `src/server/stats.ts`: server-side stats aggregation
- `src/server/reset.ts`: reset-and-reseed workflow
- `api/bootstrap.ts`: bootstrap endpoint
- `api/tasks/index.ts`: list/create tasks
- `api/tasks/[id].ts`: patch task
- `api/tasks/[id]/toggle.ts`: toggle completion
- `api/focus-session/current.ts`: fetch current session
- `api/focus-session/start.ts`: start session
- `api/focus-session/pause.ts`: pause session
- `api/focus-session/resume.ts`: resume session
- `api/focus-session/complete.ts`: complete session
- `api/focus-session/abandon.ts`: abandon session
- `api/check-ins.ts`: submit check-in
- `api/stats.ts`: aggregated stats
- `api/settings.ts`: fetch/update settings
- `api/reset.ts`: reset and reseed
- `api/export.ts`: export JSON payload
- `app/_layout.tsx`: app bootstrap and loading state hook-up
- `app/(tabs)/index.tsx`: remote bootstrap data consumption
- `app/(tabs)/tasks.tsx`: task mutations via API
- `app/(tabs)/focus.tsx`: focus lifecycle via API
- `app/(tabs)/stats.tsx`: remote stats consumption
- `app/(tabs)/settings.tsx`: settings/reset/export via API
- `app/check-in.tsx`: submit server-backed check-in
- `src/__tests__/`: update/add API-backed tests
- `README.md`: deployment, local setup, Supabase and Vercel steps

## Environment Notes

- The current workspace contains uncommitted frontend changes. Treat those as the baseline to stabilize before full-stack migration rather than layering server work on top of an unstable local state model.
- The repo is currently on `master`, and the user explicitly asked to continue in the current workspace. Do not create a worktree unless the user later asks for isolation.
- The current session cannot use subagent review loops unless the user explicitly asks for delegation. Use inline execution and local verification instead.

### Task 1: Stabilize the Current Frontend Baseline

**Files:**
- Modify: `src/store/app-store.ts`
- Modify: `app/(tabs)/focus.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/(tabs)/tasks.tsx`
- Modify: `app/check-in.tsx`
- Modify: `src/features/tasks/task-editor-form.tsx`
- Modify: `src/features/tasks/task-list-section.tsx`
- Modify: `src/features/tasks/task-row.tsx`
- Create: `src/components/confirmation-sheet.tsx`
- Test: `src/__tests__/dashboard-empty-state.test.tsx`
- Test: `src/__tests__/task-edit-flow.test.tsx`
- Test: `src/__tests__/check-in-flow.test.ts`
- Test: `src/__tests__/settings-confirmation.test.tsx`
- Test: `src/__tests__/focus-screen.test.tsx`

- [ ] **Step 1: Run the current full test suite to confirm the starting point**

Run:
```bash
npm test -- --runInBand
```

Expected: PASS. If it fails, stop and fix baseline regressions before proceeding.

- [ ] **Step 2: Review the current local-only store contract before remote migration**

Inspect the existing task, focus, settings, and check-in flows so the API design preserves current behavior instead of replacing product semantics.

- [ ] **Step 3: Ensure the current local-first UX remains coherent**

Keep empty states, task editing, check-in submission, focus early-exit confirmation, and settings reset confirmation intact while the data layer changes later.

- [ ] **Step 4: Re-run the focused feature tests**

Run:
```bash
npm test -- --runInBand src/__tests__/dashboard-empty-state.test.tsx src/__tests__/task-edit-flow.test.tsx src/__tests__/check-in-flow.test.ts src/__tests__/settings-confirmation.test.tsx src/__tests__/focus-screen.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the stabilized frontend baseline**

```bash
git add app src package.json package-lock.json jest.setup.ts
git commit -m "feat: stabilize frontend baseline before full-stack migration"
```

### Task 2: Add Supabase Schema, Seed, and Server Utilities

**Files:**
- Create: `.env.example`
- Create: `supabase/migrations/20260331_initial_schema.sql`
- Create: `src/lib/api-types.ts`
- Create: `src/server/env.ts`
- Create: `src/server/supabase-admin.ts`
- Create: `src/server/http.ts`
- Create: `src/server/auth.ts`
- Create: `src/server/validation.ts`
- Create: `src/server/bootstrap.ts`
- Create: `src/server/stats.ts`
- Create: `src/server/reset.ts`
- Modify: `package.json`
- Test: `src/__tests__/server-stats.test.ts`
- Test: `src/__tests__/server-validation.test.ts`

- [ ] **Step 1: Write the failing server validation test**

```ts
import { taskMutationSchema } from '@/server/validation';

test('rejects an empty task title', () => {
  const result = taskMutationSchema.safeParse({ title: '' });
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/server-validation.test.ts
```

Expected: FAIL because the server validation module does not exist yet.

- [ ] **Step 3: Add runtime dependencies**

Install the smallest set needed for the backend layer:

```bash
npm install @supabase/supabase-js zod
```

- [ ] **Step 4: Implement server env validation and Supabase admin client**

Create helpers that read:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_WRITE_TOKEN`

and fail fast when required variables are missing on the server.

- [ ] **Step 5: Implement schema migration and starter seed**

Create SQL for all required tables and a minimal starter seed matching the current product:

- tasks
- focus_sessions
- check_ins
- app_limits
- usage_snapshots
- settings
- streak_state
- insight_summary

- [ ] **Step 6: Implement bootstrap, stats, reset, and validation helpers**

Keep these pure and testable rather than embedding logic directly into route handlers.

- [ ] **Step 7: Write and run a stats aggregation test**

```ts
import { buildWeeklyStatsPayload } from '@/server/stats';

test('builds weekly stats from sessions and usage snapshots', () => {
  const result = buildWeeklyStatsPayload({
    focusSessions: [{ status: 'completed', duration_minutes: 50 }],
    tasks: [{ status: 'done' }],
    usageSnapshots: [{ app_name: 'Instagram', minutes_used: 24 }],
  });

  expect(result.averageSessionMinutes).toBe(50);
});
```

Run:
```bash
npm test -- --runInBand src/__tests__/server-validation.test.ts src/__tests__/server-stats.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the backend foundation**

```bash
git add package.json package-lock.json .env.example supabase src/server src/lib/api-types.ts src/__tests__/server-validation.test.ts src/__tests__/server-stats.test.ts
git commit -m "feat: add supabase schema and server foundation"
```

### Task 3: Implement Vercel API Routes for Tasks, Focus, Settings, and Export

**Files:**
- Create: `api/bootstrap.ts`
- Create: `api/tasks/index.ts`
- Create: `api/tasks/[id].ts`
- Create: `api/tasks/[id]/toggle.ts`
- Create: `api/focus-session/current.ts`
- Create: `api/focus-session/start.ts`
- Create: `api/focus-session/pause.ts`
- Create: `api/focus-session/resume.ts`
- Create: `api/focus-session/complete.ts`
- Create: `api/focus-session/abandon.ts`
- Create: `api/check-ins.ts`
- Create: `api/stats.ts`
- Create: `api/settings.ts`
- Create: `api/reset.ts`
- Create: `api/export.ts`
- Test: `src/__tests__/api-bootstrap.test.ts`
- Test: `src/__tests__/api-task-routes.test.ts`
- Test: `src/__tests__/api-focus-routes.test.ts`
- Test: `src/__tests__/api-settings-routes.test.ts`

- [ ] **Step 1: Write the failing bootstrap API test**

```ts
import bootstrapHandler from '../../api/bootstrap';

test('returns dashboard bootstrap data', async () => {
  const req = { method: 'GET' } as any;
  const json = jest.fn();
  const res = { status: jest.fn(() => ({ json })), json } as any;

  await bootstrapHandler(req, res);

  expect(json).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the targeted API test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/api-bootstrap.test.ts
```

Expected: FAIL because the route and supporting helpers do not exist yet.

- [ ] **Step 3: Implement thin route handlers**

Each handler should:

1. validate the method
2. parse and validate input
3. call a server helper
4. return JSON

Avoid embedding aggregation or mutation logic directly in the route files.

- [ ] **Step 4: Protect write endpoints**

Require the app write token on:

- create/update/toggle task
- start/pause/resume/complete/abandon session
- submit check-in
- update settings
- reset

- [ ] **Step 5: Add focused route tests**

Cover at least:

- bootstrap returns expected sections
- task create/update/toggle route shape
- focus lifecycle route shape
- settings update and reset route shape

- [ ] **Step 6: Run the route test batch**

Run:
```bash
npm test -- --runInBand src/__tests__/api-bootstrap.test.ts src/__tests__/api-task-routes.test.ts src/__tests__/api-focus-routes.test.ts src/__tests__/api-settings-routes.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit the API layer**

```bash
git add api src/__tests__/api-*.test.ts src/server src/lib/api-types.ts
git commit -m "feat: add vercel api routes for full-stack mvp"
```

### Task 4: Replace Local-Only Store with API-Backed Bootstrap and Mutations

**Files:**
- Create: `src/lib/api-client.ts`
- Modify: `src/store/app-store.ts`
- Modify: `src/store/selectors.ts`
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/tasks.tsx`
- Modify: `app/(tabs)/focus.tsx`
- Modify: `app/(tabs)/stats.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/check-in.tsx`
- Test: `src/__tests__/bootstrap-store.test.ts`
- Test: `src/__tests__/tasks-flow.test.tsx`
- Test: `src/__tests__/focus-screen.test.tsx`
- Test: `src/__tests__/stats-screen.test.tsx`

- [ ] **Step 1: Write the failing bootstrap store test**

```ts
import { useAppStore } from '@/store/app-store';

test('hydrates state from bootstrap payload', async () => {
  await useAppStore.getState().bootstrap();
  expect(useAppStore.getState().hydrated).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/bootstrap-store.test.ts
```

Expected: FAIL because no API-backed bootstrap action exists yet.

- [ ] **Step 3: Implement the typed API client**

The client should centralize:

- base URL resolution from `EXPO_PUBLIC_API_BASE_URL`
- JSON parsing
- error handling
- auth header injection for protected writes

- [ ] **Step 4: Refactor the store**

Add actions such as:

- `bootstrap`
- `refreshStats`
- `createTaskRemote`
- `updateTaskRemote`
- `toggleTaskCompleteRemote`
- `startFocusSessionRemote`
- `pauseFocusSessionRemote`
- `resumeFocusSessionRemote`
- `completeFocusSessionRemote`
- `abandonFocusSessionRemote`
- `submitCheckInRemote`
- `updateSettingsRemote`
- `resetAppDataRemote`

- [ ] **Step 5: Update screens to use remote actions**

Keep the UI behavior the same, but replace direct local mutations with API-backed flows and reload/merge returned data.

- [ ] **Step 6: Preserve graceful loading and empty states**

The app must still show:

- dashboard first-run state
- task editor flow
- no active session
- stats no-data state
- settings confirmations

- [ ] **Step 7: Run the frontend regression suite**

Run:
```bash
npm test -- --runInBand src/__tests__/bootstrap-store.test.ts src/__tests__/tasks-flow.test.tsx src/__tests__/focus-screen.test.tsx src/__tests__/stats-screen.test.tsx src/__tests__/dashboard-empty-state.test.tsx src/__tests__/check-in-flow.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the frontend data migration**

```bash
git add app src/lib src/store src/__tests__
git commit -m "feat: connect expo app to backend api"
```

### Task 5: Finalize Deployment Config, Docs, and Full Verification

**Files:**
- Create: `vercel.json`
- Modify: `README.md`
- Modify: `package.json`
- Test: full suite

- [ ] **Step 1: Add deployment config**

Add:

- `.env.example`
- `vercel.json`
- any package scripts needed for verification

- [ ] **Step 2: Document local and production setup**

Update `README.md` with:

- local app run steps
- Supabase project setup
- migration execution steps
- Vercel env var setup
- personal-MVP security caveat
- Expo client configuration

- [ ] **Step 3: Run the complete test suite**

Run:
```bash
npm test -- --runInBand
```

Expected: PASS with 0 failing tests.

- [ ] **Step 4: Run static type verification**

Run:
```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 5: Run Expo project verification**

Run:
```bash
npx expo-doctor
```

Expected: all checks pass.

- [ ] **Step 6: Run a production-style web export**

Run:
```bash
npx expo export --platform web
```

Expected: export succeeds.

- [ ] **Step 7: Commit deployment readiness**

```bash
git add README.md vercel.json .env.example package.json package-lock.json
git commit -m "feat: prepare mindful productivity full-stack deployment"
```

## Review Notes

- Keep the API layer thin. If logic grows, move it into `src/server/` instead of bloating route files.
- Do not regress the current honest product boundary. Usage tracking remains persisted mock data unless a real platform integration exists.
- The app write token is acceptable only for a personal deployment. Do not represent it as a public multi-user security model.
- If Vercel route conventions require slight path adjustments, prefer the smallest routing change that preserves the API contract described in the spec.
