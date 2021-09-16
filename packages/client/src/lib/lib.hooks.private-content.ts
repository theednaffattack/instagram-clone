import { Dispatch, SetStateAction, useState } from "react";

// type UsePrivateRoute = [JSX.Element, Dispatch<SetStateAction<JSX.Element>>];

/**
 *
 * @returns a tuple of JSX.Element in the first position and a useState dispatch (Dispatch<SetStateAction<JSX.Element>>) in the second.
 */
export function usePrivateContent(): [
  JSX.Element | undefined,
  Dispatch<SetStateAction<JSX.Element | undefined>>
] {
  const [content, setContent] = useState<JSX.Element | undefined>();

  return [content, setContent];
}
