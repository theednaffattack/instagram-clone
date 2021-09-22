import useEventListener from "@use-it/event-listener";
import { Dispatch } from "react";
import { AuthenticationAction } from "./lib.auth-reducer";

export function useStorageLogout(
  setAuthenticationState: Dispatch<AuthenticationAction>,
  logoutKey: string
): void {
  function checkLogoutData() {
    const item = localStorage.getItem(logoutKey);

    if (item) {
      setAuthenticationState({ type: "setNotAuthenticated" });
    }
  }
  useEventListener("storage", checkLogoutData);
}
