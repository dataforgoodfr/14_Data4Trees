import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Dashboard from "@widgets/dashboard/dashboard";
import { getFallbackRender } from "@widgets/dashboard/error-boundary-fallback";
import Loading from "@widgets/dashboard/loading";

import { useTranslation } from "@shared/i18n";

export default function DashboardPage() {
  const { t } = useTranslation("all4trees");

  return (
    <ErrorBoundary fallbackRender={getFallbackRender({ t })}>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
