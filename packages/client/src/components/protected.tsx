import React from "react";
import { useMeQuery } from "../generated/graphql";
import { logger } from "../lib/lib.logger";

interface ProtectedProps {
  children: React.ReactNode;
}

export function Protected({ children }: ProtectedProps): JSX.Element {
  const { data, error, loading } = useMeQuery({ fetchPolicy: "network-only" });
  if (error) {
    logger.error(error);
    return null;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (data && data.me) {
    // Otherwise render the create post page
    return <>{children}</>;
  }
  // We hope this is impossible?
}
