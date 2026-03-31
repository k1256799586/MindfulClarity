import { reduceFocusSession } from '@/features/focus/focus-session-machine';

describe('reduceFocusSession', () => {
  it('moves from active to paused to completed', () => {
    const active = reduceFocusSession(undefined, {
      durationMinutes: 50,
      taskTitle: 'Mindful Clarity',
      type: 'START',
    });
    expect(active).toBeDefined();

    const paused = reduceFocusSession(active!, { type: 'PAUSE' });
    const completed = reduceFocusSession(
      { ...paused!, remainingSeconds: 0 },
      { type: 'COMPLETE' }
    );

    expect(paused?.status).toBe('paused');
    expect(completed?.status).toBe('completed');
  });
});
