import { verifyAppWriteToken } from '@/server/auth';
import { jsonCreated, jsonError } from '@/server/http';
import { submitCheckInData } from '@/server/repository';
import { checkInSchema } from '@/server/validation';

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

  const parsed = checkInSchema.safeParse(req.body);

  if (!parsed.success) {
    const response = jsonError('invalid_check_in', 'Check-in payload is invalid', 400);
    return res.status(response.status).json(response.body);
  }

  const data = await submitCheckInData(parsed.data);
  const response = jsonCreated(data);

  return res.status(response.status).json(response.body);
}
