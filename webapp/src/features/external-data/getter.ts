import type { ExternalData } from "@entities/data";
import { EXTERNAL_RESOURCES_BY_LAYER } from "@entities/resources";

import type { ApiClient } from "@shared/api/client";

/** No-argument fetcher, as expected by `useSuspenseData`. */
export type ExternalDataFetcher = () => Promise<ExternalData>;

// Layers with no declared resources resolve to an empty payload instead of
// hitting the catalog endpoint. Consumers read individual keys, which are then
// simply undefined.
const EMPTY_EXTERNAL_DATA = {} as ExternalData;

export const getExternalDataPromiseByLayer = (
  layerId: string,
  client: ApiClient,
): ExternalDataFetcher => {
  const resourceList = EXTERNAL_RESOURCES_BY_LAYER.get(layerId) || [];

  return resourceList.length > 0
    ? () => client.getCatalogResourceList(layerId, resourceList)
    : () => Promise.resolve(EMPTY_EXTERNAL_DATA);
};
