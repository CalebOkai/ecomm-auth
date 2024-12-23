import morgan, { StreamOptions } from "morgan";
import logger from "./logger";



const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

export const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);

export default morganMiddleware;