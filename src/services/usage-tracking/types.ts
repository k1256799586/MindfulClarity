export type UsageReading = {
  appName: string;
  minutesUsed: number;
  dailyLimitMinutes: number;
};

export type EvaluatedUsageReading = UsageReading & {
  isOverLimit: boolean;
};

export type WeeklyUsageInsight = {
  peakDistractionMinutes: number;
  peakDistractionLabel: string;
  peakAppName: string;
  healthyAverageSessionLabel: string;
};
