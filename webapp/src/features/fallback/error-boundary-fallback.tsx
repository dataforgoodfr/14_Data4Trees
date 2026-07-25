import { TriangleAlert } from "lucide-react";
import { type FallbackProps, getErrorMessage } from "react-error-boundary";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";

import { useTranslation } from "@shared/i18n";
import type { APIError } from "@shared/lib/types";
import { cn } from "@shared/lib/utils";
import { Alert, AlertTitle } from "@shared/ui/alert";

import { Button } from "@ui/button";

// `retry` is injected on top of the props react-error-boundary provides.
export type ErrorBoundaryFallbackProps = FallbackProps & {
  retry?: () => void;
};

export function ErrorBoundaryFallback({
  error,
  retry,
}: ErrorBoundaryFallbackProps) {
  const { t } = useTranslation("common");

  const apiError = error as APIError;
  const errorMessage =
    apiError.status === 401
      ? t("error.pleaseLogin")
      : (getErrorMessage(error) ?? t("error.unknownMessage"));

  return (
    <>
      <Alert
        className="w-full rounded-t-md rounded-b-none border-none text-xl py-4 bg-rose-950"
        variant="destructive"
      >
        <TriangleAlert size={ICON_SIZE_HEADER} />
        <AlertTitle className={cn("text-foreground")}>
          {t("error.title")}
        </AlertTitle>
      </Alert>
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 py-10">
          <h2 className="text-2xl font-bold text-accent">{errorMessage}</h2>
          {retry && (
            <Button
              onClick={retry}
              type="button"
            >
              {t("error.retry")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
