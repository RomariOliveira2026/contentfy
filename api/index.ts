/**
 * Vercel serverless entry for Express (API + SPA fallback).
 * Static assets are served from /public by the CDN.
 */
import "dotenv/config";
import { createApp } from "../server/createApp";

export default createApp({ serveClient: true });
