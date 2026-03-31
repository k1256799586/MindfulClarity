# Mindful Productivity

Honest Expo MVP for a calm, local-first focus and task management app inspired by the provided Mindful Clarity / Digital Sanctuary reference screens.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- React Native SVG
- Jest Expo + React Native Testing Library

## Run

```bash
npm install
npm test -- --runInBand
npx tsc --noEmit
npx expo start
```

## What Is Real In This MVP

- Task creation, editing, grouping, and completion
- Focus session lifecycle with pause/resume/complete/abandon states
- Check-in flow route
- Local persistence
- Dashboard and stats summaries driven by local state
- Settings toggles, reset flow, and local data export via share sheet

## What Is Mocked On Purpose

- Distracting-app usage tracking
- Overuse intervention triggers
- Weekly distraction peak insights

These features use an honest local/mock abstraction because Expo and iOS cannot provide unrestricted device-wide app monitoring or force-close third-party apps in the way the UI suggests.

## Notes

- The app ships under the name `Mindful Productivity` even though the reference artwork uses placeholder names such as `Mindful Clarity` and `Digital Sanctuary`.
- The current workspace was initialized as a git repository during implementation so commits are available locally.
