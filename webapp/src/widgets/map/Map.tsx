import { type FC, useEffect } from "react";

import {
  type ForestInventoryData,
  ForestInventoryPopupContent,
} from "@features/indicators/forest-inventory";
import { type SeedData, SeedIndicator } from "@features/indicators/seed";
import {
  type SocioEcoData,
  SocioEcoIndicator,
} from "@features/indicators/socio-eco";
import {
  DEFAULT_POPUP_CONFIG,
  getRenderPopupLayer,
} from "@features/popup/renderPopup";

import { LAYERS } from "@shared/api/layers";
import { useMap } from "@shared/hooks/useMap";

import pictoInventaire from "./assets/inventaire-icon.svg";
import pictoSocioEco from "./assets/socio-eco-icon.svg";

function getIconSize({
  assetSize,
  targetSize,
}: {
  assetSize: number;
  targetSize: number;
}) {
  if (!assetSize) {
    return 1;
  }
  return targetSize / assetSize;
}

const TARGET_SIZE = 48;
const SVG_SIZE = 72;

export const WidgetMap: FC = () => {
  const { isReady, mapApiRef, forests, mapContainerRef } = useMap();

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({ assetSize: SVG_SIZE, targetSize: TARGET_SIZE }),
      layerId: LAYERS.INVENTARY,
      svg: pictoInventaire,
    });

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({ assetSize: SVG_SIZE, targetSize: TARGET_SIZE }),
      layerId: LAYERS.ENQUETE,
      svg: pictoSocioEco,
    });

    // Set the popup for the "inventaire" layer
    mapApiRef.current.setLayerPopup<ForestInventoryData>({
      centerOnClick: true,
      layerId: LAYERS.INVENTARY,
      popupConfig: { ...DEFAULT_POPUP_CONFIG },
      renderCallback: getRenderPopupLayer<ForestInventoryData>(
        ForestInventoryPopupContent,
      ),
      trigger: "click",
    });

    // Set the popup for the "enquete" layer
    mapApiRef.current.setLayerPopup<SocioEcoData>({
      centerOnClick: true,
      layerId: LAYERS.ENQUETE,
      popupConfig: { ...DEFAULT_POPUP_CONFIG },
      renderCallback: getRenderPopupLayer<SocioEcoData>(SocioEcoIndicator),
      trigger: "click",
    });

    // Set the popup for the Seed data layer
    mapApiRef.current.setLayerPopup<SeedData>({
      centerOnClick: true,
      layerId: LAYERS.SEED,
      popupConfig: { ...DEFAULT_POPUP_CONFIG },
      renderCallback: getRenderPopupLayer<SeedData>(SeedIndicator),
      trigger: "click",
    });
  }, [isReady, mapApiRef]);

  const filterByForest = (forestId: string) => {
    mapApiRef.current?.setLayerFilters({
      filters: { args: [{ property: "for" }, forestId], op: "=" },
      layerId: "inventaire",
    });
  };

  const resetFilter = () => {
    mapApiRef.current?.setLayerFilters({
      filters: null,
      layerId: "inventaire",
    });
  };

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full"
        id="map"
        ref={mapContainerRef}
      ></div>
      {!isReady && (
        <div className="map-loader absolute inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      {forests.length > 0 && (
        <div className="absolute top-4 left-12 z-10 bg-white rounded shadow p-2 flex gap-2">
          {forests.map((forest) => (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              key={forest.value}
              onClick={() => filterByForest(forest.value)}
            >
              {forest.label}
            </button>
          ))}
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            onClick={resetFilter}
          >
            Toutes
          </button>
        </div>
      )}
    </div>
  );
};
