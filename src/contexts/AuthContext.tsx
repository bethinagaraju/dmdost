import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { authService } from "@/services";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("instaautodm_token");
    const storedUser = localStorage.getItem("instaautodm_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem("instaautodm_token");
        localStorage.removeItem("instaautodm_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem("instaautodm_token", response.data.token);
    localStorage.setItem("instaautodm_user", JSON.stringify(response.data.user));
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const response = await authService.register(data);
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem("instaautodm_token", response.data.token);
    localStorage.setItem("instaautodm_user", JSON.stringify(response.data.user));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("instaautodm_token");
    localStorage.removeItem("instaautodm_user");
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
