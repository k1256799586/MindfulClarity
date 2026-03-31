import { buildDashboardSummary, buildWeeklyStatsSummary } from '@/store/selectors';
import type { AppData } from '@/types/models';

export function buildBootstrapPayload(data: AppData) {
  return {
    ...data,
    currentFocusSession: data.focusSessions[0],
    dashboard: buildDashboardSummary(data),
    weeklyStats: buildWeeklyStatsSummary(data),
  };
}
