import Router from "next/router";
import { MyContext } from "./types";
import { isServer } from "./utilities.is-server";

export function redirect(context: MyContext, target: string): void {
  if (context.req) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    // client
    Router.replace(target);
    console.error("ERROR UNEXPECTED STATE DURING RE-ROUTE", {
      isServer: isServer(),
    });
  }
}

export default redirect;
