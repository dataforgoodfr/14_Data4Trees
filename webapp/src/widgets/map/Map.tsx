import { type FC, useEffect } from "react";
import {
  BiodiversityIndicator,
  type BiodiversityData,
} from "@features/indicators/biodiversity";
import { createRoot } from "react-dom/client";

import { useMap } from "@shared/hooks/useMap";

export const WidgetMap: FC = () => {
  const { isReady, mapApiRef, forests } = useMap("#map");

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    const renderPopup = (properties: BiodiversityData) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <BiodiversityIndicator
          className="w-[300px] max-h-[350px]"
          data={properties}
          onClose={() => root.unmount()}
        />,
      );
      return container;
    };

    // Set the popup for the "inventaire" layer
    mapApiRef.current.setLayerPopup<BiodiversityData>({
      layerId: "inventaire",
      popupConfig: {
        anchor: "center",
        className: "bg-background/90 rounded-md",
        closeButton: false,
        closeOnClick: true,
        closeOnMove: false,
        maxWidth: "300px",
      },
      renderCallback: renderPopup,
      trigger: "click",
    });
  }, [isReady, mapApiRef]);

  const filterByForest = (forestId: string) => {
    mapApiRef.current?.setLayerFilters({
      layerId: "inventaire",
      filters: { op: "=", args: [{ property: "for" }, forestId] },
    });
  };

  const resetFilter = () => {
    mapApiRef.current?.setLayerFilters({
      layerId: "inventaire",
      filters: null,
    });
  };

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full"
        id="map"
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
