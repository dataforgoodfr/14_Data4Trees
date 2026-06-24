import type { FC, PropsWithChildren, RefCallback } from "react";

import { getPopupSizeCustomVariables } from "@features/popup/renderPopup";

type MapBaseProps = PropsWithChildren<{
  isMaximizedPopupSize: boolean;
  isReady: boolean;
  mapContainerRef: RefCallback<HTMLElement>;
}>;

export const MapBase: FC<MapBaseProps> = ({
  isMaximizedPopupSize,
  isReady,
  mapContainerRef,
  children,
}) => {
  return (
    <div
      className="relative w-full h-full"
      style={getPopupSizeCustomVariables(isMaximizedPopupSize)}
    >
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

      {children}
    </div>
  );
};
