// src/utils/tokenStorage.ts
export class TokenStorage {
  private static readonly AUTH_TOKEN_KEY = "auth-token";
  private static readonly REFRESH_TOKEN_KEY = "refresh-token";

  // ✅ Safe token setter - only save valid tokens
  static setAuthToken(token: string | null | undefined): void {
    if (this.isValidToken(token)) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      console.log("✅ Auth token saved successfully");
    } else {
      console.warn("❌ Invalid token, removing from storage:", token);
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }

  static setRefreshToken(token: string | null | undefined): void {
    if (this.isValidToken(token)) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      console.log("✅ Refresh token saved successfully");
    } else {
      console.warn("❌ Invalid refresh token, removing from storage:", token);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  // ✅ Safe token getter - return null for invalid tokens
  static getAuthToken(): string | null {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    return this.isValidToken(token) ? token : null;
  }

  static getRefreshToken(): string | null {
    const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.isValidToken(token) ? token : null;
  }

  // ✅ Validate token - check if it's a real token
  private static isValidToken(
    token: string | null | undefined
  ): token is string {
    return (
      typeof token === "string" &&
      token.length > 0 &&
      token !== "undefined" &&
      token !== "null" &&
      token !== "false" &&
      token.trim() !== ""
    );
  }

  // ✅ Clear all tokens
  static clearTokens(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem("auth-storage");
    console.log("🧹 All tokens cleared");
  }

  // ✅ Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }
}
