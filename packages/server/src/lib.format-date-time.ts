export function formatDateTime(date: string | number | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let hour = "" + d.getHours();
  let minutes = "" + d.getMinutes();
  let seconds = "" + d.getSeconds();

  // Append zero if the day or month are single
  // digits.
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (seconds.length < 2) seconds = "0" + seconds;

  const calendarDate = `${year}-${month}-${day}`;
  const time = `${hour}.${minutes}.${seconds}`;
  return calendarDate + "_" + time;
}
