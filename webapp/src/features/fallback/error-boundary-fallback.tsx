import type { TFunction } from "i18next";
import { TriangleAlert } from "lucide-react";
import { type FallbackProps, getErrorMessage } from "react-error-boundary";

import {
  ICON_SIZE_HEADER,
} from "@features/indicators/components/constants";

import type { APIError } from "@shared/lib/types";
import { cn } from "@shared/lib/utils";
import {
  Alert,
  AlertTitle,
} from "@shared/ui/alert";

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
    const apiError = error as APIError;
    const errorMessage =
      apiError.status === 401
        ? t("error.pleaseLogin")
        : (getErrorMessage(error) ?? t("error.unknownMessage"));
    return (
      <>
        <Alert
          className="w-full rounded-t-md rounded-b-none border-none text-xl py-lg bg-rose-950"
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

  return FallbackRender;
}
