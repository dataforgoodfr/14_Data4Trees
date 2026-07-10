import { EXTERNAL_RESOURCES_BY_LAYER } from "@entities/resources";

import type { ApiClient } from "@shared/api/client";

export const SVG_SIZE_DEFAULT = 72;
export const TARGET_SIZE_DEFAULT = 48;

export function getIconSize({
  assetSize = SVG_SIZE_DEFAULT,
  targetSize = TARGET_SIZE_DEFAULT,
}: {
  assetSize?: number;
  targetSize?: number;
}) {
  if (!assetSize) {
    return 1;
  }
  return targetSize / assetSize;
}

export const getExternalDataPromiseByLayer = (
  layerId: string,
  client: ApiClient,
) => {
  const resourceList = EXTERNAL_RESOURCES_BY_LAYER.get(layerId) || [];
  return resourceList?.length > 0
    ? () => client.getCatalogResourceList(layerId, resourceList)
    : () => Promise.resolve({});
};
