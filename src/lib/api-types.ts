import type {
  AppData,
  DashboardSummary,
  FocusSession,
  WeeklyStatsSummary,
} from '@/types/models';

export type BootstrapPayload = AppData & {
  currentFocusSession?: FocusSession;
  dashboard: DashboardSummary;
  weeklyStats: WeeklyStatsSummary;
};

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};
