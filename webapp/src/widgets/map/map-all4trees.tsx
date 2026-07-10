import { LAYERS } from "@entities/layers";
import { type FC, useEffect, useState } from "react";

import { type SeedData, SeedIndicator } from "@features/indicators/seed";
import {
  type BioInventoryData,
  BioInventoryPopupContent,
} from "@features/popup/bio-inventory";
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

import { useMap } from "@shared/hooks/use-map-all4trees";
import { useApi } from "@shared/hooks/useApi";

import pictoInventaire from "./assets/inventaire-icon.svg";
import pictoSocioEco from "./assets/socio-eco-icon.svg";
import { MapBase } from "./map-base";
import { getExternalDataPromiseByLayer, getIconSize } from "./utils";

export const MapAll4Trees: FC = () => {
  const { isReady, mapApiRef, mapContainerRef } = useMap();
  // We need to pass the api as prop to the popup content, so we can fetch data from the catalog.
  // We can't call useApi() from inside the popup as it is created dynamically and not part of the React tree.
  const api = useApi();
  const [isMaximizedPopupSize, setIsMaximizedPopupSize] = useState(false);

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;
    const toggleShiftSize = () => setIsMaximizedPopupSize((prev) => !prev);

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.INVENTORY_FOR,
      svg: pictoInventaire,
    });

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.ENQUETE,
      svg: pictoSocioEco,
    });

    mapApiRef.current.setLayerSymbol({
      iconSize: getIconSize({}),
      layerId: LAYERS.INVENTORY_BIO,
      svg: pictoInventaire,
    });

    // Set the popup for the "inventaire_for" layer
    mapApiRef.current.setLayerPopup<ForestInventoryData>({
      centerOnClick: true,
      layerId: LAYERS.INVENTORY_FOR,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<ForestInventoryData>({
        Element: ForestInventoryPopupContent,
        getExternalData: getExternalDataPromiseByLayer(
          LAYERS.INVENTORY_FOR,
          api,
        ),
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
        Element: SocioEcoIndicator,
        getExternalData: getExternalDataPromiseByLayer(LAYERS.ENQUETE, api),
        toggleShiftSize,
      }),
      trigger: "click",
    });

    // Set the popup for the "inventaire_bio" layer
    mapApiRef.current.setLayerPopup<BioInventoryData>({
      centerOnClick: true,
      layerId: LAYERS.INVENTORY_BIO,
      popupConfig: DEFAULT_POPUP_CONFIG,
      renderCallback: getRenderPopupLayer<BioInventoryData>({
        Element: BioInventoryPopupContent,
        getExternalData: getExternalDataPromiseByLayer(
          LAYERS.INVENTORY_BIO,
          api,
        ),
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
