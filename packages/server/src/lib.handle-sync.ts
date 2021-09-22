export function handleSyncSimple(func: any) {
  try {
    let data = func();
    // If the promise succeeded but doesn't return
    // anything do this goofy thing, for now.
    if (data === null || data === undefined) {
      data = "successful promise";
      return [data, null];
    }

    // If the call returns data forward that return
    return [data, null];
  } catch (error) {
    if (error instanceof Error) {
      return [null, error];
    }
    if (typeof error === "string") {
      return [null, new Error(error)];
    }
    return [null, new Error(JSON.stringify(error))];
  }
}
