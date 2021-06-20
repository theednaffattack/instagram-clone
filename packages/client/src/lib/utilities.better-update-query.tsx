import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  updateFn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => updateFn(result, data as any) as any);
}
