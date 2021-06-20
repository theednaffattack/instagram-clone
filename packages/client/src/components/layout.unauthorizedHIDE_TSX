import Head from "next/head";
import * as React from "react";
import { GlobalWrapper } from "./global-wrapper";

interface LayoutProps {
  children: React.ReactChildren[] | React.ReactChild;
  className: string;
}

export default function Layout({ children }: LayoutProps) {
  const [isSelected, setIsSelected] = React.useState<string>(null);
  return (
    <GlobalWrapper id="global-wrapper">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </GlobalWrapper>
  );
}
