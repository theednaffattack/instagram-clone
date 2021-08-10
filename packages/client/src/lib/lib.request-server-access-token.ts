import { setAccessToken } from "./lib.access-token";
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
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_REFRESH_URL
      : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;

  // const requestBody = {};
  // const axiosConfig: AxiosRequestConfig = { withCredentials: true };

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ from: fromWhere }),
      headers: {
        cookie: "icg=" + cookie,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    logger.info("VIEW RESPONSE & COOKIE");
    logger.info({ res, cookie });
    // res = await axios.post(url, requestBody, axiosConfig);
  } catch (err) {
    logger.error(
      err,
      "ERROR REQUESTING ACCESS TOKEN AND SETTING REFRESH TOKEN COOKIE"
    );
  }

  let data;
  try {
    data = await res.json();
    logger.info("VIEW DATA (json)");
    logger.info({ data });
  } catch (error) {
    logger.error(error, "CONVERTING REQUEST DATA TO JSON");
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
