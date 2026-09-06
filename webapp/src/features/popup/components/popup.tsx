import type { FC } from "react";

import type { ExternalDataFetcher } from "@features/external-data/getter";
import { ExternalDataFetcherBoundary } from "@features/external-data/suspense-boundary";

import type { RenderPopupProps } from "../renderPopup";

type PopupProps = {
  getExternalData: ExternalDataFetcher;
  PopupContent: FC<RenderPopupProps<any>>;
  childrenProps: any;
};

export const Popup: FC<PopupProps> = ({
  getExternalData,
  PopupContent,
  childrenProps,
}) => {
  return (
    <div className="h-(--popup-height) max-h-full">
      {/*
       * Popups live in their own detached `createRoot`, outside <ApiProvider>,
       * so the fetcher is built by the map widget and passed down rather than
       * derived from useApi() here.
       */}
      <ExternalDataFetcherBoundary fetcher={getExternalData}>
        <PopupContent {...childrenProps} />
      </ExternalDataFetcherBoundary>
    </div>
  );
};
