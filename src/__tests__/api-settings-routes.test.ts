jest.mock('@/server/repository', () => ({
  resetAppData: jest.fn(async () => ({
    insight: { body: 'Body', title: 'Clarity Insight' },
    settings: {
      deepWorkMode: true,
      monitoringEnabled: true,
      remindersEnabled: true,
      visualClarity: 'System',
      zenNotifications: true,
    },
  })),
  updateSettingsData: jest.fn(async (input) => input),
}));

import resetHandler from '../../api/reset';
import settingsHandler from '../../api/settings';

describe('api/settings', () => {
  beforeEach(() => {
    process.env.APP_WRITE_TOKEN = 'secret-token';
  });

  it('rejects unauthorized settings writes', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await settingsHandler(
      {
        body: { deepWorkMode: false },
        headers: {},
        method: 'PATCH',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(401);
  });

  it('accepts authorized settings writes', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await settingsHandler(
      {
        body: { deepWorkMode: false },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'PATCH',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
  });

  it('resets app data with authorization', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await resetHandler(
      {
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
  });
});
