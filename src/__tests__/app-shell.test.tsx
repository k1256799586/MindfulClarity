import { render, screen } from '@testing-library/react-native';

import DashboardScreen from '../../app/(tabs)/index';

describe('Dashboard screen shell', () => {
  it('renders the current dashboard hero', () => {
    render(<DashboardScreen />);

    expect(screen.getByText('Mindful Productivity')).toBeTruthy();
    expect(screen.getByText('Deep Work: Architecture Phase')).toBeTruthy();
  });
});
