import { useCallback, useState } from "react";
import { logger } from "./lib.logger";

// GOOD EXAMPLE
// From: https://stackoverflow.com/a/60476525/9448010

/**
 * @template ElementType - The element type extends HTMLElement.
 */
type ReturnTuple<ElementType> = [
  refLike: (node: ElementType) => void,
  element: ElementType | ElementType[keyof ElementType] | undefined
  // setElement: Dispatch<
  //   SetStateAction<ElementType | ElementType[keyof ElementType] | undefined>
  // >
];

/**
 * Reusable hook to handle DOM elements.
 * @template ElementType - Type of DOM node, extends `HTMLElement`.
 * @param {String} [methodName] The method name to call on the DOM node referenced by `refLike`.
 * @returns `ReturnTuple` a tuple with three items
 *   {@link ReturnTuple (see definition)}
 */
export function useHandleElement<ElementType>(
  methodName?: ReturnType<() => keyof ElementType>
): ReturnTuple<ElementType> {
  const [element, setElement] = useState<
    ElementType | ElementType[keyof ElementType]
  >();
  const refLike = useCallback<(node: ElementType) => void>(
    (node) => {
      // logger.info("INSIDE USE CALLBACK");
      // logger.info({ node, methodName });
      setElement(() => {
        // If a method name was supplied, apply it
        if (node && methodName && typeof node[methodName] === "function") {
          logger.info({
            typeof: typeof node[methodName],
            what: node[methodName],
          });

          return node[methodName];
        }
        // If no method was provided, skip it all
        return node;
      });
    },
    [methodName]
  );

  return [refLike, element];
}
