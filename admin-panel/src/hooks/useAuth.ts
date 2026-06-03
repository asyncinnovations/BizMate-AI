"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import type { LoginCredentials } from "@/modules/auth/types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, logout } =
    useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual auth service call
      // const response = await authService.login(credentials);
      // setUser(response.user);
      // router.push("/");

      // Stubbed for now — wire to authService.login()
      await new Promise((r) => setTimeout(r, 1200));

      setUser({
        id: "1",
        email: credentials.email,
        name: "Admin User",
        role: "super_admin",
        permissions: ["*"],
      });

      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    }
  };

  const signOut = () => {
    logout();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signOut,
  };
}