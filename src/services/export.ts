import type { AppData } from '@/types/models';

export function buildExportPayload(data: AppData) {
  return JSON.stringify(data, null, 2);
}
