// src/services/auth.service.ts

const API_URL = "/api/v1/auth";

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

// Helper to handle API responses
const handleResponse = async (response: Response) => {
    const data: ApiResponse = await response.json();
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
        return handleResponse(res);
    },

    // 5. Refresh Access Token
    refreshToken: async (refreshToken: string) => {
        const res = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        return handleResponse(res);
    },

    // 6. Logout User
    logout: async (refreshToken: string) => {
        const res = await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
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