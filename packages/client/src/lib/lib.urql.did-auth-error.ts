import type { CombinedError } from "@urql/core";

export function didAuthError({ error }: { error: CombinedError }): boolean {
  return error.graphQLErrors.some((err) => {
    return err.extensions?.code === "FORBIDDEN";
  });
}
