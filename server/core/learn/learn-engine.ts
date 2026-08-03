import type { AdaptiveHint, LearnNode } from "@shared/contentfy";

/** ContentFy Learn — adaptive learning seams over existing LMS. */
export class LearnEngine {
  buildTrail(root: LearnNode): LearnNode {
    return root;
  }

  recommendNext(hint: Omit<AdaptiveHint, "recommendedNext" | "reason">): AdaptiveHint {
    return {
      ...hint,
      recommendedNext: [],
      reason: "Architecture ready — adaptive ranking not wired yet.",
    };
  }
}

export const learnEngine = new LearnEngine();
