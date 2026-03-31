import { render, screen } from '@testing-library/react-native';

import DashboardScreen from '../../app/(tabs)/index';

describe('Dashboard screen shell', () => {
  it('renders the dashboard label', () => {
    render(<DashboardScreen />);

    expect(screen.getByText('Dashboard')).toBeTruthy();
  });
});
