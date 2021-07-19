import { Dispatch, SetStateAction, useState } from "react";

// type UsePrivateRoute = [JSX.Element, Dispatch<SetStateAction<JSX.Element>>];

/**
 *
 * @returns a tuple of JSX.Element in the first position and a useState dispatch (Dispatch<SetStateAction<JSX.Element>>) in the second.
 */
export function usePrivateContent(): [
  JSX.Element,
  Dispatch<SetStateAction<JSX.Element>>
] {
  const [content, setContent] = useState<JSX.Element>();

  return [content, setContent];
}
