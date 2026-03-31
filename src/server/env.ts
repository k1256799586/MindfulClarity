type ServerEnv = {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  appWriteToken: string;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getServerEnv(): ServerEnv {
  return {
    appWriteToken: requireEnv('APP_WRITE_TOKEN'),
    supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    supabaseUrl: requireEnv('SUPABASE_URL'),
  };
}
