/** ContentFy Learn — adaptive learning architecture (LMS evolution). */

export type LearnNodeType =
  | "trail"
  | "objective"
  | "mission"
  | "lesson"
  | "quiz"
  | "challenge"
  | "practice"
  | "certificate";

export interface LearnNode {
  id: string;
  type: LearnNodeType;
  title: string;
  children?: LearnNode[];
  productId?: number;
}

export interface AdaptiveHint {
  userId: number;
  nodeId: string;
  recommendedNext: string[];
  reason: string;
}
