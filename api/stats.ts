import { jsonError, jsonOk } from '@/server/http';
import { getWeeklyStatsData } from '@/server/repository';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    const response = jsonError('method_not_allowed', 'Use GET', 405);
    return res.status(response.status).json(response.body);
  }

  const data = await getWeeklyStatsData();
  const response = jsonOk(data);

  return res.status(response.status).json(response.body);
}
