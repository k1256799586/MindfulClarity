jest.mock('@/server/repository', () => ({
  abandonCurrentFocusSessionData: jest.fn(async () => ({
    id: 'session-active',
    status: 'abandoned',
  })),
  completeCurrentFocusSessionData: jest.fn(async () => ({
    id: 'session-active',
    status: 'completed',
  })),
  getCurrentFocusSessionData: jest.fn(async () => ({
    id: 'session-active',
    status: 'active',
  })),
  pauseCurrentFocusSessionData: jest.fn(async () => ({
    id: 'session-active',
    status: 'paused',
  })),
  resumeCurrentFocusSessionData: jest.fn(async () => ({
    id: 'session-active',
    status: 'active',
  })),
  startFocusSessionData: jest.fn(async (input) => ({
    id: 'session-active',
    ...input,
    status: 'active',
  })),
  submitCheckInData: jest.fn(async (input) => ({
    createdAt: '2026-03-31T10:00:00.000Z',
    id: 'checkin-123',
    ...input,
    sessionId: input.sessionId ?? 'session-active',
  })),
}));

import abandonHandler from '../../api/focus-session/abandon';
import completeHandler from '../../api/focus-session/complete';
import currentHandler from '../../api/focus-session/current';
import pauseHandler from '../../api/focus-session/pause';
import resumeHandler from '../../api/focus-session/resume';
import startHandler from '../../api/focus-session/start';
import checkInsHandler from '../../api/check-ins';

describe('api/focus-session', () => {
  beforeEach(() => {
    process.env.APP_WRITE_TOKEN = 'secret-token';
  });

  it('returns the current session', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await currentHandler({ method: 'GET' } as any, res);

    expect(status).toHaveBeenCalledWith(200);
  });

  it('starts a focus session', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await startHandler(
      {
        body: {
          durationMinutes: 50,
          taskId: 'task-review',
          taskTitle: 'Review Strategy',
        },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(201);
  });

  it('pauses, resumes, completes, and abandons the current session', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    await pauseHandler(
      {
        body: { remainingSeconds: 1200 },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      { json, status } as any
    );
    await resumeHandler(
      {
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      { json, status } as any
    );
    await completeHandler(
      {
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      { json, status } as any
    );
    await abandonHandler(
      {
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      { json, status } as any
    );

    expect(status).toHaveBeenCalledWith(200);
  });

  it('creates a check-in', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await checkInsHandler(
      {
        body: { note: 'Locked in a calm review block.' },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(201);
  });
});
