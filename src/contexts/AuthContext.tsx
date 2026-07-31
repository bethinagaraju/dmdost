import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { authService } from "@/services";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            // Verify current session with the backend using getCurrentUser (endpoint 7)
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
            // If verify session fails (e.g. accessToken is expired), try silent refresh
            if (storedRefreshToken) {
              try {
                const refreshResponse = await authService.refreshToken(storedRefreshToken);
                const newData = refreshResponse.data;
                const mappedUser: User = {
                  id: newData.userId,
                  name: `${newData.firstName} ${newData.lastName}`.trim(),
                  email: newData.email,
                  role: newData.role.toLowerCase() as "user" | "admin",
                  plan: "free",
                  createdAt: new Date().toISOString(),
                  instagramAccounts: 0,
                };
                setUser(mappedUser);
                setToken(newData.accessToken);
                localStorage.setItem("dmdost_token", newData.accessToken);
                localStorage.setItem("dmdost_refresh_token", newData.refreshToken);
                localStorage.setItem("dmdost_user", JSON.stringify(mappedUser));
              } catch {
                // If refresh token fails, clear session
                localStorage.removeItem("dmdost_token");
                localStorage.removeItem("dmdost_refresh_token");
                localStorage.removeItem("dmdost_user");
                setUser(null);
                setToken(null);
              }
            } else {
              localStorage.removeItem("dmdost_token");
              localStorage.removeItem("dmdost_user");
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch (e) {
        // localStorage or window error
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { accessToken, refreshToken, userId, email: userEmail, role, firstName, lastName } = response.data;
    
    const mappedUser: User = {
      id: userId,
      name: `${firstName} ${lastName}`.trim(),
      email: userEmail,
      role: role.toLowerCase() as "user" | "admin",
      plan: "free",
      createdAt: new Date().toISOString(),
      instagramAccounts: 0,
    };

    setUser(mappedUser);
    setToken(accessToken);
    localStorage.setItem("dmdost_token", accessToken);
    localStorage.setItem("dmdost_refresh_token", refreshToken);
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
    localStorage.removeItem("dmdost_token");
    localStorage.removeItem("dmdost_refresh_token");
    localStorage.removeItem("dmdost_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}
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
