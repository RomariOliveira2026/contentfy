import type { CommunitySpace, CommunityThread } from "@shared/contentfy";

/** ContentFy Community — spaces & threads architecture. */
export class CommunityEngine {
  createSpace(space: Omit<CommunitySpace, "id">): CommunitySpace {
    return { ...space, id: `cf_space_${Date.now()}` };
  }

  openThread(
    input: Omit<CommunityThread, "id" | "createdAt">
  ): CommunityThread {
    return {
      ...input,
      id: `cf_thread_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }
}

export const communityEngine = new CommunityEngine();
