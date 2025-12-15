import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(() => {
    // Remove token from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      
      // Force a hard redirect to clear all state
      window.location.href = "/signin";
    }
  }, []);

  return { logout };
};
