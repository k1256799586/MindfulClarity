import { fireEvent, render, screen } from '@testing-library/react-native';

const mockBack = jest.fn();
const mockCreateTaskRemote = jest.fn();
const mockStoreState: any = {};

jest.mock('expo-router', () => ({
  router: {
    back: (...args: any[]) => mockBack(...args),
  },
}));

jest.mock('@/store/app-store', () => {
  return {
    useAppStore: (selector: any) => selector(mockStoreState),
  };
});

import TaskEditorScreen from '../../app/task-editor';

describe('Task editor remote flow', () => {
  beforeEach(() => {
    mockBack.mockReset();
    mockCreateTaskRemote.mockReset();
    Object.assign(mockStoreState, {
      createTaskRemote: mockCreateTaskRemote,
    });
  });

  it('creates a task through the remote store action', () => {
    render(<TaskEditorScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Task name'), 'Prepare seminar notes');
    fireEvent.press(screen.getByText('Save Task'));

    expect(mockCreateTaskRemote).toHaveBeenCalledWith(
      expect.objectContaining({
        durationMinutes: 45,
        lane: 'focus',
        reminderEnabled: true,
        title: 'Prepare seminar notes',
      })
    );
    expect(mockBack).toHaveBeenCalled();
  });
});
