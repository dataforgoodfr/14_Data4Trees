import type { FC } from "react";

import { SuspenseBoundary } from "@features/fallback/suspense-boundary";

import { useSuspenseData } from "@shared/api/suspense-fetch";

import type { RenderPopupProps } from "../renderPopup";

type PromiseFunc = () => Promise<any>;

type PopupProps = {
  promiseFunc: PromiseFunc;
  PopupContent: FC<RenderPopupProps<any>>;
  childrenProps: any;
};

export const Popup: FC<PopupProps> = ({
  promiseFunc,
  PopupContent,
  childrenProps,
}) => {
  const { dataPromise: externalDataPromise, retry } = useSuspenseData({
    fetcher: promiseFunc,
  });

  return (
    <div className="h-(--popup-height) max-h-full">
      <SuspenseBoundary
        resource={externalDataPromise}
        retry={retry}
      >
        <PopupContent
          {...childrenProps}
          externalDataPromise={externalDataPromise}
        />
      </SuspenseBoundary>
    </div>
  );
};
