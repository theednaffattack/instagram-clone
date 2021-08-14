import { ReactNode, useState } from "react";
import { positionFixedViewer } from "./styles";

interface PositionFixedWrapperProps {
  children: ReactNode;
}
export function PositionFixedWrapper({
  children,
}: PositionFixedWrapperProps): JSX.Element {
  function handleClick(event: any) {
    event.preventDefault();
    if (visibility === "isCollapsed") {
      setVisibility("isExpanded");
    }
    if (visibility === "isExpanded") {
      setVisibility("isCollapsed");
    }
  }
  const [visibility, setVisibility] =
    useState<"isExpanded" | "isCollapsed">("isExpanded");

  const content =
    visibility === "isExpanded" ? (
      <>
        <div>
          <button type="button" onClick={handleClick}>
            close all
          </button>
        </div>
        {children}
      </>
    ) : (
      <>
        <div>
          <button type="button" onClick={handleClick}>
            open
          </button>
        </div>
      </>
    );
  return <div className={positionFixedViewer}>{content}</div>;
}
