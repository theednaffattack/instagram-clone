import { LOGOUT_KEY } from "./logoutAllTabs";

export function removeLogout(): void {
  window.localStorage.removeItem(LOGOUT_KEY);
  // window.localStorage.setItem(LOGOUT_KEY, null);
  // inMemoryToken = token;
}
