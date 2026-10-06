import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_PATHS } from "@/features/admin/config/paths";

// tymczasowa "sesja" do czasu podpięcia logowania z backendu
const AUTH_STORAGE_KEY = "panel-auth";

export const isAdminAuthenticated = () =>
  sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";

export function useAdminAuth() {
  const navigate = useNavigate();

  const login = useCallback(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
    navigate(ADMIN_PATHS.dashboard, { replace: true });
  }, [navigate]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    navigate(ADMIN_PATHS.login, { replace: true });
  }, [navigate]);

  return { isAuthenticated: isAdminAuthenticated(), login, logout };
}
