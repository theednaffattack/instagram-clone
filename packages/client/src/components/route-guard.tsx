import { useRouter } from "next/router";
import { useAuthentication } from "../lib/lib.auth-reducer";
import { useStorageLogout } from "../lib/lib.hooks.use-storage-logout";
import { LOGOUT_KEY } from "../lib/logoutAllTabs";
import { center } from "./styles";

// https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated
export function BetterRouteGuard({ children }: { children: any }) {
  const router = useRouter();
  const [state, dispatch] = useAuthentication("isNotAuthenticated", router);

  // multi-tab logout
  useStorageLogout(dispatch, LOGOUT_KEY);
  // return state === "isAuthenticated" && children;
  if (state === "isAuthenticated") {
    return children;
  } else {
    return <NotAuthFiller />;
  }
}

function NotAuthFiller() {
  return <div className={center}>NOT AUTHENTICATED</div>;
}
