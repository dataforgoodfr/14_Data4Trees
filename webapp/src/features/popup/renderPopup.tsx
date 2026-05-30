import type { LayerMetadata, PopupOptions } from "coordo";
import type { FC } from "react";
import { createRoot } from "react-dom/client";

import type { IndicatorPopupHeaderProps } from "./components/indicator-popup-header";

export const getPopupSizeCustomVariables = (isMaximizedPopupSize: boolean) => {
  return {
    "--popup-height": isMaximizedPopupSize ? "100%" : "120",
    "--popup-max-width": isMaximizedPopupSize ? "100%" : "560px",
    "--popup-maximize-size-button-width": isMaximizedPopupSize ? 0 : "100%",
    "--popup-minimize-size-button-width": isMaximizedPopupSize ? "100%" : 0,
    "--popup-right": isMaximizedPopupSize ? "0" : "auto",
  } as const;
};

export const DEFAULT_POPUP_CONFIG: PopupOptions = {
  anchor: "center",
  // WARNING: Keep a single string for the whole classname, cx is not working
  className:
    "z-10 rounded-2xl justify-center border border-border bg-popover/95 shadow-2xl right-[var(--popup-right)] max-h-[99%]",
  closeButton: false,
  closeOnClick: true,
  closeOnMove: false,
  maxWidth: "var(--popup-max-width)",
};

export type RenderPopupProps<T> = {
  className: string;
  data: T;
  metadata: LayerMetadata;
} & Pick<IndicatorPopupHeaderProps, "onClose" | "toggleShiftSize">;

export function getRenderPopupLayer<Properties>({
  Element,
  toggleShiftSize,
}: {
  Element: FC<RenderPopupProps<Properties>>;
  toggleShiftSize: IndicatorPopupHeaderProps["toggleShiftSize"];
}) {
  return (properties: Properties, metadata: LayerMetadata) => {
    const container = document.createElement("div");
    const root = createRoot(container);

    container.className = "h-full w-full";

    root.render(
      <Element
        className="h-[var(--popup-height)] max-h-full"
        data={properties}
        metadata={metadata}
        onClose={() => root.unmount()}
        toggleShiftSize={toggleShiftSize}
      />,
    );
    return container;
  };
}
