export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskLane = 'focus' | 'transition';

export type Task = {
  id: string;
  title: string;
  subtitle?: string;
  status: TaskStatus;
  lane: TaskLane;
  scheduledLabel?: string;
  durationMinutes: number;
  reminderEnabled: boolean;
  highFocus?: boolean;
  progressRatio?: number;
  accentColor?: string;
  completedAt?: string;
};

export type FocusSessionStatus =
  | 'idle'
  | 'active'
  | 'paused'
  | 'completed'
  | 'abandoned';

export type FocusSession = {
  id: string;
  taskId?: string;
  taskTitle: string;
  durationMinutes: number;
  remainingSeconds: number;
  startedAt?: string;
  endsAt?: string;
  pausedAt?: string;
  completedAt?: string;
  status: FocusSessionStatus;
};

export type CheckIn = {
  id: string;
  sessionId: string;
  createdAt: string;
  note: string;
};

export type StreakSnapshot = {
  currentDays: number;
  longestDays: number;
  lastCheckInDate: string;
};

export type TrackedAppUsage = {
  id: string;
  appName: string;
  minutesUsed: number;
  dailyLimitMinutes: number;
  isDistracting: boolean;
  categoryLabel: string;
};

export type AppLimit = {
  id: string;
  appName: string;
  dailyLimitMinutes: number;
};

export type UserSettings = {
  deepWorkMode: boolean;
  zenNotifications: boolean;
  visualClarity: 'System' | 'Soft' | 'High Contrast';
  monitoringEnabled: boolean;
  remindersEnabled: boolean;
};

export type InsightSummary = {
  title: string;
  body: string;
};

export type AppData = {
  tasks: Task[];
  focusSessions: FocusSession[];
  checkIns: CheckIn[];
  streak: StreakSnapshot;
  usageSnapshots: TrackedAppUsage[];
  appLimits: AppLimit[];
  settings: UserSettings;
  insight: InsightSummary;
  hasSeenOnboarding: boolean;
  seededAt: string;
};

export type DashboardSummary = {
  currentTaskTitle: string;
  progressPercentage: number;
  distractionMinutes: number;
  streakDays: number;
  limitStatusLabel: string;
  upcomingTasks: Task[];
  currentTask?: Task;
};

export type WeeklyStatsSummary = {
  completedTaskCount: number;
  averageSessionMinutes: number;
  distractionPeakMinutes: number;
  distractionPeakAppName: string;
  contextSwitches: number;
  resilienceScore: number;
};
