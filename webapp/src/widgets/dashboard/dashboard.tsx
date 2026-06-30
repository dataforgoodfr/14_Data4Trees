import { Suspense, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getFallbackRender } from "@widgets/dashboard/error-boundary-fallback";
import LoadedDashboard from "@widgets/dashboard/loaded-dashboard";
import Loading from "@widgets/dashboard/loading";

import { useApi } from "@features/hooks/useApi";

import type { DashboardData } from "@entities/dashboard/generic";

import { LAYERS } from "@shared/api/layers";
import { useTranslation } from "@shared/i18n";

type FetchDashboardData = (layer: string) => Promise<DashboardData>;
type Layer = (typeof LAYERS)[keyof typeof LAYERS];

// ✅ Cache Promises so the same one is reused across renders
// required by 'use()', see https://react.dev/reference/react/use#caching-promises-for-client-components
// Cache is scoped by API client (auth token) + layer to avoid leaking data across sessions.
const cache = new WeakMap<
  FetchDashboardData,
  Map<Layer, Promise<DashboardData>>
>();

function getPerApiCache(fetchDashboardData: FetchDashboardData) {
  const perApiCache = cache.get(fetchDashboardData);
  if (perApiCache) {
    return perApiCache;
  }
  const newPerApiCache = new Map<Layer, Promise<DashboardData>>();
  cache.set(fetchDashboardData, newPerApiCache);
  return newPerApiCache;
}

function fetchData({
  fetchDashboardData,
  layer,
}: {
  fetchDashboardData: FetchDashboardData;
  layer: Layer;
}): Promise<DashboardData> {
  const cache = getPerApiCache(fetchDashboardData);
  const cachedPromise = cache.get(layer);

  if (cachedPromise) {
    return cachedPromise;
  }
  const promise = fetchDashboardData(layer).catch((err) => {
    // Don't cache failures forever; allow retries (e.g. after navigation / remount).
    cache.delete(layer);
    throw err;
  });
  cache.set(layer, promise);

  return promise;
}

export default function Dashboard() {
  const { t } = useTranslation("all4trees");
  const { fetchDashboardData } = useApi();
  const fetch = useCallback(
    () =>
      fetchData({
        fetchDashboardData,
        layer: LAYERS.INVENTARY,
      }),
    [fetchDashboardData],
  );
  const [dataPromise, setDataPromise] = useState(fetch);

  const retry = useCallback(() => {
    setDataPromise(fetch());
  }, [fetch]);
  const fallbackRender = useMemo(
    () => getFallbackRender({ retry, t }),
    [retry, t],
  );

  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      resetKeys={[dataPromise]}
    >
      <Suspense fallback={<Loading />}>
        <LoadedDashboard dataPromise={dataPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
