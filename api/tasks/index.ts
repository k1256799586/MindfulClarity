import { verifyAppWriteToken } from '@/server/auth';
import { jsonCreated, jsonError, jsonOk } from '@/server/http';
import { createTaskData, loadAppData } from '@/server/repository';
import { taskMutationSchema } from '@/server/validation';

function getWriteToken(req: any) {
  return req.headers?.['x-app-write-token'] ?? req.headers?.['X-App-Write-Token'];
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const data = await loadAppData();
    const response = jsonOk(data.tasks);

    return res.status(response.status).json(response.body);
  }

  if (req.method !== 'POST') {
    const response = jsonError('method_not_allowed', 'Use GET or POST', 405);
    return res.status(response.status).json(response.body);
  }

  if (!verifyAppWriteToken(getWriteToken(req))) {
    const response = jsonError('unauthorized', 'Invalid app write token', 401);
    return res.status(response.status).json(response.body);
  }

  const parsed = taskMutationSchema.safeParse(req.body);

  if (!parsed.success) {
    const response = jsonError('invalid_task', 'Task payload is invalid', 400);
    return res.status(response.status).json(response.body);
  }

  const data = await createTaskData({
    durationMinutes: parsed.data.durationMinutes ?? 25,
    highFocus: parsed.data.highFocus ?? false,
    lane: parsed.data.lane ?? 'focus',
    progressRatio: 0,
    reminderEnabled: parsed.data.reminderEnabled ?? true,
    scheduledLabel: parsed.data.scheduledLabel,
    subtitle: parsed.data.subtitle,
    title: parsed.data.title,
  });
  const response = jsonCreated(data);

  return res.status(response.status).json(response.body);
}
