import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";

/**
 * Route guard for admin routes.
 * Redirect to login page if not authenticated.
 */
export function AdminRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
