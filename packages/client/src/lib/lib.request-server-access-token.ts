import { setAccessToken } from "./lib.access-token";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

// Now handled by apollo-token-refresh-link
export async function requestAccessToken(
  cookie: string,
  fromWhere: string
): Promise<string> {
  // We only do this for the initial sign-in.
  // if (getAccessToken()) return;

  // I think we only want this on the client (see if settings). It'd be
  // much better to check for SSR somehow. Actually why wouldn't I have this
  // server-only for refresh situations?
  // if (!isServer()) {
  // const url =
  //   process.env.NODE_ENV === "production"
  //     ? process.env.NEXT_PUBLIC_REFRESH_URL
  //     : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;

  // const requestBody = {};
  // const axiosConfig: AxiosRequestConfig = { withCredentials: true };

  let res;
  try {
    res = await fetch(getUrl(), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ from: fromWhere }),
      headers: {
        cookie: "icg=" + cookie,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    logger.error(
      "ERROR REQUESTING ACCESS TOKEN AND SETTING REFRESH TOKEN COOKIE"
    );

    handleCatchBlockError(err);
  }

  let data;
  if (res) {
    try {
      data = await res.json();
    } catch (error) {
      logger.error("CONVERTING REQUEST DATA TO JSON");
      handleCatchBlockError(error);
    }
  }

  if (data && data.ok) {
    setAccessToken(data.accessToken);
    return data.accessToken;
  } else {
    // I set access token to "public" because setting it to an
    // empty string is confusing elsewhere in the application.
    setAccessToken("public");
    return "public";
  }
}

function getUrl(): string {
  if (process.env.NODE_ENV === undefined) {
    throw new Error("env var NODE_ENV is undefined!");
  }

  switch (process.env.NODE_ENV) {
    case "production":
      if (process.env.NEXT_PUBLIC_REFRESH_URL) {
        return process.env.NEXT_PUBLIC_REFRESH_URL;
      } else {
        throw new Error("env var NEXT_PUBLIC_REFRESH_URL is undefined!");
      }
    case "development":
      if (process.env.NEXT_PUBLIC_DEV_REFRESH_URL) {
        return process.env.NEXT_PUBLIC_DEV_REFRESH_URL;
      } else {
        throw new Error("env var NEXT_PUBLIC_DEV_REFRESH_URL is undefined!");
      }

    default:
      if (process.env.NEXT_PUBLIC_DEV_REFRESH_URL) {
        return process.env.NEXT_PUBLIC_DEV_REFRESH_URL;
      } else {
        throw new Error("env var NEXT_PUBLIC_DEV_REFRESH_URL is undefined!");
      }
  }
}
