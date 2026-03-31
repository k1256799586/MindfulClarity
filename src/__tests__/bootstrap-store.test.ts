import { useAppStore } from '@/store/app-store';

describe('bootstrap store', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        data: {
          appLimits: [],
          checkIns: [],
          currentFocusSession: undefined,
          dashboard: {
            currentTask: undefined,
            currentTaskTitle: 'Create your first task',
            distractionMinutes: 0,
            limitStatusLabel: 'Within Range',
            progressPercentage: 0,
            streakDays: 0,
            upcomingTasks: [],
          },
          focusSessions: [],
          hasSeenOnboarding: true,
          hydrated: true,
          insight: {
            body: 'Start with one task.',
            title: 'Clarity Insight',
          },
          seededAt: '2026-03-31T09:00:00.000Z',
          settings: {
            deepWorkMode: true,
            monitoringEnabled: true,
            remindersEnabled: true,
            visualClarity: 'System',
            zenNotifications: true,
          },
          streak: {
            currentDays: 0,
            lastCheckInDate: '2026-03-31',
            longestDays: 0,
          },
          tasks: [],
          usageSnapshots: [],
          weeklyStats: {
            averageSessionMinutes: 0,
            completedTaskCount: 0,
            contextSwitches: 0,
            distractionPeakAppName: 'None',
            distractionPeakMinutes: 0,
            resilienceScore: 0,
          },
        },
      }),
      ok: true,
      status: 200,
    } as Response);
  });

  it('hydrates state from bootstrap payload', async () => {
    await useAppStore.getState().bootstrap();

    expect(useAppStore.getState().hydrated).toBe(true);
    expect(global.fetch).toHaveBeenCalled();
  });
});
