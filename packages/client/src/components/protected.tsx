import React from "react";
import { useMeQuery } from "../generated/graphql";
import { logger } from "../lib/lib.logger";

interface ProtectedProps {
  children: React.ReactNode;
}

export function Protected({ children }: ProtectedProps): JSX.Element {
  const [{ data, error, fetching }] = useMeQuery();
  if (error) {
    logger.error(error);
    return <pre>JSON.stringify(error, null,2)</pre>;
  }
  if (fetching) {
    return <div>loading...</div>;
  }
  if (data && data.me) {
    // Otherwise render the create post page
    return <>{children}</>;
  }
  // We hope this is impossible?
  return <div>loading...</div>;
}
