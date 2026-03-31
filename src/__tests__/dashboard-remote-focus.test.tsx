import { fireEvent, render, screen } from '@testing-library/react-native';

const mockPush = jest.fn();
const mockStartFocusSessionRemote = jest.fn();
const mockStoreState: any = {};

jest.mock('expo-router', () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
  },
}));

jest.mock('@/store/app-store', () => {
  return {
    useAppStore: (selector: any) => selector(mockStoreState),
  };
});

import DashboardScreen from '../../app/(tabs)/index';

describe('Dashboard remote focus flow', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockStartFocusSessionRemote.mockReset();
    Object.assign(mockStoreState, {
      appLimits: [],
      dashboard: {
        currentTask: {
          durationMinutes: 45,
          id: 'task-review',
          lane: 'focus',
          reminderEnabled: true,
          status: 'todo',
          title: 'Review Strategy',
        },
        currentTaskTitle: 'Review Strategy',
        distractionMinutes: 0,
        limitStatusLabel: 'Within Range',
        progressPercentage: 0,
        streakDays: 12,
        upcomingTasks: [],
      },
      focusSessions: [],
      insight: { body: 'Body', title: 'Clarity Insight' },
      settings: {
        deepWorkMode: true,
        monitoringEnabled: true,
        remindersEnabled: true,
        visualClarity: 'System',
        zenNotifications: true,
      },
      startFocusSessionRemote: mockStartFocusSessionRemote,
      streak: {
        currentDays: 12,
        lastCheckInDate: '2026-03-31',
        longestDays: 42,
      },
      tasks: [
        {
          durationMinutes: 45,
          id: 'task-review',
          lane: 'focus',
          reminderEnabled: true,
          status: 'todo',
          title: 'Review Strategy',
        },
      ],
      usageSnapshots: [],
    });
  });

  it('starts focus through the remote store action', () => {
    render(<DashboardScreen />);

    fireEvent.press(screen.getByText('Start Focus'));

    expect(mockStartFocusSessionRemote).toHaveBeenCalledWith(
      'task-review',
      'Review Strategy',
      45
    );
    expect(mockPush).toHaveBeenCalledWith('/focus');
  });
});
