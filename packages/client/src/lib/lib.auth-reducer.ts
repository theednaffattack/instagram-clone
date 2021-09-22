import { NextRouter } from "next/router";
import { Dispatch, useEffect, useReducer } from "react";
import { getToken } from "./lib.in-memory-access-token";

export interface AuthenticationAction {
  type: "setNotAuthenticated" | "setIsAuthenticated";
}

export type AuthenticationState = "isAuthenticated" | "isNotAuthenticated";

export function authReducer(
  state: AuthenticationState,
  action: AuthenticationAction
): AuthenticationState {
  switch (action.type) {
    case "setNotAuthenticated":
      return "isNotAuthenticated";
    case "setIsAuthenticated":
      return "isAuthenticated";

    default:
      return "isNotAuthenticated";
  }
}
function init(initialState: AuthenticationState): AuthenticationState {
  return initialState;
}

export function useAuthentication(
  initialState: AuthenticationState,
  router: NextRouter
): [AuthenticationState, Dispatch<AuthenticationAction>] {
  const [state, dispatch] = useReducer(authReducer, initialState, init);

  useEffect(() => {
    function authCheck(url: string) {
      const token = getToken();
      // redirect to login page if accessing a private page and not logged in
      const publicPaths = ["/"];
      const path = url.split("?")[0];
      if (!token?.accessToken && !publicPaths.includes(path)) {
        dispatch({ type: "setNotAuthenticated" });
        router.push({
          pathname: "/login",
          query: { next: router.asPath },
          // query: { returnUrl: router.asPath },
        });
      } else {
        dispatch({ type: "setIsAuthenticated" });
      }
    }

    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => dispatch({ type: "setNotAuthenticated" }); // setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router]);

  // function authCheck(url: string) {
  //   // redirect to login page if accessing a private page and not logged in
  //   const publicPaths = ["/"];
  //   const path = url.split("?")[0];
  //   if (!userService.userValue && !publicPaths.includes(path)) {
  //     setAuthorized(false);
  //     router.push({
  //       pathname: "/login",
  //       query: { next: router.asPath },
  //       // query: { returnUrl: router.asPath },
  //     });
  //   } else {
  //     setAuthorized(true);
  //   }
  // }

  return [state, dispatch];
}
