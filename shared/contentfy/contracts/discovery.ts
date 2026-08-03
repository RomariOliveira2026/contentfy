/** ContentFy Discovery — behavior-aware recommendation contracts. */

export interface DiscoveryProfile {
  userId: number;
  preferences: string[];
  goals: string[];
  completedProductIds: number[];
  signals: DiscoverySignal[];
}

export interface DiscoverySignal {
  type: "view" | "purchase" | "complete" | "wishlist" | "search";
  productId?: number;
  weight: number;
  at: string;
}

export interface DiscoveryResult {
  productIds: number[];
  strategy: "behavior" | "goals" | "related" | "fallback";
  reason: string;
}
