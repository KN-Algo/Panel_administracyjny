import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

type ProtectedRouteProps = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = sessionStorage.getItem("panel-auth") === "1";

  if (!isAuthenticated) {
    return <Navigate to="/panel" replace />;
  }

  return children;
}
