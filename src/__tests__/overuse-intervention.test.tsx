import { render, screen } from '@testing-library/react-native';

import OveruseInterventionScreen from '../../app/overuse-intervention';

describe('Overuse intervention', () => {
  it('renders return and extend actions', () => {
    render(<OveruseInterventionScreen />);

    expect(screen.getByText('Return to Focus')).toBeTruthy();
    expect(screen.getByText('Extend by 5 Minutes')).toBeTruthy();
  });
});
