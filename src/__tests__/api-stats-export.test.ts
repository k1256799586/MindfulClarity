jest.mock('@/server/repository', () => ({
  getWeeklyStatsData: jest.fn(async () => ({
    averageSessionMinutes: 52,
    completedTaskCount: 3,
    contextSwitches: 14,
    distractionPeakAppName: 'Instagram',
    distractionPeakMinutes: 24,
    resilienceScore: 88,
  })),
  loadAppData: jest.fn(async () => ({
    appLimits: [],
    checkIns: [],
    focusSessions: [],
    hasSeenOnboarding: true,
    insight: { body: 'Body', title: 'Clarity Insight' },
    seededAt: '2026-03-31T09:00:00.000Z',
    settings: {
      deepWorkMode: true,
      monitoringEnabled: true,
      remindersEnabled: true,
      visualClarity: 'System',
      zenNotifications: true,
    },
    streak: { currentDays: 0, lastCheckInDate: '2026-03-31', longestDays: 0 },
    tasks: [],
    usageSnapshots: [],
  })),
}));

import exportHandler from '../../api/export';
import statsHandler from '../../api/stats';

describe('api/stats and api/export', () => {
  it('returns weekly stats', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await statsHandler({ method: 'GET' } as any, res);

    expect(status).toHaveBeenCalledWith(200);
  });

  it('exports app data', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await exportHandler({ method: 'GET' } as any, res);

    expect(status).toHaveBeenCalledWith(200);
  });
});
