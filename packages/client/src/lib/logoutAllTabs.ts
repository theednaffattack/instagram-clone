/**
 * Update localStorage 'logout' key to sign out from all windows
 * The 'logout' key expects a stringified Date object "Date.now().toString()"
 */
export function logoutAllTabs(): void {
  window.localStorage.setItem("logout", Date.now().toString());
}
