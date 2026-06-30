import type { TFunction } from "i18next";
import { type FallbackProps, getErrorMessage } from "react-error-boundary";

// t must be passed to the fallback render function because the error boundary fallback component cannot call hooks like useTranslation
export function getFallbackRender({
  retry,
  t,
}: {
  retry?: () => void;
  t: TFunction<"all4trees", undefined>;
}) {
  function FallbackRender({ error }: FallbackProps) {
    const errorMessage =
      getErrorMessage(error) ?? t("dashboard.error.unknownMessage");

    return (
      <div className="flex flex-col items-center pt-24 gap-4">
        <h1 className="text-2xl font-bold text-accent">
          {t("dashboard.error.title")}
        </h1>
        <p className="mt-2">{errorMessage}</p>
        {retry && (
          <button
            className="mt-4 border border-accent rounded px-4 py-2 bg-primary hover:bg-accent text-xl hover:cursor-pointer"
            onClick={retry}
            type="button"
          >
            {t("dashboard.error.retry")}
          </button>
        )}
      </div>
    );
  }

  return FallbackRender;
}
