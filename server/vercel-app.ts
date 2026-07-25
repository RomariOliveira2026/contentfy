/**
 * Source entry for the Vercel serverless bundle (built into api/index.js).
 */
import "dotenv/config";
import { createApp } from "./createApp";

export default createApp({ serveClient: true });
