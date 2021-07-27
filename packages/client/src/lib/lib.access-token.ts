let accessToken = "";

/**
 * Sets the global 'accessToken' variable.
 *
 * @param newToken  String value used to set the global variable.
 * @returns string
 */
export function setAccessToken(newToken: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accessToken = newToken;
}

/**
 * Gets the global 'accessToken' variable.
 */
export function getAccessToken(): string {
  return accessToken;
}
