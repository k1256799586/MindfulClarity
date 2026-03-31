import { fireEvent, render, screen } from '@testing-library/react-native';

import DashboardScreen from '../../app/(tabs)/index';
import { useAppStore } from '@/store/app-store';

describe('Dashboard empty state', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
    useAppStore.setState({
      focusSessions: [],
      tasks: [],
      usageSnapshots: [],
    });
  });

  it('renders a first-task prompt when there is no work queued', () => {
    render(<DashboardScreen />);

    expect(screen.getByText('Create your first task')).toBeTruthy();
    expect(screen.getByText('Start by capturing one meaningful task for today.')).toBeTruthy();
  });

  it('shows the create-first-task CTA', () => {
    render(<DashboardScreen />);

    expect(screen.getByText('Create first task')).toBeTruthy();
  });
});
