import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@features/auth/useAuth";

type AdminRouteProps = {
  children?: React.ReactNode;
};

/**
 * Route guard for admin routes.
 * Redirect to login page if not authenticated.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { t } = useTranslation("translations");
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-screen h-screen flex items-center justify-center"
      >
        {t("common.loading")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace={true}
      />
    );
  }

  return children ? children : <Outlet />;
}
