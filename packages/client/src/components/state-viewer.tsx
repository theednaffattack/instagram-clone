import { css } from "@linaria/core";
import { useState } from "react";

interface StateViewerProps {
  data: unknown;
}

type StateViewerState = "isVisible" | "isHidden";

export function StateViewer({ data }: StateViewerProps): JSX.Element {
  const [visibility, setVisibility] = useState<StateViewerState>("isVisible");
  const content =
    visibility === "isVisible" ? (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    ) : null;

  return (
    <div className={divStyles}>
      <button
        type="button"
        onClick={() => {
          setVisibility((prevState) => {
            if (prevState === "isVisible") return "isHidden";
            if (prevState === "isHidden") return "isVisible";
            // by default we'll just keep it hidden
            return "isHidden";
          });
        }}
      >
        {visibility === "isHidden" ? "open" : "close"}
      </button>
      {content}
    </div>
  );
}

const divStyles = css`
  border: 2px dashed limegreen;
`;
