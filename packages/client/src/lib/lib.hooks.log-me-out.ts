import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLogoutMutation } from "../generated/graphql";

export function LogMeOut(): string | undefined {
  const router = useRouter();
  const [{ data, error, fetching }, logoutFunc] = useLogoutMutation();

  useEffect(() => {
    logoutFunc();
  }, []);

  if (error) {
    return `[Logout Error]: ${error.message}`;
  }
  if (fetching) {
    return "loading...";
  }
  if (data) {
    if (router) {
      router.push("/");
    }
  }
}
