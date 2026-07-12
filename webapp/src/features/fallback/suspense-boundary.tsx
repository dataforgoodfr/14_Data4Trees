import { type ComponentProps, type ReactNode, Suspense, useMemo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { ErrorBoundaryFallback } from "@features/fallback/error-boundary-fallback";
import Loading from "@features/fallback/loading";

type SuspenseBoundaryProps = {
  /**
   * The cached promise being read below (e.g. from `useSuspenseData`). Passed
   * to `resetKeys` so the boundary resets whenever a fresh promise arrives —
   * for instance after `retry` — letting the new attempt render.
   */
  resource: unknown;
  /** Wired to the fallback's Retry button; usually `retry` from useSuspenseData. */
  retry?: () => void;
  /** Optional error logging, forwarded to <ErrorBoundary>. */
  onError?: ComponentProps<typeof ErrorBoundary>["onError"];
  children: ReactNode;
};

/**
 * Standard `<ErrorBoundary>` + `<Suspense>` wrapper for our `use()` +
 * cached-promise data fetching:
 *  - `<Suspense>` shows <Loading /> while the promise is pending.
 *  - `<ErrorBoundary>` shows the translated {@link ErrorBoundaryFallback} when
 *    it rejects, with a Retry button wired to `retry`.
 */
export function SuspenseBoundary({
  resource,
  retry,
  onError,
  children,
}: SuspenseBoundaryProps) {
  // Memoised so the fallback component keeps a stable identity across renders
  // (it only changes when `retry` does), avoiding needless remounts.
  const FallbackComponent = useMemo(
    () =>
      function Fallback(props: FallbackProps) {
        return (
          <ErrorBoundaryFallback
            {...props}
            retry={retry}
          />
        );
      },
    [retry],
  );

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={onError}
      resetKeys={[resource]}
    >
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
