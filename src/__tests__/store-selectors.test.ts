import { createSeedData } from '@/data/seed';
import { buildDashboardSummary } from '@/store/selectors';

describe('buildDashboardSummary', () => {
  it('builds the dashboard summary from seeded local data', () => {
    const state = createSeedData();
    const summary = buildDashboardSummary(state);

    expect(summary.currentTaskTitle).toBe('Deep Work: Architecture Phase');
    expect(summary.streakDays).toBe(12);
    expect(summary.distractionMinutes).toBe(12);
  });
});
