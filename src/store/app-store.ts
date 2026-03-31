import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createSeedData } from '@/data/seed';
import { getTodayKey } from '@/utils/date';
import type { AppData, FocusSession, Task, UserSettings } from '@/types/models';

type AppStoreState = AppData & {
  hydrated: boolean;
  createTask: (
    task: Omit<Task, 'id' | 'status' | 'progressRatio' | 'completedAt'>
  ) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (taskId: string) => void;
  startFocusSession: (taskId: string, taskTitle: string, durationMinutes: number) => void;
  pauseFocusSession: (remainingSeconds?: number) => void;
  resumeFocusSession: () => void;
  completeFocusSession: () => void;
  abandonFocusSession: () => void;
  submitCheckIn: (note: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetAppData: () => void;
  markHydrated: () => void;
};

const seed = createSeedData();

function buildFocusSession(
  taskId: string,
  taskTitle: string,
  durationMinutes: number
): FocusSession {
  const startedAt = new Date().toISOString();

  return {
    id: `session-${Date.now()}`,
    taskId,
    taskTitle,
    durationMinutes,
    remainingSeconds: durationMinutes * 60,
    startedAt,
    status: 'active',
  };
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      ...seed,
      hydrated: false,
      createTask: (task) =>
        set((state) => ({
          tasks: [
            {
              ...task,
              id: `task-${Date.now()}`,
              progressRatio: 0,
              status: 'todo',
            },
            ...state.tasks,
          ],
        })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      toggleTaskComplete: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completedAt:
                    task.status === 'done' ? undefined : new Date().toISOString(),
                  progressRatio: task.status === 'done' ? 0 : 1,
                  status: task.status === 'done' ? 'todo' : 'done',
                }
              : task
          ),
        })),
      startFocusSession: (taskId, taskTitle, durationMinutes) =>
        set((state) => ({
          focusSessions: [
            buildFocusSession(taskId, taskTitle, durationMinutes),
            ...state.focusSessions,
          ],
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: 'in_progress' } : task
          ),
        })),
      pauseFocusSession: (remainingSeconds) =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0 && session.status === 'active'
              ? {
                  ...session,
                  pausedAt: new Date().toISOString(),
                  remainingSeconds:
                    remainingSeconds ?? session.remainingSeconds,
                  status: 'paused',
                }
              : session
          ),
        })),
      resumeFocusSession: () =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0 && session.status === 'paused'
              ? {
                  ...session,
                  endsAt: new Date(
                    Date.now() + session.remainingSeconds * 1000
                  ).toISOString(),
                  pausedAt: undefined,
                  startedAt: new Date().toISOString(),
                  status: 'active',
                }
              : session
          ),
        })),
      completeFocusSession: () =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0
              ? {
                  ...session,
                  completedAt: new Date().toISOString(),
                  remainingSeconds: 0,
                  status: 'completed',
                }
              : session
          ),
        })),
      abandonFocusSession: () =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0
              ? {
                  ...session,
                  status: 'abandoned',
                }
              : session
          ),
        })),
      submitCheckIn: (note) =>
        set((state) => {
          const latestCompletedSession = state.focusSessions.find(
            (session) =>
              session.status === 'completed' &&
              !state.checkIns.some((checkIn) => checkIn.sessionId === session.id)
          );

          if (!latestCompletedSession) {
            return {};
          }

          const createdAt = new Date().toISOString();
          const todayKey = getTodayKey(new Date(createdAt));
          const normalizedNote = note.trim() || 'Protected a meaningful block of work.';
          const shouldIncrementStreak = state.streak.lastCheckInDate !== todayKey;
          const nextCurrentDays = shouldIncrementStreak
            ? state.streak.currentDays + 1
            : state.streak.currentDays;

          return {
            checkIns: [
              {
                id: `checkin-${Date.now()}`,
                createdAt,
                note: normalizedNote,
                sessionId: latestCompletedSession.id,
              },
              ...state.checkIns,
            ],
            streak: {
              currentDays: nextCurrentDays,
              lastCheckInDate: todayKey,
              longestDays: Math.max(state.streak.longestDays, nextCurrentDays),
            },
            tasks: state.tasks.map((task) =>
              task.id === latestCompletedSession.taskId
                ? {
                    ...task,
                    completedAt: createdAt,
                    progressRatio: 1,
                    status: 'done',
                  }
                : task
            ),
          };
        }),
      updateSettings: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        })),
      resetAppData: () =>
        set(() => ({
          ...createSeedData(),
          hydrated: true,
        })),
      markHydrated: () => ({
        hydrated: true,
      }),
    }),
    {
      name: 'mindful-productivity-store',
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
      partialize: (state) => ({
        tasks: state.tasks,
        focusSessions: state.focusSessions,
        checkIns: state.checkIns,
        streak: state.streak,
        usageSnapshots: state.usageSnapshots,
        appLimits: state.appLimits,
        settings: state.settings,
        insight: state.insight,
        hasSeenOnboarding: state.hasSeenOnboarding,
        seededAt: state.seededAt,
      }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getAppSeedState() {
  return createSeedData();
}
