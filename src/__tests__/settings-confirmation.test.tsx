import { fireEvent, render, screen } from '@testing-library/react-native';

import SettingsScreen from '../../app/(tabs)/settings';
import { useAppStore } from '@/store/app-store';

describe('Settings confirmations', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
    useAppStore.getState().updateSettings({ deepWorkMode: false });
  });

  it('asks for confirmation before resetting stats', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Reset Productivity Stats'));
    expect(screen.getByText('Reset your progress?')).toBeTruthy();

    fireEvent.press(screen.getByText('Confirm Reset'));
    expect(useAppStore.getState().settings.deepWorkMode).toBe(true);
  });
});
