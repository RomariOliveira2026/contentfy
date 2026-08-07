/**
 * ContentFy Intelligence Engine — contracts (Evolution XIV).
 * Rule-based / statistical only. No generative AI, OpenAI, LLM, or embeddings.
 * Consumes marketplace & LMS signals; does not mutate other engines.
 */

/** All score weights/thresholds live in config — never hardcode in engines. */
export interface IntelligenceScoreWeights {
  product: {
    views: number;
    sales: number;
    favorites: number;
    completion: number;
    retention: number;
    refundPenalty: number;
    abandonmentPenalty: number;
  };
  creator: {
    conversion: number;
    retention: number;
    satisfaction: number;
    volume: number;
  };
  category: {
    growth: number;
    sales: number;
    engagement: number;
  };
  engagement: {
    sessionsProxy: number;
    favorites: number;
    progress: number;
  };
  trust: {
    completion: number;
    lowRefund: number;
    retention: number;
  };
  growth: {
    salesDelta: number;
    viewsDelta: number;
  };
  momentum: {
    recentSales: number;
    recentViews: number;
    acceleration: number;
  };
}

export interface IntelligenceThresholds {
  /** Relative drop vs prior window to flag sales decline */
  salesDropPercent: number;
  retentionDropPercent: number;
  highAbandonmentPercent: number;
  highRefundPercent: number;
  viralViewsMin: number;
  viralSalesMin: number;
  emergingGrowthPercent: number;
  decliningGrowthPercent: number;
  categoryHeatGrowthPercent: number;
  categoryCoolDropPercent: number;
}

export interface IntelligenceScoreConfig {
  weights: IntelligenceScoreWeights;
  thresholds: IntelligenceThresholds;
  /** Windows in days for recent vs prior comparison */
  windows: {
    recentDays: number;
    priorDays: number;
  };
}

export const DEFAULT_INTELLIGENCE_SCORE_CONFIG: IntelligenceScoreConfig = {
  weights: {
    product: {
      views: 0.15,
      sales: 0.25,
      favorites: 0.1,
      completion: 0.2,
      retention: 0.15,
      refundPenalty: 0.1,
      abandonmentPenalty: 0.05,
    },
    creator: {
      conversion: 0.3,
      retention: 0.25,
      satisfaction: 0.25,
      volume: 0.2,
    },
    category: {
      growth: 0.4,
      sales: 0.35,
      engagement: 0.25,
    },
    engagement: {
      sessionsProxy: 0.4,
      favorites: 0.3,
      progress: 0.3,
    },
    trust: {
      completion: 0.4,
      lowRefund: 0.35,
      retention: 0.25,
    },
    growth: {
      salesDelta: 0.6,
      viewsDelta: 0.4,
    },
    momentum: {
      recentSales: 0.4,
      recentViews: 0.3,
      acceleration: 0.3,
    },
  },
  thresholds: {
    salesDropPercent: 20,
    retentionDropPercent: 15,
    highAbandonmentPercent: 40,
    highRefundPercent: 8,
    viralViewsMin: 50,
    viralSalesMin: 5,
    emergingGrowthPercent: 25,
    decliningGrowthPercent: -15,
    categoryHeatGrowthPercent: 20,
    categoryCoolDropPercent: -15,
  },
  windows: {
    recentDays: 14,
    priorDays: 14,
  },
};

export type IntelligenceAlertKind =
  | "sales_drop"
  | "retention_drop"
  | "high_abandonment"
  | "high_refund"
  | "accelerated_growth"
  | "viral_product"
  | "category_heating"
  | "category_cooling";

export type IntelligenceInsightKind =
  | "retention_change"
  | "abandonment_hotspot"
  | "co_purchase"
  | "study_time_pattern"
  | "conversion_weekday"
  | "generic_metric";

export interface IntelligenceScoreBreakdown {
  score: number;
  label: string;
  components: Record<string, number>;
}

export interface ProductIntelligenceRow {
  productId: number;
  slug: string;
  name: string;
  category: string | null;
  author: string | null;
  views: number;
  sales: number;
  favorites: number;
  refunds: number;
  refundRate: number;
  completionRate: number;
  abandonmentRate: number;
  retentionProxy: number;
  avgProgress: number;
  revenueCents: number;
  recentSales: number;
  priorSales: number;
  salesDeltaPercent: number | null;
  recentViews: number;
  priorViews: number;
  viewsDeltaPercent: number | null;
  productScore: IntelligenceScoreBreakdown;
  engagementScore: IntelligenceScoreBreakdown;
  trustScore: IntelligenceScoreBreakdown;
  growthScore: IntelligenceScoreBreakdown;
  momentumScore: IntelligenceScoreBreakdown;
  lifecycle: "emerging" | "stable" | "declining" | "unknown";
}

export interface CreatorIntelligenceRow {
  authorKey: string;
  authorLabel: string;
  productCount: number;
  views: number;
  sales: number;
  conversionRate: number;
  completionRate: number;
  retentionProxy: number;
  refundRate: number;
  revenueCents: number;
  creatorScore: IntelligenceScoreBreakdown;
}

export interface CategoryIntelligenceRow {
  category: string;
  productCount: number;
  views: number;
  sales: number;
  favorites: number;
  salesDeltaPercent: number | null;
  categoryScore: IntelligenceScoreBreakdown;
  trend: "heating" | "cooling" | "stable" | "unknown";
}

export interface IntelligenceAlert {
  id: string;
  kind: IntelligenceAlertKind;
  severity: "info" | "watch" | "critical";
  title: string;
  body: string;
  entityType: "product" | "category" | "creator" | "marketplace";
  entityId: string;
  metric?: number;
  unit?: string;
}

export interface IntelligenceInsight {
  id: string;
  kind: IntelligenceInsightKind;
  title: string;
  body: string;
  entityType: "product" | "category" | "creator" | "marketplace";
  entityId: string;
  /** Only include when derived from real aggregates */
  evidence: Record<string, number | string | null>;
}

export interface MarketplaceHealth {
  revenueCents: number;
  ordersCompleted: number;
  conversionProxy: number;
  retentionProxy: number;
  completionProxy: number;
  refundRate: number;
  activeProducts: number;
  totalViews: number;
  totalFavorites: number;
}

export interface IntelligenceAdminDashboard {
  health: MarketplaceHealth;
  topProducts: ProductIntelligenceRow[];
  topCreators: CreatorIntelligenceRow[];
  topCategories: CategoryIntelligenceRow[];
  emerging: ProductIntelligenceRow[];
  stable: ProductIntelligenceRow[];
  declining: ProductIntelligenceRow[];
  highAbandonment: ProductIntelligenceRow[];
  highRefund: ProductIntelligenceRow[];
  alerts: IntelligenceAlert[];
  insights: IntelligenceInsight[];
  note: string | null;
  generatedAt: string;
  cacheHit: boolean;
}

export interface IntelligenceCreatorDashboard {
  summary: {
    views: number;
    sales: number;
    conversionRate: number;
    completionRate: number;
    retentionProxy: number;
    revenueCents: number;
    refundRate: number;
    favorites: number;
  };
  products: ProductIntelligenceRow[];
  ranking: ProductIntelligenceRow[];
  insights: IntelligenceInsight[];
  suggestions: IntelligenceInsight[];
  alerts: IntelligenceAlert[];
  note: string | null;
  ownershipMode: "author_meta" | "platform_proxy";
  generatedAt: string;
  cacheHit: boolean;
}

export interface IntelligenceRawProductSignal {
  productId: number;
  slug: string;
  name: string;
  category: string | null;
  author: string | null;
  views: number;
  recentViews: number;
  priorViews: number;
  sales: number;
  recentSales: number;
  priorSales: number;
  favorites: number;
  refunds: number;
  revenueCents: number;
  learners: number;
  avgProgress: number;
  completionRate: number;
  abandonmentRate: number;
  /** Proxied retention: learners with progress > 20% / learners */
  retentionProxy: number;
}
