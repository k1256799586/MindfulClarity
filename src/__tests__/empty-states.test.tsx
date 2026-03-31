import { render, screen } from '@testing-library/react-native';

import StatsScreen from '../../app/(tabs)/stats';
import { useAppStore } from '@/store/app-store';

describe('Stats empty states', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
    useAppStore.setState({
      checkIns: [],
      focusSessions: [],
      tasks: [],
      usageSnapshots: [],
    });
  });

  it('renders a helpful no-data message when not enough activity exists', () => {
    render(<StatsScreen />);

    expect(screen.getByText('Build a few sessions first')).toBeTruthy();
  });
});
