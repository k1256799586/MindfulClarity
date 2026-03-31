import type { BootstrapPayload } from '@/lib/api-types';
import type { AppData, FocusSession, Task, UserSettings, WeeklyStatsSummary } from '@/types/models';

function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  return '/api';
}

function getWriteToken() {
  return process.env.EXPO_PUBLIC_APP_WRITE_TOKEN?.trim();
}

function buildWriteHeaders() {
  const token = getWriteToken();

  return token ? ({ 'x-app-write-token': token } as Record<string, string>) : undefined;
}

async function requestJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload.data as T;
}

export function shouldUseRemoteApi() {
  return Boolean(process.env.EXPO_PUBLIC_API_BASE_URL?.trim());
}

export function getBootstrapData() {
  return requestJson<BootstrapPayload>('/bootstrap');
}

export function getStatsData() {
  return requestJson<WeeklyStatsSummary>('/stats');
}

export async function getExportPayload() {
  const data = await requestJson<AppData>('/export');

  return JSON.stringify(data, null, 2);
}

export function createTask(input: {
  durationMinutes: number;
  highFocus?: boolean;
  lane: 'focus' | 'transition';
  reminderEnabled: boolean;
  scheduledLabel?: string;
  subtitle?: string;
  title: string;
}) {
  return requestJson<Task>('/tasks', {
    body: JSON.stringify(input),
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function updateTask(taskId: string, input: Partial<Task>) {
  return requestJson<Task>(`/tasks/${taskId}`, {
    body: JSON.stringify(input),
    headers: buildWriteHeaders(),
    method: 'PATCH',
  });
}

export function toggleTaskComplete(taskId: string) {
  return requestJson<Task>(`/tasks/${taskId}/toggle`, {
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function startFocusSession(input: {
  durationMinutes: number;
  taskId: string;
  taskTitle: string;
}) {
  return requestJson<FocusSession>('/focus-session/start', {
    body: JSON.stringify(input),
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function pauseFocusSession(remainingSeconds?: number) {
  return requestJson<FocusSession | null>('/focus-session/pause', {
    body: JSON.stringify({ remainingSeconds }),
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function resumeFocusSession() {
  return requestJson<FocusSession | null>('/focus-session/resume', {
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function completeFocusSession() {
  return requestJson<FocusSession | null>('/focus-session/complete', {
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function abandonFocusSession() {
  return requestJson<FocusSession | null>('/focus-session/abandon', {
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function submitCheckIn(input: { note: string; sessionId?: string }) {
  return requestJson('/check-ins', {
    body: JSON.stringify(input),
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}

export function updateSettings(input: Partial<UserSettings>) {
  return requestJson<UserSettings>('/settings', {
    body: JSON.stringify(input),
    headers: buildWriteHeaders(),
    method: 'PATCH',
  });
}

export function resetAppData() {
  return requestJson<BootstrapPayload | any>('/reset', {
    headers: buildWriteHeaders(),
    method: 'POST',
  });
}
