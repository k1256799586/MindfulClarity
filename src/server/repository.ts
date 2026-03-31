import { createSeedData } from '@/data/seed';
import { buildResetSeed } from '@/server/reset';
import { getSupabaseAdminClient } from '@/server/supabase-admin';
import { buildWeeklyStatsPayload } from '@/server/stats';
import { getTodayKey } from '@/utils/date';
import type { AppData, FocusSession, Task, UserSettings } from '@/types/models';

let localAppData: AppData = createSeedData();

function cloneAppData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getLocalAppData() {
  return cloneAppData(localAppData);
}

function setLocalAppData(nextState: AppData) {
  localAppData = cloneAppData(nextState);
  return getLocalAppData();
}

function toTask(input: Omit<Task, 'id' | 'status'> & Partial<Pick<Task, 'id' | 'status'>>) {
  return {
    ...input,
    id: input.id ?? `task-${Date.now()}`,
    status: input.status ?? 'todo',
  } satisfies Task;
}

function buildFocusSession(
  taskId: string,
  taskTitle: string,
  durationMinutes: number
): FocusSession {
  const startedAt = new Date().toISOString();

  return {
    durationMinutes,
    endsAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
    id: `session-${Date.now()}`,
    remainingSeconds: durationMinutes * 60,
    startedAt,
    status: 'active',
    taskId,
    taskTitle,
  };
}

function canUseSupabase() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function loadSingleRow<T>(
  table: string,
  fallback: T,
  matchPrimary = true
): Promise<T> {
  if (!canUseSupabase()) {
    return fallback;
  }

  const client: any = getSupabaseAdminClient();
  const query = matchPrimary
    ? client.from(table).select('*').eq('id', true).maybeSingle()
    : client.from(table).select('*').limit(1).maybeSingle();
  const { data, error } = await query;

  if (error || !data) {
    return fallback;
  }

  return data as T;
}

export async function loadAppData(): Promise<AppData> {
  const seed = createSeedData();

  if (!canUseSupabase()) {
    return getLocalAppData();
  }

  const client: any = getSupabaseAdminClient();
  const [tasks, focusSessions, checkIns, appLimits, usageSnapshots] =
    await Promise.all([
      client.from('tasks').select('*').order('created_at', { ascending: false }),
      client
        .from('focus_sessions')
        .select('*')
        .order('created_at', { ascending: false }),
      client.from('check_ins').select('*').order('created_at', { ascending: false }),
      client.from('app_limits').select('*').order('created_at', { ascending: false }),
      client
        .from('usage_snapshots')
        .select('*')
        .order('captured_on', { ascending: false }),
    ]);

  const appLimitRows = (appLimits.data ?? []) as any[];
  const checkInRows = (checkIns.data ?? []) as any[];
  const focusSessionRows = (focusSessions.data ?? []) as any[];
  const taskRows = (tasks.data ?? []) as any[];
  const usageSnapshotRows = (usageSnapshots.data ?? []) as any[];

  return {
    appLimits: appLimitRows.map((limit) => ({
      appName: limit.app_name,
      dailyLimitMinutes: limit.daily_limit_minutes,
      id: limit.id,
    })),
    checkIns: checkInRows.map((checkIn) => ({
      createdAt: checkIn.created_at,
      id: checkIn.id,
      note: checkIn.note,
      sessionId: checkIn.session_id,
    })),
    focusSessions: focusSessionRows.map((session) => ({
        completedAt: session.completed_at ?? undefined,
        durationMinutes: session.duration_minutes,
        endsAt: session.ends_at ?? undefined,
        id: session.id,
        pausedAt: session.paused_at ?? undefined,
        remainingSeconds: session.remaining_seconds,
        startedAt: session.started_at ?? undefined,
        status: session.status,
        taskId: session.task_id ?? undefined,
        taskTitle: session.task_title_snapshot,
      })),
    hasSeenOnboarding: seed.hasSeenOnboarding,
    insight: await loadSingleRow('insight_summary', seed.insight),
    seededAt: seed.seededAt,
    settings: await loadSingleRow('settings', seed.settings),
    streak: await loadSingleRow('streak_state', seed.streak),
    tasks: taskRows.map((task) => ({
        completedAt: task.completed_at ?? undefined,
        durationMinutes: task.duration_minutes,
        highFocus: task.high_focus,
        id: task.id,
        lane: task.lane,
        progressRatio: task.progress_ratio ?? undefined,
        reminderEnabled: task.reminder_enabled,
        scheduledLabel: task.scheduled_label ?? undefined,
        status: task.status,
        subtitle: task.subtitle ?? undefined,
        title: task.title,
      })),
    usageSnapshots: usageSnapshotRows.map((snapshot) => ({
        appName: snapshot.app_name,
        categoryLabel: snapshot.category_label,
        dailyLimitMinutes: snapshot.daily_limit_minutes,
        id: snapshot.id,
        isDistracting: snapshot.is_distracting,
        minutesUsed: snapshot.minutes_used,
      })),
  };
}

export async function updateSettingsData(input: Partial<UserSettings>) {
  const seed = getLocalAppData();
  const nextSettings = {
    ...seed.settings,
    ...input,
  };

  if (!canUseSupabase()) {
    setLocalAppData({
      ...seed,
      settings: nextSettings,
    });

    return nextSettings;
  }

  const client: any = getSupabaseAdminClient();
  const payload = {
    deep_work_mode: nextSettings.deepWorkMode,
    id: true,
    monitoring_enabled: nextSettings.monitoringEnabled,
    reminders_enabled: nextSettings.remindersEnabled,
    updated_at: new Date().toISOString(),
    visual_clarity: nextSettings.visualClarity,
    zen_notifications: nextSettings.zenNotifications,
  };

  const { data, error } = await client
    .from('settings')
    .upsert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to update settings');
  }

  return {
    deepWorkMode: data.deep_work_mode,
    monitoringEnabled: data.monitoring_enabled,
    remindersEnabled: data.reminders_enabled,
    visualClarity: data.visual_clarity,
    zenNotifications: data.zen_notifications,
  } satisfies UserSettings;
}

export async function resetAppData() {
  const seed = buildResetSeed();

  if (!canUseSupabase()) {
    return setLocalAppData(seed);
  }

  const client: any = getSupabaseAdminClient();

  await client.from('check_ins').delete().neq('id', '');
  await client.from('focus_sessions').delete().neq('id', '');
  await client.from('tasks').delete().neq('id', '');
  await client.from('app_limits').delete().neq('id', '');
  await client.from('usage_snapshots').delete().neq('id', '');

  await client.from('tasks').insert(
    seed.tasks.map((task) => ({
      completed_at: task.completedAt ?? null,
      duration_minutes: task.durationMinutes,
      high_focus: task.highFocus ?? false,
      id: task.id,
      lane: task.lane,
      progress_ratio: task.progressRatio ?? null,
      reminder_enabled: task.reminderEnabled,
      scheduled_label: task.scheduledLabel ?? null,
      status: task.status,
      subtitle: task.subtitle ?? null,
      title: task.title,
    }))
  );

  await client.from('focus_sessions').insert(
    seed.focusSessions.map((session) => ({
      completed_at: session.completedAt ?? null,
      duration_minutes: session.durationMinutes,
      ends_at: session.endsAt ?? null,
      id: session.id,
      paused_at: session.pausedAt ?? null,
      remaining_seconds: session.remainingSeconds,
      started_at: session.startedAt ?? null,
      status: session.status,
      task_id: session.taskId ?? null,
      task_title_snapshot: session.taskTitle,
    }))
  );

  await client.from('check_ins').insert(
    seed.checkIns.map((checkIn) => ({
      created_at: checkIn.createdAt,
      id: checkIn.id,
      note: checkIn.note,
      session_id: checkIn.sessionId,
    }))
  );

  await client.from('app_limits').insert(
    seed.appLimits.map((limit) => ({
      app_name: limit.appName,
      daily_limit_minutes: limit.dailyLimitMinutes,
      id: limit.id,
    }))
  );

  await client.from('usage_snapshots').insert(
    seed.usageSnapshots.map((snapshot) => ({
      app_name: snapshot.appName,
      category_label: snapshot.categoryLabel,
      daily_limit_minutes: snapshot.dailyLimitMinutes,
      id: snapshot.id,
      is_distracting: snapshot.isDistracting,
      minutes_used: snapshot.minutesUsed,
    }))
  );

  await client.from('settings').upsert({
    deep_work_mode: seed.settings.deepWorkMode,
    id: true,
    monitoring_enabled: seed.settings.monitoringEnabled,
    reminders_enabled: seed.settings.remindersEnabled,
    visual_clarity: seed.settings.visualClarity,
    zen_notifications: seed.settings.zenNotifications,
  });

  await client.from('streak_state').upsert({
    current_days: seed.streak.currentDays,
    id: true,
    last_check_in_date: seed.streak.lastCheckInDate,
    longest_days: seed.streak.longestDays,
  });

  await client.from('insight_summary').upsert({
    body: seed.insight.body,
    id: true,
    title: seed.insight.title,
  });

  return seed;
}

export async function createTaskData(
  input: Omit<Task, 'id' | 'status' | 'completedAt'>
) {
  if (!canUseSupabase()) {
    const nextTask = toTask({
      ...input,
      completedAt: undefined,
      progressRatio: input.progressRatio ?? 0,
    });

    setLocalAppData({
      ...localAppData,
      tasks: [nextTask, ...localAppData.tasks],
    });

    return nextTask;
  }

  const client: any = getSupabaseAdminClient();
  const payload = {
    completed_at: null,
    duration_minutes: input.durationMinutes,
    high_focus: input.highFocus ?? false,
    id: `task-${Date.now()}`,
    lane: input.lane,
    progress_ratio: input.progressRatio ?? 0,
    reminder_enabled: input.reminderEnabled,
    scheduled_label: input.scheduledLabel ?? null,
    status: 'todo',
    subtitle: input.subtitle ?? null,
    title: input.title,
  };
  const { data, error } = await client.from('tasks').insert(payload).select('*').single();

  if (error || !data) {
    throw error ?? new Error('Failed to create task');
  }

  return {
    completedAt: data.completed_at ?? undefined,
    durationMinutes: data.duration_minutes,
    highFocus: data.high_focus,
    id: data.id,
    lane: data.lane,
    progressRatio: data.progress_ratio ?? undefined,
    reminderEnabled: data.reminder_enabled,
    scheduledLabel: data.scheduled_label ?? undefined,
    status: data.status,
    subtitle: data.subtitle ?? undefined,
    title: data.title,
  } satisfies Task;
}

export async function updateTaskData(taskId: string, updates: Partial<Task>) {
  if (!canUseSupabase()) {
    const nextTasks = localAppData.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setLocalAppData({
      ...localAppData,
      tasks: nextTasks,
    });
    return nextTasks.find((task) => task.id === taskId) ?? null;
  }

  const client: any = getSupabaseAdminClient();
  const payload = {
    ...(updates.durationMinutes !== undefined
      ? { duration_minutes: updates.durationMinutes }
      : {}),
    ...(updates.highFocus !== undefined ? { high_focus: updates.highFocus } : {}),
    ...(updates.lane !== undefined ? { lane: updates.lane } : {}),
    ...(updates.progressRatio !== undefined
      ? { progress_ratio: updates.progressRatio }
      : {}),
    ...(updates.reminderEnabled !== undefined
      ? { reminder_enabled: updates.reminderEnabled }
      : {}),
    ...(updates.scheduledLabel !== undefined
      ? { scheduled_label: updates.scheduledLabel }
      : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
    ...(updates.subtitle !== undefined ? { subtitle: updates.subtitle } : {}),
    ...(updates.title !== undefined ? { title: updates.title } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client
    .from('tasks')
    .update(payload)
    .eq('id', taskId)
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to update task');
  }

  return {
    completedAt: data.completed_at ?? undefined,
    durationMinutes: data.duration_minutes,
    highFocus: data.high_focus,
    id: data.id,
    lane: data.lane,
    progressRatio: data.progress_ratio ?? undefined,
    reminderEnabled: data.reminder_enabled,
    scheduledLabel: data.scheduled_label ?? undefined,
    status: data.status,
    subtitle: data.subtitle ?? undefined,
    title: data.title,
  } satisfies Task;
}

export async function toggleTaskCompleteData(taskId: string) {
  const existing = (await loadAppData()).tasks.find((task) => task.id === taskId);

  if (!existing) {
    return null;
  }

  const nextStatus = existing.status === 'done' ? 'todo' : 'done';
  const nextTask = await updateTaskData(taskId, {
    completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
    progressRatio: nextStatus === 'done' ? 1 : 0,
    status: nextStatus,
  });

  return nextTask;
}

export async function getCurrentFocusSessionData() {
  return (await loadAppData()).focusSessions[0] ?? null;
}

export async function startFocusSessionData(input: {
  durationMinutes: number;
  taskId: string;
  taskTitle: string;
}) {
  if (!canUseSupabase()) {
    const session = buildFocusSession(
      input.taskId,
      input.taskTitle,
      input.durationMinutes
    );
    setLocalAppData({
      ...localAppData,
      focusSessions: [session, ...localAppData.focusSessions],
      tasks: localAppData.tasks.map((task) =>
        task.id === input.taskId ? { ...task, status: 'in_progress' } : task
      ),
    });
    return session;
  }

  const client: any = getSupabaseAdminClient();
  const session = buildFocusSession(
    input.taskId,
    input.taskTitle,
    input.durationMinutes
  );
  const { data, error } = await client
    .from('focus_sessions')
    .insert({
      duration_minutes: session.durationMinutes,
      ends_at: session.endsAt,
      id: session.id,
      remaining_seconds: session.remainingSeconds,
      started_at: session.startedAt,
      status: session.status,
      task_id: session.taskId,
      task_title_snapshot: session.taskTitle,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to start focus session');
  }

  await client
    .from('tasks')
    .update({ status: 'in_progress', updated_at: new Date().toISOString() })
    .eq('id', input.taskId);

  return {
    durationMinutes: data.duration_minutes,
    endsAt: data.ends_at ?? undefined,
    id: data.id,
    remainingSeconds: data.remaining_seconds,
    startedAt: data.started_at ?? undefined,
    status: data.status,
    taskId: data.task_id ?? undefined,
    taskTitle: data.task_title_snapshot,
  } satisfies FocusSession;
}

async function updateCurrentFocusSessionData(
  updates: Partial<FocusSession>,
  taskStatus?: Task['status']
) {
  const current = await getCurrentFocusSessionData();

  if (!current) {
    return null;
  }

  if (!canUseSupabase()) {
    const nextSession = { ...current, ...updates };
    setLocalAppData({
      ...localAppData,
      focusSessions: localAppData.focusSessions.map((session, index) =>
        index === 0 ? nextSession : session
      ),
      tasks:
        taskStatus === undefined
          ? localAppData.tasks
          : localAppData.tasks.map((task) =>
              task.id === current.taskId ? { ...task, status: taskStatus } : task
            ),
    });
    return nextSession;
  }

  const client: any = getSupabaseAdminClient();
  const payload = {
    ...(updates.completedAt !== undefined ? { completed_at: updates.completedAt } : {}),
    ...(updates.endsAt !== undefined ? { ends_at: updates.endsAt } : {}),
    ...(updates.pausedAt !== undefined ? { paused_at: updates.pausedAt } : {}),
    ...(updates.remainingSeconds !== undefined
      ? { remaining_seconds: updates.remainingSeconds }
      : {}),
    ...(updates.startedAt !== undefined ? { started_at: updates.startedAt } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('focus_sessions')
    .update(payload)
    .eq('id', current.id)
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to update focus session');
  }

  if (taskStatus !== undefined && current.taskId) {
    await client
      .from('tasks')
      .update({ status: taskStatus, updated_at: new Date().toISOString() })
      .eq('id', current.taskId);
  }

  return {
    completedAt: data.completed_at ?? undefined,
    durationMinutes: data.duration_minutes,
    endsAt: data.ends_at ?? undefined,
    id: data.id,
    pausedAt: data.paused_at ?? undefined,
    remainingSeconds: data.remaining_seconds,
    startedAt: data.started_at ?? undefined,
    status: data.status,
    taskId: data.task_id ?? undefined,
    taskTitle: data.task_title_snapshot,
  } satisfies FocusSession;
}

export async function pauseCurrentFocusSessionData(remainingSeconds?: number) {
  const current = await getCurrentFocusSessionData();
  if (!current) return null;
  return updateCurrentFocusSessionData({
    pausedAt: new Date().toISOString(),
    remainingSeconds: remainingSeconds ?? current.remainingSeconds,
    status: 'paused',
  });
}

export async function resumeCurrentFocusSessionData() {
  const current = await getCurrentFocusSessionData();
  if (!current) return null;
  return updateCurrentFocusSessionData({
    endsAt: new Date(Date.now() + current.remainingSeconds * 1000).toISOString(),
    pausedAt: undefined,
    startedAt: new Date().toISOString(),
    status: 'active',
  });
}

export async function completeCurrentFocusSessionData() {
  const current = await getCurrentFocusSessionData();
  if (!current) return null;
  return updateCurrentFocusSessionData(
    {
      completedAt: new Date().toISOString(),
      remainingSeconds: 0,
      status: 'completed',
    },
    'done'
  );
}

export async function abandonCurrentFocusSessionData() {
  return updateCurrentFocusSessionData(
    {
      status: 'abandoned',
    },
    'todo'
  );
}

export async function submitCheckInData(input: {
  note: string;
  sessionId?: string;
}) {
  const appData = await loadAppData();
  const session =
    appData.focusSessions.find((item) => item.id === input.sessionId) ??
    appData.focusSessions.find(
      (item) =>
        item.status === 'completed' &&
        !appData.checkIns.some((checkIn) => checkIn.sessionId === item.id)
    );

  if (!session) {
    return null;
  }

  const createdAt = new Date().toISOString();
  const todayKey = getTodayKey(new Date(createdAt));
  const shouldIncrement = appData.streak.lastCheckInDate !== todayKey;
  const nextCurrentDays = shouldIncrement
    ? appData.streak.currentDays + 1
    : appData.streak.currentDays;

  const nextCheckIn = {
    createdAt,
    id: `checkin-${Date.now()}`,
    note: input.note.trim(),
    sessionId: session.id,
  };

  if (!canUseSupabase()) {
    setLocalAppData({
      ...localAppData,
      checkIns: [nextCheckIn, ...localAppData.checkIns],
      streak: {
        currentDays: nextCurrentDays,
        lastCheckInDate: todayKey,
        longestDays: Math.max(localAppData.streak.longestDays, nextCurrentDays),
      },
      tasks: localAppData.tasks.map((task) =>
        task.id === session.taskId
          ? {
              ...task,
              completedAt: createdAt,
              progressRatio: 1,
              status: 'done',
            }
          : task
      ),
    });
    return nextCheckIn;
  }

  const client: any = getSupabaseAdminClient();
  const { data, error } = await client
    .from('check_ins')
    .insert({
      created_at: nextCheckIn.createdAt,
      id: nextCheckIn.id,
      note: nextCheckIn.note,
      session_id: nextCheckIn.sessionId,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create check-in');
  }

  await client.from('streak_state').upsert({
    current_days: nextCurrentDays,
    id: true,
    last_check_in_date: todayKey,
    longest_days: Math.max(appData.streak.longestDays, nextCurrentDays),
    updated_at: createdAt,
  });

  if (session.taskId) {
    await client
      .from('tasks')
      .update({
        completed_at: createdAt,
        progress_ratio: 1,
        status: 'done',
        updated_at: createdAt,
      })
      .eq('id', session.taskId);
  }

  return {
    createdAt: data.created_at,
    id: data.id,
    note: data.note,
    sessionId: data.session_id,
  };
}

export async function getWeeklyStatsData() {
  const data = await loadAppData();

  return buildWeeklyStatsPayload({
    focusSessions: data.focusSessions.map((session) => ({
      duration_minutes: session.durationMinutes,
      status: session.status,
    })),
    tasks: data.tasks.map((task) => ({
      status: task.status,
    })),
    usageSnapshots: data.usageSnapshots.map((snapshot) => ({
      app_name: snapshot.appName,
      minutes_used: snapshot.minutesUsed,
    })),
  });
}
