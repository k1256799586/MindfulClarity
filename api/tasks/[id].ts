import { verifyAppWriteToken } from '@/server/auth';
import { jsonError, jsonOk } from '@/server/http';
import { updateTaskData } from '@/server/repository';
import { taskUpdateSchema } from '@/server/validation';

function getWriteToken(req: any) {
  return req.headers?.['x-app-write-token'] ?? req.headers?.['X-App-Write-Token'];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH') {
    const response = jsonError('method_not_allowed', 'Use PATCH', 405);
    return res.status(response.status).json(response.body);
  }

  if (!verifyAppWriteToken(getWriteToken(req))) {
    const response = jsonError('unauthorized', 'Invalid app write token', 401);
    return res.status(response.status).json(response.body);
  }

  const parsed = taskUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    const response = jsonError('invalid_task', 'Task payload is invalid', 400);
    return res.status(response.status).json(response.body);
  }

  const taskId = String(req.query?.id ?? '');
  const data = await updateTaskData(taskId, parsed.data);
  const response = jsonOk(data);

  return res.status(response.status).json(response.body);
}
