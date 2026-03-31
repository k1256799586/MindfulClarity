import { fireEvent, render, screen } from '@testing-library/react-native';

import FocusScreen from '../../app/(tabs)/focus';
import { useAppStore } from '@/store/app-store';

describe('Focus screen', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
  });

  it('pauses and resumes the active session', () => {
    render(<FocusScreen />);

    fireEvent.press(screen.getByText('Pause'));
    expect(screen.getByText('Resume')).toBeTruthy();

    fireEvent.press(screen.getByText('Resume'));
    expect(screen.getByText('Pause')).toBeTruthy();
  });
});
