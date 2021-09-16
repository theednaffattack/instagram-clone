import { css } from "@linaria/core";
import { useReducer } from "react";
import { logger } from "../lib/lib.logger";
import { useHandleElement } from "../lib/libs.hooks.use-dom-element";

type Test<T> = ReturnType<() => keyof T>;

const test: Test<HTMLElement> = "getBoundingClientRect";

logger.info({ test });

function RefExample(): JSX.Element {
  // GOOD EXAMPLE
  // From: https://stackoverflow.com/a/60476525/9448010
  const [isMounted, toggle] = useReducer((p: boolean) => !p, true);

  const [refLike, element] = useHandleElement<HTMLDivElement>(
    "getBoundingClientRect"
  );

  return (
    <div className={limegreenVar}>
      <button onClick={toggle}>Toggle</button>
      {isMounted && (
        <div className={exampleDivStyle} ref={refLike}>
          Example
        </div>
      )}
      <pre>{JSON.stringify(element, null, 2)}</pre>
    </div>
  );
}

export { RefExample as default };

const limegreenVar = css`
  --clr-limegreen: 120 60% 50%;
`;

const exampleDivStyle = css`
  border: 2px hsl(var(--clr-limegreen) / 1) dashed;
`;
