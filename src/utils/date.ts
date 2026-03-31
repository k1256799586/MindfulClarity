export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function minutesToLabel(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}
