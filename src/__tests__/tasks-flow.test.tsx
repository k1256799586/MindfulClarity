import { fireEvent, render, screen } from '@testing-library/react-native';

import TasksScreen from '../../app/(tabs)/tasks';
import { useAppStore } from '@/store/app-store';

describe('Tasks screen flow', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
  });

  it('creates a new task from the quick-add flow', async () => {
    render(<TasksScreen />);

    fireEvent.press(screen.getByText('Add a moment of productivity...'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Task name'),
      'Prepare seminar notes'
    );
    fireEvent.press(screen.getByText('Save Task'));

    expect(await screen.findByText('Prepare seminar notes')).toBeTruthy();
  });
});
