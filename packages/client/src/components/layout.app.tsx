import * as React from "react";
import { useState } from "react";
import { ThemeType } from "../pages/_app";
import { globalStyles } from "../styles/global-styles";

export type LayoutProps = {
  children: React.ReactChildren[] | React.ReactChild;
  className?: string;
};

export default function AppLayout({
  children,
  className,
}: LayoutProps): JSX.Element {
  const [themeState, setThemeState] = useState<ThemeType>("light");

  function toggleTheme(evt: React.MouseEvent) {
    evt.preventDefault();
    setThemeState((prevState) => {
      if (prevState === "light") {
        return "dark";
      }
      if (prevState === "dark") {
        return "light";
      }
    });
  }
  return (
    <div
      id="main-grid"
      className={className ? className + " " + globalStyles : globalStyles}
    >
      <button onClick={toggleTheme} type="button">
        {themeState}
      </button>
      {children}
    </div>
  );
}
