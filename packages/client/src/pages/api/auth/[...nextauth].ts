import axios from "axios";
import Cookies from "cookies";
import type { Response } from "express";
import { sign } from "jsonwebtoken";
import type { NextApiRequest } from "next";
import type { NextAuthOptions, Session } from "next-auth";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { LoginMutation } from "../../../generated/graphql";
import { cloudFrontCookies } from "../../../lib/lib.cloudfront-cookies";

// Loosely adapted from: https://dev.to/szymkab/next-js-authentication-with-existing-backend-200h
const refreshAccessToken = async (prevToken) => {
  let token;

  try {
    token = await axios({
      url: "http://192.168.1.10:8080/refresh_token",
      method: "post",
      data: {
        token: prevToken.accessToken,
        version: prevToken.version,
        operationName: `Token Refresh ${prevToken}`,
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error("ERROR FETCHING REFRESH TOKEN");
    console.error(error);
    throw new Error(error);
  }

  return {
    accessToken: token.accessToken,
    accessTokenExpires: Date.now() + token.expiresIn * 1000,
  };
};

// async function getUserFromTheApiServer(token) {
//   let user;
//   try {
//     user = await axios({
//       url: "http://192.168.1.10:8080/refresh_token",
//       method: "post",
//       data: {
//         token,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     throw new Error(error);
//   }

//   return user;
// }

const callbacks: NextAuthOptions["callbacks"] = {
  async jwt(prevToken: any, token: any) {
    // Initial call
    if (token) {
      return {
        accessToken: token.accessToken,
        // Assuming you can get the expired time from the API you are using
        // If not you can set this value manually
        accessTokenExpires: token.expiresIn,
      };
    }

    // Subsequent calls
    // Check if the expired time set has passed
    if (Date.now() < Date.parse(prevToken.accessTokenExpires)) {
      // Return previous token if still valid
      return prevToken;
    }

    // Refresh the token in case time has passed
    // If prevToken.accessTokenExpires does not exist
    // this fires.

    return refreshAccessToken(prevToken);
  },

  redirect: async (url: string, baseUrl: string) => {
    return url.startsWith(baseUrl)
      ? Promise.resolve(url)
      : Promise.resolve(baseUrl);
  },
  session: async function session(session, userOrToken): Promise<Session> {
    session.accessToken = userOrToken.accessToken;
    // session.user = await getUserFromTheApiServer(session.accessToken);

    return session;
  },

  /**
   * @param  {object} _user     User object
   * @param  {object} _account  Provider account
   * @param  {object} _profile  Provider profile
   * @return {boolean|string}  Return `true` to allow sign in
   *                           Return `false` to deny access
   *                           Return `string` to redirect to (eg.: "/unauthorized")
   */
  async signIn(_user, _account, _profile) {
    const isAllowedToSignIn = true;
    if (isAllowedToSignIn) {
      return true;
    } else {
      // Return false to display a default error message
      return false;
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    }
  },
};

const loginMutation = `mutation Login($password: String!, $username:String!){
  login(password: $password, username: $username){
    errors{
      field
      message
    }
    accessToken
    expiresIn
  }
}`;

function addDays(days: number) {
  const result = new Date();
  const date = result.getTime() / 1000 + 60 * 60 * 24 * 1;
  result.setDate(date + days);
  return result;
}

const getOptions = (req: NextApiRequest, res: Response) => ({
  callbacks,
  providers: [
    Providers.Credentials({
      id: "login",
      type: "credentials",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      authorize: async function authorize(credentials, _req) {
        const { username, password } = credentials;
        // Add logic here to look up the user from the credentials supplied
        // const token = await loginEndpoint(credentials);

        // BEG = EXAMPLE
        let loginResponse: { data: { data: LoginMutation } };
        try {
          loginResponse = await axios({
            url: "http://192.168.1.10:8080/graphql",
            method: "post",
            data: {
              query: loginMutation,
              variables: {
                username,
                password,
              },
              operationName: "Login",
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        } catch (error) {
          console.error("ERROR REQUESTING BACKEND USER - LOGIN");
          console.error(error.response);
          throw new Error(error);
        }

        const {
          data: {
            data: { login },
          },
        } = loginResponse;

        const sevenDays = addDays(7);

        const refreshToken = sign(
          { userId: login.userId, tokenVersion: login.version },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "7d",
          }
        );

        // Set cookies
        // First is our internal app refresh token set in a secure cookie
        const cookies = new Cookies(req, res);

        cookies.set(process.env.NEXT_PUBLIC_COOKIE_PREFIX, refreshToken, {
          httpOnly: true,
          expires: sevenDays,
        });

        // TODO: AWS CloudFront cookies go here.
        try {
          await cloudFrontCookies(res);
        } catch (error) {
          console.error(error);
          throw new Error("Error setting cookies needed for media assets.");
        }
        // END = EXAMPLE
        if (login) {
          // Any object returned will be saved in `user` property of the JWT
          return login;
          // return user.data.data.login.accessToken;
        } else {
          // If you return null or false then the credentials will be rejected
          // return null;
          // You can also Reject this callback with an Error or with a URL:
          throw new Error("error message - TEST"); // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.SESSION_SECRET,
  session: { jwt: true },
  debug: true,
});

export default async (req: NextApiRequest, res: Response): Promise<void> =>
  NextAuth(req, res as any, getOptions(req, res));

export const config = {
  api: {
    bodyParser: false,
  },
};
