import { useEffect, useState } from "react";

export function useHasMounted(): "hasMounted" | "hasNotMounted" {
  const [hasMounted, setHasMounted] =
    useState<"hasMounted" | "hasNotMounted">("hasNotMounted");
  useEffect(() => {
    setHasMounted("hasMounted");
  }, []);
  return hasMounted;
}
