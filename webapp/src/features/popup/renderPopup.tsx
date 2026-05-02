import type { LayerMetadata, PopupOptions } from "coordo";
import type { FC } from "react";
import { createRoot } from "react-dom/client";

export const DEFAULT_POPUP_CONFIG: PopupOptions = {
  anchor: "center",
  className: "rounded-2xl border border-border bg-popover/95 shadow-2xl",
  closeButton: false,
  closeOnClick: true,
  closeOnMove: false,
  maxWidth: "560px",
};

export function getRenderPopupLayer<Properties>(
  Element: FC<{
    className: string;
    data: Properties;
    onClose: () => void;
    metadata: LayerMetadata;
  }>,
) {
  return (properties: Properties, metadata: LayerMetadata) => {
    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(
      <Element
        className="w-full max-w-136 max-h-150"
        data={properties}
        metadata={metadata}
        onClose={() => root.unmount()}
      />,
    );
    return container;
  };
}
