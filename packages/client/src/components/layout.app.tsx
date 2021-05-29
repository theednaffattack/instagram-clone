import * as React from "react";
import { ThemeType } from "../pages/_app";
import { globalStyles } from "../styles/global-styles";

export type LayoutProps = {
  children: React.ReactChildren[] | React.ReactChild;
  className: string;
  theme: ThemeType;
  toggleTheme: () => void;
};

export default function AppLayout({
  children,
  theme,
  toggleTheme,
}: LayoutProps): JSX.Element {
  return (
    <div id="main-grid" className={globalStyles}>
      <button onClick={toggleTheme}>{theme}</button>
      {children}
    </div>
  );
}
