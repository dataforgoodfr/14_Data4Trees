import { type FC, useEffect, useState } from "react";

import { type SeedData, SeedIndicator } from "@features/indicators/seed";
import {
  DEFAULT_POPUP_CONFIG,
  getRenderPopupLayer,
} from "@features/popup/renderPopup";

import { LAYERS } from "@entities/layers";
import { useMap } from "@shared/hooks/use-map-seed";
import { useApi } from "@shared/hooks/useApi";

import { MapBase } from "./map-base";
import { getExternalDataPromiseByLayer } from "./utils";

export const MapSeed: FC = () => {
  const { isReady, mapContainerRef, mapApiRef } = useMap();
  // We need to pass the api as prop to the popup content, so we can fetch data from the catalog.
  // We can't call useApi() from inside the popup as it is created dynamically and not part of the React tree.
  const api = useApi();
  const [isMaximizedPopupSize, setIsMaximizedPopupSize] = useState(false);

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    const toggleShiftSize = () => setIsMaximizedPopupSize((prev) => !prev);

    mapApiRef.current.setLayerPopup<SeedData>({
      centerOnClick: true,
      layerId: LAYERS.SEED_POINT,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<SeedData>({
        Element: SeedIndicator,
        getExternalData: getExternalDataPromiseByLayer(LAYERS.SEED_POINT, api),
        toggleShiftSize,
      }),
      trigger: "click",
    });
  }, [isReady, mapApiRef, api]);

  return (
    <MapBase
      isMaximizedPopupSize={isMaximizedPopupSize}
      isReady={isReady}
      mapContainerRef={mapContainerRef}
    />
  );
};
