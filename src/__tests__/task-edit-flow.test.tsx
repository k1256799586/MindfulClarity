import { fireEvent, render, screen } from '@testing-library/react-native';

import TasksScreen from '../../app/(tabs)/tasks';
import { useAppStore } from '@/store/app-store';

describe('Task edit flow', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
  });

  it('updates an existing task from the tasks screen', async () => {
    render(<TasksScreen />);

    fireEvent.press(screen.getAllByText('Edit')[0]);
    fireEvent.changeText(screen.getByPlaceholderText('Task name'), 'Review sprint plan');
    fireEvent.press(screen.getByText('Update Task'));

    expect(await screen.findByText('Review sprint plan')).toBeTruthy();
  });
});
