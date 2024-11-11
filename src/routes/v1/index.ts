import { Application } from "express";

import { camelToKebabCase } from "../../utils/strings";
import { validString } from "../../validators";
import { isRoute, PathObject } from "../types";



const routes: PathObject = {

}


const v1Routes = (app: Application) => {
  const addRoutes = (routes: PathObject, basePath1: string = "") => {
    Object.entries(routes).forEach(([key, route]) => {
      const basePath2 = `${basePath1}/${camelToKebabCase(key)}`;
      if (isRoute(route)) {
        const { method, handler, path: customPath, middleware } = route;
        // If a path is manually defined in the route use it.
        // Otherwise use the route's / object's parent key as the path
        const path = (validString(customPath))
          ? `${basePath1}/${customPath}`
          : basePath2;
        const handlers = middleware ? [...middleware, handler] : [handler];
        switch (method) {
          case "get":
            app.get(path, ...handlers);
            break;
          case "post":
            app.post(path, ...handlers);
            break;
          case "patch":
            app.patch(path, ...handlers);
            break;
          case "delete":
            app.delete(path, ...handlers);
            break;
        }
      } else {
        addRoutes(route as PathObject, basePath2);
      }
    });
  }
  addRoutes(routes, "/v1"); // Initialize routes with base path

  return app;
}

export default v1Routes;