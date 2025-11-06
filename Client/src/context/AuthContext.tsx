"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  token: string;
  user: Record<string , unknown>;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: Record<string , unknown>) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = "bz_token";
const USER_KEY = "bz_user";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      if (token && userData) {
        setUser({ token, user: JSON.parse(userData) });
      } else {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: Record<string , unknown>) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser({ token, user: userData });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const isAuthenticated = (): boolean => {
    return !!user?.token;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
