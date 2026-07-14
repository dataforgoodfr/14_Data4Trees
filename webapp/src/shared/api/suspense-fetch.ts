import { useCallback, useMemo, useState } from "react";

/**
 * Fetch data for React's `use()` + `<Suspense>`.
 *
 * `use(promise)` suspends until the promise settles, but it re-reads whatever
 * promise it is given on EVERY render. If a component created a brand-new
 * promise each render, it would suspend forever on a promise it never keeps.
 * So the promise handed to `use()` must be *stable* across renders — the same
 * instance until we explicitly decide to refetch.
 * See https://react.dev/reference/react/use#caching-promises-for-client-components
 *
 * This module memoises promises in a cache so the identical promise instance is
 * returned until a forced refetch replaces it.
 *
 * Typical usage:
 *
 * ```tsx
 * const { getDashboardData } = useApi();
 * const fetcher = useCallback(
 *   () => getDashboardData(LAYERS.INVENTARY),
 *   [getDashboardData],
 * );
 * const { dataPromise, retry } = useSuspenseData({ fetcher });
 *
 * return (
 *   <SuspenseBoundary resource={dataPromise} retry={retry}>
 *     <ChildThatCallsUse dataPromise={dataPromise} />
 *   </SuspenseBoundary>
 * );
 * ```
 */

// A no-argument function that starts a request. The fetcher's *identity* is the
// cache key: in this app fetchers come from `createApiClient(authToken)`, so a
// new auth token produces a new fetcher, which lands in a fresh cache bucket —
// stale (e.g. logged-out) data can never leak across sessions. A WeakMap lets
// buckets for gone-away fetchers be garbage-collected automatically.
type Fetcher<T> = () => Promise<T>;

// Sub-key used when a caller does not need several promises per fetcher.
const DEFAULT_KEY = "__default__";

const cache = new WeakMap<Fetcher<unknown>, Map<string, Promise<unknown>>>();

function getBucket<T>(fetcher: Fetcher<T>): Map<string, Promise<T>> {
  let bucket = cache.get(fetcher);
  if (!bucket) {
    bucket = new Map<string, Promise<T>>();
    cache.set(fetcher, bucket);
  }
  return bucket as Map<string, Promise<T>>;
}

/**
 * Return a cached promise for `fetcher`, creating and caching it on first call.
 *
 * - `key`: keep several promises alive for the same fetcher (e.g. one per
 *   layer). Omit it when a fetcher only ever produces one promise.
 * - `force`: skip the cache and replace the stored promise with a fresh fetch.
 *
 * Rejected promises are never cached: a failed request is dropped so the next
 * attempt (retry / remount) starts clean instead of replaying the old error.
 */
export function getCachedPromise<T>({
  fetcher,
  key = DEFAULT_KEY,
  force = false,
}: {
  fetcher: Fetcher<T>;
  key?: string;
  force?: boolean;
}): Promise<T> {
  const bucket = getBucket(fetcher);
  const cached = bucket.get(key);

  if (cached && !force) {
    return cached;
  }

  const promise = fetcher().catch((error) => {
    bucket.delete(key);
    throw error;
  });
  bucket.set(key, promise);

  return promise;
}

/**
 * Hand a parent component a stable, cached promise to pass down to a
 * `use()`-powered child, plus a `retry` that forces a fresh fetch.
 *
 * `fetcher` must be stable across renders (wrap it in `useCallback`) — its
 * identity scopes the cache. Pair the returned `dataPromise` and `retry` with
 * `<SuspenseBoundary>`.
 */
export function useSuspenseData<T>({
  fetcher,
  key,
}: {
  fetcher: Fetcher<T>;
  key?: string;
}): { dataPromise: Promise<T>; retry: () => void } {
  const [reloadKey, setReloadKey] = useState(0);

  const dataPromise = useMemo(
    // reloadKey === 0 on first render reuses any cached promise; each retry
    // bumps it, which both forces a refetch and re-runs this memo.
    () => getCachedPromise({ fetcher, force: reloadKey > 0, key }),
    [fetcher, key, reloadKey],
  );

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { dataPromise, retry };
}
