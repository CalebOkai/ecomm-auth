import * as dotenv from "dotenv";



dotenv.config();

// Working Environment
export const ENV = process.env.ENV || "local";

// SONA Apps
export const BASE_URL =
  process.env.BASE_URL || "http://localhost:8000";
export const BASE_AUTH_URL =
  process.env.BASE_AUTH_URL || "http://localhost:8000";
export const BASE_STORE_URL =
  process.env.BASE_STORE_URL || "http://localhost:8001";
export const BASE_CMS_URL =
  process.env.BASE_CMS_URL || "http://localhost:3000";
export const BASE_WEB_URL =
  process.env.BASE_WEB_URL || "http://localhost:3001";

// Miscellaneous Configs
export const PORT = parseInt(process.env.PORT || "8000", 10);
export const CORS_ORIGIN = (process.env.CORS_ORIGIN || "").split(";");
export const LOCAL_TUNNEL_URL = "https://a4f8-154-161-142-9.ngrok-free.app";

// Amazon Web Services (AWS)
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
export const AWS_S3_FILE_OVERWRITE = process.env.AWS_S3_FILE_OVERWRITE || "";
export const AWS_REGION_NAME = process.env.AWS_REGION_NAME || "";
export const AWS_S3_MEDIA_URL = `https://${AWS_S3_BUCKET_NAME
  }.s3.amazonaws.com`;