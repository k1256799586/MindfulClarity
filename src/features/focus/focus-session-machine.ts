import type { FocusSession } from '@/types/models';

type FocusSessionAction =
  | {
      type: 'START';
      taskId?: string;
      taskTitle: string;
      durationMinutes: number;
    }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK'; remainingSeconds: number }
  | { type: 'COMPLETE' }
  | { type: 'ABANDON' };

export function reduceFocusSession(
  session: FocusSession | undefined,
  action: FocusSessionAction
): FocusSession | undefined {
  if (action.type === 'START') {
    return {
      durationMinutes: action.durationMinutes,
      id: `session-${action.taskId ?? Date.now()}`,
      remainingSeconds: action.durationMinutes * 60,
      startedAt: new Date().toISOString(),
      status: 'active',
      taskId: action.taskId,
      taskTitle: action.taskTitle,
    };
  }

  if (!session) {
    return session;
  }

  switch (action.type) {
    case 'PAUSE':
      return {
        ...session,
        pausedAt: new Date().toISOString(),
        status: 'paused',
      };
    case 'RESUME':
      return {
        ...session,
        pausedAt: undefined,
        status: 'active',
      };
    case 'TICK':
      return {
        ...session,
        remainingSeconds: action.remainingSeconds,
      };
    case 'COMPLETE':
      return {
        ...session,
        completedAt: new Date().toISOString(),
        remainingSeconds: 0,
        status: 'completed',
      };
    case 'ABANDON':
      return {
        ...session,
        status: 'abandoned',
      };
    default:
      return session;
  }
}
