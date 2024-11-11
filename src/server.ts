import express from "express";
import cors from "cors";

import { PORT, CORS_ORIGIN, BASE_URL } from "./constants";
import defaultRoutes from "./routes/default";
import Morgan from "./middleware/morgan";
import logger from "./middleware/logger";
import v1Routes from "./routes/v1";



export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: CORS_ORIGIN,
};
app.set("trust proxy", true);
app.use(express.json());
app.use(cors(corsOptions));
app.use(Morgan);

v1Routes(app);
defaultRoutes(app);


export const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  logger.info(`⚡️[server]: Server is running at ${BASE_URL}`);
});