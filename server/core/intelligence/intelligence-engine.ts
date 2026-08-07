import type {
  IntelligenceAdminDashboard,
  IntelligenceCreatorDashboard,
  IntelligenceScoreConfig,
} from "@shared/contentfy";
import { resolveIntelligenceConfig } from "./config";
import {
  intelligenceCacheGet,
  intelligenceCacheSet,
} from "./cache";
import { behaviorEngine } from "./behavior-engine";
import { analyticsEngine } from "./analytics-engine";
import { retentionEngine } from "./retention-engine";
import { marketplaceInsights } from "./marketplace-insights";
import { detectAlerts } from "./detection";
import { buildCreatorSuggestions, buildInsights } from "./insights";
import { buildIntelligenceSnapshot } from "../../intelligence-store";

export class IntelligenceEngine {
  constructor(private config: IntelligenceScoreConfig = resolveIntelligenceConfig()) {}

  async buildAdminDashboard(): Promise<IntelligenceAdminDashboard> {
    const cacheKey = "intelligence:admin";
    const cached = intelligenceCacheGet<IntelligenceAdminDashboard>(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const cfg = resolveIntelligenceConfig(this.config);
    const snapshot = await buildIntelligenceSnapshot();
    const rows = behaviorEngine.toProductRows(snapshot.products, cfg);
    const health = analyticsEngine.marketplaceHealth(rows);
    const life = marketplaceInsights.byLifecycle(rows);
    const categories = marketplaceInsights.categories(rows, cfg);
    const creators = marketplaceInsights.creators(rows, cfg);
    const alerts = detectAlerts(rows, categories, cfg);
    const insights = buildInsights(rows);

    const payload: IntelligenceAdminDashboard = {
      health,
      topProducts: marketplaceInsights.topProducts(rows, 12),
      topCreators: creators.slice(0, 12),
      topCategories: categories.slice(0, 12),
      emerging: life.emerging
        .sort((a, b) => (b.salesDeltaPercent || 0) - (a.salesDeltaPercent || 0))
        .slice(0, 10),
      stable: life.stable
        .sort((a, b) => b.productScore.score - a.productScore.score)
        .slice(0, 10),
      declining: life.declining
        .sort((a, b) => (a.salesDeltaPercent || 0) - (b.salesDeltaPercent || 0))
        .slice(0, 10),
      highAbandonment: retentionEngine.highAbandonment(
        rows,
        cfg.thresholds.highAbandonmentPercent,
        10
      ),
      highRefund: marketplaceInsights.highRefund(
        rows,
        cfg.thresholds.highRefundPercent,
        10
      ),
      alerts,
      insights,
      note:
        snapshot.persistence === "db"
          ? null
          : "Agregações parciais — verifique migration/DB. Nenhum número foi inventado.",
      generatedAt: new Date().toISOString(),
      cacheHit: false,
    };

    intelligenceCacheSet(cacheKey, payload, 60_000);
    return payload;
  }

  async buildCreatorDashboard(input: {
    userName: string | null;
  }): Promise<IntelligenceCreatorDashboard> {
    const authorHint = (input.userName || "").trim().toLowerCase();
    const cacheKey = `intelligence:creator:${authorHint || "platform"}`;
    const cached = intelligenceCacheGet<IntelligenceCreatorDashboard>(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const cfg = resolveIntelligenceConfig(this.config);
    const snapshot = await buildIntelligenceSnapshot();
    const allRows = behaviorEngine.toProductRows(snapshot.products, cfg);

    let ownershipMode: "author_meta" | "platform_proxy" = "platform_proxy";
    let rows = allRows;
    if (authorHint) {
      const filtered = allRows.filter(
        (r) => (r.author || "").trim().toLowerCase() === authorHint
      );
      if (filtered.length > 0) {
        rows = filtered;
        ownershipMode = "author_meta";
      }
    }

    const views = rows.reduce((s, r) => s + r.views, 0);
    const sales = rows.reduce((s, r) => s + r.sales, 0);
    const favorites = rows.reduce((s, r) => s + r.favorites, 0);
    const revenueCents = rows.reduce((s, r) => s + r.revenueCents, 0);
    const refunds = rows.reduce((s, r) => s + r.refunds, 0);
    const completionRate =
      rows.length > 0
        ? Math.round(
            rows.reduce((s, r) => s + r.completionRate, 0) / rows.length
          )
        : 0;
    const retentionProxy =
      rows.length > 0
        ? Math.round(
            rows.reduce((s, r) => s + r.retentionProxy, 0) / rows.length
          )
        : 0;
    const conversionRate =
      views > 0 ? Math.round((sales / views) * 1000) / 10 : 0;
    const refundRate =
      sales > 0 ? Math.round((refunds / sales) * 1000) / 10 : 0;

    const categories = marketplaceInsights.categories(rows, cfg);
    const alerts = detectAlerts(rows, categories, cfg);
    const insights = buildInsights(rows);
    const suggestions = buildCreatorSuggestions(rows);

    const payload: IntelligenceCreatorDashboard = {
      summary: {
        views,
        sales,
        conversionRate,
        completionRate,
        retentionProxy,
        revenueCents,
        refundRate,
        favorites,
      },
      products: rows
        .sort((a, b) => b.productScore.score - a.productScore.score)
        .slice(0, 24),
      ranking: marketplaceInsights.topProducts(rows, 10),
      insights,
      suggestions,
      alerts,
      note:
        ownershipMode === "author_meta"
          ? "Escopo por autor em product_discovery_meta (soft). Ownership formal ainda não existe no schema."
          : "Proxy de plataforma — sem products.creatorId. Quando meta.author coincidir com seu nome, o filtro ativa automaticamente.",
      ownershipMode,
      generatedAt: new Date().toISOString(),
      cacheHit: false,
    };

    intelligenceCacheSet(cacheKey, payload, 60_000);
    return payload;
  }
}

export const intelligenceEngine = new IntelligenceEngine();
