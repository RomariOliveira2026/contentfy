import type { MediaAsset, MediaTransformOptions } from "@shared/contentfy";

/** ContentFy Media — compression / CDN-ready pipeline seams. */
export class MediaEngine {
  planTransform(asset: MediaAsset, options: MediaTransformOptions) {
    return {
      assetId: asset.id,
      targetFormat: options.format ?? "webp",
      maxWidth: options.maxWidth,
      quality: options.quality ?? 80,
      compress: options.compress ?? true,
      cdnReady: Boolean(asset.cdnReady),
      status: "planned" as const,
    };
  }
}

export const mediaEngine = new MediaEngine();
