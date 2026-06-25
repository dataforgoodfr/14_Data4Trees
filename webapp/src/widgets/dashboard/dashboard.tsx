import { use } from "react";

import LoadedDashboard, {
  type DashboardData,
} from "@widgets/dashboard/loaded-dashboard";

import { LAYERS } from "@shared/api/layers";
import { useApi } from "@shared/hooks/useApi";

// ✅ Cache the Promise so the same one is reused across renders
// required by 'use()', see https://react.dev/reference/react/use#caching-promises-for-client-components
const cache = new Map<
  (typeof LAYERS)[keyof typeof LAYERS],
  Promise<DashboardData>
>();

// TODO: bettter typing (no "as")
export function fetchData({
  getDashboardData,
  layer,
}: {
  getDashboardData: (layerId: string) => Promise<DashboardData>;
  layer: (typeof LAYERS)[keyof typeof LAYERS];
}): Promise<DashboardData> {
  const cachedPromise = cache.get(layer);
  if (cachedPromise) {
    return cachedPromise;
  }
  const promise = getDashboardData(layer);
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
