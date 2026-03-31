type ServerFocusSession = {
  duration_minutes: number;
  status: string;
};

type ServerTask = {
  status: string;
};

type ServerUsageSnapshot = {
  app_name: string;
  minutes_used: number;
};

type BuildWeeklyStatsPayloadInput = {
  focusSessions: ServerFocusSession[];
  tasks: ServerTask[];
  usageSnapshots: ServerUsageSnapshot[];
};

export function buildWeeklyStatsPayload({
  focusSessions,
  tasks,
  usageSnapshots,
}: BuildWeeklyStatsPayloadInput) {
  const completedSessions = focusSessions.filter(
    (session) => session.status === 'completed'
  );
  const totalSessionMinutes = completedSessions.reduce(
    (sum, session) => sum + session.duration_minutes,
    0
  );
  const averageSessionMinutes =
    completedSessions.length > 0
      ? Math.round(totalSessionMinutes / completedSessions.length)
      : 0;
  const distractionPeak = [...usageSnapshots].sort(
    (left, right) => right.minutes_used - left.minutes_used
  )[0];

  return {
    averageSessionMinutes,
    completedTaskCount: tasks.filter((task) => task.status === 'done').length,
    contextSwitches: 14,
    distractionPeakAppName: distractionPeak?.app_name ?? 'None',
    distractionPeakMinutes: distractionPeak?.minutes_used ?? 0,
    resilienceScore: 88,
  };
}
