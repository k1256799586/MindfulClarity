import { useAppStore } from '@/store/app-store';

describe('Check-in flow', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
  });

  it('records a check-in and completes the linked task', () => {
    const store = useAppStore.getState();
    store.startFocusSession('task-review', 'Review Strategy', 45);
    store.completeFocusSession();
    useAppStore.getState().submitCheckIn('Locked in a calm review block.');

    const nextState = useAppStore.getState();
    const completedTask = nextState.tasks.find((task) => task.id === 'task-review');

    expect(nextState.checkIns[0]?.note).toBe('Locked in a calm review block.');
    expect(completedTask?.status).toBe('done');
    expect(nextState.streak.currentDays).toBeGreaterThanOrEqual(13);
  });
});
