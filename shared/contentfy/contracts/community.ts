/** ContentFy Community — discussions, mentorship, events. */

export type CommunitySpaceType =
  | "product"
  | "cohort"
  | "public"
  | "mentorship";

export interface CommunitySpace {
  id: string;
  type: CommunitySpaceType;
  title: string;
  productId?: number;
}

export type CommunityThreadKind =
  | "discussion"
  | "question"
  | "answer"
  | "live"
  | "event";

export interface CommunityThread {
  id: string;
  spaceId: string;
  kind: CommunityThreadKind;
  title: string;
  authorId: number;
  createdAt: string;
}
