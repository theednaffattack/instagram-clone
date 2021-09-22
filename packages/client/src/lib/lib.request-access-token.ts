import { setAccessToken } from "./lib.access-token";
import { handleAsyncSimple } from "./lib.handle-async-client";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";

function getRefreshUrl(): string {
  const url =
    process.env.NODE_ENV !== "production"
      ? process.env.NEXT_PUBLIC_DEV_REFRESH_URL
      : process.env.NEXT_PUBLIC_REFRESH_URL;
  if (url) {
    return url;
  } else {
    return "refresh_url_undefined";
  }
}
export async function requestAccessToken(): Promise<any> {
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      data: { from: "lib.urql-client.ts" },
      operationName: "REFRESH-TOKEN",
    }),
  };

  const [refreshResponse, refreshError] = await handleAsyncSimple(
    async () => await fetch(getRefreshUrl(), fetchOptions)
  );

  if (refreshError) {
    handleCatchBlockError(refreshError);
  }

  const [resJson, resJsonError] = await handleAsyncSimple(
    async () => await refreshResponse.json()
  );

  if (resJsonError) {
    handleCatchBlockError(resJsonError);
  }

  setAccessToken(resJson);

  if (resJson && resJson.ok === true) {
    return resJson;
  }
  throw new Error("Impossible state - login");
}
