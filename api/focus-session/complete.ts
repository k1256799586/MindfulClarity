import { verifyAppWriteToken } from '@/server/auth';
import { jsonError, jsonOk } from '@/server/http';
import { completeCurrentFocusSessionData } from '@/server/repository';

function getWriteToken(req: any) {
  return req.headers?.['x-app-write-token'] ?? req.headers?.['X-App-Write-Token'];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    const response = jsonError('method_not_allowed', 'Use POST', 405);
    return res.status(response.status).json(response.body);
  }

  if (!verifyAppWriteToken(getWriteToken(req))) {
    const response = jsonError('unauthorized', 'Invalid app write token', 401);
    return res.status(response.status).json(response.body);
  }

  const data = await completeCurrentFocusSessionData();
  const response = jsonOk(data);

  return res.status(response.status).json(response.body);
}
