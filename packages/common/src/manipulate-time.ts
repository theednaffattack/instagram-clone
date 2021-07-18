export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function addDays(days: number) {
  const result = new Date();
  const date = result.getTime() / 1000 + 60 * 60 * 24 * 1;
  result.setDate(date + days);
  return result;
}
