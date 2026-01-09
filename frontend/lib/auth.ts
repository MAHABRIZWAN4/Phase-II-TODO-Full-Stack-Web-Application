// Better Auth configuration for frontend

// Token storage and management utilities
export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";
export const AUTH_COOKIE_NAME = "auth_token"; // For middleware to read server-side

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const tokenData = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!tokenData) return null;

  try {
    const token: AuthToken = JSON.parse(tokenData);
    // Check if token is expired
    if (token.expiresAt < Date.now()) {
      removeAuthToken();
      return null;
    }
    return token.token;
  } catch {
    removeAuthToken();
    return null;
  }
}

/**
 * Set authentication token (also sets cookie for middleware)
 */
export function setAuthToken(token: string, expiresIn: number = 604800000): void {
  // Default 7 days in milliseconds
  if (typeof window === "undefined") return;

  const tokenData: AuthToken = {
    token,
    expiresAt: Date.now() + expiresIn,
  };
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData));

  // Also set cookie for server-side middleware to read
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${Math.floor(expiresIn / 1000)}; SameSite=Lax`;
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Get stored user information
 */
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(AUTH_USER_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Set user information
 */
export function setAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Logout user
 */
export function logout(): void {
  removeAuthToken();
  // Optionally redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
