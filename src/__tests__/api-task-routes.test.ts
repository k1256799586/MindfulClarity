jest.mock('@/server/repository', () => ({
  createTaskData: jest.fn(async (input) => ({
    ...input,
    id: 'task-created',
    status: 'todo',
  })),
  loadAppData: jest.fn(async () => ({
    appLimits: [],
    checkIns: [],
    focusSessions: [],
    hasSeenOnboarding: true,
    insight: { body: 'Body', title: 'Clarity Insight' },
    seededAt: '2026-03-31T09:00:00.000Z',
    settings: {
      deepWorkMode: true,
      monitoringEnabled: true,
      remindersEnabled: true,
      visualClarity: 'System',
      zenNotifications: true,
    },
    streak: { currentDays: 0, lastCheckInDate: '2026-03-31', longestDays: 0 },
    tasks: [],
    usageSnapshots: [],
  })),
  toggleTaskCompleteData: jest.fn(async () => ({
    id: 'task-review',
    status: 'done',
  })),
  updateTaskData: jest.fn(async (_taskId, input) => ({
    id: 'task-review',
    ...input,
  })),
}));

import taskByIdHandler from '../../api/tasks/[id]';
import taskToggleHandler from '../../api/tasks/[id]/toggle';
import tasksHandler from '../../api/tasks';

describe('api/tasks', () => {
  beforeEach(() => {
    process.env.APP_WRITE_TOKEN = 'secret-token';
  });

  it('lists tasks', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await tasksHandler({ method: 'GET' } as any, res);

    expect(status).toHaveBeenCalledWith(200);
  });

  it('creates a task when authorized', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await tasksHandler(
      {
        body: {
          durationMinutes: 45,
          lane: 'focus',
          reminderEnabled: true,
          title: 'Prepare seminar notes',
        },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(201);
  });

  it('updates a task when authorized', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await taskByIdHandler(
      {
        body: { title: 'Review sprint plan' },
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'PATCH',
        query: { id: 'task-review' },
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(200);
  });

  it('toggles a task when authorized', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await taskToggleHandler(
      {
        headers: { 'x-app-write-token': 'secret-token' },
        method: 'POST',
        query: { id: 'task-review' },
      } as any,
      res
    );

    expect(status).toHaveBeenCalledWith(200);
  });
});
