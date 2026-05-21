import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

/**
 * Guard for routes that require a completed, server-stored profile
 * (the summary pages and the main app).
 *
 * Assumes the user is already authenticated — it is always nested
 * under <ProtectedRoute />, which handles the auth check.
 *
 * A user without a completed profile is sent to the first setup step
 * of their role so they can fill it in.
 */
export function RequireProfile() {
  const { isProfileComplete, user } = useAuth();

  if (!isProfileComplete) {
    const setupStart =
      user?.role === "company"
        ? "/company-profile-setup-1"
        : "/talent-profile-setup-1";
    return <Navigate to={setupStart} replace />;
  }

  return <Outlet />;
}
