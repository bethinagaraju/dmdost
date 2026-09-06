// src/services/auth.service.ts

const API_URL = "/api/v1/auth";

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
    expiresIn?: number;
    userId?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
}

export interface RefreshTokenPayload {
    refreshToken: string;
}

// Helper to handle API responses
const handleResponse = async <T = any>(response: Response): Promise<ApiResponse<T>> => {
    const data: ApiResponse<T> = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
};

export const authService = {
    // 1. Register User
    register: async (data: any) => {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    // 2. Verify Email OTP
    verifyOtp: async (email: string, otp: string) => {
        const res = await fetch(`${API_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        return handleResponse(res);
    },

    // 3. Resend OTP
    resendOtp: async (email: string) => {
        const res = await fetch(`${API_URL}/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        return handleResponse(res);
    },

    // 4. Login User
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        return handleResponse<AuthTokens>(res);
    },

    // 5. Refresh Access Token
    // POST /api/v1/auth/refresh
    // Content-Type: application/json
    // { "refreshToken": "<YOUR_REFRESH_TOKEN>" }
    refreshToken: async (refreshTokenOrPayload?: string | RefreshTokenPayload): Promise<ApiResponse<AuthTokens>> => {
        let tokenToUse: string | null = null;
        if (typeof refreshTokenOrPayload === "string") {
            tokenToUse = refreshTokenOrPayload;
        } else if (refreshTokenOrPayload && typeof refreshTokenOrPayload === "object" && refreshTokenOrPayload.refreshToken) {
            tokenToUse = refreshTokenOrPayload.refreshToken;
        } else if (typeof localStorage !== "undefined") {
            tokenToUse = localStorage.getItem("dmdost_refresh_token");
        }

        if (!tokenToUse) {
            throw new Error("No refresh token available");
        }

        const res = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokenToUse }),
        });

        const result = await handleResponse<AuthTokens>(res);

        // Update localStorage if new tokens are returned
        if (result.data && result.data.accessToken && typeof localStorage !== "undefined") {
            localStorage.setItem("dmdost_token", result.data.accessToken);
            if (result.data.refreshToken) {
                localStorage.setItem("dmdost_refresh_token", result.data.refreshToken);
            }
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("dmdost:token_refreshed", { detail: result.data }));
            }
        }

        return result;
    },

    // 6. Logout User
    logout: async (refreshToken?: string) => {
        const tokenToUse = refreshToken || (typeof localStorage !== "undefined" ? localStorage.getItem("dmdost_refresh_token") : null);
        const res = await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokenToUse || "" }),
        });
        return handleResponse(res);
    },

    // 7. Get Current User Info
    getCurrentUser: async (accessToken: string) => {
        const res = await fetch(`${API_URL}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });
        return handleResponse(res);
    },

    // 8. Change Password
    changePassword: async (data: any, accessToken: string) => {
        const res = await fetch(`${API_URL}/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    // 9. Forgot Password
    forgotPassword: async (email: string) => {
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        return handleResponse(res);
    },

    // 10. Reset Password
    resetPassword: async (data: any) => {
        const res = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
};

// Automatic 401 Interceptor / Fetch Wrapper
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

/**
 * Enhanced fetch wrapper that attaches Bearer tokens and automatically handles
 * token refresh via POST /api/v1/auth/refresh when receiving 401 Unauthorized.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("dmdost_token") : null;
    const headers = new Headers(init.headers || {});

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...init,
        headers,
    };

    let response = await fetch(input, config);

    // If 401 Unauthorized and not already refreshing auth endpoint
    const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const isAuthEndpoint = urlStr.includes("/api/v1/auth/");

    if (response.status === 401 && !isAuthEndpoint) {
        const storedRefreshToken = typeof localStorage !== "undefined" ? localStorage.getItem("dmdost_refresh_token") : null;
        if (!storedRefreshToken) {
            return response;
        }

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshResult = await authService.refreshToken(storedRefreshToken);
                const newAccessToken = refreshResult.data?.accessToken;
                isRefreshing = false;
                if (newAccessToken) {
                    onRefreshed(newAccessToken);
                }
            } catch (refreshErr) {
                isRefreshing = false;
                refreshSubscribers = [];
                if (typeof localStorage !== "undefined") {
                    localStorage.removeItem("dmdost_token");
                    localStorage.removeItem("dmdost_refresh_token");
                    localStorage.removeItem("dmdost_user");
                    localStorage.removeItem("dmdost_active_workspace");
                }
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("dmdost:auth_logout"));
                }
                return response;
            }
        }

        // Wait for token refresh to complete and retry
        const retryToken = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token) => resolve(token));
        });

        const retryHeaders = new Headers(init.headers || {});
        retryHeaders.set("Authorization", `Bearer ${retryToken}`);
        response = await fetch(input, {
            ...init,
            headers: retryHeaders,
        });
    }

    return response;
}