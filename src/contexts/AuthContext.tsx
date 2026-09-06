import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { authService } from "@/services";
import type { AuthTokens } from "@/services";

export interface WorkspaceInfo {
  username: string;
  instagramUserId: string;
  workspaceId: string;
  connected?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeWorkspace: WorkspaceInfo | null;
  setActiveWorkspace: (workspace: WorkspaceInfo) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceInfo | null>(() => {
    try {
      const stored = localStorage.getItem("dmdost_active_workspace");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setActiveWorkspace = useCallback((workspace: WorkspaceInfo) => {
    setActiveWorkspaceState(workspace);
    localStorage.setItem("dmdost_active_workspace", JSON.stringify(workspace));
  }, []);

  // Listen to external/interceptor token refresh and logout events
  useEffect(() => {
    const handleTokenRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<AuthTokens>;
      if (customEvent.detail?.accessToken) {
        setToken(customEvent.detail.accessToken);
      }
    };

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
      setActiveWorkspaceState(null);
    };

    window.addEventListener("dmdost:token_refreshed", handleTokenRefreshed);
    window.addEventListener("dmdost:auth_logout", handleAuthLogout);

    return () => {
      window.removeEventListener("dmdost:token_refreshed", handleTokenRefreshed);
      window.removeEventListener("dmdost:auth_logout", handleAuthLogout);
    };
  }, []);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem("dmdost_refresh_token");
    if (!storedRefreshToken) {
      throw new Error("No refresh token stored");
    }

    const refreshResponse = await authService.refreshToken(storedRefreshToken);
    const newData = refreshResponse.data;
    if (newData?.accessToken) {
      setToken(newData.accessToken);

      // If user profile info is returned with refresh response
      if (newData.userId && newData.role) {
        const mappedUser: User = {
          id: newData.userId,
          name: `${newData.firstName || ""} ${newData.lastName || ""}`.trim() || "User",
          email: newData.email || "",
          role: (newData.role.toLowerCase() as "user" | "admin") || "user",
          plan: "free",
          createdAt: new Date().toISOString(),
          instagramAccounts: 0,
        };
        setUser(mappedUser);
        localStorage.setItem("dmdost_user", JSON.stringify(mappedUser));
      } else {
        // Otherwise fetch updated profile via /me
        try {
          const meRes = await authService.getCurrentUser(newData.accessToken);
          if (meRes.success && meRes.data) {
            const mappedUser: User = {
              id: meRes.data.userId,
              name: `${meRes.data.firstName} ${meRes.data.lastName}`.trim(),
              email: meRes.data.email,
              role: meRes.data.role.toLowerCase() as "user" | "admin",
              plan: "free",
              createdAt: new Date().toISOString(),
              instagramAccounts: 0,
            };
            setUser(mappedUser);
            localStorage.setItem("dmdost_user", JSON.stringify(mappedUser));
          }
        } catch {
          // If /me fails, preserve existing user in state/localStorage if available
        }
      }
    }
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const storedToken = localStorage.getItem("dmdost_token");
        const storedUser = localStorage.getItem("dmdost_user");
        const storedRefreshToken = localStorage.getItem("dmdost_refresh_token");

        if (storedToken && storedUser) {
          // Set initial local state first so UI is responsive
          setToken(storedToken);
          try {
            setUser(JSON.parse(storedUser) as User);
          } catch {
            // ignore JSON parse error
          }

          try {
            // Verify current session with backend using getCurrentUser (endpoint 7)
            const response = await authService.getCurrentUser(storedToken);
            if (response.success && response.data) {
              const mappedUser: User = {
                id: response.data.userId,
                name: `${response.data.firstName} ${response.data.lastName}`.trim(),
                email: response.data.email,
                role: response.data.role.toLowerCase() as "user" | "admin",
                plan: "free",
                createdAt: new Date().toISOString(),
                instagramAccounts: 0,
              };
              setUser(mappedUser);
              localStorage.setItem("dmdost_user", JSON.stringify(mappedUser));
            } else {
              throw new Error("Invalid session");
            }
          } catch (err) {
            // If session check fails (e.g. accessToken expired), try silent refresh
            if (storedRefreshToken) {
              try {
                await refreshToken();
              } catch {
                // If refresh token also fails, clear session
                localStorage.removeItem("dmdost_token");
                localStorage.removeItem("dmdost_refresh_token");
                localStorage.removeItem("dmdost_user");
                localStorage.removeItem("dmdost_active_workspace");
                setUser(null);
                setToken(null);
                setActiveWorkspaceState(null);
              }
            } else {
              localStorage.removeItem("dmdost_token");
              localStorage.removeItem("dmdost_user");
              localStorage.removeItem("dmdost_active_workspace");
              setUser(null);
              setToken(null);
              setActiveWorkspaceState(null);
            }
          }
        }
      } catch (e) {
        // localStorage or window error
      }
      setIsLoading(false);
    };

    verifySession();
  }, [refreshToken]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const authData = response.data;
    if (!authData) {
      throw new Error("Login failed: no data received");
    }
    const { accessToken, refreshToken: newRefreshToken, userId, email: userEmail, role, firstName, lastName } = authData;
    
    const mappedUser: User = {
      id: userId || "",
      name: `${firstName || ""} ${lastName || ""}`.trim() || "User",
      email: userEmail || email,
      role: (role?.toLowerCase() as "user" | "admin") || "user",
      plan: "free",
      createdAt: new Date().toISOString(),
      instagramAccounts: 0,
    };

    setUser(mappedUser);
    setToken(accessToken);
    localStorage.setItem("dmdost_token", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("dmdost_refresh_token", newRefreshToken);
    }
    localStorage.setItem("dmdost_user", JSON.stringify(mappedUser));
  }, []);

  const register = useCallback(async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem("dmdost_refresh_token");
    if (storedRefreshToken) {
      try {
        await authService.logout(storedRefreshToken);
      } catch {
        // Proceed with local logout regardless of API failure
      }
    }
    setUser(null);
    setToken(null);
    setActiveWorkspaceState(null);
    localStorage.removeItem("dmdost_token");
    localStorage.removeItem("dmdost_refresh_token");
    localStorage.removeItem("dmdost_user");
    localStorage.removeItem("dmdost_active_workspace");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        activeWorkspace,
        setActiveWorkspace,
        login,
        register,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

