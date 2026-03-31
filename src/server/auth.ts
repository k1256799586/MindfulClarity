export function verifyAppWriteToken(token?: string | null) {
  const expected = process.env.APP_WRITE_TOKEN;

  if (!expected || token !== expected) {
    return false;
  }

  return true;
}
