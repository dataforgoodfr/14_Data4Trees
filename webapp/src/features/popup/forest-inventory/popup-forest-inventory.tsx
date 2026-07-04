import { type FC, Suspense, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Loading from "@widgets/dashboard/loading";

import { getFallbackRender } from "@features/fallback/error-boundary-fallback";
import { useSoilIndicatorElements } from "@features/indicators/soil";

import { LAYERS } from "@shared/api/layers";
import { findCategoricalLabel } from "@shared/lib/utils";
import { useTranslation } from "@i18n";

import { useBiodiversityIndicatorElements } from "../../indicators/biodiversity/use-biodiversity-indicator-elements";
import type { RenderPopupProps } from "../renderPopup";
import { LoadedPopupForestInventory } from "./loaded-popup-forest-inventory";
import type { ForestInventoryData } from "./types";

type ForestInventoryPopupContentProps = RenderPopupProps<ForestInventoryData>;

type ExternalData = Record<string, any>;
type GetExternalData = (
  layerId: string,
  resourceList: string[],
) => Promise<ExternalData>;
type Layer = (typeof LAYERS)[keyof typeof LAYERS];

const EXTERNAL_RESOURCES = [
  "for_label",
  "for_mf_tax1",
  "for_mf_tax2",
  "for_mf_tax3",
  "for_score",
];

const cache = new WeakMap<GetExternalData, Map<Layer, Promise<ExternalData>>>();

function getPerApiCache(getExternalData: GetExternalData) {
  const perApiCache = cache.get(getExternalData);
  if (perApiCache) {
    return perApiCache;
  }
  const newPerApiCache = new Map<Layer, Promise<ExternalData>>();
  cache.set(getExternalData, newPerApiCache);
  return newPerApiCache;
}

function fetchData({
  getExternalData,
  layer,
  resourceList,
  force,
}: {
  getExternalData: GetExternalData;
  layer: Layer;
  resourceList: string[];
  force?: boolean;
}): Promise<ExternalData> {
  const perLayerCache = getPerApiCache(getExternalData);
  const cachedPromise = perLayerCache.get(layer);

  if (cachedPromise && !force) {
    return cachedPromise;
  }
  const promise = getExternalData(layer, resourceList).catch((err) => {
    // Don't cache failures forever; allow retries (e.g. after navigation / remount).
    perLayerCache.delete(layer);
    throw err;
  });
  perLayerCache.set(layer, promise);

  return promise;
}

export const ForestInventoryPopupContent: FC<
  ForestInventoryPopupContentProps
> = ({ data, metadata, api, className, ...headerProps }) => {
  const { t } = useTranslation(["common", "all4trees"]);

  const [reloadKey, setReloadKey] = useState(0);
  const externalData = useMemo(
    () =>
      fetchData({
        force: reloadKey > 0,
        getExternalData: api.getCatalogResourceList,
        layer: LAYERS.INVENTARY,
        resourceList: EXTERNAL_RESOURCES,
      }),
    [api, reloadKey],
  );

  const biodiversityElements = useBiodiversityIndicatorElements(data, metadata);
  const soilElements = useSoilIndicatorElements(data, metadata);

  const retry = useCallback(() => {
    console.log("Retrying")
    setReloadKey((k) => k + 1);
  }, []);
  const fallbackRender = useMemo(
    () => getFallbackRender({ retry, t }),
    [retry, t],
  );

  const title = t("popup.forestInventory.title", {
    id: data.id,
    ns: "all4trees",
  });

  const subtitle =
    findCategoricalLabel(metadata, "loc2", data.for) ||
    t("dataManagement.undefined", { ns: "common" });

  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onError={(error, info) => {
        // Log the error to your error reporting service
        console.error("Error in forest invetory popup:", error, info);
      }}
      resetKeys={[externalData]}
    >
      <Suspense fallback={<Loading />}>
        <LoadedPopupForestInventory
          biodiversityElements={biodiversityElements}
          className={className}
          headerProps={headerProps}
          soilElements={soilElements}
          subtitle={subtitle}
          title={title}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
