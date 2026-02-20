import {
  type Location,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { LoginForm } from "@features/auth/LoginForm";
import { useAuth } from "@features/auth/useAuth";

/**
 * Initial source target before redirecting to Login
 */
type LocationState = { from?: Location };

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/admin";

  if (isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background items-center justify-center">
      <h1>Login Page</h1>
      <LoginForm
        onSuccess={() => {
          navigate(redirectTo, { replace: true });
        }}
      />
    </div>
  );
}
