import { buildWeeklyStatsPayload } from '@/server/stats';

describe('server stats', () => {
  it('builds weekly stats from sessions and usage snapshots', () => {
    const result = buildWeeklyStatsPayload({
      focusSessions: [{ duration_minutes: 50, status: 'completed' }],
      tasks: [{ status: 'done' }],
      usageSnapshots: [{ app_name: 'Instagram', minutes_used: 24 }],
    });

    expect(result.averageSessionMinutes).toBe(50);
    expect(result.completedTaskCount).toBe(1);
    expect(result.distractionPeakAppName).toBe('Instagram');
  });
});
