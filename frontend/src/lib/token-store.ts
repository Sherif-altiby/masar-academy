/**
 * The access token is kept in memory only (a module-level variable), never in
 * localStorage/sessionStorage. This limits the blast radius of an XSS attack:
 * there's nothing for injected script to read from storage. Session
 * persistence across page reloads instead relies on the httpOnly refresh
 * token cookie the backend sets — see AuthProvider, which silently calls
 * /auth/refresh once on mount to re-obtain an access token.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
