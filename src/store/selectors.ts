import type {
  AppData,
  DashboardSummary,
  Task,
  WeeklyStatsSummary,
} from '@/types/models';
import { clamp } from '@/utils/format';

function getCurrentTask(tasks: Task[]) {
  return (
    tasks.find((task) => task.status === 'in_progress') ??
    tasks.find((task) => task.lane === 'focus' && task.status === 'todo')
  );
}

export function buildDashboardSummary(data: AppData): DashboardSummary {
  const currentTask = getCurrentTask(data.tasks);
  const distractionMinutes = data.usageSnapshots
    .filter((item) => item.isDistracting)
    .reduce((sum, item) => sum + item.minutesUsed, 0);
  const progressPercentage = clamp(
    Math.round((currentTask?.progressRatio ?? 0.68) * 100),
    0,
    100
  );
  const upcomingTasks = data.tasks.filter(
    (task) => task.id !== currentTask?.id && task.status !== 'done'
  );
  const isWithinRange = data.usageSnapshots.every(
    (item) => item.minutesUsed <= item.dailyLimitMinutes
  );

  return {
    currentTask,
    currentTaskTitle: currentTask?.title ?? 'Create your first focus task',
    progressPercentage,
    distractionMinutes,
    streakDays: data.streak.currentDays,
    limitStatusLabel: isWithinRange ? 'Within Range' : 'Action Required',
    upcomingTasks,
  };
}

export function buildWeeklyStatsSummary(data: AppData): WeeklyStatsSummary {
  const completedSessions = data.focusSessions.filter(
    (session) => session.status === 'completed'
  );
  const totalMinutes = completedSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0
  );
  const averageSessionMinutes =
    completedSessions.length > 0
      ? Math.round(totalMinutes / completedSessions.length)
      : 0;
  const distractionPeak = [...data.usageSnapshots].sort(
    (left, right) => right.minutesUsed - left.minutesUsed
  )[0];

  return {
    completedTaskCount: data.tasks.filter((task) => task.status === 'done')
      .length,
    averageSessionMinutes,
    distractionPeakMinutes: distractionPeak?.minutesUsed ?? 0,
    distractionPeakAppName: distractionPeak?.appName ?? 'None',
    contextSwitches: 14,
    resilienceScore: 88,
  };
}
