import { isServer } from "./utilities.is-server";

const TOKEN_KEY = "ACCESS_TOKEN";
export const getToken = function (): string | null {
  if (!isServer()) {
    return window.localStorage.getItem(TOKEN_KEY);
  } else {
    return "";
  }
};
export const setToken = function (token: string): void {
  if (!isServer()) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
};
export const removeToken = function (): void {
  if (!isServer()) {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};
