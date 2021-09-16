type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type AwaitReturnType<F extends (...args: any) => any> = Await<
  ReturnType<F>
>;
//  usage: AwaitReturnType<typeof someFunction>

type ReturnTuple = [any | null, Error | null];

export async function handleAsyncTs<U extends (...args: any[]) => Promise<any>>(
  func: U
) {
  return async function (...args: Parameters<U>): Promise<ReturnTuple> {
    try {
      let data = await func(...args);

      // If the promise succeeded but doesn't return
      // anything do this goofy thing, for now.
      if (data === null || data === undefined) {
        data = "successful promise";
        return [data, null];
      }
      // Proper data can just return
      return [data, null];
    } catch (error) {
      // If the error is a real Error object
      // just return to throw (or not) later.
      if (error instanceof Error) {
        return [null, error];
      }
      // If it's a string for some reason then
      // create an Error ojbect to be handled later.
      if (typeof error === "string") {
        return [null, new Error(error)];
      }
      // If it's of a strange type serialize it into
      // a new Error object and return it.
      return [null, new Error(JSON.stringify(error))];
    }
  };
}

// BEG SIMPLE SECTION

export async function handleAsyncSimple(
  func: any
): Promise<[any | null, Error | null]> {
  try {
    let data = await func();
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

export async function handleAsyncWithArgs(
  func: any,
  args: any[]
): Promise<[any | null, Error | null]> {
  try {
    let data = await func(...args);
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

// END SIMPLE SECTION

// BEG TYPING ATTEMPTS

export async function handleAsync(
  func: any,
  funcArgs?: Record<string, string>
): Promise<[any | null, Error | null]> {
  try {
    // For now we have to pass in args gross style
    if (funcArgs) {
      const data = await func(...func.arguments);
      return [data, null];
    } else {
      const data = await func(...func.arguments);
      return [data, null];
    }
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

export const wrapper =
  <U extends (...args: any[]) => any>(func: U) =>
  (...args: Parameters<U>): ReturnType<U> =>
    func(...args);

export const asyncWrapper =
  async <U extends (...args: any[]) => Promise<any>>(func: U) =>
  async (...args: Parameters<U>): Promise<ReturnType<U>> =>
    await func(...args);

// BEG TYPING ATTEMPTS

// | AType[] | null, Error | null]>
