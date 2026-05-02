export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "support" | "analyst";
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}