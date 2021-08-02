interface PsuedoHistory {
  prevPath: string;
  currentPath: string;
}

export function getPathnameValues(): PsuedoHistory {
  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  // Set the previous path as the value of the current path.
  const prevPath = storage.getItem("prevPath");
  const currentPath = storage.getItem("currentPath");
  return { prevPath, currentPath };
}

export function storePathValues(): void {
  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  // Set the previous path as the value of the current path.
  const prevPath = storage.getItem("currentPath");
  storage.setItem("prevPath", prevPath);
  // Set the current path value by looking at the browser's location object.
  storage.setItem("currentPath", globalThis.location.pathname);
}
