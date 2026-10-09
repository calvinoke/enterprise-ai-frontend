import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  logout as logoutApi,
} from "../api/auth.api";

import { getCurrentUser } from "../api/users.api";

import apiClient from "../api/client";

import type {
  LoginRequest,
  TokenResponse,
} from "../types/auth";

import type { CurrentUser } from "../types/users";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<TokenResponse>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  // =========================================
  // AUTHENTICATION STATE
  // =========================================

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token")
  );

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // =========================================
  // KEEP ACCESS TOKEN IN LOCAL STORAGE
  // =========================================

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(
        "access_token",
        accessToken
      );
    } else {
      localStorage.removeItem("access_token");
    }
  }, [accessToken]);

  // =========================================
  // KEEP REFRESH TOKEN IN LOCAL STORAGE
  // =========================================

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(
        "refresh_token",
        refreshToken
      );
    } else {
      localStorage.removeItem("refresh_token");
    }
  }, [refreshToken]);

  // =========================================
  // LOAD CURRENT AUTHENTICATED USER
  // =========================================

  const loadCurrentUser = async (): Promise<void> => {
    try {
      // Always read the latest token directly
      // from localStorage.
      const storedAccessToken =
        localStorage.getItem("access_token");

      if (!storedAccessToken) {
        setUser(null);
        return;
      }

      // Make sure Axios uses the latest token.
      apiClient.defaults.headers.common.Authorization =
        `Bearer ${storedAccessToken}`;

      // Ask the backend who is currently authenticated.
      const currentUser = await getCurrentUser();

      // This is where role information enters
      // the frontend authentication state.
      setUser(currentUser);
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      // The token may be expired or invalid.
      setUser(null);

      // Clear invalid authentication state.
      setAccessToken(null);
      setRefreshToken(null);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      delete apiClient.defaults.headers.common.Authorization;
    }
  };

  // =========================================
  // INITIALIZE AUTHENTICATION
  // =========================================

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken =
        localStorage.getItem("access_token");

      if (storedAccessToken) {
        // Restore Axios authorization header.
        apiClient.defaults.headers.common.Authorization =
          `Bearer ${storedAccessToken}`;

        await loadCurrentUser();
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // =========================================
  // LOGIN
  // =========================================

  const login = async (
    data: LoginRequest
  ): Promise<TokenResponse> => {
    const response = await loginApi(data);

    // =========================================
    // STORE TOKENS IMMEDIATELY
    // =========================================

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    localStorage.setItem(
      "refresh_token",
      response.refresh_token
    );

    // =========================================
    // UPDATE REACT STATE
    // =========================================

    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);

    // =========================================
    // UPDATE AXIOS IMMEDIATELY
    // =========================================

    apiClient.defaults.headers.common.Authorization =
      `Bearer ${response.access_token}`;

    // =========================================
    // LOAD USER PROFILE
    // =========================================

    // This request returns the authenticated user,
    // including whether the account is:
    //
    // role = "user"
    // OR
    // role = "admin"
    //
    await loadCurrentUser();

    return response;
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = async (): Promise<void> => {
    const storedRefreshToken =
      localStorage.getItem("refresh_token");

    try {
      if (storedRefreshToken) {
        await logoutApi({
          refresh_token: storedRefreshToken,
        });
      }
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      // =======================================
      // CLEAR REACT STATE
      // =======================================

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      // =======================================
      // CLEAR LOCAL STORAGE
      // =======================================

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // =======================================
      // CLEAR AXIOS AUTHORIZATION
      // =======================================

      delete apiClient.defaults.headers.common.Authorization;
    }
  };

  // =========================================
  // PROVIDER
  // =========================================

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,

        // Authentication requires both:
        // 1. A token
        // 2. A successfully loaded user
        //
        // During initialization isLoading prevents
        // the application from making premature
        // authentication decisions.
        isAuthenticated:
          !!accessToken && !!user,

        isLoading,

        login,
        logout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================
// AUTH HOOK
// =========================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

