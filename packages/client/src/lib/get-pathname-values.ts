type NoPrevious = "noPrevPathAvailable";
type NoCurrent = "noCurrentPathAvailable";

interface PsuedoHistory {
  prevPath: string | NoPrevious;
  currentPath: string | NoCurrent;
}

export function getPathnameValues(): PsuedoHistory {
  const storage = globalThis?.sessionStorage;
  if (!storage)
    return {
      prevPath: "noPrevPathAvailable",
      currentPath: "noCurrentPathAvailable",
    };
  // Set the previous path as the value of the current path.
  const prevPath = storage.getItem("prevPath") ?? "noPrevPathAvailable";
  const currentPath =
    storage.getItem("currentPath") ?? "noCurrentPathAvailable";
  return { prevPath, currentPath };
}

export function storePathValues(): void {
  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  // Set the previous path as the value of the current path.
  const prevPath = storage.getItem("currentPath") ?? "noPrevPathAvailable";
  storage.setItem("prevPath", prevPath);
  // Set the current path value by looking at the browser's location object.
  storage.setItem("currentPath", globalThis.location.pathname);
}
