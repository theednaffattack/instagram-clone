type TimeInterval = "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";

interface AddTimeProps {
  date: Date;
  amount: number;
  interval: TimeInterval;
}

// Adapted from: https://stackoverflow.com/a/1214753/9448010
// With JSFiddle: http://jsfiddle.net/2rgcosfe/

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param amount  Number of units of the given interval to add.
 */
export function addTime({ date, interval, amount }: AddTimeProps): Date | undefined {
  const intervalList = ["year", "quarter", "month", "week", "day", "hour", "minute", "second"];

  if (!(date instanceof Date))
    throw Error(
      `The "date" argument must be a valid Date Object.\nMDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date`
    );
  if (Number.isInteger(amount)) throw Error("The units argument must be an integer.");
  if (intervalList.indexOf(interval) === -1)
    throw Error(
      `The 'interval' argument must be either: "year", "quarter", "month", "week", "day", "hour", "minute", or "second"`
    );

  let ret: Date | undefined = new Date(date); // don't change original date

  const checkMonthRollover = function (): void {
    if (ret && ret.getDate() !== date.getDate()) ret.setDate(0);
  };

  if (ret) {
    switch (String(interval).toLowerCase()) {
      case "year":
        ret.setFullYear(ret.getFullYear() + amount);
        checkMonthRollover();
        break;
      case "quarter":
        ret.setMonth(ret.getMonth() + 3 * amount);
        checkMonthRollover();
        break;
      case "month":
        ret.setMonth(ret.getMonth() + amount);
        checkMonthRollover();
        break;
      case "week":
        ret.setDate(ret.getDate() + 7 * amount);
        break;
      case "day":
        ret.setDate(ret.getDate() + amount);
        break;
      case "hour":
        ret.setTime(ret.getTime() + amount * 3600000);
        break;
      case "minute":
        ret.setTime(ret.getTime() + amount * 60000);
        break;
      case "second":
        ret.setTime(ret.getTime() + amount * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
  }
  return ret;
}
