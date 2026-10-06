import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { isAdminAuthenticated } from "./useAdminAuth";

interface ProtectedRouteProps {
  children: ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to={ADMIN_PATHS.login} replace />;
  }

  return children;
}
