import {
  computeTrendingScore,
  type TrendingScoreBreakdown,
} from "@shared/contentfy";

export interface TrendingSignals {
  slug: string;
  views: number;
  purchases: number;
  favorites: number;
  ratings: number;
  /** Normalized 0–1 growth proxy (recent events / older events). */
  recentGrowth: number;
}

export class TrendingEngine {
  scoreOne(signals: TrendingSignals): TrendingScoreBreakdown {
    const score = computeTrendingScore(signals);
    return {
      slug: signals.slug,
      score,
      views: signals.views,
      purchases: signals.purchases,
      favorites: signals.favorites,
      ratings: signals.ratings,
      recentGrowth: signals.recentGrowth,
    };
  }

  rank(signals: TrendingSignals[], limit = 12): TrendingScoreBreakdown[] {
    return signals
      .map((s) => this.scoreOne(s))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * When behavioral data is sparse, boost launches/featured as soft trending.
   */
  withEditorialFallback(
    ranked: TrendingScoreBreakdown[],
    editorialSlugs: string[],
    limit = 12
  ): TrendingScoreBreakdown[] {
    if (ranked.some((r) => r.score > 0)) {
      return ranked.slice(0, limit);
    }
    return editorialSlugs.slice(0, limit).map((slug, i) => ({
      slug,
      score: 100 - i,
      views: 0,
      purchases: 0,
      favorites: 0,
      ratings: 0,
      recentGrowth: 0,
    }));
  }
}

export const trendingEngine = new TrendingEngine();
