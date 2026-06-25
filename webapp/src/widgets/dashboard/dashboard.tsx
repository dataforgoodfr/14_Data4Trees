import { use } from "react";

import LoadedDashboard, {
  type DashboardData,
} from "@widgets/dashboard/loaded-dashboard";

import { LAYERS } from "@shared/api/layers";
import { useApi } from "@shared/hooks/useApi";

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

export function fetchData({
  getDashboardData,
  layer,
}: {
  getDashboardData: GetDashboardData;
  layer: Layer;
}): Promise<DashboardData> {
  const cache = getPerApiCache(getDashboardData);
  const cachedPromise = cache.get(layer);

  if (cachedPromise) {
    return cachedPromise;
  }
  const promise = getDashboardData(layer).catch((err) => {
    // Don't cache failures forever; allow retries (e.g. after navigation / remount).
    cache.delete(layer);
    throw err;
  });
  cache.set(layer, promise);

  return promise;
}

export default function Dashboard() {
  const api = useApi();

  const data = use(
    fetchData({
      getDashboardData: api.getDashboardData,
      layer: LAYERS.INVENTARY,
    }),
  );

  return <LoadedDashboard data={data} />;
}
