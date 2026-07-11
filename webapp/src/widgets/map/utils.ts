import type { ApiClient } from "@shared/api/client";
import { LAYERS } from "@shared/api/layers";

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

export const EXTERNAL_RESOURCES_BY_LAYER = new Map<string, string[]>([
  [
    LAYERS.INVENTARY,
    ["for_label", "for_mf_tax1", "for_mf_tax2", "for_mf_tax3", "for_score"],
  ],
  [LAYERS.ENQUETE, [""]],
  [LAYERS.SEED_POINT, [""]],
]);

export const getExternalDataPromiseByLayer = (
  layerId: string,
  client: ApiClient,
) => {
  const resourceList = EXTERNAL_RESOURCES_BY_LAYER.get(layerId) || [];
  return resourceList?.length > 0
    ? () => client.getCatalogResourceList(layerId, resourceList)
    : () => Promise.resolve({});
};
