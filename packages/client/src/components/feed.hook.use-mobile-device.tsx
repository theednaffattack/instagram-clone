import { useEffect, useState } from "react";
import { isMobileOrTabletDevice } from "./lib.detect-mobile";

/**
 * A custom hook to detect mobile web devices.
 * Adapted from: https://dev.to/pmca/how-to-build-a-mobile-web-share-component-with-react-in-under-10-minutes-37jh
 *
 * @returns A tuple boolean
 */
export const useMobileDevice = (): [boolean] => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(isMobileOrTabletDevice());
  });

  return [isMobileOrTablet];
};
