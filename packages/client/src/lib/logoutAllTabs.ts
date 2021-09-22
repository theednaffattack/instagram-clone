export const LOGOUT_KEY = "logout";

/**
 * Update localStorage 'logout' key to sign out from all windows
 * The 'logout' key expects a stringified Date object "Date.now().toString()"
 */
export function logoutAllTabs(): void {
  window.localStorage.setItem(LOGOUT_KEY, Date.now().toString());
}

export function clearLogout(): void {
  window.localStorage.removeItem(LOGOUT_KEY);
}
