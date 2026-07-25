/**
 * Source entry for the Vercel serverless bundle (built into api/index.js).
 * Static SPA is served from /public via vercel.json outputDirectory.
 */
import "dotenv/config";
import { createApp } from "./createApp";

export default createApp({ serveClient: false });
