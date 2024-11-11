import { Application } from "express";

import { Default } from "../views/default";



const defaultRoutes = (app: Application) => {
  // Default views for unhandled URLs
  app.get("*", Default);
  app.post("*", Default);
  app.put("*", Default);
  app.patch("*", Default);
  app.delete("*", Default);

  return app;
}

export default defaultRoutes;