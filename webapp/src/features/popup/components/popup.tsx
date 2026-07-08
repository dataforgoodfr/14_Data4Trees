import { type FC, Suspense, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { getFallbackRender } from "@features/fallback/error-boundary-fallback";
import Loading from "@features/fallback/loading";

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
  const { t } = useTranslation("common");

  // Retrieve external data before rendering popup
  const [reloadKey, setReloadKey] = useState(0);
  const externalDataPromise = useMemo(
    () =>
      fetchData({
        force: reloadKey > 0,
        promiseFunc,
      }),
    [reloadKey, promiseFunc],
  );

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);
  const fallbackRender = useMemo(
    () => getFallbackRender({ retry, t }),
    [retry, t],
  );

  return (
    <div className="h-(--popup-height) max-h-full">
      <ErrorBoundary
        fallbackRender={fallbackRender}
        resetKeys={[externalDataPromise]}
      >
        <Suspense fallback={<Loading />}>
          <PopupContent
            {...childrenProps}
            externalDataPromise={externalDataPromise}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const cache = new WeakMap<PromiseFunc, Promise<any>>();

function fetchData({
  promiseFunc,
  force,
}: {
  promiseFunc: () => Promise<any>;
  force?: boolean;
}): Promise<any> {
  const cachedPromise = cache.get(promiseFunc);

  if (cachedPromise && !force) {
    return cachedPromise;
  }
  const promise = promiseFunc().catch((err) => {
    // Don't cache failures forever; allow retries (e.g. after navigation / remount).
    cache.delete(promiseFunc);
    throw err;
  });
  cache.set(promiseFunc, promise);

  return promise;
}
