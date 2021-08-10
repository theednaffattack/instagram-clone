import { useCallback, useRef } from "react";
import { logger } from "./lib.logger";

// adapted from: https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780

export function useHookWithRefCallback(): [(node: any) => void] {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
      logger.info("VIEW NODE");
      logger.info(node);
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [setRef];
}
