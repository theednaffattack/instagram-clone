// Adapted from: https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object

export function serialize(obj: Record<string, any>): string {
  const str = [];

  for (const property in obj)
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      str.push(
        encodeURIComponent(property) + "=" + encodeURIComponent(obj[property])
      );
    }
  return str.join("&");
}
