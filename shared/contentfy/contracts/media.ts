/** ContentFy Media — asset pipeline architecture. */

export type MediaKind = "image" | "video" | "pdf" | "audio" | "download";

export type MediaFormat = "webp" | "png" | "jpg" | "mp4" | "pdf" | "mp3" | "original";

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  url: string;
  format: MediaFormat;
  bytes?: number;
  productId?: number;
  cdnReady?: boolean;
}

export interface MediaTransformOptions {
  format?: MediaFormat;
  maxWidth?: number;
  quality?: number;
  compress?: boolean;
}
