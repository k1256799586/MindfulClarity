import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createSeedData } from '@/data/seed';
import type { AppData, FocusSession, Task, UserSettings } from '@/types/models';

type AppStoreState = AppData & {
  hydrated: boolean;
  createTask: (
    task: Omit<Task, 'id' | 'status' | 'progressRatio' | 'completedAt'>
  ) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (taskId: string) => void;
  startFocusSession: (taskId: string, taskTitle: string, durationMinutes: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  completeFocusSession: () => void;
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
        set(() => ({
          focusSessions: [buildFocusSession(taskId, taskTitle, durationMinutes)],
        })),
      pauseFocusSession: () =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0 && session.status === 'active'
              ? { ...session, pausedAt: new Date().toISOString(), status: 'paused' }
              : session
          ),
        })),
      resumeFocusSession: () =>
        set((state) => ({
          focusSessions: state.focusSessions.map((session, index) =>
            index === 0 && session.status === 'paused'
              ? { ...session, pausedAt: undefined, status: 'active' }
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
      updateSettings: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        })),
      resetAppData: () => ({
        ...createSeedData(),
        hydrated: true,
      }),
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
