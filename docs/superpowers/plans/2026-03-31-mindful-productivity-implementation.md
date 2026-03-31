# Mindful Productivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-minded Honest Expo MVP of Mindful Productivity in the current workspace using React Native, Expo Router, TypeScript, local persistence, and an honest mocked usage-tracking abstraction.

**Architecture:** Build a local-first Expo Router app with five tabs and modal flows. Keep raw entities in a small Zustand store persisted via AsyncStorage, compute dashboard/stats summaries with selectors, and isolate usage tracking behind a service interface so device-level behavior can be upgraded later without rewriting UI code.

**Tech Stack:** Expo, React Native, TypeScript, Expo Router, Zustand, AsyncStorage, React Native SVG, Jest Expo, React Native Testing Library

---

## Planned File Structure

- `package.json`: app scripts and dependencies
- `.gitignore`: ignore Node, Expo, and local build outputs
- `app.json`: Expo app metadata and router plugin configuration
- `babel.config.js`: Expo Router Babel config
- `tsconfig.json`: TypeScript config
- `jest.config.js`: Jest Expo config
- `jest.setup.ts`: shared test setup
- `expo-env.d.ts`: Expo env typings
- `app/_layout.tsx`: root providers and navigation shell entry
- `app/+not-found.tsx`: fallback route
- `app/(tabs)/_layout.tsx`: bottom tab layout
- `app/(tabs)/index.tsx`: dashboard route
- `app/(tabs)/tasks.tsx`: tasks route
- `app/(tabs)/focus.tsx`: focus route
- `app/(tabs)/stats.tsx`: stats route
- `app/(tabs)/settings.tsx`: settings route
- `app/task-editor.tsx`: modal task create/edit route
- `app/check-in.tsx`: modal completion/check-in route
- `app/overuse-intervention.tsx`: modal overuse route
- `app/monitoring-info.tsx`: modal monitoring explanation route
- `src/theme/tokens.ts`: colors, spacing, radii, shadows
- `src/theme/typography.ts`: font sizes and text styles
- `src/theme/index.ts`: theme exports
- `src/components/`: shared UI primitives
- `src/features/tasks/`: task domain helpers and task-specific UI
- `src/features/focus/`: timer helpers and focus UI
- `src/features/stats/`: stat-card helpers and summary formatting
- `src/features/settings/`: settings rows and confirmation helpers
- `src/store/app-store.ts`: Zustand store and entity actions
- `src/store/selectors.ts`: derived dashboard/stats selectors
- `src/services/storage.ts`: persistence helpers if needed beyond Zustand middleware
- `src/services/usage-tracking/types.ts`: service contract
- `src/services/usage-tracking/mock-usage-tracking-service.ts`: MVP provider
- `src/services/export.ts`: JSON export helper
- `src/data/seed.ts`: seeded preview data for non-empty first launch
- `src/types/models.ts`: shared model types
- `src/utils/date.ts`: date/session helpers
- `src/utils/format.ts`: formatting helpers
- `src/__tests__/`: integration and selector tests

## Environment Notes

- Current workspace is not a git repository, so initialize git before the first commit.
- Git worktrees are not available until the repository exists. Execute inline in the current workspace after `git init`.
- Use seeded local data on first launch so the app is visually complete immediately, while still supporting real empty states in tests and reset flows.

### Task 1: Bootstrap Repo, Expo Tooling, and Test Harness

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`
- Create: `jest.config.js`
- Create: `jest.setup.ts`
- Create: `expo-env.d.ts`
- Create: `src/__tests__/app-shell.test.tsx`
- Create: `app/_layout.tsx`
- Create: `app/+not-found.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/tasks.tsx`
- Create: `app/(tabs)/focus.tsx`
- Create: `app/(tabs)/stats.tsx`
- Create: `app/(tabs)/settings.tsx`
- Test: `src/__tests__/app-shell.test.tsx`

- [ ] **Step 1: Initialize git and dependency manifest**

Run:
```bash
git init
npm init -y
```

Expected: `.git/` and `package.json` exist.

- [ ] **Step 2: Install runtime and test dependencies**

Run:
```bash
npm install expo react react-native expo-router expo-status-bar react-native-safe-area-context react-native-screens zustand @react-native-async-storage/async-storage react-native-svg
npm install -D typescript jest jest-expo @types/jest @testing-library/react-native @testing-library/jest-native react-test-renderer
```

Expected: install completes with no fatal errors.

- [ ] **Step 3: Write the failing shell test**

```tsx
import { render, screen } from '@testing-library/react-native';
import RootLayout from '../../app/_layout';

test('renders the mindful productivity tab shell', () => {
  render(<RootLayout />);

  expect(screen.getByText('Dashboard')).toBeTruthy();
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/app-shell.test.tsx
```

Expected: FAIL because the root layout and placeholder routes do not yet expose the expected label.

- [ ] **Step 5: Write the minimal Expo Router shell**

```tsx
export default function DashboardScreen() {
  return <Text>Dashboard</Text>;
}
```

Also add the router/plugin, Jest config, and placeholder tab routes so the app boots and tests can render.

- [ ] **Step 6: Run the test to verify it passes**

Run:
```bash
npm test -- --runInBand src/__tests__/app-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit bootstrap**

Run:
```bash
git add .
git commit -m "chore: bootstrap expo router project"
```

### Task 2: Theme System and Shared UI Primitives

**Files:**
- Create: `src/theme/tokens.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/index.ts`
- Create: `src/components/screen-shell.tsx`
- Create: `src/components/top-bar.tsx`
- Create: `src/components/section-header.tsx`
- Create: `src/components/primary-button.tsx`
- Create: `src/components/metric-card.tsx`
- Create: `src/components/empty-state.tsx`
- Create: `src/components/insight-card.tsx`
- Test: `src/__tests__/theme-rendering.test.tsx`

- [ ] **Step 1: Write the failing visual-system test**

```tsx
import { render, screen } from '@testing-library/react-native';
import { MetricCard } from '../components/metric-card';

test('renders a metric card with label and value', () => {
  render(<MetricCard label="Focus Streak" value="12 Days" />);

  expect(screen.getByText('Focus Streak')).toBeTruthy();
  expect(screen.getByText('12 Days')).toBeTruthy();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/theme-rendering.test.tsx
```

Expected: FAIL because the theme files and component do not exist yet.

- [ ] **Step 3: Implement tokens and primitives**

```ts
export const colors = {
  background: '#f5f4ef',
  surface: '#efefea',
  ink: '#1a1a1a',
  mint: '#4fb79b',
  alert: '#d96f67',
};
```

Implement primitives to match the screenshots: editorial typography, generous spacing, rounded cards, strong primary button styling, and warm neutral surfaces.

- [ ] **Step 4: Rebuild placeholder tab screens to use `ScreenShell`**

Replace raw `<Text>` placeholders with shell-wrapped content so the visual system is wired through real routes.

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
npm test -- --runInBand src/__tests__/theme-rendering.test.tsx src/__tests__/app-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the design system base**

Run:
```bash
git add .
git commit -m "feat: add theme tokens and shared ui primitives"
```

### Task 3: Model Types, Store, Selectors, and Seed Data

**Files:**
- Create: `src/types/models.ts`
- Create: `src/data/seed.ts`
- Create: `src/store/app-store.ts`
- Create: `src/store/selectors.ts`
- Create: `src/utils/date.ts`
- Create: `src/utils/format.ts`
- Test: `src/__tests__/store-selectors.test.ts`

- [ ] **Step 1: Write the failing selector test**

```ts
import { buildDashboardSummary } from '../store/selectors';
import { createSeedState } from '../data/seed';

test('builds dashboard summary from tasks, sessions, and usage', () => {
  const state = createSeedState();
  const summary = buildDashboardSummary(state);

  expect(summary.currentTaskTitle).toBe('Deep Work: Architecture Phase');
  expect(summary.streakDays).toBe(12);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/store-selectors.test.ts
```

Expected: FAIL because the store and selectors do not exist.

- [ ] **Step 3: Implement shared models and seeded local-first state**

```ts
export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  focusArea: 'focus' | 'transition';
  scheduledAt?: string;
  durationMinutes?: number;
  reminderEnabled: boolean;
};
```

Implement:
- model types
- seed generator
- Zustand store with persistence
- derived selectors for dashboard and weekly stats

- [ ] **Step 4: Add store actions and safe hydration defaults**

Implement create/edit/complete task, start/pause/resume/finish focus session, settings updates, reset state, and seed-on-first-launch behavior.

- [ ] **Step 5: Run the selector test and one smoke suite**

Run:
```bash
npm test -- --runInBand src/__tests__/store-selectors.test.ts src/__tests__/app-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the data foundation**

Run:
```bash
git add .
git commit -m "feat: add persisted app store and selectors"
```

### Task 4: Dashboard and Task Management Flow

**Files:**
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/tasks.tsx`
- Create: `app/task-editor.tsx`
- Create: `src/features/tasks/task-list-section.tsx`
- Create: `src/features/tasks/task-editor-form.tsx`
- Create: `src/features/tasks/task-row.tsx`
- Create: `src/features/tasks/task-grouping.ts`
- Create: `src/components/progress-ring-badge.tsx`
- Test: `src/__tests__/tasks-flow.test.tsx`

- [ ] **Step 1: Write the failing task-flow test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import TasksScreen from '../../app/(tabs)/tasks';

test('creates and completes a task', async () => {
  render(<TasksScreen />);

  fireEvent.press(screen.getByText('Add a moment of productivity...'));
  fireEvent.changeText(screen.getByPlaceholderText('Task name'), 'Prepare seminar notes');
  fireEvent.press(screen.getByText('Save Task'));

  expect(screen.getByText('Prepare seminar notes')).toBeTruthy();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/tasks-flow.test.tsx
```

Expected: FAIL because the task form flow does not exist yet.

- [ ] **Step 3: Implement dashboard summaries and task list UI**

Build the `Home` and `Tasks` routes to match the references:
- oversized current intent headline
- progress, streak, distraction cards
- upcoming tasks on dashboard
- grouped sections on tasks screen
- contextual distraction alert card

- [ ] **Step 4: Implement task create/edit modal**

Add a fast modal editor with:
- task title
- optional duration
- reminder toggle
- focus-area selection
- save/update/delete actions

- [ ] **Step 5: Wire completion and empty states**

Ensure first-run/no-task UI works, task completion updates dashboard summaries, and completed tasks render with distinct visual treatment.

- [ ] **Step 6: Run task-flow and selector tests**

Run:
```bash
npm test -- --runInBand src/__tests__/tasks-flow.test.tsx src/__tests__/store-selectors.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit dashboard and tasks**

Run:
```bash
git add .
git commit -m "feat: implement dashboard and task management flows"
```

### Task 5: Focus Session Lifecycle and Check-in Flow

**Files:**
- Modify: `app/(tabs)/focus.tsx`
- Create: `app/check-in.tsx`
- Create: `src/features/focus/focus-timer-ring.tsx`
- Create: `src/features/focus/focus-controls.tsx`
- Create: `src/features/focus/focus-session-card.tsx`
- Create: `src/features/focus/use-focus-clock.ts`
- Create: `src/features/focus/focus-session-machine.ts`
- Test: `src/__tests__/focus-session.test.ts`
- Test: `src/__tests__/focus-screen.test.tsx`

- [ ] **Step 1: Write the failing focus transition test**

```ts
import { reduceFocusSession } from '../features/focus/focus-session-machine';

test('moves from active to paused to completed', () => {
  const active = reduceFocusSession(undefined, { type: 'START', durationMinutes: 50 });
  const paused = reduceFocusSession(active, { type: 'PAUSE' });
  const completed = reduceFocusSession({ ...paused, remainingSeconds: 0 }, { type: 'COMPLETE' });

  expect(paused.status).toBe('paused');
  expect(completed.status).toBe('completed');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/focus-session.test.ts
```

Expected: FAIL because the reducer/state machine does not exist.

- [ ] **Step 3: Implement focus session state machine and timestamp-based timer hook**

Use timestamps to compute remaining time so the session recovers after backgrounding or reload.

- [ ] **Step 4: Build the focus screen and control states**

Implement:
- idle state with prompt to start
- active state with large timer ring
- paused state
- early-exit confirmation
- completed state opening the check-in modal

- [ ] **Step 5: Implement the check-in flow**

Allow session completion to update streak and optionally mark task progress with calm reinforcement language.

- [ ] **Step 6: Run focus tests**

Run:
```bash
npm test -- --runInBand src/__tests__/focus-session.test.ts src/__tests__/focus-screen.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit focus mode**

Run:
```bash
git add .
git commit -m "feat: implement focus session and check-in flows"
```

### Task 6: Stats, Settings, and Honest Usage-Tracking Abstraction

**Files:**
- Modify: `app/(tabs)/stats.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Create: `app/monitoring-info.tsx`
- Create: `src/services/usage-tracking/types.ts`
- Create: `src/services/usage-tracking/mock-usage-tracking-service.ts`
- Create: `src/features/stats/stat-card.tsx`
- Create: `src/features/stats/focus-consistency-grid.tsx`
- Create: `src/features/settings/settings-section.tsx`
- Create: `src/features/settings/toggle-row.tsx`
- Create: `src/services/export.ts`
- Test: `src/__tests__/usage-tracking.test.ts`
- Test: `src/__tests__/stats-screen.test.tsx`

- [ ] **Step 1: Write the failing usage-limit test**

```ts
import { evaluateUsageLimits } from '../services/usage-tracking/mock-usage-tracking-service';

test('flags apps that exceed the configured limit', () => {
  const result = evaluateUsageLimits(
    [{ appName: 'Instagram', minutesUsed: 44 }],
    [{ appName: 'Instagram', dailyLimitMinutes: 40 }]
  );

  expect(result[0].isOverLimit).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/usage-tracking.test.ts
```

Expected: FAIL because the service does not exist.

- [ ] **Step 3: Implement the mock usage service and stats selectors**

Add:
- service contract
- seeded usage snapshots
- over-limit evaluation
- weekly stats aggregation for focus, distraction, and consistency

- [ ] **Step 4: Build the stats screen**

Match the reference tone:
- card-based trend summaries
- distraction risk card
- session averages
- resilience/context-switch metrics
- empty-state fallback

- [ ] **Step 5: Build the settings screen**

Implement:
- focus-experience toggles
- reminder/monitoring sections
- monitoring limitations explainer
- export JSON action
- reset-confirmation flow

- [ ] **Step 6: Run usage and stats tests**

Run:
```bash
npm test -- --runInBand src/__tests__/usage-tracking.test.ts src/__tests__/stats-screen.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit stats and settings**

Run:
```bash
git add .
git commit -m "feat: implement stats settings and usage abstractions"
```

### Task 7: Overuse Intervention, Empty States, and App Polish

**Files:**
- Create: `app/overuse-intervention.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/tasks.tsx`
- Modify: `app/(tabs)/focus.tsx`
- Modify: `app/(tabs)/stats.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Create: `src/components/confirmation-sheet.tsx`
- Test: `src/__tests__/overuse-intervention.test.tsx`
- Test: `src/__tests__/empty-states.test.tsx`

- [ ] **Step 1: Write the failing overuse-intervention test**

```tsx
import { render, screen } from '@testing-library/react-native';
import OveruseInterventionScreen from '../../app/overuse-intervention';

test('renders return-to-focus and extend actions', () => {
  render(<OveruseInterventionScreen />);

  expect(screen.getByText('Return to Focus')).toBeTruthy();
  expect(screen.getByText('Extend by 5 Minutes')).toBeTruthy();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --runInBand src/__tests__/overuse-intervention.test.tsx
```

Expected: FAIL because the modal route does not exist.

- [ ] **Step 3: Implement intervention and confirmation surfaces**

Add:
- overuse modal
- early-exit confirmation
- reset confirmation
- export confirmation feedback

- [ ] **Step 4: Implement comprehensive empty/no-data states**

Ensure:
- no tasks
- no active focus session
- no stats yet
- monitoring unavailable
- reset state after clearing data

- [ ] **Step 5: Apply final layout polish across screens**

Tune spacing, typography, accent usage, card weights, and tab-bar styling to better match the screenshots.

- [ ] **Step 6: Run the focused UI suites**

Run:
```bash
npm test -- --runInBand src/__tests__/overuse-intervention.test.tsx src/__tests__/empty-states.test.tsx src/__tests__/focus-screen.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit polish**

Run:
```bash
git add .
git commit -m "feat: add intervention states and final polish"
```

### Task 8: Full Verification and Expo Run Check

**Files:**
- Modify: `README.md`
- Test: `src/__tests__/`

- [ ] **Step 1: Add run instructions**

Create `README.md` with:
- install
- test
- start Expo
- note on honest mocked monitoring behavior

- [ ] **Step 2: Run the complete test suite**

Run:
```bash
npm test -- --runInBand
```

Expected: PASS with 0 failing tests.

- [ ] **Step 3: Run static type verification**

Run:
```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 4: Start Expo and verify the app boots**

Run:
```bash
npx expo start --web --non-interactive
```

Expected: Expo starts without configuration errors. Capture the served URL if available, then stop the process after confirming startup.

- [ ] **Step 5: Final commit**

Run:
```bash
git add .
git commit -m "feat: deliver mindful productivity expo mvp"
```

## Review Notes

- If `expo-router` setup or Jest Expo config differs slightly from current package defaults, prefer the smallest change that preserves the planned structure.
- If a package install or Expo bootstrap command fails because the current directory already contains `docs/`, keep the docs directory and continue with manual file scaffolding instead of recreating the workspace elsewhere.
- Do not claim real device-wide app monitoring. The README and Settings screen must call out the MVP limitation clearly.
