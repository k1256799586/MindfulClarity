import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Share } from 'react-native';

jest.mock('@/lib/api-client', () => ({
  getExportPayload: jest.fn(async () => '{"tasks":[]}'),
  shouldUseRemoteApi: jest.fn(() => true),
}));

import SettingsScreen from '../../app/(tabs)/settings';
import { getExportPayload } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';

describe('Settings export remote flow', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppData();
    jest.spyOn(Share, 'share').mockResolvedValue({
      action: 'sharedAction',
      activityType: undefined,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exports through the API client when remote mode is enabled', async () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Export Data'));

    await waitFor(() => {
      expect(getExportPayload).toHaveBeenCalled();
      expect(Share.share).toHaveBeenCalledWith({
        message: '{"tasks":[]}',
        title: 'Mindful Productivity Export',
      });
    });
  });
});
