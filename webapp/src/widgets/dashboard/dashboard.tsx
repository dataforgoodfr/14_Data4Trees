import { Suspense, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getFallbackRender } from "@widgets/dashboard/error-boundary-fallback";
import LoadedDashboard, {
  type DashboardData,
} from "@widgets/dashboard/loaded-dashboard";
import Loading from "@widgets/dashboard/loading";

import { LAYERS } from "@shared/api/layers";
import { useApi } from "@shared/hooks/useApi";
import { useTranslation } from "@shared/i18n";

type GetDashboardData = (layer: string) => Promise<DashboardData>;
type Layer = (typeof LAYERS)[keyof typeof LAYERS];

// ✅ Cache Promises so the same one is reused across renders
// required by 'use()', see https://react.dev/reference/react/use#caching-promises-for-client-components
// Cache is scoped by API client (auth token) + layer to avoid leaking data across sessions.
const cache = new WeakMap<
  GetDashboardData,
  Map<Layer, Promise<DashboardData>>
>();

function getPerApiCache(getDashboardData: GetDashboardData) {
  const perApiCache = cache.get(getDashboardData);
  if (perApiCache) {
    return perApiCache;
  }
  const newPerApiCache = new Map<Layer, Promise<DashboardData>>();
  cache.set(getDashboardData, newPerApiCache);
  return newPerApiCache;
}

function fetchData({
  getDashboardData,
  layer,
  force,
}: {
  getDashboardData: GetDashboardData;
  layer: Layer;
  force?: boolean;
}): Promise<DashboardData> {
  const perLayerCache = getPerApiCache(getDashboardData);
  const cachedPromise = perLayerCache.get(layer);

  if (cachedPromise && !force) {
    return cachedPromise;
  }
  const promise = getDashboardData(layer).catch((err) => {
    // Don't cache failures forever; allow retries (e.g. after navigation / remount).
    perLayerCache.delete(layer);
    throw err;
  });
  perLayerCache.set(layer, promise);

  return promise;
}

export default function Dashboard() {
  const { t } = useTranslation("all4trees");
  const api = useApi();
  const fetch = useCallback(
    ({ force }: { force?: boolean } = {}) =>
      fetchData({
        force,
        getDashboardData: api.getDashboardData,
        layer: LAYERS.INVENTARY,
      }),
    [api],
  );

  const [reloadKey, setReloadKey] = useState(0);

  const dataPromise = useMemo(
    () => fetch({ force: reloadKey > 0 }),
    [fetch, reloadKey],
  );

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);
  const fallbackRender = useMemo(
    () => getFallbackRender({ retry, t }),
    [retry, t],
  );

  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onError={(error, info) => {
        // Log the error to your error reporting service
        console.error("Error in Dashboard:", error, info);
      }}
      resetKeys={[dataPromise]}
    >
      <Suspense fallback={<Loading />}>
        <LoadedDashboard dataPromise={dataPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
