/**
 * The `addSeconds` function adds seconds of time to
 * the date passed.
 *
 * @param date Date object
 * @param seconds Seconds in integers
 * @returns New Date object
 */
export function addSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

/**
 * The `addMinutes` function adds minutes of time to
 * the date passed.
 *
 * @param date Date object
 * @param minutes Minutes in integers
 * @returns New Date object
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * The `addDays` function adds days of time to
 * the date passed.
 *
 * @param date Date object
 * @param days Days in integers
 * @returns New Date object
 */
export function addDays(date: Date, days: number) {
  const result = date;
  const _date = result.getTime() / 1000 + 60 * 60 * 24 * 1;
  result.setDate(_date + days);
  return result;
}

export function addDaysToNow(days: number) {
  const result = new Date();
  const date = result.getTime() / 1000 + 60 * 60 * 24 * 1;
  result.setDate(date + days);
  return result;
}
