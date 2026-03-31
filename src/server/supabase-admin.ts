import { createClient } from '@supabase/supabase-js';

import { getServerEnv } from '@/server/env';

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdminClient() {
  if (client) {
    return client;
  }

  const env = getServerEnv();

  client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as any;

  return client;
}
