import Router from "next/router";
import { MyContext } from "./types";
import { isServer } from "./utilities.is-server";

function redirect(context: MyContext, target: string) {
  if (context.res) {
    console.log("VIEW CONTEXT", context);

    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target });
    context.res.end();
  }
  if (!isServer()) {
    {
      // In the browser, we just pretend like this never even happened ;)
      Router.replace(target);
    }
  } else {
    //
    console.log("ERROR UNEXPECTED STATE DURING RE-ROUTE", context);
  }
}

export default redirect;
