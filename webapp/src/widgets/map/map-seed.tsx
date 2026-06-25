import { type FC, useEffect, useState } from "react";

import { type SeedData, SeedIndicator } from "@features/indicators/seed";
import {
  DEFAULT_POPUP_CONFIG,
  getRenderPopupLayer,
} from "@features/popup/renderPopup";

import { LAYERS } from "@shared/api/layers";
import { useMap } from "@shared/hooks/use-map-seed";

import pictoSeed from "./assets/seed-icon.svg";
import { MapBase } from "./map-base";
import { getIconSize } from "./utils";

export const MapSeed: FC = () => {
  const { isReady, mapContainerRef, mapApiRef } = useMap();
  const [isMaximizedPopupSize, setIsMaximizedPopupSize] = useState(false);

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    const toggleShiftSize = () => setIsMaximizedPopupSize((prev) => !prev);

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.SEED,
      svg: pictoSeed,
    });

    mapApiRef.current.setLayerPopup<SeedData>({
      centerOnClick: true,
      layerId: LAYERS.SEED,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<SeedData>({
        Element: SeedIndicator,
        toggleShiftSize,
      }),
      trigger: "click",
    });
  }, [isReady, mapApiRef]);

  return (
    <MapBase
      isMaximizedPopupSize={isMaximizedPopupSize}
      isReady={isReady}
      mapContainerRef={mapContainerRef}
    />
  );
};
