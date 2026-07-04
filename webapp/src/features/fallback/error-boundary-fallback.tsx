import type { TFunction } from "i18next";
import { type FallbackProps, getErrorMessage } from "react-error-boundary";

import { Button } from "@ui/button";

// t must be passed to the fallback render function because the error boundary fallback component cannot call hooks like useTranslation
// See https://react.dev/warnings/invalid-hook-call-warning
// > 🔴 Do not call Hooks in class components.
// while ErrorBoundary is a class component: https://github.com/bvaughn/react-error-boundary/blob/main/lib/components/ErrorBoundary.tsx#L45
export function getFallbackRender({
  retry,
  t,
}: {
  retry?: () => void;
  t: TFunction<"common", undefined>;
}) {
  function FallbackRender({ error }: FallbackProps) {
    const errorMessage = getErrorMessage(error) ?? t("error.unknownMessage");

    return (
      <div className="flex flex-col items-center pt-24 gap-4">
        <h1 className="text-2xl font-bold text-accent">{t("error.title")}</h1>
        <p className="mt-2">{errorMessage}</p>
        {retry && (
          <Button
            onClick={retry}
            type="button"
          >
            {t("error.retry")}
          </Button>
        )}
      </div>
    );
  }

  return FallbackRender;
}
