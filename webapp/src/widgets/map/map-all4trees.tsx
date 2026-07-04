import { type FC, useEffect, useState } from "react";

import { type SeedData, SeedIndicator } from "@features/indicators/seed";
import {
  type ForestInventoryData,
  ForestInventoryPopupContent,
} from "@features/popup/forest-inventory";
import {
  DEFAULT_POPUP_CONFIG,
  getRenderPopupLayer,
} from "@features/popup/renderPopup";
import {
  type SocioEcoData,
  SocioEcoIndicator,
} from "@features/popup/socio-eco";

import { LAYERS } from "@shared/api/layers";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useApi } from "@shared/hooks/useApi";

import pictoInventaire from "./assets/inventaire-icon.svg";
import pictoSocioEco from "./assets/socio-eco-icon.svg";
import { MapBase } from "./map-base";
import { getIconSize } from "./utils";

export const MapAll4Trees: FC = () => {
  const { isReady, mapApiRef, forests, mapContainerRef } = useMap();
  // We need to pass the api as prop to the popup content, so we can fetch data from the catalog.
  // We can't call useApi() from inside the popup as it is created dynamically and not part of the React tree.
  const api = useApi();
  const [isMaximizedPopupSize, setIsMaximizedPopupSize] = useState(false);

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    const toggleShiftSize = () => setIsMaximizedPopupSize((prev) => !prev);

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.INVENTARY,
      svg: pictoInventaire,
    });

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.ENQUETE,
      svg: pictoSocioEco,
    });

    // Set the popup for the "inventaire" layer
    mapApiRef.current.setLayerPopup<ForestInventoryData>({
      centerOnClick: true,
      layerId: LAYERS.INVENTARY,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<ForestInventoryData>({
        api,
        Element: ForestInventoryPopupContent,
        toggleShiftSize,
      }),
      trigger: "click",
    });

    // Set the popup for the "enquete" layer
    mapApiRef.current.setLayerPopup<SocioEcoData>({
      centerOnClick: true,
      layerId: LAYERS.ENQUETE,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<SocioEcoData>({
        api,
        Element: SocioEcoIndicator,
        toggleShiftSize,
      }),
      trigger: "click",
    });

    // Set the popup for the Seed data layer
    mapApiRef.current.setLayerPopup<SeedData>({
      centerOnClick: true,
      layerId: LAYERS.SEED,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<SeedData>({
        api,
        Element: SeedIndicator,
        toggleShiftSize,
      }),
      trigger: "click",
    });
  }, [isReady, mapApiRef, api]);

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
    <MapBase
      isMaximizedPopupSize={isMaximizedPopupSize}
      isReady={isReady}
      mapContainerRef={mapContainerRef}
    >
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
    </MapBase>
  );
};
