import { type FC, Suspense, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Loading from "@widgets/dashboard/loading";

import { getFallbackRender } from "@features/fallback/error-boundary-fallback";

import type { APIError } from "@shared/lib/types";
import { useAbsoluteUrls } from "@shared/urls";

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
    console.log("Retrying");
    setReloadKey((k) => k + 1);
  }, []);
  const fallbackRender = useMemo(
    () => getFallbackRender({ retry, t }),
    [retry, t],
  );

  return (
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
