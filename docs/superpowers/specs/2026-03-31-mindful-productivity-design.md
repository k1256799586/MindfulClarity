# Mindful Productivity Design Spec

Date: 2026-03-31
Status: Approved in conversation, pending written-spec review

## 1. Overview

Mindful Productivity is a local-first mobile productivity app built for React Native, Expo, and TypeScript. It helps users reduce phone distraction, stay focused on meaningful work, and build sustainable execution habits through task planning, focus sessions, behavioral feedback, and honest distraction-awareness features.

The visual direction is based on the provided reference screens: calm editorial layouts, warm off-white backgrounds, strong black typography, mint/teal accents, soft gray cards, sparse coral alert accents, generous spacing, and a steady emotional tone.

## 2. Product Boundary

This project will ship as an Honest Expo MVP.

### Included in MVP

- Dashboard with current priority, primary focus CTA, progress, streak, and distraction summary
- Task creation, editing, completion, and lightweight planning
- Focus mode with timer lifecycle: active, paused, completed, and early exit
- Check-in flow and streak reinforcement
- Weekly stats derived from local activity data
- Settings for focus preferences, app limits, reminders, privacy, export, and monitoring explanation
- Usage-tracking and overuse-intervention UI built on an honest abstraction layer

### Explicitly excluded from MVP

- Social features
- AI recommendations
- Multi-device sync
- Claims of unrestricted device-wide monitoring on iOS
- Claims of force-closing or controlling third-party apps

## 3. Platform Honesty

The app must not pretend Expo or iOS can provide unrestricted real-time app surveillance.

### Real in MVP

- Task CRUD
- Local persistence
- Focus timer behavior
- Streak and check-in logic
- Derived dashboard and stats summaries
- Settings and app-limit configuration UI

### Honest abstractions in MVP

- Distracting app usage data
- Overuse intervention triggers

These are implemented through a `UsageTrackingService` boundary. The initial Expo MVP uses a local/mock provider with production-quality UI and state flow. A future native/platform-specific provider can replace the backing implementation without rewriting screen code.

## 4. Navigation Structure

Use Expo Router with a bottom-tab shell and modal routes.

### Tabs

- `Home`
- `Tasks`
- `Focus`
- `Stats`
- `Settings`

### Modal routes

- `Task Editor`
- `Check-in`
- `Overuse Intervention`
- `Monitoring Info`

This keeps navigation aligned with the reference screens while leaving room for focused modal interactions without adding unnecessary stack complexity.

## 5. Screen Intent

### Dashboard

Primary question answered: "What should I do right now?"

Required elements:

- current task or current intent
- primary `Start Focus` action
- today's progress
- streak
- distraction summary
- next 2-3 upcoming tasks
- one reflective insight or tip

### Tasks

Operational planning surface for the day.

Required elements:

- rapid task creation
- grouped task sections such as `Focus`, `Transition`, and `Completed`
- optional duration
- reminder toggle
- completion state
- visual differentiation for high-focus or priority tasks

### Focus

Immersive session state with minimal distraction.

Required states:

- active
- paused
- completed
- early exit confirmation

Required elements:

- task title
- countdown ring
- pause/resume
- end session
- optional sound/fullscreen helpers if supported cleanly

### Stats

Reflective weekly view based on local activity.

Required elements:

- completed task totals
- focus-session trends
- distraction trend summaries
- most-used distracting app from the usage abstraction layer
- consistency or resilience summaries

### Settings

Trust and control surface.

Required elements:

- focus preferences
- reminder preferences
- app-limit management
- monitoring explanation
- privacy/export
- reset confirmations

## 6. Missing States To Design And Implement

The references mostly show happy-path screens. The following states are required for a usable MVP:

- first-run empty state with `Create first task`
- empty dashboard when no current task exists
- create-task and edit-task flows
- paused focus timer
- completed focus timer with check-in
- early-exit confirmation
- overuse intervention modal or screen
- monitoring unavailable or limited explanation
- stats empty state when insufficient data exists
- settings confirmations for reset/export/toggle changes
- graceful fallback when linked task data changes during an active session

## 7. Architecture

Keep the codebase intentionally modular and local-first.

### Suggested folder shape

- `app/` for Expo Router routes
- `src/components/` for reusable UI primitives
- `src/features/tasks/`
- `src/features/focus/`
- `src/features/stats/`
- `src/features/settings/`
- `src/store/` for persisted state and selectors
- `src/services/` for reminders, export, and usage tracking boundaries
- `src/theme/` for tokens and typography

### Shared UI primitives

- `ScreenShell`
- `TopBar`
- `SectionHeader`
- `PrimaryButton`
- `MetricCard`
- `TaskRow`
- `InsightCard`
- `EmptyState`
- `ConfirmationSheet`
- `ToggleRow`
- `StatCard`
- `FocusTimerRing`

## 8. State Model

Use a small shared store with persisted entities and derived selectors. `Zustand + AsyncStorage` is the preferred baseline because it is lightweight, fits Expo well, and avoids unnecessary ceremony.

### Persisted entities

- `Task`
- `FocusSession`
- `CheckIn`
- `StreakSnapshot`
- `TrackedAppUsage`
- `AppLimit`
- `Settings`

### Derived data

- `DashboardSummary`
- `WeeklyStats`
- current task / current intent
- streak status
- distraction summaries

Derived summaries should be computed from raw entities rather than stored redundantly.

## 9. Runtime Behavior

### App launch

- hydrate persisted state from storage
- derive dashboard and stats summaries from raw entities
- show empty states instead of broken cards when no data exists

### Focus session lifecycle

Starting a session creates a `FocusSession` with:

- linked task ID
- target duration
- start timestamp
- status

The timer must derive remaining time from timestamps, not from a fragile in-memory interval alone. This allows recovery after backgrounding or reopening the app.

### Completion flow

Completing a session may open a `Check-in` flow that:

- updates streaks
- records completion metadata
- updates task progress
- contributes to stats summaries

### Usage tracking flow

The MVP `UsageTrackingService` returns seeded or locally recorded usage snapshots. Those snapshots are evaluated against configured app limits and can trigger an `Overuse Intervention` UI. The UI is real; the underlying device-wide monitoring is not claimed as real.

## 10. Error Handling

- If storage is empty, show guided empty states.
- If storage data is malformed, fall back to safe defaults and offer reset in Settings.
- If a linked task changes during a session, preserve the session with the last known task title.
- If monitoring is unavailable, explain the limitation clearly and keep settings informative.
- If stats data is insufficient, show a useful no-data state instead of zeros that imply false precision.

## 11. Testing Strategy

### Unit coverage

- streak calculation
- focus-session transitions
- dashboard selectors
- weekly stats aggregation
- app-limit evaluation

### Interaction coverage

- create/edit/complete task
- start/pause/resume/complete focus session
- early-exit confirmation
- check-in flow
- settings toggles and confirmations

### Manual verification

- visual fidelity against references
- persistence after reload
- timer recovery after backgrounding
- empty and no-data states
- modal flows

## 12. Implementation Phases

1. App shell, theme tokens, tab structure, shared UI primitives
2. Tasks and Dashboard with persistence and derived summaries
3. Focus mode with reliable timer lifecycle and check-in flow
4. Stats, Settings, usage abstraction, intervention flows, and polish
5. Test coverage and Expo verification

## 13. Open Constraints

- Workspace is currently not a git repository, so this spec cannot be committed yet.
- Formal subagent spec review was not available under the current tool-use policy; this document should therefore be treated as locally reviewed and pending user review.

## 14. Approval Gate

Once the user approves this written spec, the next step is to create the implementation plan using the writing-plans workflow. No product code should be written before that transition.
