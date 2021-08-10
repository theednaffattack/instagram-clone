import { css } from "linaria";
import Link from "next/link";
import React from "react";

export function NotAuthenticated(): JSX.Element {
  return (
    <div className={flexContainer}>
      <p>NOT AUTHENTICATED</p>
      <Link passHref href="/">
        <a>login</a>
      </Link>
    </div>
  );
}

// BEGIN STYLES
const flexContainer = css`
  display: flex;
  flex-direction: column;
`;
// END STYLES
