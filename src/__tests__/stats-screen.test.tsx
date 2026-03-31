import { render, screen } from '@testing-library/react-native';

import StatsScreen from '../../app/(tabs)/stats';
import { useAppStore } from '@/store/app-store';

describe('Stats screen', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
  });

  it('renders weekly performance metrics from local summaries', () => {
    render(<StatsScreen />);

    expect(screen.getByText('Clarity Stats')).toBeTruthy();
    expect(screen.getByText('52m')).toBeTruthy();
  });
});
