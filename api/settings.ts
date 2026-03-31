import { verifyAppWriteToken } from '@/server/auth';
import { jsonError, jsonOk } from '@/server/http';
import { loadAppData, updateSettingsData } from '@/server/repository';
import { settingsUpdateSchema } from '@/server/validation';

function getWriteToken(req: any) {
  return req.headers?.['x-app-write-token'] ?? req.headers?.['X-App-Write-Token'];
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const data = await loadAppData();
    const response = jsonOk(data.settings);

    return res.status(response.status).json(response.body);
  }

  if (req.method !== 'PATCH') {
    const response = jsonError('method_not_allowed', 'Use GET or PATCH', 405);
    return res.status(response.status).json(response.body);
  }

  if (!verifyAppWriteToken(getWriteToken(req))) {
    const response = jsonError('unauthorized', 'Invalid app write token', 401);
    return res.status(response.status).json(response.body);
  }

  const parsed = settingsUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    const response = jsonError('invalid_settings', 'Settings payload is invalid', 400);
    return res.status(response.status).json(response.body);
  }

  const data = await updateSettingsData(parsed.data);
  const response = jsonOk(data);

  return res.status(response.status).json(response.body);
}
