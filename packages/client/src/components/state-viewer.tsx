import { css } from "@linaria/core";
import { useState } from "react";
import { stateViewer } from "./styles";

interface StateViewerProps {
  state: any;
  title: string;
}

function StateViewer({ state, title }: StateViewerProps): JSX.Element {
  const [visibility, setVisibility] =
    useState<"isExpanded" | "isCollapsed">("isExpanded");

  const content =
    visibility === "isCollapsed" ? null : (
      <>
        <h1>{title}</h1>
        <pre className={preStyle}>{JSON.stringify(state, null, 2)}</pre>
      </>
    );
  function handleClick(event: any) {
    event.preventDefault();
    if (visibility === "isCollapsed") {
      setVisibility("isExpanded");
    }
    if (visibility === "isExpanded") {
      setVisibility("isCollapsed");
    }
  }
  return (
    <div className={stateViewer}>
      <button type="button" onClick={handleClick}>
        {visibility === "isCollapsed" ? `open` : "close"}
      </button>
      {content}
    </div>
  );
}

export { StateViewer };

const preStyle = css`
  white-space: pre-wrap;
`;
