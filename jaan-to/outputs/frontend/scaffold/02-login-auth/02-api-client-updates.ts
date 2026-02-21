import axios from "axios";

/**
 * Updated API Client — HttpOnly Cookie Auth
 *
 * Changes from original api-client.ts:
 * 1. REMOVED: localStorage token read in request interceptor
 * 2. REMOVED: localStorage token write in response interceptor (refresh)
 * 3. KEPT: withCredentials: true (browser sends HttpOnly cookies automatically)
 * 4. UPDATED: 401 refresh flow relies on cookies, not manual token injection
 * 5. UPDATED: On refresh failure, redirect to /login instead of /onboarding
 *
 * Replace: apps/web/src/lib/api-client.ts
 */

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Browser sends HttpOnly cookies automatically
});

// No request interceptor needed — cookies are sent automatically by the browser
// when withCredentials is true. The backend reads the access_token from the cookie.

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        // POST /auth/refresh — backend reads refresh_token from HttpOnly cookie
        // and sets new access_token cookie via Set-Cookie header
        await apiClient.post("/auth/refresh");

        // Retry the original request — new cookie is already set
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — session expired, redirect to login
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  }
);
