import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createSeedData } from '@/data/seed';
import {
  abandonFocusSession as abandonFocusSessionRequest,
  completeFocusSession as completeFocusSessionRequest,
  createTask as createTaskRequest,
  getBootstrapData,
  getStatsData,
  pauseFocusSession as pauseFocusSessionRequest,
  resetAppData as resetAppDataRequest,
  resumeFocusSession as resumeFocusSessionRequest,
  shouldUseRemoteApi,
  startFocusSession as startFocusSessionRequest,
  submitCheckIn as submitCheckInRequest,
  toggleTaskComplete as toggleTaskCompleteRequest,
  updateSettings as updateSettingsRequest,
  updateTask as updateTaskRequest,
} from '@/lib/api-client';
import { buildDashboardSummary, buildWeeklyStatsSummary } from '@/store/selectors';
import { getTodayKey } from '@/utils/date';
import type {
  AppData,
  DashboardSummary,
  FocusSession,
  Task,
  UserSettings,
  WeeklyStatsSummary,
} from '@/types/models';

type AppStoreState = AppData & {
  currentFocusSession?: FocusSession;
  dashboard: DashboardSummary;
  hydrated: boolean;
  bootstrap: () => Promise<void>;
  refreshStats: () => Promise<void>;
  createTask: (
    task: Omit<Task, 'id' | 'status' | 'progressRatio' | 'completedAt'>
  ) => void;
  createTaskRemote: (
    task: Omit<Task, 'id' | 'status' | 'progressRatio' | 'completedAt'>
  ) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskRemote: (taskId: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskComplete: (taskId: string) => void;
  toggleTaskCompleteRemote: (taskId: string) => Promise<void>;
  startFocusSession: (taskId: string, taskTitle: string, durationMinutes: number) => void;
  startFocusSessionRemote: (
    taskId: string,
    taskTitle: string,
    durationMinutes: number
  ) => Promise<void>;
  pauseFocusSession: (remainingSeconds?: number) => void;
  pauseFocusSessionRemote: (remainingSeconds?: number) => Promise<void>;
  resumeFocusSession: () => void;
  resumeFocusSessionRemote: () => Promise<void>;
  completeFocusSession: () => void;
  completeFocusSessionRemote: () => Promise<void>;
  abandonFocusSession: () => void;
  abandonFocusSessionRemote: () => Promise<void>;
  submitCheckIn: (note: string) => void;
  submitCheckInRemote: (note: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateSettingsRemote: (updates: Partial<UserSettings>) => Promise<void>;
  weeklyStats: WeeklyStatsSummary;
  resetAppData: () => void;
  resetAppDataRemote: () => Promise<void>;
  markHydrated: () => void;
};

const seed = createSeedData();

function pickAppData(state: AppData | AppStoreState): AppData {
  return {
    appLimits: state.appLimits,
    checkIns: state.checkIns,
    focusSessions: state.focusSessions,
    hasSeenOnboarding: state.hasSeenOnboarding,
    insight: state.insight,
    seededAt: state.seededAt,
    settings: state.settings,
    streak: state.streak,
    tasks: state.tasks,
    usageSnapshots: state.usageSnapshots,
  };
}

function deriveStoreState(data: AppData) {
  return {
    currentFocusSession: data.focusSessions[0],
    dashboard: buildDashboardSummary(data),
    weeklyStats: buildWeeklyStatsSummary(data),
  };
}

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
    (set, get) => ({
      ...seed,
      ...deriveStoreState(seed),
      hydrated: false,
      bootstrap: async () => {
        const payload = await getBootstrapData();

        set(() => ({
          currentFocusSession: payload.currentFocusSession,
          dashboard: payload.dashboard,
          appLimits: payload.appLimits,
          checkIns: payload.checkIns,
          focusSessions: payload.focusSessions,
          hasSeenOnboarding: payload.hasSeenOnboarding,
          hydrated: true,
          insight: payload.insight,
          seededAt: payload.seededAt,
          settings: payload.settings,
          streak: payload.streak,
          tasks: payload.tasks,
          usageSnapshots: payload.usageSnapshots,
          weeklyStats: payload.weeklyStats,
        }));
      },
      refreshStats: async () => {
        if (!shouldUseRemoteApi()) {
          set((state) => deriveStoreState(pickAppData(state)));
          return;
        }

        const weeklyStats = await getStatsData();

        set(() => ({
          weeklyStats,
        }));
      },
      createTask: (task) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
            tasks: [
              {
                ...task,
                id: `task-${Date.now()}`,
                progressRatio: 0,
                status: 'todo',
              },
              ...state.tasks,
            ],
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      createTaskRemote: async (task) => {
        if (!shouldUseRemoteApi()) {
          get().createTask(task);
          return;
        }

        await createTaskRequest({
          durationMinutes: task.durationMinutes,
          highFocus: task.highFocus,
          lane: task.lane,
          reminderEnabled: task.reminderEnabled,
          scheduledLabel: task.scheduledLabel,
          subtitle: task.subtitle,
          title: task.title,
        });
        await get().bootstrap();
      },
      updateTask: (taskId, updates) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      updateTaskRemote: async (taskId, updates) => {
        if (!shouldUseRemoteApi()) {
          get().updateTask(taskId, updates);
          return;
        }

        await updateTaskRequest(taskId, updates);
        await get().bootstrap();
      },
      toggleTaskComplete: (taskId) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
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
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      toggleTaskCompleteRemote: async (taskId) => {
        if (!shouldUseRemoteApi()) {
          get().toggleTaskComplete(taskId);
          return;
        }

        await toggleTaskCompleteRequest(taskId);
        await get().bootstrap();
      },
      startFocusSession: (taskId, taskTitle, durationMinutes) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
            focusSessions: [
              buildFocusSession(taskId, taskTitle, durationMinutes),
              ...state.focusSessions,
            ],
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, status: 'in_progress' } : task
            ),
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      startFocusSessionRemote: async (taskId, taskTitle, durationMinutes) => {
        if (!shouldUseRemoteApi()) {
          get().startFocusSession(taskId, taskTitle, durationMinutes);
          return;
        }

        await startFocusSessionRequest({ durationMinutes, taskId, taskTitle });
        await get().bootstrap();
      },
      pauseFocusSession: (remainingSeconds) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
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
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      pauseFocusSessionRemote: async (remainingSeconds) => {
        if (!shouldUseRemoteApi()) {
          get().pauseFocusSession(remainingSeconds);
          return;
        }

        await pauseFocusSessionRequest(remainingSeconds);
        await get().bootstrap();
      },
      resumeFocusSession: () =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
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
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      resumeFocusSessionRemote: async () => {
        if (!shouldUseRemoteApi()) {
          get().resumeFocusSession();
          return;
        }

        await resumeFocusSessionRequest();
        await get().bootstrap();
      },
      completeFocusSession: () =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
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
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      completeFocusSessionRemote: async () => {
        if (!shouldUseRemoteApi()) {
          get().completeFocusSession();
          return;
        }

        await completeFocusSessionRequest();
        await get().bootstrap();
      },
      abandonFocusSession: () =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
            focusSessions: state.focusSessions.map((session, index) =>
              index === 0
                ? {
                    ...session,
                    status: 'abandoned',
                  }
                : session
            ),
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      abandonFocusSessionRemote: async () => {
        if (!shouldUseRemoteApi()) {
          get().abandonFocusSession();
          return;
        }

        await abandonFocusSessionRequest();
        await get().bootstrap();
      },
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

          const nextData = {
            ...pickAppData(state),
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
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      submitCheckInRemote: async (note) => {
        if (!shouldUseRemoteApi()) {
          get().submitCheckIn(note);
          return;
        }

        await submitCheckInRequest({ note });
        await get().bootstrap();
      },
      updateSettings: (updates) =>
        set((state) => {
          const nextData = {
            ...pickAppData(state),
            settings: {
              ...state.settings,
              ...updates,
            },
          } satisfies AppData;

          return {
            ...nextData,
            ...deriveStoreState(nextData),
          };
        }),
      updateSettingsRemote: async (updates) => {
        if (!shouldUseRemoteApi()) {
          get().updateSettings(updates);
          return;
        }

        await updateSettingsRequest(updates);
        await get().bootstrap();
      },
      resetAppData: () =>
        set(() => {
          const nextData = createSeedData();

          return {
            ...nextData,
            ...deriveStoreState(nextData),
            hydrated: true,
          };
        }),
      resetAppDataRemote: async () => {
        if (!shouldUseRemoteApi()) {
          get().resetAppData();
          return;
        }

        await resetAppDataRequest();
        await get().bootstrap();
      },
      markHydrated: () =>
        set((state) => ({
          ...deriveStoreState(pickAppData(state)),
          hydrated: true,
        })),
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
