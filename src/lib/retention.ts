const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calcPurgeAt(endedAt: Date): Date {
  return new Date(endedAt.getTime() + 30 * MS_PER_DAY);
}
