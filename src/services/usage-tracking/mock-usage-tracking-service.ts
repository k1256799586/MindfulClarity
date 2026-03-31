import type {
  EvaluatedUsageReading,
  UsageReading,
  WeeklyUsageInsight,
} from './types';

export function evaluateUsageLimits(
  readings: UsageReading[],
  limits: Array<{ appName: string; dailyLimitMinutes: number }>
): EvaluatedUsageReading[] {
  return readings.map((reading) => {
    const limit = limits.find((item) => item.appName === reading.appName);
    const dailyLimitMinutes = limit?.dailyLimitMinutes ?? reading.dailyLimitMinutes;

    return {
      ...reading,
      dailyLimitMinutes,
      isOverLimit: reading.minutesUsed > dailyLimitMinutes,
    };
  });
}

export function getWeeklyUsageInsight(): WeeklyUsageInsight {
  return {
    healthyAverageSessionLabel: '52m',
    peakAppName: 'Social Feed',
    peakDistractionLabel: '2h 14m',
    peakDistractionMinutes: 134,
  };
}
