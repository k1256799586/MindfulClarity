import { render, screen } from '@testing-library/react-native';

import { MetricCard } from '@/components/metric-card';

describe('MetricCard', () => {
  it('renders a label and value', () => {
    render(<MetricCard label="Focus Streak" value="12 Days" />);

    expect(screen.getByText('Focus Streak')).toBeTruthy();
    expect(screen.getByText('12 Days')).toBeTruthy();
  });
});
