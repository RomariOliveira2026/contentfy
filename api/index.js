var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  uniqueIndex,
  index
} from "drizzle-orm/mysql-core";
var users, productCategories, products, coupons, orders, refundRequests, refundAuditEvents, userProducts, courses, courseModules, courseLessons, lessonProgress, digitalAssets, affiliates, affiliateSales, certificates, productReviews, subscriptionPlans, userSubscriptions, productDiscoveryMeta, productDiscoveryRelationships, userFavorites, discoveryEvents, discoverySearchStats, learnUserGoals, experienceOnboarding, experienceActivityEvents, experienceActivityDaily, experienceTelemetryEvents, experienceDismissedRecommendations;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin", "affiliate"]).default("user").notNull(),
      stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
      // Stripe Customer ID
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    productCategories = mysqlTable("product_categories", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      type: mysqlEnum("type", ["ebook", "audiobook", "course", "app"]).notNull(),
      categoryId: int("categoryId"),
      price: int("price").notNull(),
      // Preço em centavos (ex: 9990 = R$99,90)
      isRecurring: boolean("isRecurring").default(false).notNull(),
      // Assinatura recorrente
      recurringInterval: mysqlEnum("recurringInterval", ["month", "year"]),
      // Intervalo de recorrência
      allowInstallments: boolean("allowInstallments").default(true).notNull(),
      // Permite parcelamento
      maxInstallments: int("maxInstallments").default(12),
      // Máximo de parcelas
      coverImage: text("coverImage"),
      // URL da imagem de capa
      thumbnailImage: text("thumbnailImage"),
      // URL da thumbnail
      contentUrl: text("contentUrl"),
      // URL do arquivo do produto (PDF, MP3, etc.)
      salesPageUrl: text("salesPageUrl"),
      // URL da página de vendas
      isActive: boolean("isActive").default(true).notNull(),
      stripePriceId: varchar("stripePriceId", { length: 255 }),
      // Stripe Price ID
      stripeProductId: varchar("stripeProductId", { length: 255 }),
      // Stripe Product ID
      guaranteeDays: int("guaranteeDays").default(30).notNull(),
      // Garantia em dias (padrão 30)
      affiliateCommission: int("affiliateCommission").default(60).notNull(),
      // Comissão de afiliados em % (padrão 60%, mínimo 50%, máximo 70%)
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    coupons = mysqlTable("coupons", {
      id: int("id").autoincrement().primaryKey(),
      code: varchar("code", { length: 50 }).notNull().unique(),
      discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
      discountValue: int("discountValue").notNull(),
      // Porcentagem ou valor em centavos
      maxUses: int("maxUses"),
      // Máximo de usos (null = ilimitado)
      usedCount: int("usedCount").default(0).notNull(),
      validFrom: timestamp("validFrom"),
      validUntil: timestamp("validUntil"),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    orders = mysqlTable("orders", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      productId: int("productId").notNull(),
      status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
      amount: int("amount").notNull(),
      // Valor total em centavos
      couponId: int("couponId"),
      // Cupom aplicado
      discountAmount: int("discountAmount").default(0),
      // Desconto aplicado em centavos
      stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
      // Stripe Payment Intent ID
      stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
      // Stripe Checkout Session ID
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    refundRequests = mysqlTable("refund_requests", {
      id: int("id").autoincrement().primaryKey(),
      orderId: int("orderId").notNull(),
      userId: int("userId").notNull(),
      productId: int("productId").notNull(),
      reason: mysqlEnum("reason", [
        "content_mismatch",
        "access_issue",
        "accidental_purchase",
        "not_needed",
        "other"
      ]).notNull(),
      details: text("details"),
      status: mysqlEnum("status", [
        "requested",
        "under_review",
        "approved",
        "rejected",
        "processing",
        "refunded",
        "failed",
        "cancelled"
      ]).default("requested").notNull(),
      requestedAt: timestamp("requestedAt").defaultNow().notNull(),
      reviewedAt: timestamp("reviewedAt"),
      reviewedBy: int("reviewedBy"),
      refundAmount: int("refundAmount"),
      // centavos
      providerRefundId: varchar("providerRefundId", { length: 255 }),
      adminNotes: text("adminNotes"),
      idempotencyKey: varchar("idempotencyKey", { length: 128 }),
      accessRevocationStatus: mysqlEnum("accessRevocationStatus", [
        "pending",
        "revoked",
        "failed",
        "not_applicable"
      ]).default("not_applicable").notNull(),
      reconciliationNeeded: boolean("reconciliationNeeded").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    refundAuditEvents = mysqlTable("refund_audit_events", {
      id: int("id").autoincrement().primaryKey(),
      refundRequestId: int("refundRequestId"),
      orderId: int("orderId"),
      actorUserId: int("actorUserId"),
      eventType: varchar("eventType", { length: 64 }).notNull(),
      fromStatus: varchar("fromStatus", { length: 32 }),
      toStatus: varchar("toStatus", { length: 32 }),
      message: text("message"),
      metadataJson: text("metadataJson"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    userProducts = mysqlTable("user_products", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      productId: int("productId").notNull(),
      orderId: int("orderId").notNull(),
      accessGrantedAt: timestamp("accessGrantedAt").defaultNow().notNull(),
      accessExpiresAt: timestamp("accessExpiresAt"),
      // null = acesso vitalício
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courses = mysqlTable("courses", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull().unique(),
      // Relacionado ao produto
      instructor: varchar("instructor", { length: 255 }),
      duration: int("duration"),
      // Duração estimada em minutos
      level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]),
      certificateEnabled: boolean("certificateEnabled").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseModules = mysqlTable("course_modules", {
      id: int("id").autoincrement().primaryKey(),
      courseId: int("courseId").notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      order: int("order").notNull(),
      // Ordem do módulo
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseLessons = mysqlTable("course_lessons", {
      id: int("id").autoincrement().primaryKey(),
      moduleId: int("moduleId").notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      type: mysqlEnum("type", ["video", "text", "pdf", "audio"]).notNull(),
      contentUrl: text("contentUrl"),
      // URL do vídeo, PDF, áudio
      duration: int("duration"),
      // Duração em segundos (para vídeo/áudio)
      order: int("order").notNull(),
      // Ordem da aula
      isFree: boolean("isFree").default(false).notNull(),
      // Aula gratuita (preview)
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    lessonProgress = mysqlTable("lesson_progress", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      lessonId: int("lessonId").notNull(),
      isCompleted: boolean("isCompleted").default(false).notNull(),
      progress: int("progress").default(0),
      // Progresso em porcentagem (0-100)
      lastWatchedAt: timestamp("lastWatchedAt"),
      completedAt: timestamp("completedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    digitalAssets = mysqlTable("digital_assets", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull(),
      fileUrl: text("fileUrl").notNull(),
      // URL do arquivo (PDF, MP3, etc.)
      fileType: varchar("fileType", { length: 50 }).notNull(),
      // pdf, mp3, epub, etc.
      fileSize: int("fileSize"),
      // Tamanho em bytes
      duration: int("duration"),
      // Duração em segundos (para audiobooks)
      allowDownload: boolean("allowDownload").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    affiliates = mysqlTable("affiliates", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique(),
      affiliateCode: varchar("affiliateCode", { length: 50 }).notNull().unique(),
      commissionRate: int("commissionRate").default(60).notNull(),
      // Taxa de comissão padrão (50-70%)
      totalEarnings: int("totalEarnings").default(0).notNull(),
      // Ganhos totais em centavos
      pendingEarnings: int("pendingEarnings").default(0).notNull(),
      // Ganhos pendentes
      status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    affiliateSales = mysqlTable("affiliate_sales", {
      id: int("id").autoincrement().primaryKey(),
      affiliateId: int("affiliateId").notNull(),
      orderId: int("orderId").notNull(),
      commissionAmount: int("commissionAmount").notNull(),
      // Comissão em centavos
      status: mysqlEnum("status", ["pending", "approved", "paid"]).default("pending").notNull(),
      paidAt: timestamp("paidAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    certificates = mysqlTable("certificates", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      courseId: int("courseId").notNull(),
      certificateCode: varchar("certificateCode", { length: 100 }).notNull().unique(),
      issuedAt: timestamp("issuedAt").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    productReviews = mysqlTable("product_reviews", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull(),
      userId: int("userId").notNull(),
      rating: int("rating").notNull(),
      // 1 a 5 estrelas
      comment: text("comment"),
      isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(),
      // Compra verificada
      isApproved: boolean("isApproved").default(true).notNull(),
      // Moderação
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    subscriptionPlans = mysqlTable("subscription_plans", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      // Ex: "Básico", "Pro", "Premium"
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      price: int("price").notNull(),
      // Preço mensal em centavos
      interval: mysqlEnum("interval", ["month", "year"]).default("month").notNull(),
      features: text("features"),
      // JSON com lista de features
      maxProducts: int("maxProducts"),
      // Limite de produtos (null = ilimitado)
      stripePriceId: varchar("stripePriceId", { length: 255 }),
      // Stripe Price ID
      stripeProductId: varchar("stripeProductId", { length: 255 }),
      // Stripe Product ID
      isActive: boolean("isActive").default(true).notNull(),
      displayOrder: int("displayOrder").default(0),
      // Ordem de exibição
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    userSubscriptions = mysqlTable("user_subscriptions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      planId: int("planId").notNull(),
      status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid", "trialing"]).default("active").notNull(),
      stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
      // Stripe Subscription ID
      stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
      // Stripe Customer ID
      currentPeriodStart: timestamp("currentPeriodStart"),
      currentPeriodEnd: timestamp("currentPeriodEnd"),
      cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
      canceledAt: timestamp("canceledAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productDiscoveryMeta = mysqlTable("product_discovery_meta", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId"),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      tagsJson: text("tagsJson"),
      category: varchar("category", { length: 255 }),
      subcategory: varchar("subcategory", { length: 255 }),
      level: varchar("level", { length: 64 }),
      durationLabel: varchar("durationLabel", { length: 128 }),
      author: varchar("author", { length: 255 }),
      collectionsJson: text("collectionsJson"),
      keywordsJson: text("keywordsJson"),
      objectivesJson: text("objectivesJson"),
      audienceJson: text("audienceJson"),
      skillsJson: text("skillsJson"),
      isFeatured: boolean("isFeatured").default(false).notNull(),
      isLaunch: boolean("isLaunch").default(false).notNull(),
      isBeginnerFriendly: boolean("isBeginnerFriendly").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productDiscoveryRelationships = mysqlTable(
      "product_discovery_relationships",
      {
        id: int("id").autoincrement().primaryKey(),
        fromSlug: varchar("fromSlug", { length: 255 }).notNull(),
        toSlug: varchar("toSlug", { length: 255 }).notNull(),
        relationType: mysqlEnum("relationType", [
          "next",
          "prerequisite",
          "companion",
          "upsell",
          "bundle"
        ]).default("next").notNull(),
        weight: int("weight").default(1).notNull(),
        label: varchar("label", { length: 255 }),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      }
    );
    userFavorites = mysqlTable("user_favorites", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      productId: int("productId"),
      productSlug: varchar("productSlug", { length: 255 }).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    discoveryEvents = mysqlTable("discovery_events", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      eventType: varchar("eventType", { length: 32 }).notNull(),
      productId: int("productId"),
      productSlug: varchar("productSlug", { length: 255 }),
      category: varchar("category", { length: 255 }),
      query: varchar("query", { length: 512 }),
      dwellMs: int("dwellMs"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    discoverySearchStats = mysqlTable("discovery_search_stats", {
      id: int("id").autoincrement().primaryKey(),
      queryNormalized: varchar("queryNormalized", { length: 255 }).notNull().unique(),
      hitCount: int("hitCount").default(1).notNull(),
      lastSearchedAt: timestamp("lastSearchedAt").defaultNow().notNull()
    });
    learnUserGoals = mysqlTable("learn_user_goals", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique(),
      goalId: varchar("goalId", { length: 64 }).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    experienceOnboarding = mysqlTable("experience_onboarding", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique(),
      primaryGoalId: varchar("primaryGoalId", { length: 64 }),
      improveFirst: varchar("improveFirst", { length: 200 }),
      weeklyHours: decimal("weeklyHours", { precision: 4, scale: 1 }),
      preferencesJson: text("preferencesJson"),
      completedAt: timestamp("completedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    experienceActivityEvents = mysqlTable(
      "experience_activity_events",
      {
        id: int("id").autoincrement().primaryKey(),
        userId: int("userId").notNull(),
        eventType: varchar("eventType", { length: 48 }).notNull(),
        productId: int("productId"),
        productSlug: varchar("productSlug", { length: 255 }),
        lessonId: int("lessonId"),
        metaJson: text("metaJson"),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (t2) => ({
        userCreatedIdx: index("experience_activity_user_created_idx").on(
          t2.userId,
          t2.createdAt
        ),
        typeIdx: index("experience_activity_type_idx").on(t2.eventType)
      })
    );
    experienceActivityDaily = mysqlTable(
      "experience_activity_daily",
      {
        id: int("id").autoincrement().primaryKey(),
        userId: int("userId").notNull(),
        day: varchar("day", { length: 10 }).notNull(),
        eventCount: int("eventCount").default(1).notNull(),
        lastEventType: varchar("lastEventType", { length: 48 }),
        createdAt: timestamp("createdAt").defaultNow().notNull(),
        updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
      },
      (t2) => ({
        userDayUniq: uniqueIndex("experience_activity_daily_user_day").on(
          t2.userId,
          t2.day
        )
      })
    );
    experienceTelemetryEvents = mysqlTable(
      "experience_telemetry_events",
      {
        id: int("id").autoincrement().primaryKey(),
        userId: int("userId").notNull(),
        eventName: varchar("eventName", { length: 64 }).notNull(),
        metaJson: text("metaJson"),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (t2) => ({
        userCreatedIdx: index("experience_telemetry_user_created_idx").on(
          t2.userId,
          t2.createdAt
        ),
        nameIdx: index("experience_telemetry_name_idx").on(t2.eventName)
      })
    );
    experienceDismissedRecommendations = mysqlTable(
      "experience_dismissed_recommendations",
      {
        id: int("id").autoincrement().primaryKey(),
        userId: int("userId").notNull(),
        recommendationId: varchar("recommendationId", { length: 128 }).notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (t2) => ({
        uniq: uniqueIndex("experience_dismissed_rec_unique").on(
          t2.userId,
          t2.recommendationId
        )
      })
    );
  }
});

// server/_core/env.ts
function resolveOAuthServerUrl() {
  const configured = (process.env.OAUTH_SERVER_URL || "").trim();
  const isPlaceholder = !configured || /seu[_-]?oauth|sou[_-]?oauth|SEU_OAUTH|YOUR[_-]?OAUTH|example\.com/i.test(
    configured
  );
  const isOrphanLocalMock = /localhost:3010|127\.0\.0\.1:3010/i.test(
    configured
  );
  if (isPlaceholder || isOrphanLocalMock) {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/dev-oauth/`;
    }
    const port = process.env.PORT || "3000";
    return `http://localhost:${port}/api/dev-oauth/`;
  }
  return configured.endsWith("/") ? configured : `${configured}/`;
}
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: resolveOAuthServerUrl(),
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
import { eq, desc, and, sql, inArray, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return _db;
  if (process.env.VERCEL && /localhost|127\.0\.0\.1|::1/i.test(url)) {
    console.error(
      "[Database] DATABASE_URL aponta para localhost na Vercel. Use um MySQL hospedado (PlanetScale, Railway, Neon MySQL, etc)."
    );
    return null;
  }
  if (!_db) {
    try {
      _db = drizzle(url);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod", "stripeCustomerId"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error("[Database] getAllUsers failed:", error);
    return [];
  }
}
async function updateUserStripeCustomerId(userId, stripeCustomerId) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}
async function getAllProductCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productCategories).orderBy(productCategories.name);
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      type: products.type,
      categoryId: products.categoryId,
      price: products.price,
      isRecurring: products.isRecurring,
      recurringInterval: products.recurringInterval,
      allowInstallments: products.allowInstallments,
      maxInstallments: products.maxInstallments,
      coverImage: products.coverImage,
      thumbnailImage: products.thumbnailImage,
      salesPageUrl: products.salesPageUrl,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: productCategories
    }).from(products).leftJoin(productCategories, eq(products.categoryId, productCategories.id)).orderBy(desc(products.createdAt));
  } catch (error) {
    console.error("[Database] getAllProducts failed:", error);
    return [];
  }
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createProduct(product) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product);
  const insertId = Number(
    result[0]?.insertId ?? result.insertId ?? 0
  );
  return { insertId, result };
}
async function updateProduct(id, product) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(product).where(eq(products.id, id));
}
async function deleteProduct(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
}
async function getProductsByType(type) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(and(eq(products.type, type), eq(products.isActive, true))).orderBy(desc(products.createdAt));
}
async function getCouponByCode(code) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(coupons).where(and(eq(coupons.code, code), eq(coupons.isActive, true))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function incrementCouponUsage(couponId) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, couponId));
}
async function createOrder(order) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  const insertId = result[0]?.insertId || result.insertId;
  if (!insertId) {
    throw new Error("Failed to get order ID after insert");
  }
  return Number(insertId);
}
async function getOrderById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    id: orders.id,
    userId: orders.userId,
    productId: orders.productId,
    amount: orders.amount,
    couponId: orders.couponId,
    discountAmount: orders.discountAmount,
    status: orders.status,
    stripeCheckoutSessionId: orders.stripeCheckoutSessionId,
    stripePaymentIntentId: orders.stripePaymentIntentId,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
    user: {
      id: users.id,
      name: users.name,
      email: users.email
    }
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, id)).limit(1);
  return result[0] || null;
}
async function updateOrderStatus(orderId, status) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}
async function updateOrder(orderId, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set(data).where(eq(orders.id, orderId));
}
async function getUserOrders(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}
async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select({
      id: orders.id,
      userId: orders.userId,
      totalAmount: orders.amount,
      status: orders.status,
      stripeCheckoutSessionId: orders.stripeCheckoutSessionId,
      createdAt: orders.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    }).from(orders).leftJoin(users, eq(orders.userId, users.id)).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] getAllOrders failed:", error);
    return [];
  }
}
async function grantProductAccess(userProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userProducts).values(userProduct);
  return result;
}
async function getUserProducts(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    userProduct: userProducts,
    product: products
  }).from(userProducts).leftJoin(products, eq(userProducts.productId, products.id)).where(and(
    eq(userProducts.userId, userId),
    eq(userProducts.isActive, true)
  )).orderBy(desc(userProducts.accessGrantedAt));
}
async function hasProductAccess(userId, productId) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(userProducts).where(and(
    eq(userProducts.userId, userId),
    eq(userProducts.productId, productId),
    eq(userProducts.isActive, true)
  )).limit(1);
  return result.length > 0;
}
async function revokeProductAccessByOrder(orderId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userProducts).set({ isActive: false }).where(eq(userProducts.orderId, orderId));
}
async function finalizeRefundAndRevokeAccess(input) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  let accessRevocationStatus = "revoked";
  let reconciliationNeeded = false;
  try {
    await database.transaction(async (tx) => {
      await tx.update(orders).set({ status: "refunded" }).where(eq(orders.id, input.orderId));
      await tx.update(userProducts).set({ isActive: false }).where(eq(userProducts.orderId, input.orderId));
      await tx.update(refundRequests).set({
        status: "refunded",
        providerRefundId: input.providerRefundId,
        refundAmount: input.refundAmount,
        reviewedBy: input.reviewedBy,
        reviewedAt: /* @__PURE__ */ new Date(),
        accessRevocationStatus: "revoked",
        reconciliationNeeded: false
      }).where(eq(refundRequests.id, input.requestId));
    });
  } catch (error) {
    console.error(
      "[ContentFy Protect] finalizeRefundAndRevokeAccess transaction failed:",
      error instanceof Error ? error.message : error
    );
    accessRevocationStatus = "failed";
    reconciliationNeeded = true;
    await database.update(refundRequests).set({
      status: "refunded",
      providerRefundId: input.providerRefundId,
      refundAmount: input.refundAmount,
      reviewedBy: input.reviewedBy,
      reviewedAt: /* @__PURE__ */ new Date(),
      accessRevocationStatus: "failed",
      reconciliationNeeded: true
    }).where(eq(refundRequests.id, input.requestId));
    try {
      await database.update(orders).set({ status: "refunded" }).where(eq(orders.id, input.orderId));
    } catch {
    }
    try {
      await database.update(userProducts).set({ isActive: false }).where(eq(userProducts.orderId, input.orderId));
      accessRevocationStatus = "revoked";
      reconciliationNeeded = false;
      await database.update(refundRequests).set({
        accessRevocationStatus: "revoked",
        reconciliationNeeded: false
      }).where(eq(refundRequests.id, input.requestId));
    } catch {
    }
  }
  return { accessRevocationStatus, reconciliationNeeded };
}
async function insertRefundAuditEvent(event) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  const result = await database.insert(refundAuditEvents).values(event);
  const insertId = result[0]?.insertId || result.insertId;
  return Number(insertId || 0);
}
async function listRefundAuditEvents(refundRequestId) {
  const database = await getDb();
  if (!database) return [];
  return database.select().from(refundAuditEvents).where(eq(refundAuditEvents.refundRequestId, refundRequestId)).orderBy(desc(refundAuditEvents.createdAt));
}
async function getUserProductByOrder(orderId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userProducts).where(eq(userProducts.orderId, orderId)).limit(1);
  return result[0] ?? null;
}
async function createRefundRequest(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(refundRequests).values(data);
  const insertId = result[0]?.insertId || result.insertId;
  if (!insertId) throw new Error("Failed to create refund request");
  return Number(insertId);
}
async function getRefundRequestById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(refundRequests).where(eq(refundRequests.id, id)).limit(1);
  return result[0] ?? null;
}
async function getRefundRequestsByOrderId(orderId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(refundRequests).where(eq(refundRequests.orderId, orderId)).orderBy(desc(refundRequests.createdAt));
}
async function getActiveRefundRequestForOrder(orderId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(refundRequests).where(
    and(
      eq(refundRequests.orderId, orderId),
      inArray(refundRequests.status, [...ACTIVE_REFUND_DB_STATUSES])
    )
  ).orderBy(desc(refundRequests.createdAt)).limit(1);
  return result[0] ?? null;
}
async function listRefundRequests(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(refundRequests.status, filters.status));
  }
  if (filters?.productId) {
    conditions.push(eq(refundRequests.productId, filters.productId));
  }
  if (filters?.userId) {
    conditions.push(eq(refundRequests.userId, filters.userId));
  }
  if (filters?.from) {
    conditions.push(gte(refundRequests.requestedAt, filters.from));
  }
  if (filters?.to) {
    conditions.push(lte(refundRequests.requestedAt, filters.to));
  }
  const base = db.select({
    request: refundRequests,
    order: {
      id: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      stripePaymentIntentId: orders.stripePaymentIntentId
    },
    product: {
      id: products.id,
      name: products.name,
      guaranteeDays: products.guaranteeDays
    },
    user: {
      id: users.id,
      name: users.name,
      email: users.email
    }
  }).from(refundRequests).leftJoin(orders, eq(refundRequests.orderId, orders.id)).leftJoin(products, eq(refundRequests.productId, products.id)).leftJoin(users, eq(refundRequests.userId, users.id));
  const rows = conditions.length ? await base.where(and(...conditions)).orderBy(desc(refundRequests.requestedAt)) : await base.orderBy(desc(refundRequests.requestedAt));
  return rows;
}
async function updateRefundRequest(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(refundRequests).set(data).where(eq(refundRequests.id, id));
  return getRefundRequestById(id);
}
async function getCourseByProductId(productId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(courses).where(eq(courses.productId, productId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function ensureCourseForProduct(productId) {
  const existing = await getCourseByProductId(productId);
  if (existing) return existing;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values({
    productId,
    level: "beginner",
    certificateEnabled: true
  });
  const insertId = Number(
    result[0]?.insertId ?? result.insertId ?? 0
  );
  const created = await getCourseByProductId(productId);
  if (!created) {
    throw new Error(`Failed to create course row (insertId=${insertId})`);
  }
  return created;
}
async function getCourseModules(courseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseModules).where(eq(courseModules.courseId, courseId)).orderBy(courseModules.order);
}
async function getModuleLessons(moduleId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseLessons).where(eq(courseLessons.moduleId, moduleId)).orderBy(courseLessons.order);
}
async function getCourseStructureForBuilder(productId) {
  const course = await ensureCourseForProduct(productId);
  const modules = await getCourseModules(course.id);
  const withLessons = await Promise.all(
    modules.map(async (mod) => ({
      ...mod,
      lessons: await getModuleLessons(mod.id)
    }))
  );
  return { course, modules: withLessons };
}
async function createCourseModule(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseModules).values(data);
  const insertId = Number(
    result[0]?.insertId ?? result.insertId ?? 0
  );
  return insertId;
}
async function updateCourseModule(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseModules).set(data).where(eq(courseModules.id, id));
}
async function deleteCourseModule(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const lessons = await getModuleLessons(id);
  for (const lesson of lessons) {
    await db.delete(courseLessons).where(eq(courseLessons.id, lesson.id));
  }
  await db.delete(courseModules).where(eq(courseModules.id, id));
}
async function createCourseLesson(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseLessons).values(data);
  return Number(
    result[0]?.insertId ?? result.insertId ?? 0
  );
}
async function updateCourseLesson(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseLessons).set(data).where(eq(courseLessons.id, id));
}
async function deleteCourseLesson(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseLessons).where(eq(courseLessons.id, id));
}
async function swapModuleOrder(moduleIdA, moduleIdB) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [a] = await db.select().from(courseModules).where(eq(courseModules.id, moduleIdA)).limit(1);
  const [b] = await db.select().from(courseModules).where(eq(courseModules.id, moduleIdB)).limit(1);
  if (!a || !b) throw new Error("M\xF3dulo n\xE3o encontrado");
  await db.update(courseModules).set({ order: b.order }).where(eq(courseModules.id, a.id));
  await db.update(courseModules).set({ order: a.order }).where(eq(courseModules.id, b.id));
}
async function swapLessonOrder(lessonIdA, lessonIdB) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [a] = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonIdA)).limit(1);
  const [b] = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonIdB)).limit(1);
  if (!a || !b) throw new Error("Aula n\xE3o encontrada");
  await db.update(courseLessons).set({ order: b.order }).where(eq(courseLessons.id, a.id));
  await db.update(courseLessons).set({ order: a.order }).where(eq(courseLessons.id, b.id));
}
async function countStudentsByProduct(productId) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(*)` }).from(userProducts).where(and(eq(userProducts.productId, productId), eq(userProducts.isActive, true)));
  return Number(result[0]?.count ?? 0);
}
async function countDistinctStudents() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(distinct ${userProducts.userId})` }).from(userProducts).where(eq(userProducts.isActive, true));
  return Number(result[0]?.count ?? 0);
}
async function getUserLessonProgress(userId, lessonId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(lessonProgress).where(and(
    eq(lessonProgress.userId, userId),
    eq(lessonProgress.lessonId, lessonId)
  )).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateLessonProgress(progress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getUserLessonProgress(progress.userId, progress.lessonId);
  if (existing) {
    await db.update(lessonProgress).set(progress).where(eq(lessonProgress.id, existing.id));
  } else {
    await db.insert(lessonProgress).values(progress);
  }
}
async function getAffiliateByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createAffiliate(affiliate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliates).values(affiliate);
  const insertId = Number(result[0].insertId);
  const created = await db.select().from(affiliates).where(eq(affiliates.id, insertId)).limit(1);
  return created[0];
}
async function getAffiliateSales(affiliateId) {
  const db = await getDb();
  if (!db) return [];
  const sales = await db.select().from(affiliateSales).where(eq(affiliateSales.affiliateId, affiliateId)).orderBy(affiliateSales.createdAt);
  return sales;
}
async function getAllAffiliates() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select({
      id: affiliates.id,
      userId: affiliates.userId,
      affiliateCode: affiliates.affiliateCode,
      commissionRate: affiliates.commissionRate,
      totalEarnings: affiliates.totalEarnings,
      pendingEarnings: affiliates.pendingEarnings,
      isActive: affiliates.isActive,
      createdAt: affiliates.createdAt,
      updatedAt: affiliates.updatedAt,
      userName: users.name,
      userEmail: users.email
    }).from(affiliates).leftJoin(users, eq(affiliates.userId, users.id)).orderBy(affiliates.createdAt);
  } catch (error) {
    console.error("[Database] getAllAffiliates failed:", error);
    return [];
  }
}
async function updateAffiliateStatus(affiliateId, isActive) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(affiliates).set({ isActive }).where(eq(affiliates.id, affiliateId));
}
async function createCertificate(certificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(certificates).values(certificate);
  const insertId = Number(result[0].insertId);
  const created = await db.select().from(certificates).where(eq(certificates.id, insertId)).limit(1);
  return created[0];
}
async function getCertificateByUserAndCourse(userId, courseId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(certificates).where(
    and(
      eq(certificates.userId, userId),
      eq(certificates.courseId, courseId)
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserCertificates(userId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: certificates.id,
    userId: certificates.userId,
    courseId: certificates.courseId,
    certificateCode: certificates.certificateCode,
    issuedAt: certificates.issuedAt,
    courseName: products.name,
    courseCoverImage: products.coverImage
  }).from(certificates).leftJoin(products, eq(certificates.courseId, products.id)).where(eq(certificates.userId, userId)).orderBy(certificates.issuedAt);
  return result;
}
async function getCertificateByCode(certificateCode) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select({
    id: certificates.id,
    userId: certificates.userId,
    courseId: certificates.courseId,
    certificateCode: certificates.certificateCode,
    issuedAt: certificates.issuedAt,
    userName: users.name,
    courseName: products.name
  }).from(certificates).leftJoin(users, eq(certificates.userId, users.id)).leftJoin(products, eq(certificates.courseId, products.id)).where(eq(certificates.certificateCode, certificateCode)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(subscriptionPlans);
  return result;
}
async function getSubscriptionPlanById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserActiveSubscription(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(userSubscriptions).where(
    and(
      eq(userSubscriptions.userId, userId),
      eq(userSubscriptions.status, "active")
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createUserSubscription(subscription) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const result = await db.insert(userSubscriptions).values(subscription);
  return result;
}
async function updateUserSubscription(id, subscription) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(userSubscriptions).set(subscription).where(eq(userSubscriptions.id, id));
}
async function getUserSubscriptionByStripeId(stripeSubscriptionId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(userSubscriptions).where(eq(userSubscriptions.stripeSubscriptionId, stripeSubscriptionId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAffiliateByCode(code) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(affiliates).where(eq(affiliates.affiliateCode, code)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAffiliateById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(affiliates).where(eq(affiliates.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAffiliateActiveSubscriptions(affiliateId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.execute(sql`
    SELECT 
      us.id,
      us.userId,
      us.planId,
      us.stripeSubscriptionId,
      us.status,
      us.currentPeriodStart,
      us.currentPeriodEnd,
      us.cancelAtPeriodEnd,
      us.createdAt,
      sp.name as planName,
      sp.price as planPrice,
      sp.\`interval\` as recurringInterval,
      u.name as customerName,
      u.email as customerEmail,
      o.affiliateId,
      o.amount as orderAmount
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.planId = sp.id
    JOIN users u ON us.userId = u.id
    LEFT JOIN orders o ON o.userId = us.userId AND o.affiliateId = ${affiliateId}
    WHERE us.status = 'active'
      AND o.affiliateId = ${affiliateId}
    ORDER BY us.createdAt DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    planId: row.planId,
    planName: row.planName,
    planPrice: row.planPrice,
    recurringInterval: row.recurringInterval,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    status: row.status,
    currentPeriodStart: row.currentPeriodStart,
    currentPeriodEnd: row.currentPeriodEnd,
    cancelAtPeriodEnd: row.cancelAtPeriodEnd,
    createdAt: row.createdAt,
    // Calcular comissão (assumindo taxa do afiliado - buscar da tabela affiliates)
    commissionAmount: Math.round(row.planPrice * 0.6)
    // 60% de comissão
  }));
}
async function getAffiliateTotalClicks(affiliateId) {
  return 0;
}
async function getAffiliateMRRHistory(affiliateId, months) {
  const db = await getDb();
  if (!db) return [];
  const monthsArray = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = /* @__PURE__ */ new Date();
    date.setMonth(date.getMonth() - i);
    monthsArray.push({
      month: date.toISOString().slice(0, 7),
      // YYYY-MM
      newSubscribers: 0,
      mrr: 0
    });
  }
  const result = await db.execute(sql`
    SELECT 
      DATE_FORMAT(us.createdAt, '%Y-%m') as month,
      COUNT(*) as newSubscribers,
      SUM(CASE 
        WHEN sp.\`interval\` = 'year' THEN sp.price * 0.6 / 12
        ELSE sp.price * 0.6
      END) as mrr
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.planId = sp.id
    JOIN orders o ON o.userId = us.userId AND o.affiliateId = ${affiliateId}
    WHERE us.status = 'active'
      AND us.createdAt >= DATE_SUB(CURDATE(), INTERVAL ${months} MONTH)
    GROUP BY DATE_FORMAT(us.createdAt, '%Y-%m')
    ORDER BY month ASC
  `);
  const dataMap = new Map(result.rows.map((row) => [
    row.month,
    {
      month: row.month,
      newSubscribers: parseInt(row.newSubscribers),
      mrr: Math.round(parseFloat(row.mrr))
    }
  ]));
  return monthsArray.map((m) => dataMap.get(m.month) || m);
}
var _db, ACTIVE_REFUND_DB_STATUSES;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
    ACTIVE_REFUND_DB_STATUSES = [
      "requested",
      "under_review",
      "approved",
      "processing"
    ];
  }
});

// server/core/learn/cache.ts
var cache_exports = {};
__export(cache_exports, {
  learnCacheGet: () => learnCacheGet,
  learnCacheInvalidate: () => learnCacheInvalidate,
  learnCacheSet: () => learnCacheSet
});
function learnCacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}
function learnCacheSet(key, value, ttlMs = 45e3) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function learnCacheInvalidate(prefix) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
var store;
var init_cache = __esm({
  "server/core/learn/cache.ts"() {
    "use strict";
    store = /* @__PURE__ */ new Map();
  }
});

// server/core/success/cache.ts
var cache_exports2 = {};
__export(cache_exports2, {
  successCacheGet: () => successCacheGet,
  successCacheInvalidate: () => successCacheInvalidate,
  successCacheSet: () => successCacheSet
});
function successCacheGet(key) {
  const entry = store2.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store2.delete(key);
    return null;
  }
  return entry.value;
}
function successCacheSet(key, value, ttlMs = 45e3) {
  store2.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function successCacheInvalidate(prefix) {
  if (!prefix) {
    store2.clear();
    return;
  }
  for (const key of Array.from(store2.keys())) {
    if (key.startsWith(prefix)) store2.delete(key);
  }
}
var store2;
var init_cache2 = __esm({
  "server/core/success/cache.ts"() {
    "use strict";
    store2 = /* @__PURE__ */ new Map();
  }
});

// server/core/experience/cache.ts
var cache_exports3 = {};
__export(cache_exports3, {
  experienceCacheGet: () => experienceCacheGet,
  experienceCacheInvalidate: () => experienceCacheInvalidate,
  experienceCacheSet: () => experienceCacheSet,
  invalidateExperienceForUser: () => invalidateExperienceForUser
});
function experienceCacheGet(key) {
  const entry = store3.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store3.delete(key);
    return null;
  }
  return entry.value;
}
function experienceCacheSet(key, value, ttlMs = 3e4) {
  store3.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function experienceCacheInvalidate(prefix) {
  if (!prefix) {
    store3.clear();
    return;
  }
  for (const key of Array.from(store3.keys())) {
    if (key.startsWith(prefix)) store3.delete(key);
  }
}
function invalidateExperienceForUser(userId) {
  experienceCacheInvalidate(`experience:home:${userId}`);
  learnCacheInvalidate(`learn:dashboard:${userId}`);
  successCacheInvalidate(`success:dashboard:${userId}`);
}
var store3;
var init_cache3 = __esm({
  "server/core/experience/cache.ts"() {
    "use strict";
    init_cache();
    init_cache2();
    store3 = /* @__PURE__ */ new Map();
  }
});

// shared/contentfy/identity.ts
var CONTENTFY_IDENTITY;
var init_identity = __esm({
  "shared/contentfy/identity.ts"() {
    "use strict";
    CONTENTFY_IDENTITY = {
      name: "ContentFy",
      company: "BuilderTudo Technologies",
      category: "Sistema Operacional do Conhecimento Digital",
      tagline: "Tecnologia propriet\xE1ria para criar, vender e evoluir conhecimento digital.",
      paymentLabel: "Pagamento ContentFy",
      guaranteeDays: 30,
      guaranteeLabel: "Garantia ContentFy"
    };
  }
});

// shared/contentfy/domains.ts
var init_domains = __esm({
  "shared/contentfy/domains.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/payments.ts
var init_payments = __esm({
  "shared/contentfy/contracts/payments.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/protect.ts
function startOfUtcDay(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function addUtcDays(d, days) {
  const next = new Date(d.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
function getRefundEligibility(input) {
  const guaranteeDays = input.guaranteeDays == null || Number.isNaN(Number(input.guaranteeDays)) ? PROTECT_DEFAULT_DAYS : Math.max(0, Math.floor(Number(input.guaranteeDays)));
  const purchasedAt = new Date(input.purchasedAt);
  if (Number.isNaN(purchasedAt.getTime())) {
    return {
      eligible: false,
      deadline: null,
      remainingDays: 0,
      reasonCode: "INVALID_PURCHASE",
      humanMessage: "N\xE3o foi poss\xEDvel validar a data desta compra.",
      guaranteeDays
    };
  }
  const purchaseDay = startOfUtcDay(purchasedAt);
  const deadlineDate = addUtcDays(purchaseDay, guaranteeDays);
  const deadline = deadlineDate.toISOString();
  const now = input.now ?? /* @__PURE__ */ new Date();
  const today = startOfUtcDay(now);
  const remainingMs = deadlineDate.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingMs / 864e5));
  if (input.alreadyRefunded || input.orderStatus === "refunded") {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "ALREADY_REFUNDED",
      humanMessage: "Este pedido j\xE1 foi reembolsado.",
      guaranteeDays
    };
  }
  if (input.orderStatus !== "completed") {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "ORDER_NOT_COMPLETED",
      humanMessage: "A garantia ContentFy Protect vale apenas para compras confirmadas.",
      guaranteeDays
    };
  }
  if (input.productEligible === false || guaranteeDays <= 0) {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "PRODUCT_NOT_ELIGIBLE",
      humanMessage: "Este produto n\xE3o participa do ContentFy Protect.",
      guaranteeDays
    };
  }
  if (input.hasActiveRequest) {
    return {
      eligible: false,
      deadline,
      remainingDays,
      reasonCode: "ACTIVE_REQUEST_EXISTS",
      humanMessage: "J\xE1 existe uma solicita\xE7\xE3o de reembolso em andamento para este pedido.",
      guaranteeDays
    };
  }
  if (today.getTime() > deadlineDate.getTime()) {
    return {
      eligible: false,
      deadline,
      remainingDays: 0,
      reasonCode: "GUARANTEE_EXPIRED",
      humanMessage: `O prazo de ${guaranteeDays} dias do ContentFy Protect encerrou em ${deadlineDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}.`,
      guaranteeDays
    };
  }
  return {
    eligible: true,
    deadline,
    remainingDays,
    reasonCode: "ELIGIBLE",
    humanMessage: remainingDays === 0 ? "\xDAltimo dia da garantia ContentFy Protect. Voc\xEA ainda pode solicitar o reembolso hoje." : `Voc\xEA tem ${remainingDays} dia${remainingDays === 1 ? "" : "s"} restantes de garantia ContentFy Protect.`,
    guaranteeDays
  };
}
function canTransitionRefundStatus(from, to) {
  return REFUND_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
var PROTECT_DEFAULT_DAYS, PROTECT_BRAND, REFUND_REASON_LABELS, REFUND_STATUS_TRANSITIONS;
var init_protect = __esm({
  "shared/contentfy/contracts/protect.ts"() {
    "use strict";
    PROTECT_DEFAULT_DAYS = 30;
    PROTECT_BRAND = {
      name: "ContentFy Protect",
      guaranteeLabel: "Garantia de 30 dias",
      purchaseProtected: "Compra protegida pela ContentFy",
      paymentCopy: "Pagamento processado com seguran\xE7a pela infraestrutura integrada da ContentFy.",
      microcopy: "Voc\xEA poder\xE1 solicitar o reembolso dentro do prazo informado, conforme a Pol\xEDtica de Garantia ContentFy."
    };
    REFUND_REASON_LABELS = {
      content_mismatch: "Conte\xFAdo diferente do esperado",
      access_issue: "Dificuldade t\xE9cnica de acesso",
      accidental_purchase: "Compra realizada por engano",
      not_needed: "Produto n\xE3o atendeu \xE0 necessidade",
      other: "Outro"
    };
    REFUND_STATUS_TRANSITIONS = {
      requested: ["under_review", "cancelled"],
      under_review: ["approved", "rejected"],
      approved: ["processing"],
      rejected: [],
      processing: ["refunded", "failed"],
      refunded: [],
      failed: ["processing"],
      cancelled: []
    };
  }
});

// shared/contentfy/contracts/ai.ts
var init_ai = __esm({
  "shared/contentfy/contracts/ai.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/learn.ts
function levelFromProgress(progress) {
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.mastery) return "mastery";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.proficient) return "proficient";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.developing) return "developing";
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.emerging) return "emerging";
  return "none";
}
function competencyStatusFromProgress(progress) {
  if (progress >= COMPETENCY_LEVEL_THRESHOLDS.proficient) return "acquired";
  if (progress > 0) return "in_progress";
  return "missing";
}
function computeSuccessIndex(input) {
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const knowledge = clamp(input.knowledge);
  const application = clamp(input.application);
  const consistency = clamp(input.consistency);
  const result = clamp(input.result);
  const overall = clamp(
    knowledge * 0.3 + application * 0.25 + consistency * 0.25 + result * 0.2
  );
  return { knowledge, application, consistency, result, overall };
}
var COMPETENCY_LEVEL_THRESHOLDS;
var init_learn = __esm({
  "shared/contentfy/contracts/learn.ts"() {
    "use strict";
    COMPETENCY_LEVEL_THRESHOLDS = {
      emerging: 15,
      developing: 40,
      proficient: 70,
      mastery: 90
    };
  }
});

// shared/contentfy/contracts/insight.ts
var init_insight = __esm({
  "shared/contentfy/contracts/insight.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/discovery.ts
function scoreDiscoverySearch(query, doc) {
  const q = query.trim().toLowerCase();
  if (!q) return { score: 0, matchedOn: [] };
  const parts = q.split(/\s+/).filter(Boolean);
  const matchedOn = [];
  let score = 0;
  const hit = (field, weight, label) => {
    const hay = field.toLowerCase();
    let fieldHits = 0;
    for (const p of parts) {
      if (hay.includes(p)) fieldHits += 1;
    }
    if (fieldHits > 0) {
      score += weight * fieldHits;
      if (!matchedOn.includes(label)) matchedOn.push(label);
    }
  };
  hit(doc.name, 10, "title");
  if (doc.author) hit(doc.author, 6, "author");
  if (doc.category) hit(doc.category, 5, "category");
  if (doc.subcategory) hit(doc.subcategory, 4, "subcategory");
  for (const t2 of doc.tags || []) hit(t2, 3, "tags");
  for (const k of doc.keywords || []) hit(k, 2.5, "keywords");
  for (const o of doc.objectives || []) hit(o, 2, "objectives");
  return { score, matchedOn };
}
function computeTrendingScore(input) {
  return input.views * TRENDING_WEIGHTS.views + input.purchases * TRENDING_WEIGHTS.purchases + input.favorites * TRENDING_WEIGHTS.favorites + input.ratings * TRENDING_WEIGHTS.ratings + input.recentGrowth * TRENDING_WEIGHTS.recentGrowth;
}
var DISCOVERY_RAIL_DEFS, TRENDING_WEIGHTS;
var init_discovery = __esm({
  "shared/contentfy/contracts/discovery.ts"() {
    "use strict";
    DISCOVERY_RAIL_DEFS = [
      {
        id: "continue_learning",
        title: "Continue Evoluindo",
        subtitle: "Retome o fio da sua jornada",
        strategy: "continue"
      },
      {
        id: "recommended",
        title: "Escolhidos para seu Objetivo",
        subtitle: "Sele\xE7\xE3o alinhada ao que voc\xEA busca evoluir",
        strategy: "behavior"
      },
      {
        id: "favorites",
        title: "Sua Cole\xE7\xE3o",
        subtitle: "O que voc\xEA guardou para evoluir depois",
        strategy: "favorites"
      },
      {
        id: "launches",
        title: "Novidades",
        subtitle: "O que acabou de entrar no ecossistema",
        strategy: "category"
      },
      {
        id: "bestsellers",
        title: "Mais Bem Avaliados",
        subtitle: "Escolhas com tra\xE7\xE3o real na comunidade",
        strategy: "trending"
      },
      {
        id: "trending",
        title: "Em Alta",
        subtitle: "O que est\xE1 movendo a plataforma agora",
        strategy: "trending"
      },
      {
        id: "featured",
        title: "Jornadas Recomendadas",
        subtitle: "Caminhos editoriais para evoluir com m\xE9todo",
        strategy: "category"
      },
      {
        id: "start_here",
        title: "Comece por Aqui",
        subtitle: "Primeiro passo com fric\xE7\xE3o m\xEDnima",
        strategy: "category"
      },
      {
        id: "ai",
        title: "Compet\xEAncias em Destaque",
        subtitle: "IA e intelig\xEAncia aplicada ao resultado",
        strategy: "category"
      },
      {
        id: "business",
        title: "Tra\xE7\xE3o de Neg\xF3cio",
        subtitle: "Crescimento comercial com opera\xE7\xE3o clara",
        strategy: "category"
      },
      {
        id: "sales_rep",
        title: "Carreira Comercial",
        subtitle: "Ecossistema do representante de alta performance",
        strategy: "category"
      },
      {
        id: "personal_dev",
        title: "Presen\xE7a & Equil\xEDbrio",
        subtitle: "H\xE1bitos, mente e ritmo sustent\xE1vel",
        strategy: "category"
      },
      {
        id: "productivity",
        title: "Foco em Movimento",
        subtitle: "Execu\xE7\xE3o sem ru\xEDdo",
        strategy: "category"
      },
      {
        id: "buildertudo",
        title: "Ecossistemas BuilderTudo",
        subtitle: "Stacks pr\xE1ticos do universo BuilderTudo",
        strategy: "category"
      }
    ];
    TRENDING_WEIGHTS = {
      views: 1,
      purchases: 8,
      favorites: 4,
      ratings: 3,
      recentGrowth: 6
    };
  }
});

// shared/contentfy/contracts/success-score.ts
function computeSuccessScore(input) {
  const breakdown = {
    videoProgress: clamp01(input.videoProgress) * 20,
    activitiesCompleted: normalizeCount(input.activitiesCompleted, 10) * 15,
    quizzesPassed: normalizeCount(input.quizzesPassed, 8) * 20,
    applicationTasks: normalizeCount(input.applicationTasks, 6) * 15,
    consistencyDays: normalizeCount(input.consistencyDays, 30) * 15,
    completionRate: clamp01(input.completionRate) * 15
  };
  const score = Math.round(
    breakdown.videoProgress + breakdown.activitiesCompleted + breakdown.quizzesPassed + breakdown.applicationTasks + breakdown.consistencyDays + breakdown.completionRate
  );
  return {
    score: Math.min(100, score),
    grade: scoreToGrade(score),
    breakdown
  };
}
function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}
function normalizeCount(n, target) {
  return clamp01(n / target);
}
function scoreToGrade(score) {
  if (score >= 85) return "master";
  if (score >= 65) return "rise";
  if (score >= 40) return "grow";
  return "seed";
}
var init_success_score = __esm({
  "shared/contentfy/contracts/success-score.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/success.ts
function normalizeWeights(weights) {
  const sum = weights.knowledge + weights.application + weights.consistency + weights.result;
  if (sum <= 0) return { ...DEFAULT_SUCCESS_SCORE_CONFIG.weights };
  return {
    knowledge: weights.knowledge / sum,
    application: weights.application / sum,
    consistency: weights.consistency / sum,
    result: weights.result / sum
  };
}
function gradeFromScore(score, thresholds = DEFAULT_SUCCESS_SCORE_CONFIG.gradeThresholds) {
  if (score >= thresholds.master) return "master";
  if (score >= thresholds.rise) return "rise";
  if (score >= thresholds.grow) return "grow";
  return "seed";
}
function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
var DEFAULT_SUCCESS_SCORE_CONFIG;
var init_success = __esm({
  "shared/contentfy/contracts/success.ts"() {
    "use strict";
    DEFAULT_SUCCESS_SCORE_CONFIG = {
      weights: {
        knowledge: 0.3,
        application: 0.25,
        consistency: 0.25,
        result: 0.2
      },
      targets: {
        modulesCompleted: 20,
        applicationTasks: 12,
        activeDays: 20,
        streakDays: 30,
        goalsCompleted: 2,
        competenciesAcquired: 6
      },
      gradeThresholds: {
        master: 85,
        rise: 65,
        grow: 40
      },
      habitMilestones: [7, 21, 30, 60, 90],
      consistencyBands: {
        excellent: 80,
        good: 60,
        declining: 35
      }
    };
  }
});

// shared/contentfy/contracts/experience.ts
var DEFAULT_INACTIVE_RETURN_DAYS, DEFAULT_NBA_PRIORITIES;
var init_experience = __esm({
  "shared/contentfy/contracts/experience.ts"() {
    "use strict";
    DEFAULT_INACTIVE_RETURN_DAYS = 7;
    DEFAULT_NBA_PRIORITIES = {
      continue_lesson: 10,
      resume_journey: 20,
      review_stagnant_competency: 30,
      choose_goal: 40,
      start_first_product: 50,
      complete_onboarding: 55,
      related_product: 60,
      view_achievement: 70,
      explore_catalog: 80,
      support: 90,
      onboarding: 100
    };
  }
});

// shared/contentfy/contracts/intelligence.ts
var DEFAULT_INTELLIGENCE_SCORE_CONFIG;
var init_intelligence = __esm({
  "shared/contentfy/contracts/intelligence.ts"() {
    "use strict";
    DEFAULT_INTELLIGENCE_SCORE_CONFIG = {
      weights: {
        product: {
          views: 0.15,
          sales: 0.25,
          favorites: 0.1,
          completion: 0.2,
          retention: 0.15,
          refundPenalty: 0.1,
          abandonmentPenalty: 0.05
        },
        creator: {
          conversion: 0.3,
          retention: 0.25,
          satisfaction: 0.25,
          volume: 0.2
        },
        category: {
          growth: 0.4,
          sales: 0.35,
          engagement: 0.25
        },
        engagement: {
          sessionsProxy: 0.4,
          favorites: 0.3,
          progress: 0.3
        },
        trust: {
          completion: 0.4,
          lowRefund: 0.35,
          retention: 0.25
        },
        growth: {
          salesDelta: 0.6,
          viewsDelta: 0.4
        },
        momentum: {
          recentSales: 0.4,
          recentViews: 0.3,
          acceleration: 0.3
        }
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
        categoryCoolDropPercent: -15
      },
      windows: {
        recentDays: 14,
        priorDays: 14
      }
    };
  }
});

// shared/contentfy/contracts/orchestrator.ts
var DEFAULT_ORCHESTRATOR_RULES;
var init_orchestrator = __esm({
  "shared/contentfy/contracts/orchestrator.ts"() {
    "use strict";
    DEFAULT_ORCHESTRATOR_RULES = {
      defaultTimeoutMs: 2e3,
      defaultRetry: 1,
      maxQueueSize: 500,
      asyncDispatch: true,
      workflows: [
        {
          id: "wf_lesson_completed",
          event: "LESSON_COMPLETED",
          description: "Invalidate learner surfaces after lesson progress",
          enabled: true,
          priority: 10,
          steps: [
            { id: "b1", kind: "log_metric", motor: "orchestrator", phase: "before" },
            { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
            { id: "m2", kind: "learn_invalidate", motor: "learn", phase: "main" },
            { id: "m3", kind: "success_invalidate", motor: "success", phase: "main" },
            { id: "m4", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
            { id: "a1", kind: "log_metric", motor: "orchestrator", phase: "after" }
          ]
        },
        {
          id: "wf_course_completed",
          event: "COURSE_COMPLETED",
          description: "Cascade completion across learner engines",
          enabled: true,
          priority: 5,
          steps: [
            { id: "m1", kind: "success_invalidate", motor: "success", phase: "main" },
            { id: "m2", kind: "learn_invalidate", motor: "learn", phase: "main" },
            { id: "m3", kind: "experience_invalidate", motor: "experience", phase: "main" },
            { id: "m4", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "m5", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" }
          ]
        },
        {
          id: "wf_product_purchased",
          event: "PRODUCT_PURCHASED",
          description: "Purchase fan-out to experience/intelligence/discovery",
          enabled: true,
          priority: 1,
          steps: [
            { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
            { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
            { id: "m3", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "m4", kind: "learn_invalidate", motor: "learn", phase: "main" }
          ]
        },
        {
          id: "wf_product_refunded",
          event: "PRODUCT_REFUNDED",
          description: "Refund fan-out",
          enabled: true,
          priority: 2,
          steps: [
            { id: "m1", kind: "experience_invalidate", motor: "experience", phase: "main" },
            { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
            { id: "fb", kind: "log_metric", motor: "orchestrator", phase: "fallback" }
          ]
        },
        {
          id: "wf_goal_updated",
          event: "GOAL_UPDATED",
          description: "Goal change refresh",
          enabled: true,
          priority: 20,
          steps: [
            { id: "m1", kind: "learn_invalidate", motor: "learn", phase: "main" },
            { id: "m2", kind: "experience_invalidate", motor: "experience", phase: "main" },
            { id: "m3", kind: "success_invalidate", motor: "success", phase: "main" }
          ]
        },
        {
          id: "wf_recommendation_clicked",
          event: "RECOMMENDATION_CLICKED",
          description: "Soft analytics refresh",
          enabled: true,
          priority: 50,
          steps: [
            { id: "m1", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" },
            { id: "m2", kind: "log_metric", motor: "orchestrator", phase: "after" }
          ]
        },
        {
          id: "wf_discovery_clicked",
          event: "DISCOVERY_CLICKED",
          description: "Discovery engagement signal",
          enabled: true,
          priority: 55,
          steps: [
            { id: "m1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" }
          ]
        },
        {
          id: "wf_product_favorited",
          event: "PRODUCT_FAVORITED",
          description: "Favorite signal",
          enabled: true,
          priority: 40,
          steps: [
            { id: "m1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "m2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" }
          ]
        }
      ],
      reactions: [
        {
          id: "rx_high_sales_boost_discovery",
          enabled: true,
          description: "Many purchases \u2192 refresh Discovery/Intelligence ranking caches",
          onEvent: "PRODUCT_PURCHASED",
          when: { field: "meta.purchaseBurst", op: "gte", value: 5 },
          then: [
            { id: "r1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "r2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" }
          ],
          priority: 15
        },
        {
          id: "rx_refund_reduce_highlight",
          enabled: true,
          description: "Refund surge \u2192 invalidate Discovery highlight caches",
          onEvent: "PRODUCT_REFUNDED",
          when: { field: "meta.refundRateProxy", op: "gte", value: 8 },
          then: [
            { id: "r1", kind: "discovery_invalidate", motor: "discovery", phase: "main" },
            { id: "r2", kind: "intelligence_invalidate", motor: "intelligence", phase: "main" }
          ],
          priority: 12
        },
        {
          id: "rx_retention_home",
          enabled: true,
          description: "Retention growth \u2192 refresh Experience home",
          onEvent: "SUCCESS_SCORE_CHANGED",
          when: { field: "meta.retentionDelta", op: "gte", value: 10 },
          then: [
            { id: "r1", kind: "experience_invalidate", motor: "experience", phase: "main" }
          ],
          priority: 25
        }
      ]
    };
  }
});

// shared/contentfy/contracts/media.ts
var init_media = __esm({
  "shared/contentfy/contracts/media.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/community.ts
var init_community = __esm({
  "shared/contentfy/contracts/community.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/notifications.ts
var init_notifications = __esm({
  "shared/contentfy/contracts/notifications.ts"() {
    "use strict";
  }
});

// shared/contentfy/contracts/products.ts
var DEFAULT_PRODUCT_SURFACES;
var init_products = __esm({
  "shared/contentfy/contracts/products.ts"() {
    "use strict";
    DEFAULT_PRODUCT_SURFACES = [
      "landing",
      "library",
      "downloads",
      "certificates",
      "resources"
    ];
  }
});

// shared/contentfy/contentfy-dna.ts
function buildDna(seed) {
  const competencies = seed.competencyIds.map(
    (id) => {
      const meta = COMPETENCY_NAMES[id] || {
        name: id,
        category: "Geral"
      };
      return {
        id,
        name: meta.name,
        category: meta.category,
        phase: "acquired",
        weight: seed.weights?.[id]
      };
    }
  );
  for (const id of seed.futureCompetencyIds || []) {
    if (competencies.some((c) => c.id === id)) continue;
    const meta = COMPETENCY_NAMES[id] || { name: id, category: "Geral" };
    competencies.push({
      id,
      name: meta.name,
      category: meta.category,
      phase: "future"
    });
  }
  const cats = new Set(competencies.map((c) => c.category));
  for (const [id, meta] of Object.entries(COMPETENCY_NAMES)) {
    if (competencies.some((c) => c.id === id)) continue;
    if (!cats.has(meta.category)) continue;
    competencies.push({
      id,
      name: meta.name,
      category: meta.category,
      phase: "related"
    });
  }
  return {
    productSlug: seed.productSlug,
    transformation: seed.transformation,
    objectives: seed.goalIds.map((id) => {
      const g = GOAL_META[id] || {
        name: id,
        description: ""
      };
      return { id, name: g.name, description: g.description };
    }),
    competencies,
    expectedOutcomes: seed.expectedOutcomes,
    journeys: seed.journeys,
    relatedProductSlugs: seed.relatedProductSlugs,
    estimatedHours: seed.estimatedHours,
    levelLabel: seed.levelLabel,
    ecosystem: seed.ecosystem
  };
}
var COMPETENCY_NAMES, GOAL_META, DNA_SEEDS, DNA_BY_SLUG;
var init_contentfy_dna = __esm({
  "shared/contentfy/contentfy-dna.ts"() {
    "use strict";
    COMPETENCY_NAMES = {
      crm: { name: "CRM", category: "Vendas" },
      "spin-selling": { name: "SPIN Selling", category: "Vendas" },
      negotiation: { name: "Negocia\xE7\xE3o", category: "Vendas" },
      prospecting: { name: "Prospec\xE7\xE3o", category: "Vendas" },
      "follow-up": { name: "Follow-up", category: "Vendas" },
      "commercial-ai": { name: "IA Comercial", category: "IA" },
      "portfolio-mgmt": { name: "Gest\xE3o da Carteira", category: "Vendas" },
      "emotional-balance": {
        name: "Equil\xEDbrio emocional",
        category: "Bem-estar"
      },
      anxiety: { name: "Ansiedade", category: "Bem-estar" },
      focus: { name: "Foco", category: "Produtividade" },
      habits: { name: "H\xE1bitos", category: "Produtividade" },
      wellbeing: { name: "Bem-estar", category: "Bem-estar" },
      routine: { name: "Rotina", category: "Produtividade" },
      "self-knowledge": {
        name: "Autoconhecimento",
        category: "Desenvolvimento"
      }
    };
    GOAL_META = {
      "earn-more": {
        name: "Ganhar mais dinheiro",
        description: "Aumentar renda com m\xE9todo comercial e execu\xE7\xE3o."
      },
      productivity: {
        name: "Melhorar produtividade",
        description: "Fazer mais com foco, h\xE1bitos e rotina."
      },
      "reduce-anxiety": {
        name: "Reduzir ansiedade",
        description: "Recuperar equil\xEDbrio e presen\xE7a."
      },
      "learn-ai": {
        name: "Aprender IA",
        description: "Usar intelig\xEAncia artificial com prop\xF3sito comercial."
      },
      "build-business": {
        name: "Criar neg\xF3cio",
        description: "Estruturar oferta, opera\xE7\xE3o e crescimento."
      },
      "organize-routine": {
        name: "Organizar rotina",
        description: "Dar ritmo sustent\xE1vel ao dia a dia."
      },
      "sell-more": {
        name: "Vender mais",
        description: "Acelerar pipeline e convers\xE3o."
      },
      lead: {
        name: "Ser l\xEDder",
        description: "Influenciar com clareza, m\xE9todo e presen\xE7a."
      },
      entrepreneur: {
        name: "Empreender",
        description: "Construir autonomia e tra\xE7\xE3o."
      },
      "career-change": {
        name: "Mudar de carreira",
        description: "Transicionar com compet\xEAncias transfer\xEDveis."
      }
    };
    DNA_SEEDS = [
      {
        productSlug: "manual-do-representante-comercial",
        transformation: "De representante improvisado a profissional com m\xE9todo, pipeline e presen\xE7a comercial.",
        competencyIds: [
          "crm",
          "spin-selling",
          "negotiation",
          "prospecting",
          "follow-up",
          "commercial-ai",
          "portfolio-mgmt"
        ],
        weights: {
          crm: 0.9,
          "spin-selling": 0.85,
          negotiation: 0.8,
          prospecting: 0.85,
          "follow-up": 0.75,
          "commercial-ai": 0.9,
          "portfolio-mgmt": 0.85
        },
        goalIds: ["earn-more", "sell-more", "learn-ai", "build-business", "entrepreneur"],
        expectedOutcomes: [
          "Organizar carteira com disciplina de CRM",
          "Conduzir conversas com m\xE9todo de descoberta",
          "Aplicar IA no ciclo comercial sem perder o humano"
        ],
        journeys: [
          "Fundamentos comerciais",
          "Pipeline & follow-up",
          "IA na opera\xE7\xE3o de vendas"
        ],
        relatedProductSlugs: ["desacelere"],
        futureCompetencyIds: ["focus", "habits"],
        estimatedHours: 18,
        levelLabel: "Intermedi\xE1rio",
        ecosystem: "BuilderTudo \xB7 Carreira Comercial"
      },
      {
        productSlug: "desacelere",
        transformation: "De mente acelerada a presen\xE7a sustent\xE1vel \u2014 rotina, foco e equil\xEDbrio sem performance t\xF3xica.",
        competencyIds: [
          "emotional-balance",
          "anxiety",
          "focus",
          "habits",
          "wellbeing",
          "routine",
          "self-knowledge"
        ],
        weights: {
          "emotional-balance": 0.9,
          anxiety: 0.85,
          focus: 0.7,
          habits: 0.8,
          wellbeing: 0.9,
          routine: 0.85,
          "self-knowledge": 0.8
        },
        goalIds: [
          "reduce-anxiety",
          "productivity",
          "organize-routine",
          "career-change"
        ],
        expectedOutcomes: [
          "Reduzir ru\xEDdo mental no dia a dia",
          "Construir rotinas que cabem na vida real",
          "Recuperar foco sem culpar o descanso"
        ],
        journeys: [
          "Presen\xE7a imediata",
          "H\xE1bitos sustent\xE1veis",
          "Rotina com inten\xE7\xE3o"
        ],
        relatedProductSlugs: ["manual-do-representante-comercial"],
        futureCompetencyIds: ["negotiation", "commercial-ai"],
        estimatedHours: 6,
        levelLabel: "Iniciante",
        ecosystem: "BuilderTudo \xB7 Bem-estar Aplicado"
      }
    ];
    DNA_BY_SLUG = Object.fromEntries(
      DNA_SEEDS.map((s) => [s.productSlug, buildDna(s)])
    );
  }
});

// shared/contentfy/index.ts
var init_contentfy = __esm({
  "shared/contentfy/index.ts"() {
    "use strict";
    init_identity();
    init_domains();
    init_payments();
    init_protect();
    init_ai();
    init_learn();
    init_insight();
    init_discovery();
    init_success_score();
    init_success();
    init_experience();
    init_intelligence();
    init_orchestrator();
    init_media();
    init_community();
    init_notifications();
    init_products();
    init_contentfy_dna();
  }
});

// server/core/experience/config.ts
function resolveNbaPriorities(override) {
  let fromEnv = {};
  const raw = process.env.EXPERIENCE_NBA_PRIORITIES_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw);
    } catch {
      console.warn(
        "[ContentFy Experience] EXPERIENCE_NBA_PRIORITIES_JSON inv\xE1lido \u2014 defaults."
      );
    }
  }
  return { ...DEFAULT_NBA_PRIORITIES, ...fromEnv, ...override };
}
function resolveInactiveReturnDays() {
  const raw = process.env.EXPERIENCE_INACTIVE_RETURN_DAYS;
  if (!raw) return DEFAULT_INACTIVE_RETURN_DAYS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1 || n > 365) {
    console.warn(
      "[ContentFy Experience] EXPERIENCE_INACTIVE_RETURN_DAYS inv\xE1lido \u2014 default",
      DEFAULT_INACTIVE_RETURN_DAYS
    );
    return DEFAULT_INACTIVE_RETURN_DAYS;
  }
  return Math.floor(n);
}
function isDevMemoryFallbackAllowed() {
  return process.env.NODE_ENV !== "production";
}
var init_config = __esm({
  "server/core/experience/config.ts"() {
    "use strict";
    init_contentfy();
  }
});

// server/core/experience/sanitize.ts
function sanitizeExperienceMeta(meta, maxKeys = 12) {
  if (!meta) return {};
  const out = {};
  let count = 0;
  for (const [k, v] of Object.entries(meta)) {
    if (count >= maxKeys) break;
    if (BLOCKED.test(k)) continue;
    if (v == null) {
      out[k] = null;
      count += 1;
      continue;
    }
    if (typeof v === "boolean" || typeof v === "number") {
      if (typeof v === "number" && !Number.isFinite(v)) continue;
      out[k] = v;
      count += 1;
      continue;
    }
    if (typeof v === "string") {
      if (BLOCKED.test(v)) continue;
      out[k] = v.slice(0, 200);
      count += 1;
    }
  }
  return out;
}
function dayKey(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().slice(0, 10);
}
function daysBetween(fromDay, toDay) {
  const a = Date.parse(`${fromDay}T00:00:00.000Z`);
  const b = Date.parse(`${toDay}T00:00:00.000Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, Math.round((b - a) / 864e5));
}
var BLOCKED;
var init_sanitize = __esm({
  "server/core/experience/sanitize.ts"() {
    "use strict";
    BLOCKED = /secret|token|password|authorization|api[_-]?key|sk_live|sk_test|cookie|session/i;
  }
});

// server/experience-store.ts
var experience_store_exports = {};
__export(experience_store_exports, {
  __resetExperienceMemoryForTests: () => __resetExperienceMemoryForTests,
  buildSummaryFromDays: () => buildSummaryFromDays,
  dismissRecommendation: () => dismissRecommendation,
  getActivitySummary: () => getActivitySummary,
  getOnboarding: () => getOnboarding,
  isRecommendationDismissed: () => isRecommendationDismissed,
  listDismissedRecommendationIds: () => listDismissedRecommendationIds,
  recentTelemetry: () => recentTelemetry,
  recordActivityEvent: () => recordActivityEvent,
  saveOnboarding: () => saveOnboarding,
  trackTelemetry: () => trackTelemetry
});
import { and as and2, desc as desc2, eq as eq2, gte as gte2, sql as sql2 } from "drizzle-orm";
function warnMemory(reason) {
  if (warnedMemory) return;
  warnedMemory = true;
  const env = process.env.NODE_ENV || "development";
  console.warn(
    `[ContentFy Experience] Fallback em mem\xF3ria (${env}): ${reason}. Migration 0014 necess\xE1ria para persist\xEAncia. N\xE3o usar como fonte de verdade em produ\xE7\xE3o.`
  );
}
function allowMemory() {
  if (!isDevMemoryFallbackAllowed()) return false;
  return true;
}
function toState(row, persisted) {
  let preferences = null;
  if (row.preferencesJson) {
    try {
      preferences = JSON.parse(row.preferencesJson);
    } catch {
      preferences = null;
    }
  }
  const weekly = row.weeklyHours != null && row.weeklyHours !== "" ? Number(row.weeklyHours) : null;
  return {
    completed: Boolean(row.completedAt),
    primaryGoalId: row.primaryGoalId,
    improveFirst: row.improveFirst,
    weeklyHours: Number.isFinite(weekly) ? weekly : null,
    preferences,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
    persisted
  };
}
async function getOnboarding(userId) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select().from(experienceOnboarding).where(eq2(experienceOnboarding.userId, userId)).limit(1);
    if (!rows[0]) return null;
    return toState(rows[0], "db");
  } catch {
    if (!allowMemory()) {
      console.error(
        "[ContentFy Experience] Onboarding DB indispon\xEDvel em produ\xE7\xE3o \u2014 retornando null."
      );
      return null;
    }
    warnMemory("onboarding get");
    return memoryOnboarding.get(userId) ?? null;
  }
}
async function saveOnboarding(userId, input) {
  experienceCacheInvalidate(`experience:home:${userId}`);
  const prefs = input.preferences ? sanitizeExperienceMeta(input.preferences) : null;
  const now = /* @__PURE__ */ new Date();
  const improveFirst = input.improveFirst?.trim().slice(0, 200) || null;
  const primaryGoalId = input.primaryGoalId?.slice(0, 64) || null;
  const weeklyHours = input.weeklyHours != null ? Math.min(40, Math.max(0.5, Number(input.weeklyHours))) : null;
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const existing = await db.select().from(experienceOnboarding).where(eq2(experienceOnboarding.userId, userId)).limit(1);
    const completedAt = existing[0]?.completedAt ?? now;
    const values = {
      userId,
      primaryGoalId,
      improveFirst,
      weeklyHours: weeklyHours != null ? String(weeklyHours) : null,
      preferencesJson: prefs ? JSON.stringify(prefs) : null,
      completedAt,
      updatedAt: now
    };
    if (existing[0]) {
      await db.update(experienceOnboarding).set({
        primaryGoalId: values.primaryGoalId,
        improveFirst: values.improveFirst,
        weeklyHours: values.weeklyHours,
        preferencesJson: values.preferencesJson,
        completedAt: values.completedAt,
        updatedAt: now
      }).where(eq2(experienceOnboarding.userId, userId));
    } else {
      await db.insert(experienceOnboarding).values(values);
    }
    return {
      completed: true,
      primaryGoalId,
      improveFirst,
      weeklyHours,
      preferences: prefs,
      completedAt: completedAt.toISOString(),
      updatedAt: now.toISOString(),
      persisted: "db"
    };
  } catch {
    if (!allowMemory()) {
      throw new Error("Experience onboarding persistence unavailable");
    }
    warnMemory("onboarding save");
    const state = {
      completed: true,
      primaryGoalId,
      improveFirst,
      weeklyHours,
      preferences: prefs,
      completedAt: memoryOnboarding.get(userId)?.completedAt || now.toISOString(),
      updatedAt: now.toISOString(),
      persisted: "memory"
    };
    memoryOnboarding.set(userId, state);
    return state;
  }
}
async function dismissRecommendation(userId, recommendationId) {
  const id = recommendationId.slice(0, 128);
  experienceCacheInvalidate(`experience:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(experienceDismissedRecommendations).values({ userId, recommendationId: id }).onDuplicateKeyUpdate({ set: { recommendationId: id } });
  } catch {
    if (!allowMemory()) return;
    warnMemory("dismiss");
    const set = memoryDismissed.get(userId) || /* @__PURE__ */ new Set();
    set.add(id);
    memoryDismissed.set(userId, set);
  }
}
async function isRecommendationDismissed(userId, recommendationId) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select().from(experienceDismissedRecommendations).where(
      and2(
        eq2(experienceDismissedRecommendations.userId, userId),
        eq2(
          experienceDismissedRecommendations.recommendationId,
          recommendationId
        )
      )
    ).limit(1);
    return rows.length > 0;
  } catch {
    if (!allowMemory()) return false;
    return memoryDismissed.get(userId)?.has(recommendationId) ?? false;
  }
}
async function listDismissedRecommendationIds(userId) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select({
      id: experienceDismissedRecommendations.recommendationId
    }).from(experienceDismissedRecommendations).where(eq2(experienceDismissedRecommendations.userId, userId));
    return rows.map((r) => r.id);
  } catch {
    if (!allowMemory()) return [];
    return Array.from(memoryDismissed.get(userId) || []);
  }
}
async function recordActivityEvent(input) {
  const meta = sanitizeExperienceMeta(input.meta);
  const day = dayKey();
  const now = /* @__PURE__ */ new Date();
  if (input.eventType === "lesson_completed" || input.eventType === "goal_updated" || input.eventType === "lesson_started") {
    experienceCacheInvalidate(`experience:home:${input.userId}`);
  }
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(experienceActivityEvents).values({
      userId: input.userId,
      eventType: input.eventType,
      productId: input.productId ?? null,
      productSlug: input.productSlug?.slice(0, 255) ?? null,
      lessonId: input.lessonId ?? null,
      metaJson: Object.keys(meta).length ? JSON.stringify(meta) : null,
      createdAt: now
    });
    const existing = await db.select().from(experienceActivityDaily).where(
      and2(
        eq2(experienceActivityDaily.userId, input.userId),
        eq2(experienceActivityDaily.day, day)
      )
    ).limit(1);
    if (existing[0]) {
      await db.update(experienceActivityDaily).set({
        eventCount: existing[0].eventCount + 1,
        lastEventType: input.eventType,
        updatedAt: now
      }).where(eq2(experienceActivityDaily.id, existing[0].id));
    } else {
      await db.insert(experienceActivityDaily).values({
        userId: input.userId,
        day,
        eventCount: 1,
        lastEventType: input.eventType,
        createdAt: now,
        updatedAt: now
      });
    }
    return { persisted: "db" };
  } catch {
    if (!allowMemory()) {
      console.error(
        "[ContentFy Experience] activity persist failed (production)"
      );
      return { persisted: "memory" };
    }
    warnMemory("activity");
    const days = memoryActivityDays.get(input.userId) || /* @__PURE__ */ new Map();
    days.set(day, (days.get(day) || 0) + 1);
    memoryActivityDays.set(input.userId, days);
    memoryActivityLast.set(input.userId, {
      at: now.toISOString(),
      type: input.eventType
    });
    return { persisted: "memory" };
  }
}
async function getActivitySummary(userId, opts) {
  const now = opts?.now || /* @__PURE__ */ new Date();
  const today = dayKey(now);
  const window = opts?.recentWindowDays ?? 30;
  const windowStart = new Date(now.getTime() - window * 864e5);
  const windowStartKey = dayKey(windowStart);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const days = await db.select().from(experienceActivityDaily).where(
      and2(
        eq2(experienceActivityDaily.userId, userId),
        gte2(experienceActivityDaily.day, windowStartKey)
      )
    ).orderBy(desc2(experienceActivityDaily.day));
    const last = await db.select().from(experienceActivityEvents).where(eq2(experienceActivityEvents.userId, userId)).orderBy(desc2(experienceActivityEvents.createdAt)).limit(1);
    return buildSummaryFromDays(
      days.map((d) => d.day),
      last[0]?.createdAt?.toISOString() ?? null,
      today
    );
  } catch {
    if (!allowMemory()) {
      return emptySummary();
    }
    const map = memoryActivityDays.get(userId);
    const days = map ? Array.from(map.keys()).filter((d) => d >= windowStartKey).sort().reverse() : [];
    const lastAt = memoryActivityLast.get(userId)?.at ?? null;
    return buildSummaryFromDays(days, lastAt, today);
  }
}
function emptySummary() {
  return {
    lastActiveDay: null,
    lastActiveAt: null,
    recentActiveDays: 0,
    streakDays: 0,
    inactiveDays: null,
    hasPriorActivity: false,
    isReturning: false
  };
}
function buildSummaryFromDays(activeDaysDesc, lastActiveAt, today) {
  const unique = Array.from(new Set(activeDaysDesc)).sort().reverse();
  if (!unique.length) return emptySummary();
  const lastActiveDay = unique[0];
  const inactiveDays = daysBetween(lastActiveDay, today);
  let streak = 0;
  let cursor = today;
  const set = new Set(unique);
  if (!set.has(today)) {
    const yesterday = dayKey(new Date(Date.parse(`${today}T00:00:00.000Z`) - 864e5));
    if (set.has(yesterday)) cursor = yesterday;
    else {
      return {
        lastActiveDay,
        lastActiveAt,
        recentActiveDays: unique.length,
        streakDays: 0,
        inactiveDays,
        hasPriorActivity: true,
        isReturning: inactiveDays >= 1
      };
    }
  }
  while (set.has(cursor)) {
    streak += 1;
    cursor = dayKey(new Date(Date.parse(`${cursor}T00:00:00.000Z`) - 864e5));
  }
  return {
    lastActiveDay,
    lastActiveAt,
    recentActiveDays: unique.length,
    streakDays: streak,
    inactiveDays,
    hasPriorActivity: true,
    isReturning: inactiveDays >= 1
  };
}
async function trackTelemetry(userId, event, meta) {
  const clean = sanitizeExperienceMeta(meta);
  const at = /* @__PURE__ */ new Date();
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(experienceTelemetryEvents).values({
      userId,
      eventName: event.slice(0, 64),
      metaJson: Object.keys(clean).length ? JSON.stringify(clean) : null,
      createdAt: at
    });
    return { persisted: "db" };
  } catch {
    if (!allowMemory()) {
      console.error("[ContentFy Experience] telemetry persist failed");
      return { persisted: "memory" };
    }
    warnMemory("telemetry");
    memoryTelemetry.push({
      userId,
      event,
      meta: clean,
      at: at.toISOString()
    });
    if (memoryTelemetry.length > 500) memoryTelemetry.splice(0, 100);
    return { persisted: "memory" };
  }
}
async function recentTelemetry(userId, limit = 50) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    return db.select().from(experienceTelemetryEvents).where(eq2(experienceTelemetryEvents.userId, userId)).orderBy(desc2(experienceTelemetryEvents.createdAt)).limit(limit);
  } catch {
    return memoryTelemetry.filter((e) => e.userId === userId).slice(-limit).reverse();
  }
}
function __resetExperienceMemoryForTests() {
  memoryOnboarding.clear();
  memoryDismissed.clear();
  memoryActivityDays.clear();
  memoryActivityLast.clear();
  memoryTelemetry.length = 0;
  warnedMemory = false;
}
var memoryOnboarding, memoryDismissed, memoryActivityDays, memoryActivityLast, memoryTelemetry, warnedMemory;
var init_experience_store = __esm({
  "server/experience-store.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_config();
    init_sanitize();
    init_cache3();
    memoryOnboarding = /* @__PURE__ */ new Map();
    memoryDismissed = /* @__PURE__ */ new Map();
    memoryActivityDays = /* @__PURE__ */ new Map();
    memoryActivityLast = /* @__PURE__ */ new Map();
    memoryTelemetry = [];
    warnedMemory = false;
  }
});

// server/core/orchestrator/event-registry.ts
var DEFS, EventRegistry, eventRegistry;
var init_event_registry = __esm({
  "server/core/orchestrator/event-registry.ts"() {
    "use strict";
    DEFS = [
      {
        name: "PRODUCT_PURCHASED",
        description: "Compra confirmada",
        origin: "commerce",
        consumers: ["experience", "intelligence", "discovery", "learn"],
        defaultPriority: 1,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "productId", "productSlug", "orderId"]
      },
      {
        name: "COURSE_STARTED",
        description: "Aluno iniciou curso",
        origin: "edge",
        consumers: ["learn", "experience", "success"],
        defaultPriority: 30,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "productId", "productSlug"]
      },
      {
        name: "COURSE_COMPLETED",
        description: "Curso conclu\xEDdo",
        origin: "edge",
        consumers: ["success", "learn", "experience", "discovery", "intelligence"],
        defaultPriority: 5,
        defaultRetry: 1,
        defaultTimeoutMs: 2500,
        payloadKeys: ["userId", "productId", "productSlug"]
      },
      {
        name: "LESSON_COMPLETED",
        description: "Aula conclu\xEDda",
        origin: "edge",
        consumers: ["experience", "learn", "success", "intelligence"],
        defaultPriority: 10,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "lessonId", "productId", "productSlug"]
      },
      {
        name: "PRODUCT_REFUNDED",
        description: "Reembolso conclu\xEDdo",
        origin: "protect",
        consumers: ["experience", "intelligence", "discovery"],
        defaultPriority: 2,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "orderId", "productId"]
      },
      {
        name: "REFUND_APPROVED",
        description: "Reembolso aprovado (pr\xE9-processamento)",
        origin: "protect",
        consumers: ["intelligence", "experience"],
        defaultPriority: 8,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "orderId"]
      },
      {
        name: "DISCOVERY_CLICKED",
        description: "Clique Discovery",
        origin: "discovery",
        consumers: ["discovery", "intelligence"],
        defaultPriority: 55,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["userId", "productSlug"]
      },
      {
        name: "GOAL_UPDATED",
        description: "Objetivo Learn atualizado",
        origin: "learn",
        consumers: ["learn", "experience", "success"],
        defaultPriority: 20,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["userId", "goalId"]
      },
      {
        name: "ACHIEVEMENT_UNLOCKED",
        description: "Conquista desbloqueada",
        origin: "learn",
        consumers: ["experience", "success"],
        defaultPriority: 25,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["userId"]
      },
      {
        name: "PRODUCT_FAVORITED",
        description: "Produto favoritado",
        origin: "discovery",
        consumers: ["discovery", "intelligence"],
        defaultPriority: 40,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["userId", "productSlug"]
      },
      {
        name: "RECOMMENDATION_CLICKED",
        description: "Recomenda\xE7\xE3o clicada",
        origin: "experience",
        consumers: ["intelligence", "orchestrator"],
        defaultPriority: 50,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["userId", "productSlug"]
      },
      {
        name: "CREATOR_PRODUCT_CREATED",
        description: "Produto criado na \xE1rea creator",
        origin: "edge",
        consumers: ["intelligence", "discovery"],
        defaultPriority: 35,
        defaultRetry: 0,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["productId", "productSlug"]
      },
      {
        name: "PRODUCT_PUBLISHED",
        description: "Produto publicado",
        origin: "edge",
        consumers: ["discovery", "intelligence"],
        defaultPriority: 15,
        defaultRetry: 1,
        defaultTimeoutMs: 2e3,
        payloadKeys: ["productId", "productSlug"]
      },
      {
        name: "CATEGORY_GROWING",
        description: "Sinal Intelligence de categoria aquecendo",
        origin: "intelligence",
        consumers: ["discovery", "experience"],
        defaultPriority: 45,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["category"]
      },
      {
        name: "PRODUCT_TRENDING",
        description: "Produto em tend\xEAncia",
        origin: "intelligence",
        consumers: ["discovery", "experience"],
        defaultPriority: 45,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["productSlug"]
      },
      {
        name: "SUCCESS_SCORE_CHANGED",
        description: "Success score materialmente alterado",
        origin: "success",
        consumers: ["experience"],
        defaultPriority: 28,
        defaultRetry: 0,
        defaultTimeoutMs: 1500,
        payloadKeys: ["userId"]
      }
    ];
    EventRegistry = class {
      byName = new Map(
        DEFS.map((d) => [d.name, d])
      );
      list() {
        return Array.from(this.byName.values());
      }
      get(name) {
        return this.byName.get(name) || null;
      }
      has(name) {
        return this.byName.has(name);
      }
    };
    eventRegistry = new EventRegistry();
  }
});

// server/core/orchestrator/config.ts
function mergeWorkflows(base, patch) {
  if (!patch?.length) return base.map((w) => ({ ...w, steps: [...w.steps] }));
  const byId = new Map(base.map((w) => [w.id, { ...w, steps: [...w.steps] }]));
  for (const w of patch) {
    byId.set(w.id, { ...w, steps: [...w.steps] });
  }
  return Array.from(byId.values());
}
function mergeReactions(base, patch) {
  if (!patch?.length) return base.map((r) => ({ ...r, then: [...r.then] }));
  const byId = new Map(base.map((r) => [r.id, { ...r, then: [...r.then] }]));
  for (const r of patch) {
    byId.set(r.id, { ...r, then: [...r.then] });
  }
  return Array.from(byId.values());
}
function resolveOrchestratorRules(override) {
  let fromEnv = {};
  const raw = process.env.ORCHESTRATOR_RULES_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw);
    } catch {
      console.warn(
        "[ContentFy Orchestrator] ORCHESTRATOR_RULES_JSON inv\xE1lido \u2014 defaults."
      );
    }
  }
  const merged = {
    ...DEFAULT_ORCHESTRATOR_RULES,
    ...fromEnv,
    ...override,
    workflows: mergeWorkflows(
      override?.workflows || fromEnv.workflows || DEFAULT_ORCHESTRATOR_RULES.workflows,
      void 0
    ),
    reactions: mergeReactions(
      override?.reactions || fromEnv.reactions || DEFAULT_ORCHESTRATOR_RULES.reactions,
      void 0
    ),
    eventPriorityOverrides: {
      ...DEFAULT_ORCHESTRATOR_RULES.eventPriorityOverrides,
      ...fromEnv.eventPriorityOverrides,
      ...override?.eventPriorityOverrides
    }
  };
  if (fromEnv.workflows?.length) merged.workflows = fromEnv.workflows;
  if (fromEnv.reactions?.length) merged.reactions = fromEnv.reactions;
  if (override?.workflows?.length) merged.workflows = override.workflows;
  if (override?.reactions?.length) merged.reactions = override.reactions;
  return merged;
}
function sanitizeOrchestratorMeta(meta) {
  if (!meta) return {};
  const blocked = /secret|token|password|authorization|api[_-]?key|cookie|session/i;
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(meta)) {
    if (n >= 12) break;
    if (blocked.test(k)) continue;
    if (v == null) {
      out[k] = null;
      n += 1;
      continue;
    }
    if (typeof v === "boolean" || typeof v === "number") {
      out[k] = typeof v === "number" && !Number.isFinite(v) ? null : v;
      n += 1;
      continue;
    }
    if (typeof v === "string") {
      if (blocked.test(v)) continue;
      out[k] = v.slice(0, 120);
      n += 1;
    }
  }
  return out;
}
var init_config2 = __esm({
  "server/core/orchestrator/config.ts"() {
    "use strict";
    init_contentfy();
  }
});

// server/core/orchestrator/event-bus.ts
function nextId(prefix) {
  seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${seq.toString(36)}`;
}
var seq, EventBus, eventBus;
var init_event_bus = __esm({
  "server/core/orchestrator/event-bus.ts"() {
    "use strict";
    init_event_registry();
    init_config2();
    seq = 0;
    EventBus = class {
      listeners = /* @__PURE__ */ new Map();
      queue = [];
      recent = [];
      maxRecent = 100;
      on(name, listener) {
        const set = this.listeners.get(name) || /* @__PURE__ */ new Set();
        set.add(listener);
        this.listeners.set(name, set);
        return () => set.delete(listener);
      }
      create(input) {
        const rules = resolveOrchestratorRules();
        const def = eventRegistry.get(input.name);
        const priority = input.priority ?? rules.eventPriorityOverrides?.[input.name] ?? def?.defaultPriority ?? 100;
        const envelope = {
          id: nextId("evt"),
          name: input.name,
          payload: {
            ...input.payload,
            meta: sanitizeOrchestratorMeta(input.payload.meta || null)
          },
          source: input.source || "system",
          priority,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          correlationId: input.correlationId
        };
        this.recent.push(envelope);
        if (this.recent.length > this.maxRecent) {
          this.recent.splice(0, this.recent.length - this.maxRecent);
        }
        return envelope;
      }
      enqueue(envelope) {
        const rules = resolveOrchestratorRules();
        if (this.queue.length >= rules.maxQueueSize) {
          this.queue.shift();
        }
        this.queue.push(envelope);
        this.queue.sort((a, b) => a.priority - b.priority);
      }
      /** @deprecated use create + enqueue */
      publish(input) {
        const envelope = this.create(input);
        this.enqueue(envelope);
        return envelope;
      }
      dequeue(limit = 1) {
        return this.queue.splice(0, Math.max(0, limit));
      }
      depth() {
        return this.queue.length;
      }
      recentEvents(limit = 50) {
        return this.recent.slice(-limit).reverse();
      }
      async notify(event) {
        const specific = this.listeners.get(event.name);
        const all = this.listeners.get("*");
        const handlers = [
          ...specific ? Array.from(specific) : [],
          ...all ? Array.from(all) : []
        ];
        await Promise.allSettled(handlers.map((h) => Promise.resolve(h(event))));
      }
      clear() {
        this.queue = [];
        this.recent = [];
      }
    };
    eventBus = new EventBus();
  }
});

// server/core/orchestrator/action-pipeline.ts
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t2 = setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t2);
        resolve(v);
      },
      (e) => {
        clearTimeout(t2);
        reject(e);
      }
    );
  });
}
var ActionPipeline;
var init_action_pipeline = __esm({
  "server/core/orchestrator/action-pipeline.ts"() {
    "use strict";
    init_config2();
    ActionPipeline = class {
      constructor(handlers) {
        this.handlers = handlers;
      }
      register(kind, handler) {
        this.handlers.set(kind, handler);
      }
      async runStep(event, step) {
        const rules = resolveOrchestratorRules();
        const timeoutMs = step.timeoutMs ?? rules.defaultTimeoutMs;
        const maxAttempts = (step.retry ?? rules.defaultRetry) + 1;
        const startedAt = (/* @__PURE__ */ new Date()).toISOString();
        const t0 = Date.now();
        let attempts = 0;
        let lastError;
        let status = "pending";
        const handler = this.handlers.get(step.kind);
        if (!handler) {
          return {
            stepId: step.id,
            kind: step.kind,
            motor: step.motor,
            phase: step.phase,
            status: "skipped",
            attempts: 0,
            latencyMs: 0,
            error: `handler missing: ${step.kind}`,
            startedAt,
            finishedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        while (attempts < maxAttempts) {
          attempts += 1;
          status = "running";
          try {
            await withTimeout(
              Promise.resolve(handler({ event, step })),
              timeoutMs
            );
            status = "success";
            lastError = void 0;
            break;
          } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
            status = lastError.includes("timeout") ? "timeout" : "failed";
          }
        }
        return {
          stepId: step.id,
          kind: step.kind,
          motor: step.motor,
          phase: step.phase,
          status,
          attempts,
          latencyMs: Date.now() - t0,
          error: lastError,
          startedAt,
          finishedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      async runSequence(event, steps) {
        const ordered = [...steps].sort(
          (a, b) => (a.priority ?? 100) - (b.priority ?? 100)
        );
        const phaseOrder = ["before", "main", "after", "onSuccess", "onFailure", "fallback"];
        const logs = [];
        const byPhase = (phase) => ordered.filter((s) => s.phase === phase);
        for (const phase of ["before", "main"]) {
          const batch = byPhase(phase);
          if (!batch.length) continue;
          const settled2 = await Promise.all(
            batch.map((step) => this.runStep(event, step))
          );
          logs.push(...settled2);
        }
        const mainFailed = logs.some(
          (l) => l.phase === "main" && (l.status === "failed" || l.status === "timeout")
        );
        const mainOk = logs.some((l) => l.phase === "main" && l.status === "success") || !byPhase("main").length;
        for (const step of byPhase("after")) {
          logs.push(await this.runStep(event, step));
        }
        if (mainOk && !mainFailed) {
          for (const step of byPhase("onSuccess")) {
            logs.push(await this.runStep(event, step));
          }
        }
        if (mainFailed) {
          for (const step of byPhase("onFailure")) {
            logs.push(await this.runStep(event, step));
          }
          for (const step of byPhase("fallback")) {
            const log = await this.runStep(event, step);
            logs.push({ ...log, status: log.status === "success" ? "fallback" : log.status });
          }
        }
        return logs;
      }
    };
  }
});

// server/core/intelligence/cache.ts
var cache_exports4 = {};
__export(cache_exports4, {
  intelligenceCacheGet: () => intelligenceCacheGet,
  intelligenceCacheInvalidate: () => intelligenceCacheInvalidate,
  intelligenceCacheSet: () => intelligenceCacheSet
});
function intelligenceCacheGet(key) {
  const entry = store4.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store4.delete(key);
    return null;
  }
  return entry.value;
}
function intelligenceCacheSet(key, value, ttlMs = 6e4) {
  store4.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function intelligenceCacheInvalidate(prefix) {
  if (!prefix) {
    store4.clear();
    return;
  }
  for (const key of Array.from(store4.keys())) {
    if (key.startsWith(prefix)) store4.delete(key);
  }
}
var store4;
var init_cache4 = __esm({
  "server/core/intelligence/cache.ts"() {
    "use strict";
    store4 = /* @__PURE__ */ new Map();
  }
});

// server/core/discovery/cache.ts
var cache_exports5 = {};
__export(cache_exports5, {
  discoveryCacheGet: () => discoveryCacheGet,
  discoveryCacheInvalidate: () => discoveryCacheInvalidate,
  discoveryCacheSet: () => discoveryCacheSet
});
function discoveryCacheGet(key) {
  const entry = store5.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store5.delete(key);
    return null;
  }
  return entry.value;
}
function discoveryCacheSet(key, value, ttlMs = 6e4) {
  store5.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function discoveryCacheInvalidate(prefix) {
  if (!prefix) {
    store5.clear();
    return;
  }
  for (const key of Array.from(store5.keys())) {
    if (key.startsWith(prefix)) store5.delete(key);
  }
}
var store5;
var init_cache5 = __esm({
  "server/core/discovery/cache.ts"() {
    "use strict";
    store5 = /* @__PURE__ */ new Map();
  }
});

// server/core/orchestrator/handlers.ts
function createDefaultHandlers() {
  const map = /* @__PURE__ */ new Map();
  map.set("noop", async () => void 0);
  map.set("log_metric", async ({ event, step }) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[ContentFy Orchestrator] ${event.name} \u2192 ${step.kind} (${step.motor})`
      );
    }
  });
  map.set("experience_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    if (!userId) return;
    const { invalidateExperienceForUser: invalidateExperienceForUser2 } = await Promise.resolve().then(() => (init_cache3(), cache_exports3));
    invalidateExperienceForUser2(userId);
  });
  map.set("learn_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    const { learnCacheInvalidate: learnCacheInvalidate2 } = await Promise.resolve().then(() => (init_cache(), cache_exports));
    if (userId) learnCacheInvalidate2(`learn:dashboard:${userId}`);
    else learnCacheInvalidate2();
  });
  map.set("success_invalidate", async ({ event }) => {
    const userId = event.payload.userId;
    const { successCacheInvalidate: successCacheInvalidate2 } = await Promise.resolve().then(() => (init_cache2(), cache_exports2));
    if (userId) successCacheInvalidate2(`success:dashboard:${userId}`);
    else successCacheInvalidate2();
  });
  map.set("intelligence_invalidate", async () => {
    const { intelligenceCacheInvalidate: intelligenceCacheInvalidate2 } = await Promise.resolve().then(() => (init_cache4(), cache_exports4));
    intelligenceCacheInvalidate2();
  });
  map.set("discovery_invalidate", async () => {
    const { discoveryCacheInvalidate: discoveryCacheInvalidate2 } = await Promise.resolve().then(() => (init_cache5(), cache_exports5));
    discoveryCacheInvalidate2();
  });
  return map;
}
var init_handlers = __esm({
  "server/core/orchestrator/handlers.ts"() {
    "use strict";
  }
});

// server/core/orchestrator/workflow-engine.ts
var runSeq, WorkflowEngine;
var init_workflow_engine = __esm({
  "server/core/orchestrator/workflow-engine.ts"() {
    "use strict";
    init_config2();
    runSeq = 0;
    WorkflowEngine = class {
      constructor(pipeline) {
        this.pipeline = pipeline;
      }
      workflowsFor(eventName) {
        const rules = resolveOrchestratorRules();
        return rules.workflows.filter((w) => w.enabled && w.event === eventName).sort((a, b) => a.priority - b.priority);
      }
      async run(event, workflow) {
        runSeq += 1;
        const startedAt = (/* @__PURE__ */ new Date()).toISOString();
        const t0 = Date.now();
        const steps = await this.pipeline.runSequence(event, workflow.steps);
        const failed = steps.filter(
          (s) => s.status === "failed" || s.status === "timeout"
        ).length;
        const success = steps.filter((s) => s.status === "success" || s.status === "fallback").length;
        const status = failed === 0 ? "success" : success > 0 ? "partial" : "failed";
        const motors = Array.from(
          new Set(steps.map((s) => s.motor))
        );
        return {
          id: `run_${Date.now().toString(36)}_${runSeq}`,
          workflowId: workflow.id,
          eventId: event.id,
          eventName: event.name,
          status,
          steps,
          motors,
          startedAt,
          finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
          totalLatencyMs: Date.now() - t0
        };
      }
    };
  }
});

// server/core/orchestrator/reaction-engine.ts
function readField(event, field) {
  if (field.startsWith("meta.")) {
    const key = field.slice(5);
    const v = event.payload.meta?.[key];
    return typeof v === "number" ? v : null;
  }
  const direct = event.payload[field];
  return typeof direct === "number" ? direct : null;
}
function match(rule, event) {
  if (!rule.enabled || rule.onEvent !== event.name) return false;
  const actual = readField(event, rule.when.field);
  if (actual == null) return false;
  const { op, value } = rule.when;
  switch (op) {
    case "gte":
      return actual >= value;
    case "lte":
      return actual <= value;
    case "gt":
      return actual > value;
    case "lt":
      return actual < value;
    case "eq":
      return actual === value;
    default:
      return false;
  }
}
var ReactionEngine, reactionEngine;
var init_reaction_engine = __esm({
  "server/core/orchestrator/reaction-engine.ts"() {
    "use strict";
    init_config2();
    ReactionEngine = class {
      matching(event) {
        const rules = resolveOrchestratorRules();
        return rules.reactions.filter((r) => match(r, event)).sort((a, b) => a.priority - b.priority);
      }
      stepsFor(event) {
        return this.matching(event).flatMap(
          (r) => r.then.map((s) => ({
            ...s,
            id: `${r.id}:${s.id}`
          }))
        );
      }
    };
    reactionEngine = new ReactionEngine();
  }
});

// server/core/orchestrator/rule-dispatcher.ts
var RuleDispatcher;
var init_rule_dispatcher = __esm({
  "server/core/orchestrator/rule-dispatcher.ts"() {
    "use strict";
    RuleDispatcher = class {
      constructor(workflows, reactions, pipeline) {
        this.workflows = workflows;
        this.reactions = reactions;
        this.pipeline = pipeline;
      }
      async dispatch(event) {
        const runs = [];
        const defs = this.workflows.workflowsFor(event.name);
        const settled2 = await Promise.allSettled(
          defs.map((wf) => this.workflows.run(event, wf))
        );
        for (const r of settled2) {
          if (r.status === "fulfilled") runs.push(r.value);
        }
        const reactionSteps = this.reactions.stepsFor(event);
        if (reactionSteps.length) {
          const startedAt = (/* @__PURE__ */ new Date()).toISOString();
          const t0 = Date.now();
          const steps = await this.pipeline.runSequence(event, reactionSteps);
          const failed = steps.some(
            (s) => s.status === "failed" || s.status === "timeout"
          );
          const ok = steps.some((s) => s.status === "success");
          runs.push({
            id: `run_rx_${event.id}`,
            workflowId: "reactions",
            eventId: event.id,
            eventName: event.name,
            status: failed ? ok ? "partial" : "failed" : "success",
            steps,
            motors: Array.from(new Set(steps.map((s) => s.motor))),
            startedAt,
            finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
            totalLatencyMs: Date.now() - t0
          });
        }
        return runs;
      }
    };
  }
});

// server/core/orchestrator/observability.ts
var ObservabilityStore, observabilityStore;
var init_observability = __esm({
  "server/core/orchestrator/observability.ts"() {
    "use strict";
    ObservabilityStore = class {
      runs = [];
      max = 200;
      processedTotal = 0;
      failedTotal = 0;
      retryTotal = 0;
      latencySum = 0;
      record(runs) {
        for (const run of runs) {
          this.processedTotal += 1;
          this.latencySum += run.totalLatencyMs;
          if (run.status === "failed") this.failedTotal += 1;
          for (const step of run.steps) {
            if (step.attempts > 1) this.retryTotal += step.attempts - 1;
          }
          this.runs.push(run);
        }
        if (this.runs.length > this.max) {
          this.runs.splice(0, this.runs.length - this.max);
        }
      }
      recent(limit = 40) {
        return this.runs.slice(-limit).reverse();
      }
      avgLatencyMs() {
        if (this.processedTotal === 0) return 0;
        return Math.round(this.latencySum / this.processedTotal);
      }
      clear() {
        this.runs = [];
        this.processedTotal = 0;
        this.failedTotal = 0;
        this.retryTotal = 0;
        this.latencySum = 0;
      }
    };
    observabilityStore = new ObservabilityStore();
  }
});

// server/core/orchestrator/contentfy-orchestrator.ts
function emitOrchestratorEvent(name, payload = {}, source = "edge") {
  try {
    void contentFyOrchestrator.emit({ name, payload, source });
  } catch (error) {
    console.error(
      "[ContentFy Orchestrator] emit failed:",
      error instanceof Error ? error.message : error
    );
  }
}
var ContentFyOrchestrator, contentFyOrchestrator;
var init_contentfy_orchestrator = __esm({
  "server/core/orchestrator/contentfy-orchestrator.ts"() {
    "use strict";
    init_event_bus();
    init_event_registry();
    init_action_pipeline();
    init_handlers();
    init_workflow_engine();
    init_reaction_engine();
    init_rule_dispatcher();
    init_observability();
    init_config2();
    ContentFyOrchestrator = class {
      pipeline = new ActionPipeline(createDefaultHandlers());
      workflows = new WorkflowEngine(this.pipeline);
      reactions = new ReactionEngine();
      dispatcher = new RuleDispatcher(
        this.workflows,
        this.reactions,
        this.pipeline
      );
      draining = false;
      /**
       * Publish an event. Dispatch is async by default (non-blocking).
       */
      emit(input) {
        if (!eventRegistry.has(input.name)) {
          throw new Error(`Unknown orchestrator event: ${input.name}`);
        }
        const envelope = eventBus.create({
          name: input.name,
          payload: input.payload || {},
          source: input.source,
          priority: input.priority,
          correlationId: input.correlationId
        });
        const rules = resolveOrchestratorRules();
        if (input.sync || !rules.asyncDispatch) {
          return this.processOne(envelope).then((runs) => ({
            event: envelope,
            runs
          }));
        }
        eventBus.enqueue(envelope);
        queueMicrotask(() => {
          void this.drain();
        });
        return Promise.resolve({ event: envelope, runs: [] });
      }
      async processOne(envelope) {
        await eventBus.notify(envelope);
        const runs = await this.dispatcher.dispatch(envelope);
        observabilityStore.record(runs);
        return runs;
      }
      async drain(max = 20) {
        if (this.draining) return;
        this.draining = true;
        try {
          const batch = eventBus.dequeue(max);
          await Promise.allSettled(batch.map((evt) => this.processOne(evt)));
          if (eventBus.depth() > 0) {
            queueMicrotask(() => {
              void this.drain();
            });
          }
        } finally {
          this.draining = false;
        }
      }
      dashboard() {
        const rules = resolveOrchestratorRules();
        return {
          queueDepth: eventBus.depth(),
          processedTotal: observabilityStore.processedTotal,
          failedTotal: observabilityStore.failedTotal,
          retryTotal: observabilityStore.retryTotal,
          avgLatencyMs: observabilityStore.avgLatencyMs(),
          recentEvents: eventBus.recentEvents(40),
          recentRuns: observabilityStore.recent(40),
          registry: eventRegistry.list(),
          workflows: rules.workflows.map((w) => ({
            id: w.id,
            event: w.event,
            enabled: w.enabled,
            steps: w.steps.length
          })),
          reactions: rules.reactions.map((r) => ({
            id: r.id,
            onEvent: r.onEvent,
            enabled: r.enabled
          })),
          generatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      /** Test helpers */
      __resetForTests() {
        eventBus.clear();
        observabilityStore.clear();
      }
      get pipelineForTests() {
        return this.pipeline;
      }
    };
    contentFyOrchestrator = new ContentFyOrchestrator();
  }
});

// server/core/orchestrator/index.ts
var orchestrator_exports = {};
__export(orchestrator_exports, {
  ActionPipeline: () => ActionPipeline,
  ContentFyOrchestrator: () => ContentFyOrchestrator,
  EventBus: () => EventBus,
  EventRegistry: () => EventRegistry,
  ReactionEngine: () => ReactionEngine,
  RuleDispatcher: () => RuleDispatcher,
  WorkflowEngine: () => WorkflowEngine,
  contentFyOrchestrator: () => contentFyOrchestrator,
  emitOrchestratorEvent: () => emitOrchestratorEvent,
  eventBus: () => eventBus,
  eventRegistry: () => eventRegistry,
  observabilityStore: () => observabilityStore,
  reactionEngine: () => reactionEngine,
  resolveOrchestratorRules: () => resolveOrchestratorRules
});
var init_orchestrator2 = __esm({
  "server/core/orchestrator/index.ts"() {
    "use strict";
    init_contentfy_orchestrator();
    init_event_bus();
    init_event_registry();
    init_workflow_engine();
    init_reaction_engine();
    init_rule_dispatcher();
    init_action_pipeline();
    init_config2();
    init_observability();
  }
});

// server/core/discovery/seed-metadata.ts
var seed_metadata_exports = {};
__export(seed_metadata_exports, {
  DISCOVERY_META_SEED: () => DISCOVERY_META_SEED,
  getSeedMetaBySlug: () => getSeedMetaBySlug,
  listSeedMeta: () => listSeedMeta
});
function getSeedMetaBySlug(slug) {
  return DISCOVERY_META_SEED.find((m) => m.slug === slug);
}
function listSeedMeta() {
  return [...DISCOVERY_META_SEED];
}
var DISCOVERY_META_SEED;
var init_seed_metadata = __esm({
  "server/core/discovery/seed-metadata.ts"() {
    "use strict";
    DISCOVERY_META_SEED = [
      {
        slug: "desacelere",
        tags: [
          "desacelera\xE7\xE3o",
          "equil\xEDbrio",
          "rotina",
          "bem-estar",
          "qualidade de vida",
          "ansiedade",
          "sono",
          "mindfulness"
        ],
        category: "Desenvolvimento Pessoal",
        subcategory: "Bem-estar",
        level: "beginner",
        duration: "Leitura pr\xE1tica",
        type: "ebook",
        author: "ContentFy",
        collections: [
          "launches",
          "featured",
          "personal_dev",
          "productivity",
          "start_here"
        ],
        keywords: ["desacelere", "presen\xE7a", "ritmo", "equil\xEDbrio"],
        objectives: [
          "Reduzir ritmo acelerado",
          "Recuperar presen\xE7a",
          "Construir rotina sustent\xE1vel"
        ],
        audience: [
          "Profissionais com rotina acelerada",
          "Pessoas buscando equil\xEDbrio"
        ],
        skills: ["autoconhecimento", "gest\xE3o de energia", "h\xE1bitos"],
        isFeatured: true,
        isLaunch: true,
        isBeginnerFriendly: true
      },
      {
        slug: "manual-do-representante-comercial",
        tags: [
          "representa\xE7\xE3o comercial",
          "vendas B2B",
          "prospec\xE7\xE3o",
          "negocia\xE7\xE3o",
          "carreira",
          "representante 4.0",
          "CRM",
          "IA"
        ],
        category: "Neg\xF3cios",
        subcategory: "Representa\xE7\xE3o Comercial",
        level: "intermediate",
        duration: "Manual + ecossistema",
        type: "ebook",
        author: "Rom\xE1rio Oliveira",
        collections: [
          "launches",
          "featured",
          "business",
          "sales_rep",
          "ai",
          "bestsellers"
        ],
        keywords: [
          "manual representante",
          "rep4crm",
          "vendas",
          "carteira",
          "prompts"
        ],
        objectives: [
          "Organizar opera\xE7\xE3o comercial",
          "Vender com m\xE9todo",
          "Usar IA no dia a dia comercial"
        ],
        audience: [
          "Representantes comerciais",
          "Profissionais de vendas B2B"
        ],
        skills: ["vendas", "CRM", "prospec\xE7\xE3o", "negocia\xE7\xE3o", "IA aplicada"],
        isFeatured: true,
        isLaunch: true,
        isBeginnerFriendly: false
      }
    ];
  }
});

// server/vercel-app.ts
import "dotenv/config";

// server/createApp.ts
import express3 from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);
var creatorProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user) {
      throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }
    if (ctx.user.role !== "admin") {
      throw new TRPCError2({
        code: "FORBIDDEN",
        message: "Acesso restrito \xE0 \xC1rea do Criador"
      });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/products.ts
import { z as z2 } from "zod";
init_db();
import { TRPCError as TRPCError3 } from "@trpc/server";
var productsRouter = router({
  // Listar categorias (público)
  listCategories: publicProcedure.query(async () => {
    return await getAllProductCategories();
  }),
  // Listar todos os produtos (público)
  list: publicProcedure.query(async () => {
    return await getAllProducts();
  }),
  // Listar produtos por tipo (público)
  listByType: publicProcedure.input(z2.object({
    type: z2.enum(["ebook", "audiobook", "course", "app"])
  })).query(async ({ input }) => {
    return await getProductsByType(input.type);
  }),
  // Obter produto por ID (público)
  getById: publicProcedure.input(z2.object({
    id: z2.number()
  })).query(async ({ input }) => {
    const product = await getProductById(input.id);
    if (!product) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    return product;
  }),
  // Obter produto por slug (público)
  getBySlug: publicProcedure.input(z2.object({
    slug: z2.string()
  })).query(async ({ input }) => {
    const product = await getProductBySlug(input.slug);
    if (!product) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    return product;
  }),
  // Criar produto (apenas admin)
  create: protectedProcedure.input(z2.object({
    name: z2.string().min(1),
    slug: z2.string().min(1),
    description: z2.string().optional(),
    type: z2.enum(["ebook", "audiobook", "course", "app"]),
    categoryId: z2.number().optional(),
    price: z2.number().min(0),
    // Preço em centavos
    isRecurring: z2.boolean().default(false),
    recurringInterval: z2.enum(["month", "year"]).optional(),
    allowInstallments: z2.boolean().default(true),
    maxInstallments: z2.number().min(1).max(12).default(12),
    coverImage: z2.string().optional(),
    thumbnailImage: z2.string().optional(),
    contentUrl: z2.string().optional(),
    // URL do arquivo do produto (PDF, MP3, etc.)
    salesPageUrl: z2.string().optional(),
    guaranteeDays: z2.number().min(0).default(30),
    affiliateCommission: z2.number().min(50).max(70).default(60),
    isActive: z2.boolean().optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Apenas administradores podem criar produtos"
      });
    }
    const existing = await getProductBySlug(input.slug);
    if (existing) {
      throw new TRPCError3({
        code: "CONFLICT",
        message: "J\xE1 existe um produto com este slug"
      });
    }
    const { isActive, ...rest } = input;
    const { insertId } = await createProduct({
      ...rest,
      isActive: isActive ?? true
    });
    if (input.type === "course" && insertId) {
      await ensureCourseForProduct(insertId);
    }
    return { success: true, id: insertId };
  }),
  // Atualizar produto (apenas admin)
  update: protectedProcedure.input(z2.object({
    id: z2.number(),
    name: z2.string().min(1).optional(),
    slug: z2.string().min(1).optional(),
    description: z2.string().optional(),
    type: z2.enum(["ebook", "audiobook", "course", "app"]).optional(),
    categoryId: z2.number().optional(),
    price: z2.number().min(0).optional(),
    isRecurring: z2.boolean().optional(),
    recurringInterval: z2.enum(["month", "year"]).optional(),
    allowInstallments: z2.boolean().optional(),
    maxInstallments: z2.number().min(1).max(12).optional(),
    coverImage: z2.string().optional(),
    thumbnailImage: z2.string().optional(),
    contentUrl: z2.string().optional(),
    // URL do arquivo do produto (PDF, MP3, etc.)
    salesPageUrl: z2.string().optional(),
    guaranteeDays: z2.number().min(0).optional(),
    affiliateCommission: z2.number().min(50).max(70).optional(),
    isActive: z2.boolean().optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Apenas administradores podem atualizar produtos"
      });
    }
    const { id, ...data } = input;
    const product = await getProductById(id);
    if (!product) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    await updateProduct(id, data);
    return { success: true };
  }),
  // Duplicar produto (apenas admin)
  duplicate: protectedProcedure.input(z2.object({
    id: z2.number()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Apenas administradores podem duplicar produtos"
      });
    }
    const originalProduct = await getProductById(input.id);
    if (!originalProduct) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    const timestamp2 = Date.now();
    const newSlug = `${originalProduct.slug}-copia-${timestamp2}`;
    const { insertId } = await createProduct({
      name: `${originalProduct.name} (C\xF3pia)`,
      slug: newSlug,
      description: originalProduct.description,
      type: originalProduct.type,
      categoryId: originalProduct.categoryId,
      price: originalProduct.price,
      isRecurring: originalProduct.isRecurring,
      recurringInterval: originalProduct.recurringInterval,
      salesPageUrl: originalProduct.salesPageUrl,
      isActive: false,
      // Duplicado começa inativo
      guaranteeDays: originalProduct.guaranteeDays
    });
    if (originalProduct.type === "course" && insertId) {
      await ensureCourseForProduct(insertId);
    }
    return { success: true, id: insertId };
  }),
  // Deletar produto (soft delete - apenas admin)
  delete: protectedProcedure.input(z2.object({
    id: z2.number()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Apenas administradores podem deletar produtos"
      });
    }
    const product = await getProductById(input.id);
    if (!product) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    await deleteProduct(input.id);
    return { success: true };
  }),
  // Verificar se usuário tem acesso ao produto
  hasAccess: protectedProcedure.input(z2.object({
    productId: z2.number()
  })).query(async ({ ctx, input }) => {
    const hasAccess = await hasProductAccess(ctx.user.id, input.productId);
    return { hasAccess };
  }),
  // Listar produtos do usuário (área de membros)
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    return await getUserProducts(ctx.user.id);
  })
});

// server/routers/checkout.ts
import { z as z3 } from "zod";
init_db();
import { TRPCError as TRPCError4 } from "@trpc/server";
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover"
});
var checkoutRouter = router({
  createCheckout: publicProcedure.input(
    z3.object({
      name: z3.string(),
      price: z3.number()
    })
  ).mutation(async ({ ctx, input }) => {
    const origin = ctx.req.headers.origin || "http://localhost:3001";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: input.name
            },
            unit_amount: input.price
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/products`
    });
    return { url: session.url };
  }),
  // Aplicar cupom no checkout
  applyCoupon: publicProcedure.input(z3.object({
    couponCode: z3.string(),
    productId: z3.number(),
    originalPrice: z3.number()
  })).mutation(async ({ input }) => {
    const coupon = await getCouponByCode(input.couponCode);
    if (!coupon) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Cupom n\xE3o encontrado"
      });
    }
    if (!coupon.isActive) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom n\xE3o est\xE1 ativo"
      });
    }
    const now = /* @__PURE__ */ new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom ainda n\xE3o \xE9 v\xE1lido"
      });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom expirou"
      });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom atingiu o limite de uso"
      });
    }
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round(input.originalPrice * coupon.discountValue / 100);
    } else {
      discountAmount = coupon.discountValue;
    }
    const finalPrice = Math.max(0, input.originalPrice - discountAmount);
    return {
      valid: true,
      couponId: coupon.id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: input.originalPrice,
      discountAmount,
      finalPrice,
      message: "Cupom aplicado com sucesso!"
    };
  }),
  // Calcular parcelamento
  calculateInstallments: publicProcedure.input(z3.object({
    amount: z3.number(),
    maxInstallments: z3.number().default(12)
  })).query(({ input }) => {
    const installments = [];
    const minInstallmentAmount = 500;
    for (let i = 1; i <= input.maxInstallments; i++) {
      const installmentAmount = Math.round(input.amount / i);
      if (installmentAmount < minInstallmentAmount) {
        break;
      }
      installments.push({
        number: i,
        amount: installmentAmount,
        total: input.amount,
        label: `${i}x de R$ ${(installmentAmount / 100).toFixed(2)} sem juros`
      });
    }
    const recommendedInstallment = installments.find(
      (inst) => inst.amount >= 2e3 && inst.amount <= 5e3
    )?.number || 1;
    return {
      installments,
      recommendedInstallment
    };
  }),
  // Verificar acesso do usuário ao produto
  checkUserAccess: protectedProcedure.input(z3.object({
    productId: z3.number()
  })).query(async ({ ctx, input }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    const access = userProducts2.find((up) => up.userProduct.productId === input.productId);
    if (!access) {
      return {
        hasAccess: false,
        purchaseDate: null,
        orderId: null
      };
    }
    return {
      hasAccess: true,
      purchaseDate: access.userProduct.accessGrantedAt,
      orderId: access.userProduct.orderId,
      message: "Voc\xEA j\xE1 possui este produto!"
    };
  }),
  // Criar sessão de checkout
  createSession: protectedProcedure.input(z3.object({
    productId: z3.number(),
    couponCode: z3.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const product = await getProductById(input.productId);
    if (!product) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    if (!product.isActive) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este produto n\xE3o est\xE1 dispon\xEDvel para venda"
      });
    }
    const hasAccess = await hasProductAccess(ctx.user.id, input.productId);
    if (hasAccess) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Voc\xEA j\xE1 possui acesso a este produto"
      });
    }
    let finalAmount = product.price;
    let discountAmount = 0;
    let couponId;
    if (input.couponCode) {
      const coupon = await getCouponByCode(input.couponCode);
      if (!coupon) {
        throw new TRPCError4({
          code: "NOT_FOUND",
          message: "Cupom inv\xE1lido"
        });
      }
      const now = /* @__PURE__ */ new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        throw new TRPCError4({
          code: "BAD_REQUEST",
          message: "Este cupom ainda n\xE3o est\xE1 v\xE1lido"
        });
      }
      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        throw new TRPCError4({
          code: "BAD_REQUEST",
          message: "Este cupom expirou"
        });
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError4({
          code: "BAD_REQUEST",
          message: "Este cupom atingiu o limite de usos"
        });
      }
      if (coupon.discountType === "percentage") {
        discountAmount = Math.floor(finalAmount * coupon.discountValue / 100);
      } else {
        discountAmount = coupon.discountValue;
      }
      finalAmount = Math.max(50, finalAmount - discountAmount);
      couponId = coupon.id;
    }
    const orderId = await createOrder({
      userId: ctx.user.id,
      productId: input.productId,
      status: "pending",
      amount: finalAmount,
      couponId,
      discountAmount
    });
    let stripeCustomerId = ctx.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: ctx.user.email || void 0,
        name: ctx.user.name || void 0,
        metadata: {
          userId: ctx.user.id.toString()
        }
      });
      stripeCustomerId = customer.id;
      if (stripeCustomerId) {
        await updateUserStripeCustomerId(ctx.user.id, stripeCustomerId);
      }
    }
    const isRecurring = product.isRecurring;
    const paymentMethods = isRecurring ? ["card"] : ["card", "pix", "boleto"];
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: isRecurring ? "subscription" : "payment",
      payment_method_types: paymentMethods,
      payment_method_options: !isRecurring ? {
        boleto: {
          expires_after_days: 3
          // Boleto vence em 3 dias
        }
      } : void 0,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description || void 0,
              images: product.coverImage ? [product.coverImage] : void 0
            },
            unit_amount: finalAmount,
            ...product.isRecurring && product.recurringInterval ? {
              recurring: {
                interval: product.recurringInterval
              }
            } : {}
          },
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ctx.req.headers.origin}/checkout/cancel`,
      metadata: {
        orderId: orderId.toString(),
        userId: ctx.user.id.toString(),
        productId: input.productId.toString()
      },
      client_reference_id: ctx.user.id.toString()
    });
    await updateOrder(orderId, {
      stripeCheckoutSessionId: session.id
    });
    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }),
  // Verificar cupom
  validateCoupon: publicProcedure.input(z3.object({
    code: z3.string(),
    productId: z3.number()
  })).query(async ({ input }) => {
    const coupon = await getCouponByCode(input.code);
    if (!coupon) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Cupom inv\xE1lido"
      });
    }
    const now = /* @__PURE__ */ new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom ainda n\xE3o est\xE1 v\xE1lido"
      });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom expirou"
      });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este cupom atingiu o limite de usos"
      });
    }
    const product = await getProductById(input.productId);
    if (!product) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Produto n\xE3o encontrado"
      });
    }
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.floor(product.price * coupon.discountValue / 100);
    } else {
      discountAmount = coupon.discountValue;
    }
    const finalPrice = Math.max(50, product.price - discountAmount);
    return {
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      originalPrice: product.price,
      finalPrice
    };
  }),
  // Criar sessão de assinatura (para planos Freemium/Premium)
  createSubscriptionSession: protectedProcedure.input(z3.object({
    planSlug: z3.string(),
    // 'librofy-premium-mensal' ou 'librofy-premium-anual'
    affiliateCode: z3.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const plans = await getAllSubscriptionPlans();
    const plan = plans.find((p) => p.slug === input.planSlug);
    if (!plan) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Plano n\xE3o encontrado"
      });
    }
    if (!plan.isActive) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Este plano n\xE3o est\xE1 dispon\xEDvel"
      });
    }
    if (plan.price === 0) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Plano gratuito n\xE3o requer pagamento"
      });
    }
    if (!plan.stripePriceId) {
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Plano n\xE3o configurado no Stripe"
      });
    }
    const existingSubscription = await getUserActiveSubscription(ctx.user.id);
    if (existingSubscription) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Voc\xEA j\xE1 possui uma assinatura ativa"
      });
    }
    let stripeCustomerId = ctx.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: ctx.user.email || void 0,
        name: ctx.user.name || void 0,
        metadata: {
          userId: ctx.user.id.toString()
        }
      });
      stripeCustomerId = customer.id;
      if (stripeCustomerId) {
        await updateUserStripeCustomerId(ctx.user.id, stripeCustomerId);
      }
    }
    const metadata = {
      userId: ctx.user.id.toString(),
      planId: plan.id.toString(),
      planSlug: plan.slug
    };
    if (input.affiliateCode) {
      const affiliate = await getAffiliateByCode(input.affiliateCode);
      if (affiliate && affiliate.status === "approved") {
        metadata.affiliateId = affiliate.id.toString();
        metadata.affiliateCode = input.affiliateCode;
      }
    }
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          // Usar Price ID fixo do Stripe
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ctx.req.headers.origin}/products`,
      metadata,
      client_reference_id: ctx.user.id.toString(),
      subscription_data: {
        metadata
      }
    });
    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }),
  // Listar pedidos do usuário
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return await getUserOrders(ctx.user.id);
  }),
  // Obter detalhes de um pedido
  getOrder: protectedProcedure.input(z3.object({
    orderId: z3.number()
  })).query(async ({ ctx, input }) => {
    const order = await getOrderById(input.orderId);
    if (!order) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Pedido n\xE3o encontrado"
      });
    }
    if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o tem permiss\xE3o para acessar este pedido"
      });
    }
    return order;
  }),
  // Criar sessão do Stripe Customer Portal
  createCustomerPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Voc\xEA n\xE3o possui uma assinatura ativa"
      });
    }
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: ctx.user.stripeCustomerId,
        return_url: `${ctx.req.headers.origin}/dashboard`
      });
      return {
        url: session.url
      };
    } catch (error) {
      console.error("[Customer Portal] Error creating session:", error);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar sess\xE3o do portal de gerenciamento"
      });
    }
  })
});

// server/routers/members.ts
import { z as z4 } from "zod";
init_db();
init_cache3();
init_experience_store();
import { TRPCError as TRPCError5 } from "@trpc/server";
var membersRouter = router({
  // Listar produtos do usuário
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    return userProducts2.map((up) => ({
      userProduct: up.userProduct,
      product: up.product,
      progress: 0
      // TODO: Calcular progresso real baseado nas aulas concluídas
    }));
  }),
  // Obter detalhes de um produto específico do usuário
  getMyProduct: protectedProcedure.input(z4.object({
    productId: z4.number()
  })).query(async ({ ctx, input }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    const userProduct = userProducts2.find(
      (up) => up.userProduct.productId === input.productId
    );
    if (!userProduct) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Voc\xEA n\xE3o possui acesso a este produto"
      });
    }
    return {
      userProduct: userProduct.userProduct,
      product: userProduct.product,
      progress: 0
      // TODO: Calcular progresso real
    };
  }),
  // Obter estrutura de curso (módulos + aulas)
  getCourseStructure: protectedProcedure.input(z4.object({
    productId: z4.number()
  })).query(async ({ ctx, input }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    const hasAccess = userProducts2.some(
      (up) => up.userProduct.productId === input.productId
    );
    if (!hasAccess) {
      throw new TRPCError5({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o possui acesso a este curso"
      });
    }
    const course = await getCourseByProductId(input.productId);
    if (!course) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Curso n\xE3o encontrado"
      });
    }
    const modules = await getCourseModules(course.id);
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await getModuleLessons(module.id);
        const lessonsWithProgress = await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await getUserLessonProgress(ctx.user.id, lesson.id);
            return {
              ...lesson,
              isCompleted: progress?.isCompleted || false,
              lastWatchedAt: progress?.lastWatchedAt || null
            };
          })
        );
        return {
          ...module,
          lessons: lessonsWithProgress
        };
      })
    );
    const totalLessons = modulesWithLessons.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    const completedLessons = modulesWithLessons.reduce(
      (sum, module) => sum + module.lessons.filter((l) => l.isCompleted).length,
      0
    );
    const progressPercentage = totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0;
    return {
      course,
      modules: modulesWithLessons,
      stats: {
        totalModules: modulesWithLessons.length,
        totalLessons,
        completedLessons,
        progressPercentage
      }
    };
  }),
  // Marcar aula como concluída
  markLessonComplete: protectedProcedure.input(z4.object({
    lessonId: z4.number(),
    isCompleted: z4.boolean()
  })).mutation(async ({ ctx, input }) => {
    await updateLessonProgress({
      userId: ctx.user.id,
      lessonId: input.lessonId,
      isCompleted: input.isCompleted,
      lastWatchedAt: /* @__PURE__ */ new Date()
    });
    invalidateExperienceForUser(ctx.user.id);
    void recordActivityEvent({
      userId: ctx.user.id,
      eventType: input.isCompleted ? "lesson_completed" : "lesson_started",
      lessonId: input.lessonId
    });
    const { emitOrchestratorEvent: emitOrchestratorEvent2 } = await Promise.resolve().then(() => (init_orchestrator2(), orchestrator_exports));
    emitOrchestratorEvent2(
      input.isCompleted ? "LESSON_COMPLETED" : "COURSE_STARTED",
      { userId: ctx.user.id, lessonId: input.lessonId },
      "edge"
    );
    return {
      success: true,
      message: input.isCompleted ? "Aula marcada como conclu\xEDda" : "Progresso salvo"
    };
  }),
  // Obter estatísticas do usuário
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    const stats = {
      totalProducts: userProducts2.length,
      courses: userProducts2.filter((up) => up.product?.type === "course").length,
      ebooks: userProducts2.filter((up) => up.product?.type === "ebook").length,
      audiobooks: userProducts2.filter((up) => up.product?.type === "audiobook").length,
      apps: userProducts2.filter((up) => up.product?.type === "app").length
    };
    return stats;
  })
});

// server/routers/affiliates.ts
import { z as z5 } from "zod";
init_db();
import { TRPCError as TRPCError6 } from "@trpc/server";
var affiliatesRouter = router({
  // Cadastrar como afiliado
  register: protectedProcedure.input(z5.object({
    paymentMethod: z5.enum(["pix", "bank_transfer"]),
    paymentDetails: z5.string()
  })).mutation(async ({ ctx, input }) => {
    const existingAffiliate = await getAffiliateByUserId(ctx.user.id);
    if (existingAffiliate) {
      throw new TRPCError6({
        code: "BAD_REQUEST",
        message: "Voc\xEA j\xE1 est\xE1 cadastrado como afiliado"
      });
    }
    const affiliate = await createAffiliate({
      userId: ctx.user.id,
      affiliateCode: `AFF${ctx.user.id}${Date.now().toString().slice(-6)}`,
      commissionRate: 20,
      // 20% de comissão padrão
      isActive: false
      // Aguardando aprovação
    });
    return {
      success: true,
      affiliate,
      message: "Cadastro enviado! Aguarde aprova\xE7\xE3o do administrador."
    };
  }),
  // Obter dados do afiliado atual
  getMyAffiliateData: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      return null;
    }
    return affiliate;
  }),
  // Gerar link de afiliado para um produto
  generateLink: protectedProcedure.input(z5.object({
    productSlug: z5.string()
  })).mutation(async ({ ctx, input }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    if (!affiliate.isActive) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Seu cadastro de afiliado ainda n\xE3o foi aprovado"
      });
    }
    const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
    const affiliateLink = `${baseUrl}/products/${input.productSlug}?ref=${affiliate.affiliateCode}`;
    return {
      link: affiliateLink,
      code: affiliate.affiliateCode
    };
  }),
  // Obter estatísticas do afiliado
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const sales = await getAffiliateSales(affiliate.id);
    const totalSales = sales.length;
    const totalEarnings = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
    const pendingEarnings = sales.filter((s) => s.status === "pending").reduce((sum, sale) => sum + sale.commissionAmount, 0);
    const paidEarnings = sales.filter((s) => s.status === "paid").reduce((sum, sale) => sum + sale.commissionAmount, 0);
    return {
      totalSales,
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      commissionRate: affiliate.commissionRate
    };
  }),
  // Listar vendas do afiliado
  getMySales: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const sales = await getAffiliateSales(affiliate.id);
    return sales;
  }),
  // Solicitar saque
  requestWithdrawal: protectedProcedure.input(z5.object({
    amount: z5.number().positive()
  })).mutation(async ({ ctx, input }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const sales = await getAffiliateSales(affiliate.id);
    const availableBalance = sales.filter((s) => s.status === "approved").reduce((sum, sale) => sum + sale.commissionAmount, 0);
    if (input.amount > availableBalance) {
      throw new TRPCError6({
        code: "BAD_REQUEST",
        message: "Saldo insuficiente para saque"
      });
    }
    return {
      success: true,
      message: "Solicita\xE7\xE3o de saque enviada com sucesso!"
    };
  }),
  // Obter estatísticas de MRR (Monthly Recurring Revenue)
  getMRRStats: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const activeSubscriptions = await getAffiliateActiveSubscriptions(affiliate.id);
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const monthlyAmount = sub.recurringInterval === "year" ? sub.commissionAmount / 12 : sub.commissionAmount;
      return sum + monthlyAmount;
    }, 0);
    const arr = mrr * 12;
    const totalClicks = await getAffiliateTotalClicks(affiliate.id);
    const conversionRate = totalClicks > 0 ? activeSubscriptions.length / totalClicks * 100 : 0;
    return {
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      activeSubscribers: activeSubscriptions.length,
      conversionRate: conversionRate.toFixed(2),
      nextPaymentDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 1).toISOString()
    };
  }),
  // Listar assinantes ativos gerados pelo afiliado
  getActiveSubscribers: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const subscribers = await getAffiliateActiveSubscriptions(affiliate.id);
    return subscribers;
  }),
  // Histórico mensal de MRR (últimos 6 meses)
  getMRRHistory: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await getAffiliateByUserId(ctx.user.id);
    if (!affiliate) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o \xE9 um afiliado cadastrado"
      });
    }
    const history = await getAffiliateMRRHistory(affiliate.id, 6);
    return history;
  }),
  // ADMIN: Listar todos os afiliados
  listAll: protectedProcedure.query(async ({ ctx }) => {
    const affiliates2 = await getAllAffiliates();
    return affiliates2;
  }),
  // ADMIN: Aprovar afiliado
  approve: protectedProcedure.input(z5.object({
    affiliateId: z5.number()
  })).mutation(async ({ ctx, input }) => {
    await updateAffiliateStatus(input.affiliateId, true);
    return {
      success: true,
      message: "Afiliado aprovado com sucesso!"
    };
  }),
  // ADMIN: Rejeitar afiliado
  reject: protectedProcedure.input(z5.object({
    affiliateId: z5.number()
  })).mutation(async ({ ctx, input }) => {
    await updateAffiliateStatus(input.affiliateId, false);
    return {
      success: true,
      message: "Afiliado rejeitado"
    };
  })
});

// server/routers/certificates.ts
import { z as z6 } from "zod";
init_db();
import { TRPCError as TRPCError7 } from "@trpc/server";
var certificatesRouter = router({
  // Gerar certificado para um curso concluído
  generate: protectedProcedure.input(z6.object({
    courseId: z6.number()
  })).mutation(async ({ ctx, input }) => {
    const userProducts2 = await getUserProducts(ctx.user.id);
    const hasCourse = userProducts2.some((up) => up.userProduct.productId === input.courseId);
    if (!hasCourse) {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o tem acesso a este curso"
      });
    }
    const course = await getProductById(input.courseId);
    if (!course || course.type !== "course") {
      throw new TRPCError7({
        code: "NOT_FOUND",
        message: "Curso n\xE3o encontrado"
      });
    }
    const existing = await getCertificateByUserAndCourse(
      ctx.user.id,
      input.courseId
    );
    if (existing) {
      return {
        certificate: existing,
        message: "Certificado j\xE1 foi gerado anteriormente"
      };
    }
    const certificateCode = `CERT${ctx.user.id}${input.courseId}${Date.now().toString().slice(-8)}`.toUpperCase();
    const certificate = await createCertificate({
      userId: ctx.user.id,
      courseId: input.courseId,
      certificateCode,
      issuedAt: /* @__PURE__ */ new Date()
    });
    return {
      certificate,
      message: "Certificado gerado com sucesso!"
    };
  }),
  // Listar certificados do usuário
  getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
    const certificates2 = await getUserCertificates(ctx.user.id);
    return certificates2;
  }),
  // Validar certificado por código (público)
  validate: protectedProcedure.input(z6.object({
    certificateCode: z6.string()
  })).query(async ({ input }) => {
    const certificate = await getCertificateByCode(input.certificateCode);
    if (!certificate) {
      return {
        valid: false,
        message: "Certificado n\xE3o encontrado"
      };
    }
    return {
      valid: true,
      certificate,
      message: "Certificado v\xE1lido"
    };
  })
});

// server/routers/orders.ts
import { TRPCError as TRPCError8 } from "@trpc/server";

// server/_core/authz.ts
function isAdminRole(role) {
  return role === "admin";
}
function canAccessOwnedResource(input) {
  return isAdminRole(input.actorRole) || input.actorUserId === input.ownerUserId;
}

// server/routers/orders.ts
init_db();
import { z as z7 } from "zod";
var ordersRouter = router({
  /** Admin-only — never expose all orders to regular users. */
  list: adminProcedure.query(async () => {
    return await getAllOrders();
  }),
  getById: protectedProcedure.input(z7.object({ id: z7.number() })).query(async ({ ctx, input }) => {
    const order = await getOrderById(input.id);
    if (!order) {
      throw new TRPCError8({ code: "NOT_FOUND", message: "Pedido n\xE3o encontrado" });
    }
    if (!canAccessOwnedResource({
      actorUserId: ctx.user.id,
      actorRole: ctx.user.role,
      ownerUserId: order.userId
    })) {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "Voc\xEA n\xE3o tem permiss\xE3o para acessar este pedido"
      });
    }
    return order;
  })
});

// server/routers/users.tsx
init_db();
var usersRouter = router({
  /** Admin-only customer list. */
  list: adminProcedure.query(async () => {
    return await getAllUsers();
  })
});

// server/routers/creator.ts
import { z as z8 } from "zod";
import { TRPCError as TRPCError9 } from "@trpc/server";
init_db();
var creatorRouter = router({
  dashboard: creatorProcedure.query(async () => {
    const products2 = await getAllProducts();
    const orders2 = await getAllOrders();
    const totalStudents = await countDistinctStudents();
    const published = products2.filter((p) => p.isActive).length;
    const drafts = products2.filter((p) => !p.isActive).length;
    const completedOrders = orders2.filter((o) => o.status === "completed");
    const grossRevenue = completedOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );
    const recentSales = completedOrders.slice(0, 8).map((o) => ({
      id: o.id,
      amount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
      customerName: o.user?.name ?? null,
      customerEmail: o.user?.email ?? null
    }));
    return {
      totalProducts: products2.length,
      publishedProducts: published,
      draftProducts: drafts,
      totalStudents,
      grossRevenue,
      recentSales,
      meta: {
        studentsSource: "user_products",
        revenueSource: "orders.status=completed",
        note: "Sem ownership por criador no schema \u2014 m\xE9tricas globais da plataforma."
      }
    };
  }),
  listProducts: creatorProcedure.query(async () => {
    const products2 = await getAllProducts();
    const withStats = await Promise.all(
      products2.map(async (p) => ({
        ...p,
        studentCount: await countStudentsByProduct(p.id),
        status: p.isActive ? "published" : "draft"
      }))
    );
    return withStats;
  }),
  listCourses: creatorProcedure.query(async () => {
    const products2 = await getAllProducts();
    return products2.filter((p) => p.type === "course");
  }),
  getCourseBuilder: creatorProcedure.input(z8.object({ productId: z8.number() })).query(async ({ input }) => {
    const product = await getProductById(input.productId);
    if (!product) {
      throw new TRPCError9({ code: "NOT_FOUND", message: "Produto n\xE3o encontrado" });
    }
    if (product.type !== "course") {
      throw new TRPCError9({
        code: "BAD_REQUEST",
        message: "Construtor dispon\xEDvel apenas para produtos do tipo curso"
      });
    }
    const structure = await getCourseStructureForBuilder(input.productId);
    return { product, ...structure };
  }),
  createModule: creatorProcedure.input(
    z8.object({
      productId: z8.number(),
      title: z8.string().min(1),
      description: z8.string().optional()
    })
  ).mutation(async ({ input }) => {
    const structure = await getCourseStructureForBuilder(input.productId);
    const nextOrder = structure.modules.reduce((max, m) => Math.max(max, m.order), 0) + 1;
    const id = await createCourseModule({
      courseId: structure.course.id,
      title: input.title,
      description: input.description ?? null,
      order: nextOrder
    });
    return { id };
  }),
  updateModule: creatorProcedure.input(
    z8.object({
      id: z8.number(),
      title: z8.string().min(1).optional(),
      description: z8.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateCourseModule(id, data);
    return { success: true };
  }),
  deleteModule: creatorProcedure.input(z8.object({ id: z8.number() })).mutation(async ({ input }) => {
    await deleteCourseModule(input.id);
    return { success: true };
  }),
  moveModule: creatorProcedure.input(
    z8.object({
      productId: z8.number(),
      moduleId: z8.number(),
      direction: z8.enum(["up", "down"])
    })
  ).mutation(async ({ input }) => {
    const { modules } = await getCourseStructureForBuilder(input.productId);
    const idx = modules.findIndex((m) => m.id === input.moduleId);
    if (idx < 0) {
      throw new TRPCError9({ code: "NOT_FOUND", message: "M\xF3dulo n\xE3o encontrado" });
    }
    const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= modules.length) {
      return { success: true };
    }
    await swapModuleOrder(modules[idx].id, modules[swapIdx].id);
    return { success: true };
  }),
  createLesson: creatorProcedure.input(
    z8.object({
      moduleId: z8.number(),
      title: z8.string().min(1),
      description: z8.string().optional(),
      type: z8.enum(["video", "text", "pdf", "audio"]),
      contentUrl: z8.string().optional(),
      duration: z8.number().min(0).optional(),
      isFree: z8.boolean().optional()
    })
  ).mutation(async ({ input }) => {
    const lessons = await getModuleLessons(input.moduleId);
    const nextOrder = lessons.reduce((max, l) => Math.max(max, l.order), 0) + 1;
    const id = await createCourseLesson({
      moduleId: input.moduleId,
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      contentUrl: input.contentUrl ?? null,
      duration: input.duration ?? null,
      order: nextOrder,
      isFree: input.isFree ?? false
    });
    return { id };
  }),
  updateLesson: creatorProcedure.input(
    z8.object({
      id: z8.number(),
      title: z8.string().min(1).optional(),
      description: z8.string().optional(),
      type: z8.enum(["video", "text", "pdf", "audio"]).optional(),
      contentUrl: z8.string().optional(),
      duration: z8.number().min(0).optional(),
      isFree: z8.boolean().optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateCourseLesson(id, data);
    return { success: true };
  }),
  deleteLesson: creatorProcedure.input(z8.object({ id: z8.number() })).mutation(async ({ input }) => {
    await deleteCourseLesson(input.id);
    return { success: true };
  }),
  moveLesson: creatorProcedure.input(
    z8.object({
      moduleId: z8.number(),
      lessonId: z8.number(),
      direction: z8.enum(["up", "down"])
    })
  ).mutation(async ({ input }) => {
    const lessons = await getModuleLessons(input.moduleId);
    const idx = lessons.findIndex((l) => l.id === input.lessonId);
    if (idx < 0) {
      throw new TRPCError9({ code: "NOT_FOUND", message: "Aula n\xE3o encontrada" });
    }
    const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) {
      return { success: true };
    }
    await swapLessonOrder(lessons[idx].id, lessons[swapIdx].id);
    return { success: true };
  })
});

// server/routers/contentfy.ts
init_contentfy();
import { z as z9 } from "zod";

// server/core/registry.ts
var CONTENTFY_CORE_STATUS = [
  { domain: "auth", maturity: "implemented", notes: "OAuth + session (unchanged)" },
  { domain: "permissions", maturity: "implemented", notes: "Role checks in routers" },
  { domain: "products", maturity: "implemented", notes: "Ecosystem model scaffolded" },
  { domain: "orders", maturity: "implemented", notes: "Existing orders router" },
  { domain: "payments", maturity: "in_development", notes: "ContentFy Pay abstraction over Stripe" },
  { domain: "certificates", maturity: "implemented" },
  { domain: "progress", maturity: "implemented", notes: "LMS progress" },
  { domain: "media", maturity: "planned", notes: "Media engine scaffolded" },
  { domain: "analytics", maturity: "planned", notes: "Insight engine scaffolded" },
  { domain: "recommendations", maturity: "in_development", notes: "Discovery RecommendationService (rules/behavior/graph)" },
  { domain: "ai", maturity: "in_development", notes: "AI engine + existing ai-studio/llm" },
  { domain: "notifications", maturity: "planned" },
  { domain: "achievements", maturity: "planned" },
  { domain: "protect", maturity: "in_development", notes: "ContentFy Protect v1 \u2014 requests + admin review; Stripe refund on explicit admin action" },
  { domain: "learn", maturity: "in_development", notes: "ContentFy Learn v1 \u2014 goals, competencies, journey, achievements, Success Index" },
  { domain: "insight", maturity: "planned" },
  { domain: "discovery", maturity: "in_development", notes: "ContentFy Discovery v1 \u2014 rails, trending, favorites, search, continue learning" },
  { domain: "successScore", maturity: "in_development", notes: "Success Engine v1 \u2014 Score/Habit/Consistency/Evolution + Learn integration" },
  { domain: "experience", maturity: "in_development", notes: "Experience Layer XIII \u2014 orchestration over Learn/Success/Discovery/Protect/LMS" },
  { domain: "intelligence", maturity: "in_development", notes: "Intelligence Engine XIV \u2014 statistical marketplace brain; no generative AI" },
  { domain: "orchestrator", maturity: "in_development", notes: "Orchestrator XV \u2014 event bus + workflows between engines; no motor business rules" },
  { domain: "community", maturity: "planned" }
];

// server/core/payments/payment-engine.ts
init_contentfy();

// server/core/payments/providers/stripe-provider.ts
init_contentfy();
var StripePaymentProvider = class {
  id = "stripe";
  async createIntent(_req) {
    return {
      provider: "stripe",
      displayName: CONTENTFY_IDENTITY.paymentLabel,
      status: "pending"
    };
  }
  async refund(_req) {
    return {
      refundId: `cf_refund_pending_${Date.now()}`,
      status: "pending"
    };
  }
};

// server/core/payments/payment-engine.ts
var PaymentEngine = class {
  providers = /* @__PURE__ */ new Map();
  active = "stripe";
  constructor() {
    this.register(new StripePaymentProvider());
  }
  register(provider) {
    this.providers.set(provider.id, provider);
  }
  setActive(id) {
    if (!this.providers.has(id)) {
      throw new Error(`Payment provider not registered: ${id}`);
    }
    this.active = id;
  }
  getActiveProvider() {
    const provider = this.providers.get(this.active);
    if (!provider) throw new Error("No active payment provider");
    return provider;
  }
  getDisplayName() {
    return CONTENTFY_IDENTITY.paymentLabel;
  }
  createIntent(req) {
    return this.getActiveProvider().createIntent(req);
  }
  refund(req) {
    return this.getActiveProvider().refund(req);
  }
  /** Split / wallet seams — planned, not wired to production yet. */
  planSplit(_rules) {
    return { status: "planned", engine: "contentfy-pay-split" };
  }
};
var paymentEngine = new PaymentEngine();

// server/core/protect/guarantee-engine.ts
init_contentfy();
var GuaranteeEngine = class {
  getPolicy(days = PROTECT_DEFAULT_DAYS) {
    return {
      days,
      label: days === 30 ? PROTECT_BRAND.guaranteeLabel : `Garantia de ${days} dias`,
      description: `Voc\xEA tem ${days} dias para solicitar reembolso pelo ${PROTECT_BRAND.name}.`,
      brandName: PROTECT_BRAND.name,
      paymentCopy: PROTECT_BRAND.paymentCopy,
      microcopy: PROTECT_BRAND.microcopy
    };
  }
  /** @deprecated in-memory scaffold — use protect router + DB */
  createRequest(input) {
    return {
      id: `cf_g_${Date.now()}`,
      orderId: input.orderId,
      userId: input.userId,
      status: "requested",
      requestedAt: (/* @__PURE__ */ new Date()).toISOString(),
      reason: input.reason
    };
  }
  /** @deprecated */
  transition(record, status) {
    return {
      ...record,
      status,
      resolvedAt: status === "approved" || status === "refunded" || status === "denied" || status === "expired" ? (/* @__PURE__ */ new Date()).toISOString() : record.resolvedAt
    };
  }
};
var guaranteeEngine = new GuaranteeEngine();

// server/core/protect/stripe-refund.ts
import Stripe2 from "stripe";
function assertStripeSecretForProtect(options) {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  if (!secret) {
    return { ok: false, errorMessage: "STRIPE_SECRET_KEY n\xE3o configurada" };
  }
  const requireTest = options?.requireTestKey ?? (process.env.CONTENTFY_PROTECT_REQUIRE_TEST_KEY === "true" || process.env.CONTENTFY_PROTECT_HOMOLOGATION === "true" || process.env.NODE_ENV !== "production");
  if (requireTest && !secret.startsWith("sk_test_")) {
    return {
      ok: false,
      errorMessage: "Homologa\xE7\xE3o ContentFy Protect exige STRIPE_SECRET_KEY de teste (sk_test_). Processamento com chave live bloqueado."
    };
  }
  if (!requireTest && secret.startsWith("sk_live_")) {
    console.warn(
      "[ContentFy Protect] Processando reembolso com chave live. Confirme que isto \xE9 intencional."
    );
  }
  return { ok: true, secret };
}
async function processStripeRefund(input) {
  const keyCheck = assertStripeSecretForProtect({
    requireTestKey: input.requireTestKey
  });
  if (!keyCheck.ok) {
    return { ok: false, errorMessage: keyCheck.errorMessage };
  }
  if (!input.paymentIntentId?.startsWith("pi_")) {
    return {
      ok: false,
      errorMessage: "PaymentIntent inv\xE1lido para reembolso"
    };
  }
  if (!Number.isFinite(input.amountCents) || input.amountCents <= 0 || input.amountCents > input.maxAmountCents) {
    return {
      ok: false,
      errorMessage: "Valor de reembolso inv\xE1lido ou acima do valor pago"
    };
  }
  const stripe3 = new Stripe2(keyCheck.secret, {
    apiVersion: "2025-10-29.clover"
  });
  try {
    const pi = await stripe3.paymentIntents.retrieve(input.paymentIntentId, {
      expand: ["latest_charge"]
    });
    if (pi.status !== "succeeded") {
      return {
        ok: false,
        errorMessage: `PaymentIntent n\xE3o eleg\xEDvel (status=${pi.status})`
      };
    }
    const paid = pi.amount_received || pi.amount || 0;
    if (input.amountCents > paid || input.amountCents > input.maxAmountCents) {
      return {
        ok: false,
        errorMessage: "Reembolso acima do valor pago bloqueado"
      };
    }
    const latestCharge = pi.latest_charge;
    const charge = typeof latestCharge === "object" && latestCharge !== null ? latestCharge : null;
    const alreadyRefunded = charge && "amount_refunded" in charge ? Number(charge.amount_refunded ?? 0) : 0;
    if (alreadyRefunded + input.amountCents > paid) {
      return {
        ok: false,
        errorMessage: "PaymentIntent j\xE1 possui reembolso que impediria um novo estorno total/parcial seguro"
      };
    }
    const refund = await stripe3.refunds.create(
      {
        payment_intent: input.paymentIntentId,
        amount: input.amountCents,
        reason: input.reason ?? "requested_by_customer",
        metadata: {
          source: "contentfy_protect",
          idempotencyKey: input.idempotencyKey
        }
      },
      { idempotencyKey: input.idempotencyKey }
    );
    return {
      ok: true,
      providerRefundId: refund.id,
      status: refund.status ?? "succeeded",
      currency: refund.currency,
      amountRefunded: refund.amount
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao processar reembolso";
    console.error("[ContentFy Protect] Stripe refund failed:", message);
    return { ok: false, errorMessage: message };
  }
}

// server/core/ai/ai-engine.ts
var AIEngine = class {
  providers = /* @__PURE__ */ new Map();
  templates = /* @__PURE__ */ new Map();
  history = /* @__PURE__ */ new Map();
  memory = /* @__PURE__ */ new Map();
  registerProvider(provider) {
    this.providers.set(provider.id, provider);
  }
  registerTemplate(template) {
    this.templates.set(template.id, template);
  }
  getTemplate(id) {
    return this.templates.get(id);
  }
  appendHistory(sessionId, message) {
    const list = this.history.get(sessionId) ?? [];
    list.push(message);
    this.history.set(sessionId, list);
    return list;
  }
  getHistory(sessionId) {
    return this.history.get(sessionId) ?? [];
  }
  remember(key, value) {
    this.memory.set(key, value);
  }
  recall(key) {
    return this.memory.get(key);
  }
  productAISlug(productSlug) {
    return `${productSlug}-ai`;
  }
  planAction(action, context) {
    return {
      status: "planned",
      action,
      context: context ?? null
    };
  }
};
var aiEngine = new AIEngine();

// server/core/learn/learn-engine.ts
init_contentfy();

// server/core/learn/catalog.ts
var LEARN_COMPETENCIES = [
  {
    id: "crm",
    name: "CRM",
    description: "Organizar carteira e pipeline com disciplina comercial.",
    category: "Vendas"
  },
  {
    id: "spin-selling",
    name: "SPIN Selling",
    description: "Conduzir descoberta e qualifica\xE7\xE3o com m\xE9todo.",
    category: "Vendas"
  },
  {
    id: "negotiation",
    name: "Negocia\xE7\xE3o",
    description: "Fechar acordos com clareza e valor m\xFAtuo.",
    category: "Vendas"
  },
  {
    id: "prospecting",
    name: "Prospec\xE7\xE3o",
    description: "Abrir oportunidades com consist\xEAncia.",
    category: "Vendas"
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Nutrir relacionamentos at\xE9 a convers\xE3o.",
    category: "Vendas"
  },
  {
    id: "commercial-ai",
    name: "IA Comercial",
    description: "Aplicar IA no dia a dia de vendas e opera\xE7\xE3o.",
    category: "IA"
  },
  {
    id: "portfolio-mgmt",
    name: "Gest\xE3o da Carteira",
    description: "Priorizar clientes e potencial de receita.",
    category: "Vendas"
  },
  {
    id: "emotional-balance",
    name: "Equil\xEDbrio emocional",
    description: "Regular energia e presen\xE7a sob press\xE3o.",
    category: "Bem-estar"
  },
  {
    id: "anxiety",
    name: "Ansiedade",
    description: "Reduzir ru\xEDdo mental e reatividade.",
    category: "Bem-estar"
  },
  {
    id: "focus",
    name: "Foco",
    description: "Concentrar aten\xE7\xE3o no que importa.",
    category: "Produtividade"
  },
  {
    id: "habits",
    name: "H\xE1bitos",
    description: "Construir rotinas sustent\xE1veis.",
    category: "Produtividade"
  },
  {
    id: "wellbeing",
    name: "Bem-estar",
    description: "Cuidar de corpo, mente e ritmo de vida.",
    category: "Bem-estar"
  },
  {
    id: "routine",
    name: "Rotina",
    description: "Estruturar o dia com inten\xE7\xE3o.",
    category: "Produtividade"
  },
  {
    id: "self-knowledge",
    name: "Autoconhecimento",
    description: "Compreender padr\xF5es e motiva\xE7\xF5es pessoais.",
    category: "Desenvolvimento"
  }
];
var LEARN_GOALS = [
  {
    id: "earn-more",
    name: "Ganhar mais dinheiro",
    description: "Aumentar renda com m\xE9todo comercial e execu\xE7\xE3o.",
    competencyIds: [
      "crm",
      "prospecting",
      "negotiation",
      "follow-up",
      "portfolio-mgmt",
      "commercial-ai"
    ],
    iconKey: "earn"
  },
  {
    id: "productivity",
    name: "Melhorar produtividade",
    description: "Fazer mais com foco, h\xE1bitos e rotina.",
    competencyIds: ["focus", "habits", "routine", "emotional-balance"],
    iconKey: "productivity"
  },
  {
    id: "reduce-anxiety",
    name: "Reduzir ansiedade",
    description: "Recuperar equil\xEDbrio e presen\xE7a.",
    competencyIds: [
      "anxiety",
      "emotional-balance",
      "wellbeing",
      "self-knowledge",
      "routine"
    ],
    iconKey: "calm"
  },
  {
    id: "learn-ai",
    name: "Aprender IA",
    description: "Usar intelig\xEAncia artificial com prop\xF3sito comercial.",
    competencyIds: ["commercial-ai", "crm", "prospecting"],
    iconKey: "ai"
  },
  {
    id: "build-business",
    name: "Criar neg\xF3cio",
    description: "Estruturar oferta, opera\xE7\xE3o e crescimento.",
    competencyIds: ["crm", "portfolio-mgmt", "negotiation", "commercial-ai"],
    iconKey: "business"
  },
  {
    id: "organize-routine",
    name: "Organizar rotina",
    description: "Dar ritmo sustent\xE1vel ao dia a dia.",
    competencyIds: ["routine", "habits", "focus", "wellbeing"],
    iconKey: "routine"
  },
  {
    id: "sell-more",
    name: "Vender mais",
    description: "Acelerar pipeline e convers\xE3o.",
    competencyIds: [
      "spin-selling",
      "prospecting",
      "follow-up",
      "negotiation",
      "crm"
    ],
    iconKey: "sales"
  },
  {
    id: "lead",
    name: "Ser l\xEDder",
    description: "Influenciar com clareza, m\xE9todo e presen\xE7a.",
    competencyIds: [
      "self-knowledge",
      "emotional-balance",
      "negotiation",
      "portfolio-mgmt"
    ],
    iconKey: "lead"
  },
  {
    id: "entrepreneur",
    name: "Empreender",
    description: "Construir autonomia e tra\xE7\xE3o.",
    competencyIds: [
      "commercial-ai",
      "crm",
      "habits",
      "focus",
      "portfolio-mgmt"
    ],
    iconKey: "entrepreneur"
  },
  {
    id: "career-change",
    name: "Mudar de carreira",
    description: "Transicionar com compet\xEAncias transfer\xEDveis.",
    competencyIds: [
      "self-knowledge",
      "habits",
      "commercial-ai",
      "prospecting",
      "focus"
    ],
    iconKey: "career"
  }
];
var LEARN_PRODUCT_LINKS = [
  {
    productSlug: "manual-do-representante-comercial",
    competencyIds: [
      "crm",
      "spin-selling",
      "negotiation",
      "prospecting",
      "follow-up",
      "commercial-ai",
      "portfolio-mgmt"
    ],
    weights: {
      crm: 0.9,
      "spin-selling": 0.85,
      negotiation: 0.8,
      prospecting: 0.85,
      "follow-up": 0.75,
      "commercial-ai": 0.9,
      "portfolio-mgmt": 0.85
    },
    goalIds: ["earn-more", "sell-more", "learn-ai", "build-business", "entrepreneur"]
  },
  {
    productSlug: "desacelere",
    competencyIds: [
      "emotional-balance",
      "anxiety",
      "focus",
      "habits",
      "wellbeing",
      "routine",
      "self-knowledge"
    ],
    weights: {
      "emotional-balance": 0.9,
      anxiety: 0.85,
      focus: 0.7,
      habits: 0.8,
      wellbeing: 0.9,
      routine: 0.85,
      "self-knowledge": 0.8
    },
    goalIds: [
      "reduce-anxiety",
      "productivity",
      "organize-routine",
      "career-change"
    ]
  }
];
var LEARN_ACHIEVEMENTS = [
  {
    id: "first_purchase",
    name: "Primeira compra",
    description: "Voc\xEA deu o primeiro passo na ContentFy.",
    tier: "bronze"
  },
  {
    id: "first_lesson",
    name: "Primeira aula",
    description: "In\xEDcio da jornada de evolu\xE7\xE3o.",
    tier: "bronze"
  },
  {
    id: "lessons_10",
    name: "10 aulas",
    description: "Const\xE2ncia come\xE7a a aparecer.",
    tier: "silver"
  },
  {
    id: "course_completed",
    name: "Curso conclu\xEDdo",
    description: "Voc\xEA fechou um ciclo completo de aprendizado.",
    tier: "gold"
  },
  {
    id: "streak_7",
    name: "7 dias consecutivos",
    description: "Ritmo sustent\xE1vel por uma semana.",
    tier: "silver"
  },
  {
    id: "goal_reached",
    name: "Meta atingida",
    description: "Objetivo alcan\xE7ado com compet\xEAncias alinhadas.",
    tier: "gold"
  },
  {
    id: "specialist",
    name: "Especialista",
    description: "Dom\xEDnio avan\xE7ado em um bloco de compet\xEAncias.",
    tier: "platinum"
  },
  {
    id: "top_performer",
    name: "Alta performance",
    description: "\xCDndice de evolu\xE7\xE3o consistentemente elevado.",
    tier: "platinum"
  },
  {
    id: "high_performance",
    name: "Top performance",
    description: "Execu\xE7\xE3o acima da m\xE9dia no seu ritmo.",
    tier: "gold"
  },
  {
    id: "habit_builder",
    name: "Criador de h\xE1bitos",
    description: "H\xE1bitos e rotina em progresso s\xF3lido.",
    tier: "silver"
  }
];

// server/core/learn/achievement-engine.ts
var AchievementEngine = class {
  evaluate(input) {
    const { signals, competencies, goals, successIndex } = input;
    const unlocked = /* @__PURE__ */ new Set();
    if (signals.purchasedAtLeastOnce) unlocked.add("first_purchase");
    if (signals.completedLessonCount >= 1) unlocked.add("first_lesson");
    if (signals.completedLessonCount >= 10) unlocked.add("lessons_10");
    if (signals.coursesCompleted >= 1) unlocked.add("course_completed");
    if (signals.streakDays >= 7) unlocked.add("streak_7");
    if (goals.some((g) => g.progress >= 70)) unlocked.add("goal_reached");
    const masteryCount = competencies.filter(
      (c) => c.level === "mastery" || c.level === "proficient"
    ).length;
    if (masteryCount >= 4) unlocked.add("specialist");
    if (successIndex.overall >= 75) unlocked.add("top_performer");
    if (successIndex.overall >= 60) unlocked.add("high_performance");
    const habit = competencies.find((c) => c.competencyId === "habits");
    const routine = competencies.find((c) => c.competencyId === "routine");
    if (habit && habit.progress >= 40 || routine && routine.progress >= 40) {
      unlocked.add("habit_builder");
    }
    return LEARN_ACHIEVEMENTS.map((def) => ({
      id: def.id,
      name: def.name,
      description: def.description,
      tier: def.tier,
      unlocked: unlocked.has(def.id),
      unlockedAt: unlocked.has(def.id) ? (/* @__PURE__ */ new Date()).toISOString() : void 0
    }));
  }
};
var achievementEngine = new AchievementEngine();

// server/core/learn/learn-engine.ts
init_cache();

// server/core/learn/competency-engine.ts
init_contentfy();
var CompetencyEngine = class {
  constructor(competencies = LEARN_COMPETENCIES, links = LEARN_PRODUCT_LINKS) {
    this.competencies = competencies;
    this.links = links;
  }
  list() {
    return [...this.competencies];
  }
  forProduct(slug) {
    const link = this.links.find((l) => l.productSlug === slug);
    if (!link) return [];
    return link.competencyIds.map((id) => this.competencies.find((c) => c.id === id)).filter((c) => Boolean(c));
  }
  /**
   * Progress on a competency = max over owned products of
   * (productProgress * weight).
   */
  evaluate(signals) {
    const progressByCompetency = /* @__PURE__ */ new Map();
    for (const slug of signals.ownedProductSlugs) {
      const link = this.links.find((l) => l.productSlug === slug);
      if (!link) continue;
      const productProgress = signals.progressBySlug[slug] ?? 0;
      for (const competencyId of link.competencyIds) {
        const weight = link.weights?.[competencyId] ?? 0.7;
        const score = Math.min(100, productProgress * weight);
        const prev = progressByCompetency.get(competencyId) || {
          progress: 0,
          sources: /* @__PURE__ */ new Set()
        };
        prev.progress = Math.max(prev.progress, score);
        prev.sources.add(slug);
        progressByCompetency.set(competencyId, prev);
      }
    }
    return this.competencies.map((c) => {
      const row = progressByCompetency.get(c.id);
      const progress = Math.round(row?.progress ?? 0);
      return {
        competencyId: c.id,
        name: c.name,
        category: c.category,
        level: levelFromProgress(progress),
        progress,
        status: competencyStatusFromProgress(progress),
        sourceProductSlugs: Array.from(row?.sources || [])
      };
    });
  }
  /** Competencies with little movement despite ownership — stagnation heuristic. */
  stagnant(states, signals) {
    return states.filter((s) => {
      if (s.status !== "in_progress") return false;
      if (s.progress >= 55) return false;
      return s.sourceProductSlugs.some(
        (slug) => signals.ownedProductSlugs.includes(slug)
      );
    });
  }
};
var competencyEngine = new CompetencyEngine();

// server/core/learn/goal-engine.ts
var GoalEngine = class {
  constructor(goals = LEARN_GOALS) {
    this.goals = goals;
  }
  list() {
    return [...this.goals];
  }
  get(id) {
    return this.goals.find((g) => g.id === id);
  }
  /**
   * Infer best default goal from owned products' declared goalIds.
   */
  inferActiveGoalId(signals) {
    if (signals.activeGoalId) return signals.activeGoalId;
    const votes = /* @__PURE__ */ new Map();
    for (const slug of signals.ownedProductSlugs) {
      const link = LEARN_PRODUCT_LINKS.find((l) => l.productSlug === slug);
      for (const goalId of link?.goalIds || []) {
        votes.set(goalId, (votes.get(goalId) || 0) + 1);
      }
    }
    const ranked = Array.from(votes.entries()).sort((a, b) => b[1] - a[1]);
    return ranked[0]?.[0] ?? this.goals[0]?.id ?? null;
  }
  evaluate(competencies, signals) {
    const byId = new Map(
      competencies.map((c) => [c.competencyId, c])
    );
    const activeId = this.inferActiveGoalId(signals);
    return this.goals.map((g) => {
      const scores = g.competencyIds.map((id) => byId.get(id)?.progress ?? 0);
      const progress = scores.length === 0 ? 0 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const missingCompetencyIds = g.competencyIds.filter((id) => {
        const c = byId.get(id);
        return !c || c.status === "missing";
      });
      return {
        goalId: g.id,
        name: g.name,
        description: g.description,
        progress,
        isActive: g.id === activeId,
        competencyIds: g.competencyIds,
        missingCompetencyIds
      };
    });
  }
  productsThatAccelerate(goalId) {
    return LEARN_PRODUCT_LINKS.filter(
      (l) => (l.goalIds || []).includes(goalId)
    ).map((l) => l.productSlug);
  }
};
var goalEngine = new GoalEngine();

// server/core/learn/journey-engine.ts
var JourneyEngine = class {
  build(input) {
    const active = input.goals.find((g) => g.isActive) || input.goals[0] || null;
    const steps = [];
    if (active) {
      steps.push({
        id: `goal:${active.goalId}`,
        kind: "goal",
        title: active.name,
        subtitle: active.description,
        status: active.progress >= 70 ? "done" : "current",
        progress: active.progress
      });
      const relevant = input.competencies.filter(
        (c) => active.competencyIds.includes(c.competencyId)
      );
      for (const c of relevant.slice(0, 5)) {
        steps.push({
          id: `comp:${c.competencyId}`,
          kind: "competency",
          title: c.name,
          subtitle: c.category,
          status: c.status === "acquired" ? "done" : c.status === "in_progress" ? "current" : "upcoming",
          progress: c.progress
        });
      }
    }
    for (const slug of input.signals.ownedProductSlugs.slice(0, 4)) {
      const progress = input.signals.progressBySlug[slug] ?? 0;
      steps.push({
        id: `course:${slug}`,
        kind: "course",
        title: input.productNames?.[slug] || slug,
        href: `/produto/${slug}`,
        status: progress >= 100 ? "done" : progress > 0 ? "current" : "upcoming",
        progress
      });
    }
    const unlocked = input.achievements.filter((a) => a.unlocked).slice(-2);
    for (const a of unlocked) {
      steps.push({
        id: `ach:${a.id}`,
        kind: "achievement",
        title: a.name,
        subtitle: a.description,
        status: "done"
      });
    }
    const next = this.nextStep({
      active,
      competencies: input.competencies,
      signals: input.signals,
      productNames: input.productNames
    });
    if (next) {
      steps.push({
        id: "next",
        kind: "next",
        title: next.title,
        subtitle: next.reason,
        href: next.href,
        status: "current"
      });
    }
    const evolutionPercent = active ? active.progress : Math.round(
      input.competencies.reduce((s, c) => s + c.progress, 0) / Math.max(1, input.competencies.length)
    );
    return {
      goalId: active?.goalId ?? null,
      goalName: active?.name ?? null,
      steps,
      evolutionPercent,
      nextStep: next
    };
  }
  nextStep(input) {
    const { signals, active } = input;
    if (signals.lastLesson && (signals.progressBySlug[signals.lastLesson.productSlug] ?? 0) < 100) {
      return {
        kind: "lesson",
        title: signals.lastLesson.lessonTitle ? `Continuar: ${signals.lastLesson.lessonTitle}` : `Continuar ${signals.lastLesson.productName}`,
        reason: "Retome a \xFAltima aula para manter const\xE2ncia.",
        href: signals.lastLesson.href,
        productSlug: signals.lastLesson.productSlug
      };
    }
    if (active) {
      const missing = input.competencies.filter(
        (c) => active.missingCompetencyIds.includes(c.competencyId) || active.competencyIds.includes(c.competencyId) && c.status !== "acquired"
      );
      const stagnant = missing.sort((a, b) => a.progress - b.progress)[0];
      if (stagnant) {
        const accelerator = goalEngine.productsThatAccelerate(active.goalId).find((slug) => !signals.ownedProductSlugs.includes(slug));
        if (accelerator) {
          return {
            kind: "product",
            title: `Acelere com ${input.productNames?.[accelerator] || accelerator}`,
            reason: `Desenvolve a compet\xEAncia ${stagnant.name}.`,
            href: `/produto/${accelerator}`,
            productSlug: accelerator,
            competencyId: stagnant.competencyId,
            goalId: active.goalId
          };
        }
        return {
          kind: "competency",
          title: `Desenvolver: ${stagnant.name}`,
          reason: "Compet\xEAncia cr\xEDtica para o seu objetivo atual.",
          competencyId: stagnant.competencyId,
          goalId: active.goalId
        };
      }
    }
    const catalog = LEARN_PRODUCT_LINKS.map((l) => l.productSlug).find(
      (slug) => !signals.ownedProductSlugs.includes(slug)
    );
    if (catalog) {
      return {
        kind: "course",
        title: `Explorar ${input.productNames?.[catalog] || catalog}`,
        reason: "Pr\xF3ximo produto alinhado ao cat\xE1logo Learn.",
        href: `/produto/${catalog}`,
        productSlug: catalog
      };
    }
    return null;
  }
};
var journeyEngine = new JourneyEngine();

// server/core/learn/skill-graph.ts
var SkillGraph = class {
  build(input) {
    const edges = [];
    const competencyIds = /* @__PURE__ */ new Set();
    const goalIds = /* @__PURE__ */ new Set();
    const productSlugs = /* @__PURE__ */ new Set();
    for (const link of LEARN_PRODUCT_LINKS) {
      productSlugs.add(link.productSlug);
      for (const competencyId of link.competencyIds) {
        competencyIds.add(competencyId);
        edges.push({
          fromType: "product",
          fromId: link.productSlug,
          toType: "competency",
          toId: competencyId,
          weight: link.weights?.[competencyId] ?? 0.7,
          relation: "develops"
        });
      }
      for (const goalId of link.goalIds || []) {
        goalIds.add(goalId);
        edges.push({
          fromType: "product",
          fromId: link.productSlug,
          toType: "goal",
          toId: goalId,
          weight: 0.8,
          relation: "supports_goal"
        });
      }
    }
    for (const g of input.goals) {
      goalIds.add(g.goalId);
      for (const competencyId of g.competencyIds) {
        competencyIds.add(competencyId);
        edges.push({
          fromType: "competency",
          fromId: competencyId,
          toType: "goal",
          toId: g.goalId,
          weight: 1,
          relation: "advances"
        });
      }
    }
    const learnerId = String(input.signals.userId);
    for (const c of input.competencies) {
      if (c.progress <= 0) continue;
      edges.push({
        fromType: "learner",
        fromId: learnerId,
        toType: "competency",
        toId: c.competencyId,
        weight: c.progress / 100,
        relation: "possesses"
      });
    }
    const active = input.goals.find((g) => g.isActive);
    if (active) {
      edges.push({
        fromType: "learner",
        fromId: learnerId,
        toType: "goal",
        toId: active.goalId,
        weight: active.progress / 100,
        relation: "pursues"
      });
    }
    if (active) {
      const related = LEARN_PRODUCT_LINKS.filter(
        (l) => (l.goalIds || []).includes(active.goalId)
      ).map((l) => l.productSlug);
      for (let i = 0; i < related.length - 1; i++) {
        edges.push({
          fromType: "product",
          fromId: related[i],
          toType: "related_product",
          toId: related[i + 1],
          weight: 0.6,
          relation: "journey_next"
        });
      }
    }
    return {
      edges,
      competencyIds: Array.from(competencyIds),
      goalIds: Array.from(goalIds),
      productSlugs: Array.from(productSlugs)
    };
  }
};
var skillGraph = new SkillGraph();

// server/core/learn/learn-engine.ts
function buildSuccessIndex(signals, competencyAvg) {
  const progresses = Object.values(signals.progressBySlug);
  const avgProgress = progresses.length > 0 ? progresses.reduce((a, b) => a + b, 0) / progresses.length : 0;
  const knowledge = Math.max(competencyAvg, avgProgress);
  const application = Math.min(
    100,
    avgProgress * 0.6 + Math.min(signals.completedLessonCount * 4, 40)
  );
  const consistency = Math.min(
    100,
    signals.streakDays * 12 + Math.min(signals.totalLessonTouches * 2, 30)
  );
  const result = Math.min(
    100,
    signals.coursesCompleted * 35 + (competencyAvg >= 70 ? 25 : competencyAvg >= 40 ? 12 : 0)
  );
  return computeSuccessIndex({
    knowledge,
    application,
    consistency,
    result
  });
}
function buildTimeline(input) {
  const events = [];
  const now = Date.now();
  if (input.signals.purchasedAtLeastOnce) {
    events.push({
      id: "purchase",
      at: new Date(now - 864e5 * 14).toISOString(),
      kind: "purchase",
      title: "Ingresso na jornada",
      subtitle: "Acesso aos produtos ContentFy"
    });
  }
  if (input.signals.lastLesson) {
    events.push({
      id: "last-lesson",
      at: (/* @__PURE__ */ new Date()).toISOString(),
      kind: "lesson",
      title: input.signals.lastLesson.lessonTitle || "Aula recente",
      subtitle: input.signals.lastLesson.productName
    });
  }
  for (const a of input.achievements.filter((x) => x.unlocked).slice(-4)) {
    events.push({
      id: `ach-${a.id}`,
      at: a.unlockedAt || (/* @__PURE__ */ new Date()).toISOString(),
      kind: "achievement",
      title: a.name,
      subtitle: a.description
    });
  }
  const active = input.goals.find((g) => g.isActive);
  if (active) {
    events.push({
      id: `goal-${active.goalId}`,
      at: (/* @__PURE__ */ new Date()).toISOString(),
      kind: "goal",
      title: `Objetivo: ${active.name}`,
      subtitle: `${active.progress}% de evolu\xE7\xE3o`
    });
  }
  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}
var LearnEngine = class {
  buildTrail(root) {
    return root;
  }
  recommendNext(hint) {
    return {
      ...hint,
      recommendedNext: [],
      reason: "Use learn.dashboard / learn.nextStep para recomenda\xE7\xF5es baseadas em compet\xEAncias."
    };
  }
  buildDashboard(input) {
    const cacheKey = `learn:dashboard:${input.signals.userId}:${input.signals.activeGoalId || "auto"}`;
    const cached = learnCacheGet(cacheKey);
    if (cached) return { ...cached, cacheHit: true };
    const competencies = competencyEngine.evaluate(input.signals);
    const goals = goalEngine.evaluate(competencies, input.signals);
    const competencyAvg = competencies.reduce((s, c) => s + c.progress, 0) / Math.max(1, competencies.length);
    const successIndex = buildSuccessIndex(input.signals, competencyAvg);
    const achievements = achievementEngine.evaluate({
      signals: input.signals,
      competencies,
      goals,
      successIndex
    });
    const journey = journeyEngine.build({
      goals,
      competencies,
      achievements,
      signals: input.signals,
      productNames: input.productNames
    });
    const acquired = competencies.filter((c) => c.status === "acquired");
    const inProgress = competencies.filter((c) => c.status === "in_progress");
    const missing = competencies.filter((c) => c.status === "missing");
    const activeGoal = goals.find((g) => g.isActive) || null;
    const relatedSlugs = activeGoal ? goalEngine.productsThatAccelerate(activeGoal.goalId) : LEARN_PRODUCT_LINKS.map((l) => l.productSlug);
    const relatedCourses = relatedSlugs.slice(0, 6).map((slug) => ({
      slug,
      name: input.productNames?.[slug] || slug,
      href: `/produto/${slug}`,
      reason: activeGoal ? `Alinhado ao objetivo ${activeGoal.name}` : "Cat\xE1logo Learn"
    }));
    const payload = {
      activeGoal,
      goals,
      competencies: { acquired, inProgress, missing },
      journey,
      timeline: buildTimeline({
        signals: input.signals,
        achievements,
        goals
      }),
      achievements,
      nextStep: journey.nextStep,
      successIndex,
      evolutionPercent: journey.evolutionPercent,
      relatedCourses,
      personalized: true,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheHit: false
    };
    void skillGraph.build({
      signals: input.signals,
      competencies,
      goals
    });
    learnCacheSet(cacheKey, payload, 45e3);
    return payload;
  }
  stagnantCompetencies(signals) {
    const states = competencyEngine.evaluate(signals);
    return competencyEngine.stagnant(states, signals);
  }
  listGoals() {
    return goalEngine.list();
  }
  listCompetencies() {
    return competencyEngine.list();
  }
  catalogGoals() {
    return LEARN_GOALS;
  }
};
var learnEngine = new LearnEngine();

// server/core/learn/index.ts
init_cache();

// server/core/insight/insight-engine.ts
var InsightEngine = class {
  emptyDashboard(audience) {
    return {
      audience,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      metrics: [
        { key: "conversion", label: "Convers\xE3o", value: 0, unit: "percent" },
        { key: "engagement", label: "Engajamento", value: 0, unit: "percent" },
        { key: "retention", label: "Reten\xE7\xE3o", value: 0, unit: "percent" },
        { key: "completion", label: "Conclus\xE3o", value: 0, unit: "percent" },
        { key: "revenue", label: "Receita", value: 0, unit: "currency" },
        { key: "ltv", label: "Lifetime Value", value: 0, unit: "currency" }
      ]
    };
  }
};
var insightEngine = new InsightEngine();

// server/core/discovery/discovery-engine.ts
init_contentfy();
init_cache5();

// server/core/discovery/category-engine.ts
var COLLECTION_TO_RAIL = {
  launches: "launches",
  featured: "featured",
  start_here: "start_here",
  ai: "ai",
  business: "business",
  sales_rep: "sales_rep",
  personal_dev: "personal_dev",
  productivity: "productivity",
  buildertudo: "buildertudo",
  bestsellers: "bestsellers"
};
var CATEGORY_ALIASES = {
  ia: ["ai"],
  "intelig\xEAncia artificial": ["ai"],
  neg\u00F3cios: ["business"],
  negocios: ["business"],
  "representa\xE7\xE3o comercial": ["sales_rep"],
  "representacao comercial": ["sales_rep"],
  "desenvolvimento pessoal": ["personal_dev"],
  "bem-estar": ["personal_dev"],
  produtividade: ["productivity"],
  buildertudo: ["buildertudo"]
};
var CategoryEngine = class {
  byCollection(catalog, collection, limit = 12) {
    const key = collection.toLowerCase();
    return catalog.filter((p) => p.collections.some((c) => c.toLowerCase() === key)).slice(0, limit);
  }
  byCategoryName(catalog, category, limit = 12) {
    const q = category.trim().toLowerCase();
    if (!q) return [];
    return catalog.filter(
      (p) => p.category.toLowerCase().includes(q) || (p.subcategory || "").toLowerCase().includes(q) || p.tags.some((t2) => t2.toLowerCase().includes(q))
    ).slice(0, limit);
  }
  railItems(catalog, railId, limit = 12) {
    const byCollection = this.byCollection(catalog, railId, limit);
    if (byCollection.length) return byCollection;
    for (const [alias, rails] of Object.entries(CATEGORY_ALIASES)) {
      if (rails.includes(railId)) {
        const found = this.byCategoryName(catalog, alias, limit);
        if (found.length) return found;
      }
    }
    if (railId === "start_here") {
      return catalog.filter((p) => p.isBeginnerFriendly).slice(0, limit);
    }
    if (railId === "featured") {
      return catalog.filter((p) => p.isFeatured).slice(0, limit);
    }
    if (railId === "launches") {
      return catalog.filter((p) => p.isLaunch).slice(0, limit);
    }
    return [];
  }
  collectionRailId(collection) {
    return COLLECTION_TO_RAIL[collection] ?? null;
  }
};
var categoryEngine = new CategoryEngine();

// server/core/discovery/continue-learning-engine.ts
var ContinueLearningEngine = class {
  build(items, limit = 8) {
    const mapped = items.map((item) => {
      const total = Math.max(item.totalLessons, 1);
      const progressPercent = Math.min(
        100,
        Math.round(item.completedLessons / total * 100)
      );
      const remaining = Math.max(0, total - item.completedLessons);
      return {
        productSlug: item.productSlug,
        productId: item.productId,
        productName: item.productName,
        lastLessonTitle: item.lastLessonTitle,
        lastModuleTitle: item.lastModuleTitle,
        progressPercent,
        remainingLabel: remaining === 0 ? "Conclu\xEDdo" : `${remaining} aula${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}`,
        href: `/my-account/course/${item.productId}`,
        coverImage: item.coverImage,
        _sort: item.lastWatchedAt ? new Date(item.lastWatchedAt).getTime() : 0
      };
    }).filter((i) => i.progressPercent < 100).sort((a, b) => b._sort - a._sort).slice(0, limit);
    return mapped.map(({ _sort: _, ...rest }) => rest);
  }
};
var continueLearningEngine = new ContinueLearningEngine();

// server/core/discovery/seed-relationships.ts
var DISCOVERY_RELATIONSHIP_SEED = [
  // Representação comercial trail
  {
    fromSlug: "manual-do-representante-comercial",
    toSlug: "rep4crm",
    type: "next",
    weight: 10,
    label: "Rep4CRM"
  },
  {
    fromSlug: "rep4crm",
    toSlug: "prompt-pack-comercial",
    type: "next",
    weight: 9,
    label: "Prompt Pack Comercial"
  },
  {
    fromSlug: "prompt-pack-comercial",
    toSlug: "planilhas-comerciais",
    type: "next",
    weight: 8,
    label: "Planilhas"
  },
  {
    fromSlug: "planilhas-comerciais",
    toSlug: "consultoria-comercial",
    type: "upsell",
    weight: 7,
    label: "Consultoria"
  },
  {
    fromSlug: "consultoria-comercial",
    toSlug: "crm-premium",
    type: "upsell",
    weight: 6,
    label: "CRM Premium"
  },
  // Bem-estar trail
  {
    fromSlug: "desacelere",
    toSlug: "ansiedade",
    type: "next",
    weight: 10,
    label: "Ansiedade"
  },
  {
    fromSlug: "ansiedade",
    toSlug: "sono",
    type: "next",
    weight: 9,
    label: "Sono"
  },
  {
    fromSlug: "sono",
    toSlug: "produtividade",
    type: "next",
    weight: 8,
    label: "Produtividade"
  },
  {
    fromSlug: "produtividade",
    toSlug: "habitos",
    type: "next",
    weight: 7,
    label: "H\xE1bitos"
  },
  {
    fromSlug: "habitos",
    toSlug: "mindfulness",
    type: "companion",
    weight: 6,
    label: "Mindfulness"
  }
];
function getSeedRelationshipsFrom(fromSlug) {
  return DISCOVERY_RELATIONSHIP_SEED.filter((r) => r.fromSlug === fromSlug).sort(
    (a, b) => b.weight - a.weight
  );
}
function walkRelationshipChain(startSlug, maxDepth = 8) {
  const chain = [startSlug];
  let current = startSlug;
  const seen = /* @__PURE__ */ new Set([startSlug]);
  for (let i = 0; i < maxDepth; i++) {
    const next = getSeedRelationshipsFrom(current).find(
      (r) => r.type === "next" || r.type === "upsell"
    );
    if (!next || seen.has(next.toSlug)) break;
    chain.push(next.toSlug);
    seen.add(next.toSlug);
    current = next.toSlug;
  }
  return chain;
}

// server/core/discovery/relationship-engine.ts
var RelationshipEngine = class {
  constructor(extra = []) {
    this.extra = extra;
  }
  allFrom(fromSlug) {
    return [...getSeedRelationshipsFrom(fromSlug), ...this.extra.filter((r) => r.fromSlug === fromSlug)].sort((a, b) => b.weight - a.weight);
  }
  relatedSlugs(fromSlug, limit = 8) {
    return this.allFrom(fromSlug).map((r) => r.toSlug).filter((slug, i, arr) => arr.indexOf(slug) === i).slice(0, limit);
  }
  chain(fromSlug, maxDepth = 8) {
    const seeded = walkRelationshipChain(fromSlug, maxDepth);
    if (seeded.length > 1) return seeded;
    return [fromSlug, ...this.relatedSlugs(fromSlug, maxDepth - 1)];
  }
  /** Score candidate by graph proximity to owned/viewed slugs. */
  scoreByGraph(candidateSlug, anchors) {
    let score = 0;
    for (const anchor of anchors) {
      if (anchor === candidateSlug) continue;
      const related = this.relatedSlugs(anchor, 12);
      const idx = related.indexOf(candidateSlug);
      if (idx >= 0) score += Math.max(1, 10 - idx);
      const chain = this.chain(anchor, 6);
      const cIdx = chain.indexOf(candidateSlug);
      if (cIdx > 0) score += Math.max(1, 12 - cIdx);
    }
    return score;
  }
  enrichMeta(meta, slug) {
    return meta.find((m) => m.slug === slug);
  }
};
var relationshipEngine = new RelationshipEngine();

// server/core/discovery/recommendation-service.ts
function mergeCatalogMeta(products2, seedMeta, dbMeta = []) {
  const bySlug = /* @__PURE__ */ new Map();
  for (const m of seedMeta) bySlug.set(m.slug, { ...m });
  for (const m of dbMeta) {
    const prev = bySlug.get(m.slug);
    bySlug.set(m.slug, prev ? { ...prev, ...m } : { ...m });
  }
  for (const p of products2) {
    if (!p.slug) continue;
    const prev = bySlug.get(p.slug);
    const type = p.type || prev?.type || "ebook";
    bySlug.set(p.slug, {
      slug: p.slug,
      productId: p.id ?? prev?.productId ?? null,
      tags: prev?.tags ?? [],
      category: prev?.category || p.categoryName || "Geral",
      subcategory: prev?.subcategory,
      level: prev?.level,
      duration: prev?.duration,
      type,
      author: prev?.author,
      collections: prev?.collections ?? [],
      keywords: prev?.keywords ?? [],
      objectives: prev?.objectives ?? [],
      audience: prev?.audience ?? [],
      skills: prev?.skills ?? [],
      isFeatured: prev?.isFeatured,
      isLaunch: prev?.isLaunch,
      isBeginnerFriendly: prev?.isBeginnerFriendly
    });
  }
  return Array.from(bySlug.values());
}
function toCardModel(meta, product, extras) {
  const slug = meta.slug;
  const name = product?.name || slug;
  const typeLabel = meta.type === "ebook" ? "E-book" : meta.type === "course" ? "Curso" : meta.type === "audiobook" ? "Audiobook" : meta.type === "app" ? "App" : String(meta.type);
  return {
    id: product?.id != null ? String(product.id) : `slug:${slug}`,
    slug,
    name,
    type: String(meta.type),
    typeLabel,
    category: meta.category,
    tags: meta.tags,
    author: meta.author,
    coverImage: product?.coverImage || product?.thumbnailImage || null,
    priceCents: product?.price ?? null,
    level: meta.level ? String(meta.level) : void 0,
    duration: meta.duration,
    href: product?.id ? `/produto/${slug}` : `/produto/${slug}`,
    ...extras
  };
}
var RecommendationService = class {
  recommend(profile, catalog, excludeSlugs = /* @__PURE__ */ new Set()) {
    const anchors = [
      ...profile.recentViewSlugs,
      ...profile.favoriteSlugs
    ].filter((s, i, a) => a.indexOf(s) === i);
    const scores = /* @__PURE__ */ new Map();
    for (const item of catalog) {
      if (excludeSlugs.has(item.slug)) continue;
      let score = 0;
      score += relationshipEngine.scoreByGraph(item.slug, anchors) * 3;
      for (const pref of profile.preferences) {
        const p = pref.toLowerCase();
        if (item.category.toLowerCase().includes(p)) score += 5;
        if (item.tags.some((t2) => t2.toLowerCase().includes(p))) score += 3;
        if (item.skills.some((s) => s.toLowerCase().includes(p))) score += 2;
      }
      for (const goal of profile.goals) {
        const g = goal.toLowerCase();
        if (item.objectives.some((o) => o.toLowerCase().includes(g))) score += 4;
        if (item.keywords.some((k) => k.toLowerCase().includes(g))) score += 2;
      }
      for (const q of profile.recentSearchQueries) {
        const qq = q.toLowerCase();
        if (item.tags.some((t2) => t2.toLowerCase().includes(qq))) score += 2;
        if (item.keywords.some((k) => k.toLowerCase().includes(qq))) score += 2;
        if (item.category.toLowerCase().includes(qq)) score += 2;
      }
      if (anchors.length === 0 && item.isFeatured) score += 2;
      if (anchors.length === 0 && item.isBeginnerFriendly) score += 1;
      if (score > 0) scores.set(item.slug, score);
    }
    const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]).map(([slug]) => slug);
    if (ranked.length === 0) {
      const fallback = categoryEngine.railItems(catalog, "featured", 12).map((m) => m.slug);
      return {
        productIds: [],
        productSlugs: fallback,
        strategy: "fallback",
        reason: "Cat\xE1logo editorial \u2014 perfil ainda sem sinais suficientes."
      };
    }
    const strategy = anchors.length > 0 ? "behavior" : profile.goals.length > 0 ? "goals" : "related";
    return {
      productIds: [],
      productSlugs: ranked.slice(0, 12),
      strategy,
      reason: strategy === "behavior" ? "Relacionamentos e comportamento recente." : strategy === "goals" ? "Alinhado aos objetivos informados." : "Produtos relacionados ao seu hist\xF3rico.",
      scoreBySlug: Object.fromEntries(scores)
    };
  }
};
var recommendationService = new RecommendationService();

// server/core/discovery/discovery-engine.ts
init_seed_metadata();

// server/core/discovery/trending-engine.ts
init_contentfy();
var TrendingEngine = class {
  scoreOne(signals) {
    const score = computeTrendingScore(signals);
    return {
      slug: signals.slug,
      score,
      views: signals.views,
      purchases: signals.purchases,
      favorites: signals.favorites,
      ratings: signals.ratings,
      recentGrowth: signals.recentGrowth
    };
  }
  rank(signals, limit = 12) {
    return signals.map((s) => this.scoreOne(s)).sort((a, b) => b.score - a.score).slice(0, limit);
  }
  /**
   * When behavioral data is sparse, boost launches/featured as soft trending.
   */
  withEditorialFallback(ranked, editorialSlugs, limit = 12) {
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
      recentGrowth: 0
    }));
  }
};
var trendingEngine = new TrendingEngine();

// server/core/discovery/discovery-engine.ts
function cardsForSlugs(slugs, meta, products2, reason) {
  const productBySlug = new Map(products2.map((p) => [p.slug, p]));
  const metaBySlug = new Map(meta.map((m) => [m.slug, m]));
  const out = [];
  for (const slug of slugs) {
    const m = metaBySlug.get(slug);
    if (!m) continue;
    out.push(
      toCardModel(m, productBySlug.get(slug), reason ? { reason } : void 0)
    );
  }
  return out;
}
function uniqueSlugs(lists, limit) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const list of lists) {
    for (const slug of list) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(slug);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
var DiscoveryEngine = class {
  buildCatalog(input) {
    return mergeCatalogMeta(
      input.products,
      listSeedMeta(),
      input.dbMeta || []
    );
  }
  recommend(profile) {
    const catalog = listSeedMeta();
    return recommendationService.recommend(profile, catalog);
  }
  search(query, input, limit = 24) {
    const catalog = this.buildCatalog(input);
    const productBySlug = new Map(input.products.map((p) => [p.slug, p]));
    const hits = catalog.map((m) => {
      const product = productBySlug.get(m.slug);
      const { score, matchedOn } = scoreDiscoverySearch(query, {
        name: product?.name || m.slug,
        author: m.author,
        category: m.category,
        subcategory: m.subcategory,
        tags: m.tags,
        keywords: m.keywords,
        objectives: m.objectives
      });
      return {
        slug: m.slug,
        name: product?.name || m.slug,
        score,
        matchedOn,
        href: `/produto/${m.slug}`,
        category: m.category,
        tags: m.tags,
        author: m.author
      };
    }).filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
    return { query, hits, total: hits.length };
  }
  related(slug, input, limit = 8) {
    const catalog = this.buildCatalog(input);
    const chain = relationshipEngine.chain(slug, limit + 1).slice(1);
    const related = relationshipEngine.relatedSlugs(slug, limit);
    const slugs = uniqueSlugs([chain, related], limit);
    return cardsForSlugs(slugs, catalog, input.products, "Relacionado");
  }
  buildHome(input) {
    const userKey = input.profile?.userId ?? "anon";
    const cacheKey = `discovery:home:${userKey}`;
    const cached = discoveryCacheGet(cacheKey);
    if (cached) return { ...cached, cacheHit: true };
    const catalog = this.buildCatalog(input);
    const productBySlug = new Map(input.products.map((p) => [p.slug, p]));
    const profile = input.profile;
    const personalized = Boolean(profile && profile.userId > 0);
    const exclude = /* @__PURE__ */ new Set();
    if (profile) {
      for (const s of profile.favoriteSlugs) exclude.add(s);
    }
    const continueLearning = continueLearningEngine.build(
      input.progress || [],
      8
    );
    const recommended = profile ? recommendationService.recommend(profile, catalog) : {
      productSlugs: categoryEngine.railItems(catalog, "featured", 12).map((m) => m.slug),
      strategy: "fallback",
      reason: "Visitante \u2014 destaque editorial.",
      productIds: []
    };
    const trendingRaw = trendingEngine.rank(input.trendingSignals || [], 12);
    const editorial = catalog.filter((m) => m.isFeatured || m.isLaunch).map((m) => m.slug);
    const trending = trendingEngine.withEditorialFallback(
      trendingRaw,
      editorial,
      12
    );
    const favoriteSlugs = input.favoriteSlugs || profile?.favoriteSlugs || [];
    const railBuilders = [];
    for (const def of DISCOVERY_RAIL_DEFS) {
      let slugs = [];
      switch (def.id) {
        case "continue_learning":
          continue;
        case "recommended":
          slugs = recommended.productSlugs;
          break;
        case "favorites":
          slugs = favoriteSlugs;
          break;
        case "bestsellers":
        case "trending":
          slugs = trending.map((t2) => t2.slug);
          break;
        default:
          slugs = categoryEngine.railItems(catalog, def.id, 12).map((m) => m.slug);
          break;
      }
      slugs = slugs.filter(
        (s) => catalog.some((m) => m.slug === s) || productBySlug.has(s)
      );
      if (!slugs.length) continue;
      railBuilders.push({
        id: def.id,
        title: def.title,
        subtitle: def.subtitle,
        slugs
      });
    }
    const heroMeta = catalog.find((m) => m.isLaunch && m.isFeatured) || catalog.find((m) => m.isFeatured) || catalog[0] || null;
    const hero = heroMeta ? toCardModel(heroMeta, productBySlug.get(heroMeta.slug)) : null;
    const payload = {
      hero,
      rails: railBuilders.map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        items: cardsForSlugs(r.slugs, catalog, input.products)
      })),
      continueLearning,
      personalized,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheHit: false
    };
    discoveryCacheSet(cacheKey, payload, personalized ? 3e4 : 9e4);
    return payload;
  }
};
var discoveryEngine = new DiscoveryEngine();

// server/core/discovery/index.ts
init_cache5();
init_seed_metadata();

// server/core/success-score/success-score-engine.ts
init_contentfy();
var SuccessScoreEngine = class {
  compute(input) {
    return computeSuccessScore(input);
  }
};
var successScoreEngine = new SuccessScoreEngine();

// server/core/success/success-engine.ts
init_cache2();

// server/core/success/config.ts
init_contentfy();
function deepMergeConfig(base, patch) {
  return {
    weights: { ...base.weights, ...patch.weights },
    targets: { ...base.targets, ...patch.targets },
    gradeThresholds: { ...base.gradeThresholds, ...patch.gradeThresholds },
    habitMilestones: patch.habitMilestones ?? base.habitMilestones,
    consistencyBands: {
      ...base.consistencyBands,
      ...patch.consistencyBands
    }
  };
}
function resolveSuccessScoreConfig(override) {
  let fromEnv = {};
  const raw = process.env.SUCCESS_SCORE_CONFIG_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw);
    } catch {
      console.warn(
        "[ContentFy Success] SUCCESS_SCORE_CONFIG_JSON inv\xE1lido \u2014 usando defaults."
      );
    }
  }
  return deepMergeConfig(
    deepMergeConfig(DEFAULT_SUCCESS_SCORE_CONFIG, fromEnv),
    override || {}
  );
}

// server/core/success/consistency-engine.ts
init_contentfy();
var ConsistencyEngine = class {
  constructor(config = resolveSuccessScoreConfig()) {
    this.config = config;
  }
  evaluate(signals) {
    const t2 = this.config.targets;
    const frequency = clampScore(
      signals.activeDays / Math.max(1, t2.activeDays) * 100
    );
    const regularity = clampScore(
      signals.streakDays / Math.max(1, t2.streakDays) * 100
    );
    const score = clampScore(frequency * 0.6 + regularity * 0.4);
    let trend = "flat";
    if (signals.weeklyDeltaPercent > 3) trend = "up";
    else if (signals.weeklyDeltaPercent < -3) trend = "down";
    const bands = this.config.consistencyBands;
    let band = "fair";
    if (score >= bands.excellent) band = "excellent";
    else if (score >= bands.good) band = "good";
    else if (score < bands.declining) band = "declining";
    if (trend === "down" && band !== "excellent") {
      band = "declining";
    }
    return {
      band,
      score,
      frequency,
      regularity,
      trend,
      label: bandLabel(band)
    };
  }
};
function bandLabel(band) {
  switch (band) {
    case "excellent":
      return "Excelente";
    case "good":
      return "Boa";
    case "declining":
      return "Em queda";
    default:
      return "Regular";
  }
}
var consistencyEngine = new ConsistencyEngine();

// server/core/success/evolution-engine.ts
var EvolutionEngine = class {
  monthly(signals) {
    if (signals.monthlyEvolution.length) {
      return signals.monthlyEvolution.map((m) => ({
        key: m.month,
        label: m.label,
        value: m.value
      }));
    }
    const base = Math.max(8, Math.round(signals.avgProgress * 0.4));
    return [
      { key: "m1", label: "In\xEDcio", value: Math.min(100, base) },
      {
        key: "m2",
        label: "Recente",
        value: Math.min(100, Math.round(signals.avgProgress * 0.7))
      },
      {
        key: "m3",
        label: "Atual",
        value: Math.min(100, Math.round(signals.avgProgress))
      }
    ];
  }
  weekly(signals) {
    const current = Math.min(100, Math.round(signals.avgProgress));
    const prev = Math.max(
      0,
      current - Math.round(signals.weeklyDeltaPercent)
    );
    return [
      { key: "w-prev", label: "Semana anterior", value: prev },
      { key: "w-now", label: "Esta semana", value: current }
    ];
  }
  series(signals) {
    return this.monthly(signals);
  }
};
var evolutionEngine = new EvolutionEngine();

// server/core/success/goal-progress-engine.ts
var GoalProgressEngine = class {
  build(input) {
    const unlockedAchievements = input.achievements.filter((a) => a.unlocked).map((a) => a.id);
    return input.goals.map((g) => {
      const courseSlugs = LEARN_PRODUCT_LINKS.filter(
        (l) => (l.goalIds || []).includes(g.goalId)
      ).map((l) => l.productSlug);
      const nextStep = g.isActive && input.nextStep ? input.nextStep.title : g.missingCompetencyIds[0] ? `Desenvolver compet\xEAncia pendente` : g.progress >= 70 ? "Objetivo quase conclu\xEDdo" : null;
      return {
        goalId: g.goalId,
        goalName: g.name,
        progress: g.progress,
        competencyIds: g.competencyIds,
        courseSlugs,
        achievementIds: unlockedAchievements.slice(0, 3),
        nextStep,
        nextStepHref: g.isActive && input.nextStep?.href ? input.nextStep.href : null
      };
    });
  }
};
var goalProgressEngine = new GoalProgressEngine();

// server/core/success/habit-engine.ts
var HabitEngine = class {
  constructor(config = resolveSuccessScoreConfig()) {
    this.config = config;
  }
  evaluate(streakDays) {
    const milestones = this.config.habitMilestones.map(
      (days) => {
        const progress = Math.min(100, Math.round(streakDays / days * 100));
        return {
          days,
          name: `${days} dias`,
          reached: streakDays >= days,
          progress
        };
      }
    );
    const next = milestones.find((m) => !m.reached);
    const label = next ? `Pr\xF3ximo marco: ${next.days} dias` : "Todos os marcos de h\xE1bito alcan\xE7ados";
    return {
      currentStreakDays: Math.max(0, streakDays),
      milestones,
      label
    };
  }
};
var habitEngine = new HabitEngine();

// server/core/success/recommendation-score.ts
var RecommendationScore = class {
  rank(input) {
    const owned = new Set(input.signals.ownedProductSlugs);
    const recs = [];
    if (input.signals.nextStepTitle) {
      recs.push({
        id: "next-action",
        title: input.signals.nextStepTitle,
        reason: input.signals.nextStepReason || "Pr\xF3ximo passo da jornada Learn",
        href: input.signals.nextStepHref || void 0,
        score: 100
      });
    }
    for (const link of LEARN_PRODUCT_LINKS) {
      if (owned.has(link.productSlug)) continue;
      let score = 40;
      if (input.signals.activeGoalId && link.goalIds?.includes(input.signals.activeGoalId)) {
        score += 35;
      }
      const overlapsStagnant = link.competencyIds.some(
        (id) => input.stagnantIds.includes(id)
      );
      if (overlapsStagnant) score += 25;
      if (input.score.pillars.knowledge < 50) score += 10;
      recs.push({
        id: `product:${link.productSlug}`,
        title: input.productNames?.[link.productSlug] || link.productSlug,
        reason: overlapsStagnant ? "Acelera compet\xEAncias estagnadas" : "Alinhado ao seu objetivo de evolu\xE7\xE3o",
        href: `/produto/${link.productSlug}`,
        productSlug: link.productSlug,
        score
      });
    }
    return recs.sort((a, b) => b.score - a.score).slice(0, 8);
  }
};
var recommendationScore = new RecommendationScore();

// server/core/success/score-engine.ts
init_contentfy();
function ratioToScore(value, target) {
  if (target <= 0) return 0;
  return clampScore(value / target * 100);
}
var ScoreEngine = class _ScoreEngine {
  constructor(config = resolveSuccessScoreConfig()) {
    this.config = config;
  }
  withConfig(config) {
    return new _ScoreEngine(resolveSuccessScoreConfig(config));
  }
  getConfig() {
    return this.config;
  }
  pillars(signals) {
    const t2 = this.config.targets;
    const knowledge = clampScore(
      ratioToScore(signals.modulesCompleted, t2.modulesCompleted) * 0.7 + (signals.modulesTotal > 0 ? signals.modulesCompleted / signals.modulesTotal * 100 * 0.3 : signals.avgProgress * 0.3)
    );
    const application = ratioToScore(
      signals.applicationTasks,
      t2.applicationTasks
    );
    const consistency = clampScore(
      ratioToScore(signals.activeDays, t2.activeDays) * 0.55 + ratioToScore(signals.streakDays, t2.streakDays) * 0.45
    );
    const result = clampScore(
      ratioToScore(signals.goalsCompleted, t2.goalsCompleted) * 0.45 + ratioToScore(
        signals.competenciesAcquired,
        t2.competenciesAcquired
      ) * 0.55
    );
    return { knowledge, application, consistency, result };
  }
  compute(signals) {
    const pillars = this.pillars(signals);
    const weights = normalizeWeights(this.config.weights);
    const weighted = clampScore(
      pillars.knowledge * weights.knowledge + pillars.application * weights.application + pillars.consistency * weights.consistency + pillars.result * weights.result
    );
    const grade = gradeFromScore(weighted, this.config.gradeThresholds);
    return {
      score: weighted,
      grade,
      pillars,
      weightsUsed: weights,
      label: gradeLabel(grade)
    };
  }
};
function gradeLabel(grade) {
  switch (grade) {
    case "master":
      return "Transforma\xE7\xE3o avan\xE7ada";
    case "rise":
      return "Evolu\xE7\xE3o s\xF3lida";
    case "grow":
      return "Em crescimento";
    default:
      return "In\xEDcio da jornada";
  }
}
var scoreEngine = new ScoreEngine();

// server/core/success/success-engine.ts
function buildInsights(signals, score, goals, stagnant) {
  const insights = [];
  const weekly = Math.round(signals.weeklyDeltaPercent);
  if (weekly !== 0) {
    insights.push({
      id: "weekly",
      kind: "weekly_evolution",
      title: weekly > 0 ? "Voc\xEA evoluiu" : "Ritmo em ajuste",
      body: weekly > 0 ? `Voc\xEA evoluiu ${weekly}% esta semana.` : `Varia\xE7\xE3o de ${weekly}% esta semana \u2014 retome o pr\xF3ximo passo.`,
      metric: Math.abs(weekly),
      unit: "%"
    });
  }
  const active = goals.find((g) => g.isActive);
  if (active) {
    insights.push({
      id: "goal",
      kind: "goal_progress",
      title: "Progresso do objetivo",
      body: `Voc\xEA concluiu ${active.progress}% do objetivo \u201C${active.name}\u201D.`,
      metric: active.progress,
      unit: "%"
    });
    const left = active.missingCompetencyIds.length;
    if (left > 0) {
      insights.push({
        id: "comps-left",
        kind: "competencies_left",
        title: "Quase l\xE1",
        body: `Mais ${left} compet\xEAncia${left === 1 ? "" : "s"} e voc\xEA conclui sua jornada.`,
        metric: left
      });
    }
  }
  if (stagnant.length > 0) {
    insights.push({
      id: "stagnant",
      kind: "stagnant",
      title: "Compet\xEAncia estagnada",
      body: `${stagnant[0].name} precisa de aten\xE7\xE3o para acelerar seu sucesso.`,
      metric: stagnant[0].progress,
      unit: "%"
    });
  }
  if (signals.streakDays >= 7) {
    insights.push({
      id: "habit",
      kind: "habit",
      title: "Const\xE2ncia",
      body: `${signals.streakDays} dias de ritmo \u2014 h\xE1bito em forma\xE7\xE3o.`,
      metric: signals.streakDays,
      unit: "dias"
    });
  }
  if (score.pillars.consistency >= 50 && score.pillars.knowledge >= 40) {
    insights.push({
      id: "morning",
      kind: "morning_hint",
      title: "Padr\xE3o de desempenho",
      body: "Seu melhor desempenho tende a ocorrer em blocos focados \u2014 priorize sess\xF5es curtas e regulares."
    });
  }
  return insights.slice(0, 6);
}
var SuccessEngine = class {
  constructor(config = resolveSuccessScoreConfig()) {
    this.config = config;
  }
  buildDashboard(input) {
    const cfg = resolveSuccessScoreConfig({
      ...this.config,
      ...input.config
    });
    const cacheKey = `success:dashboard:${input.signals.userId}`;
    const cached = successCacheGet(cacheKey);
    if (cached) return { ...cached, cacheHit: true };
    const score = new ScoreEngine(cfg).compute(input.signals);
    const habits = new HabitEngine(cfg).evaluate(input.signals.streakDays);
    const consistency = new ConsistencyEngine(cfg).evaluate(input.signals);
    const goals = goalProgressEngine.build({
      goals: input.goals,
      competencies: input.competencies,
      achievements: input.achievements,
      nextStep: input.nextStep
    });
    const stagnant = input.competencies.filter(
      (c) => c.status === "in_progress" && c.progress > 0 && c.progress < 55
    );
    const recommendations = recommendationScore.rank({
      signals: input.signals,
      score,
      productNames: input.productNames,
      stagnantIds: stagnant.map((s) => s.competencyId)
    });
    const nextAction = recommendations[0] || null;
    const relatedProducts = recommendations.filter((r) => r.productSlug).slice(0, 6).map((r) => ({
      slug: r.productSlug,
      name: r.title,
      href: r.href || `/produto/${r.productSlug}`,
      reason: r.reason
    }));
    const payload = {
      score,
      habits,
      consistency,
      goals,
      evolution: evolutionEngine.series(input.signals),
      monthlyEvolution: evolutionEngine.monthly(input.signals),
      weeklyProgress: evolutionEngine.weekly(input.signals),
      timeline: input.signals.timeline,
      insights: buildInsights(input.signals, score, input.goals, stagnant),
      recommendations,
      nextAction,
      stagnantCompetencies: stagnant.map((s) => ({
        id: s.competencyId,
        name: s.name,
        progress: s.progress
      })),
      relatedProducts,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheHit: false
    };
    successCacheSet(cacheKey, payload, 45e3);
    return payload;
  }
};
var successEngine = new SuccessEngine();

// server/core/success/index.ts
init_cache2();

// server/core/success/build-context.ts
init_contentfy();
init_db();

// server/learn-store.ts
init_db();
init_schema();
init_cache();
import { eq as eq3 } from "drizzle-orm";
var memoryGoals = /* @__PURE__ */ new Map();
var warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  console.warn(
    "[ContentFy Learn] Prefer\xEAncia de objetivo em mem\xF3ria (migration 0013 ausente). N\xE3o \xE9 dur\xE1vel."
  );
}
async function getActiveGoalId(userId) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select().from(learnUserGoals).where(eq3(learnUserGoals.userId, userId)).limit(1);
    return rows[0]?.goalId ?? null;
  } catch {
    warnOnce();
    return memoryGoals.get(userId) ?? null;
  }
}
async function setActiveGoalId(userId, goalId) {
  learnCacheInvalidate(`learn:dashboard:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(learnUserGoals).values({ userId, goalId }).onDuplicateKeyUpdate({ set: { goalId } });
    return { ok: true, persisted: "db" };
  } catch {
    warnOnce();
    memoryGoals.set(userId, goalId);
    return { ok: true, persisted: "memory" };
  }
}

// server/discovery-store.ts
init_db();
init_schema();
init_cache5();
import { and as and3, desc as desc3, eq as eq4, gte as gte3, sql as sql3 } from "drizzle-orm";
var memoryFavorites = /* @__PURE__ */ new Map();
var memoryEvents = [];
var warnedMemory2 = false;
function warnMemoryOnce() {
  if (warnedMemory2) return;
  warnedMemory2 = true;
  console.warn(
    "[ContentFy Discovery] Persist\xEAncia em mem\xF3ria ativa (migration 0012 ausente ou DB indispon\xEDvel). N\xE3o \xE9 dur\xE1vel."
  );
}
function parseJsonArray(raw) {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
async function listDiscoveryDbMeta() {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(productDiscoveryMeta);
    return rows.map((r) => ({
      slug: r.slug,
      productId: r.productId,
      tags: parseJsonArray(r.tagsJson),
      category: r.category || "Geral",
      subcategory: r.subcategory || void 0,
      level: r.level || void 0,
      duration: r.durationLabel || void 0,
      type: "ebook",
      author: r.author || void 0,
      collections: parseJsonArray(r.collectionsJson),
      keywords: parseJsonArray(r.keywordsJson),
      objectives: parseJsonArray(r.objectivesJson),
      audience: parseJsonArray(r.audienceJson),
      skills: parseJsonArray(r.skillsJson),
      isFeatured: r.isFeatured,
      isLaunch: r.isLaunch,
      isBeginnerFriendly: r.isBeginnerFriendly
    }));
  } catch {
    return [];
  }
}
async function listDiscoveryDbRelationships() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(productDiscoveryRelationships);
  } catch {
    return [];
  }
}
async function listFavoriteSlugs(userId) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select({ slug: userFavorites.productSlug }).from(userFavorites).where(eq4(userFavorites.userId, userId)).orderBy(desc3(userFavorites.createdAt));
    return rows.map((r) => r.slug);
  } catch {
    warnMemoryOnce();
    return Array.from(memoryFavorites.get(userId) || []);
  }
}
async function addFavorite(userId, productSlug, productId) {
  discoveryCacheInvalidate(`discovery:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(userFavorites).values({ userId, productSlug, productId: productId ?? null }).onDuplicateKeyUpdate({ set: { productId: productId ?? null } });
    return { ok: true, persisted: "db" };
  } catch {
    warnMemoryOnce();
    const set = memoryFavorites.get(userId) || /* @__PURE__ */ new Set();
    set.add(productSlug);
    memoryFavorites.set(userId, set);
    return { ok: true, persisted: "memory" };
  }
}
async function removeFavorite(userId, productSlug) {
  discoveryCacheInvalidate(`discovery:home:${userId}`);
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.delete(userFavorites).where(
      and3(
        eq4(userFavorites.userId, userId),
        eq4(userFavorites.productSlug, productSlug)
      )
    );
    return { ok: true, persisted: "db" };
  } catch {
    warnMemoryOnce();
    memoryFavorites.get(userId)?.delete(productSlug);
    return { ok: true, persisted: "memory" };
  }
}
async function trackDiscoveryEvent(input) {
  if (input.userId) {
    discoveryCacheInvalidate(`discovery:home:${input.userId}`);
  }
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    await db.insert(discoveryEvents).values({
      userId: input.userId ?? null,
      sessionId: input.sessionId,
      eventType: input.eventType,
      productId: input.productId ?? null,
      productSlug: input.productSlug,
      category: input.category,
      query: input.query,
      dwellMs: input.dwellMs
    });
    if (input.eventType === "search" && input.query?.trim()) {
      const q = input.query.trim().toLowerCase().slice(0, 255);
      await db.insert(discoverySearchStats).values({ queryNormalized: q, hitCount: 1 }).onDuplicateKeyUpdate({
        set: {
          hitCount: sql3`${discoverySearchStats.hitCount} + 1`,
          lastSearchedAt: sql3`CURRENT_TIMESTAMP`
        }
      });
    }
    return { ok: true, persisted: "db" };
  } catch {
    warnMemoryOnce();
    memoryEvents.push({
      userId: input.userId,
      eventType: input.eventType,
      productSlug: input.productSlug,
      category: input.category,
      query: input.query,
      dwellMs: input.dwellMs,
      at: Date.now()
    });
    if (memoryEvents.length > 5e3) memoryEvents.splice(0, 1e3);
    return { ok: true, persisted: "memory" };
  }
}
async function getRecentViewSlugs(userId, limit = 20) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select({ slug: discoveryEvents.productSlug }).from(discoveryEvents).where(
      and3(
        eq4(discoveryEvents.userId, userId),
        eq4(discoveryEvents.eventType, "view")
      )
    ).orderBy(desc3(discoveryEvents.createdAt)).limit(limit * 3);
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const r of rows) {
      if (!r.slug || seen.has(r.slug)) continue;
      seen.add(r.slug);
      out.push(r.slug);
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    const rows = memoryEvents.filter((e) => e.userId === userId && e.eventType === "view" && e.productSlug).sort((a, b) => b.at - a.at);
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const r of rows) {
      if (!r.productSlug || seen.has(r.productSlug)) continue;
      seen.add(r.productSlug);
      out.push(r.productSlug);
      if (out.length >= limit) break;
    }
    return out;
  }
}
async function getRecentSearchQueries(userId, limit = 10) {
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const rows = await db.select({ query: discoveryEvents.query }).from(discoveryEvents).where(
      and3(
        eq4(discoveryEvents.userId, userId),
        eq4(discoveryEvents.eventType, "search")
      )
    ).orderBy(desc3(discoveryEvents.createdAt)).limit(limit * 2);
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const r of rows) {
      if (!r.query || seen.has(r.query)) continue;
      seen.add(r.query);
      out.push(r.query);
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
async function buildTrendingSignals() {
  const bySlug = /* @__PURE__ */ new Map();
  const ensure = (slug) => {
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        views: 0,
        purchases: 0,
        favorites: 0,
        ratings: 0,
        recent: 0,
        older: 0
      });
    }
    return bySlug.get(slug);
  };
  try {
    const db = await getDb();
    if (!db) throw new Error("no db");
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
    const events = await db.select({
      slug: discoveryEvents.productSlug,
      type: discoveryEvents.eventType,
      createdAt: discoveryEvents.createdAt
    }).from(discoveryEvents).where(gte3(discoveryEvents.createdAt, thirtyDaysAgo)).limit(5e3);
    for (const e of events) {
      if (!e.slug) continue;
      const row = ensure(e.slug);
      if (e.type === "view" || e.type === "click") row.views += 1;
      if (e.type === "favorite" || e.type === "wishlist") row.favorites += 1;
      const t2 = e.createdAt ? new Date(e.createdAt).getTime() : 0;
      if (t2 >= sevenDaysAgo.getTime()) row.recent += 1;
      else row.older += 1;
    }
    const favCounts = await db.select({
      slug: userFavorites.productSlug,
      c: sql3`count(*)`
    }).from(userFavorites).groupBy(userFavorites.productSlug);
    for (const f of favCounts) {
      ensure(f.slug).favorites += Number(f.c) || 0;
    }
    const purchaseRows = await db.select({
      slug: products.slug,
      c: sql3`count(*)`
    }).from(orders).innerJoin(products, eq4(orders.productId, products.id)).where(eq4(orders.status, "completed")).groupBy(products.slug);
    for (const p of purchaseRows) {
      ensure(p.slug).purchases += Number(p.c) || 0;
    }
    const ratingRows = await db.select({
      slug: products.slug,
      c: sql3`count(*)`,
      avg: sql3`avg(${productReviews.rating})`
    }).from(productReviews).innerJoin(products, eq4(productReviews.productId, products.id)).where(eq4(productReviews.isApproved, true)).groupBy(products.slug);
    for (const r of ratingRows) {
      const avg = Number(r.avg) || 0;
      ensure(r.slug).ratings += (Number(r.c) || 0) * (avg / 5);
    }
  } catch {
    for (const e of memoryEvents) {
      if (!e.productSlug) continue;
      const row = ensure(e.productSlug);
      if (e.eventType === "view" || e.eventType === "click") row.views += 1;
      if (e.eventType === "favorite") row.favorites += 1;
      if (Date.now() - e.at < 7 * 24 * 60 * 60 * 1e3) row.recent += 1;
      else row.older += 1;
    }
  }
  return Array.from(bySlug.entries()).map(([slug, v]) => ({
    slug,
    views: v.views,
    purchases: v.purchases,
    favorites: v.favorites,
    ratings: v.ratings,
    recentGrowth: v.older > 0 ? v.recent / v.older : v.recent > 0 ? 1 : 0
  }));
}
async function buildContinueLearningSnapshots(userId) {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select({
      productId: products.id,
      productSlug: products.slug,
      productName: products.name,
      coverImage: products.coverImage,
      lessonId: courseLessons.id,
      lessonTitle: courseLessons.title,
      moduleTitle: courseModules.title,
      isCompleted: lessonProgress.isCompleted,
      lastWatchedAt: lessonProgress.lastWatchedAt
    }).from(lessonProgress).innerJoin(courseLessons, eq4(lessonProgress.lessonId, courseLessons.id)).innerJoin(courseModules, eq4(courseLessons.moduleId, courseModules.id)).innerJoin(courses, eq4(courseModules.courseId, courses.id)).innerJoin(products, eq4(courses.productId, products.id)).where(eq4(lessonProgress.userId, userId)).orderBy(desc3(lessonProgress.lastWatchedAt));
    const byProduct = /* @__PURE__ */ new Map();
    for (const r of rows) {
      let snap = byProduct.get(r.productId);
      if (!snap) {
        snap = {
          productId: r.productId,
          productSlug: r.productSlug,
          productName: r.productName,
          coverImage: r.coverImage,
          lastLessonTitle: r.lessonTitle,
          lastModuleTitle: r.moduleTitle,
          completedLessons: 0,
          totalLessons: 0,
          lastWatchedAt: r.lastWatchedAt,
          _last: r.lastWatchedAt ? new Date(r.lastWatchedAt).getTime() : 0
        };
        byProduct.set(r.productId, snap);
      }
      snap.totalLessons += 1;
      if (r.isCompleted) snap.completedLessons += 1;
      const t2 = r.lastWatchedAt ? new Date(r.lastWatchedAt).getTime() : 0;
      if (t2 >= (snap._last || 0)) {
        snap._last = t2;
        snap.lastLessonTitle = r.lessonTitle;
        snap.lastModuleTitle = r.moduleTitle;
        snap.lastWatchedAt = r.lastWatchedAt;
      }
    }
    for (const snap of Array.from(byProduct.values())) {
      const totals = await db.select({ c: sql3`count(*)` }).from(courseLessons).innerJoin(courseModules, eq4(courseLessons.moduleId, courseModules.id)).innerJoin(courses, eq4(courseModules.courseId, courses.id)).where(eq4(courses.productId, snap.productId));
      const total = Number(totals[0]?.c) || snap.totalLessons;
      snap.totalLessons = total;
    }
    return Array.from(byProduct.values()).map(({ _last: _, ...rest }) => rest);
  } catch (error) {
    console.error("[Discovery] continue learning snapshot failed:", error);
    return [];
  }
}
async function getAdminDiscoveryInsights() {
  const empty = {
    mostViewed: [],
    mostSold: [],
    mostFavorited: [],
    mostSearched: [],
    persistence: "unknown"
  };
  try {
    const db = await getDb();
    if (!db) {
      warnMemoryOnce();
      const views = /* @__PURE__ */ new Map();
      for (const e of memoryEvents) {
        if ((e.eventType === "view" || e.eventType === "click") && e.productSlug) {
          views.set(e.productSlug, (views.get(e.productSlug) || 0) + 1);
        }
      }
      return {
        ...empty,
        mostViewed: Array.from(views.entries()).map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count).slice(0, 20),
        persistence: "memory"
      };
    }
    const viewed = await db.select({
      slug: discoveryEvents.productSlug,
      count: sql3`count(*)`
    }).from(discoveryEvents).where(eq4(discoveryEvents.eventType, "view")).groupBy(discoveryEvents.productSlug).orderBy(desc3(sql3`count(*)`)).limit(20);
    const sold = await db.select({
      slug: products.slug,
      count: sql3`count(*)`
    }).from(orders).innerJoin(products, eq4(orders.productId, products.id)).where(eq4(orders.status, "completed")).groupBy(products.slug).orderBy(desc3(sql3`count(*)`)).limit(20);
    const favorited = await db.select({
      slug: userFavorites.productSlug,
      count: sql3`count(*)`
    }).from(userFavorites).groupBy(userFavorites.productSlug).orderBy(desc3(sql3`count(*)`)).limit(20);
    const searched = await db.select({
      query: discoverySearchStats.queryNormalized,
      count: discoverySearchStats.hitCount
    }).from(discoverySearchStats).orderBy(desc3(discoverySearchStats.hitCount)).limit(20);
    return {
      mostViewed: viewed.filter((v) => v.slug).map((v) => ({ slug: v.slug, count: Number(v.count) || 0 })),
      mostSold: sold.map((v) => ({ slug: v.slug, count: Number(v.count) || 0 })),
      mostFavorited: favorited.map((v) => ({
        slug: v.slug,
        count: Number(v.count) || 0
      })),
      mostSearched: searched.map((v) => ({
        query: v.query,
        count: Number(v.count) || 0
      })),
      persistence: "db"
    };
  } catch {
    warnMemoryOnce();
    return { ...empty, persistence: "memory" };
  }
}

// server/core/success/build-context.ts
async function buildLearnSignals(userId) {
  const [owned, progressSnaps, activeGoalId, allProducts] = await Promise.all([
    getUserProducts(userId),
    buildContinueLearningSnapshots(userId),
    getActiveGoalId(userId),
    getAllProducts()
  ]);
  const productNames = {};
  for (const p of allProducts) productNames[p.slug] = p.name;
  const ownedProductSlugs = [];
  for (const row of owned || []) {
    const slug = row.product?.slug;
    if (slug) {
      ownedProductSlugs.push(slug);
      if (row.product?.name) productNames[slug] = row.product.name;
    }
  }
  const progressBySlug = {};
  let completedLessonCount = 0;
  let totalLessonTouches = 0;
  let coursesCompleted = 0;
  let modulesCompleted = 0;
  let modulesTotal = 0;
  for (const snap of progressSnaps) {
    const pct = Math.min(
      100,
      Math.round(
        snap.completedLessons / Math.max(snap.totalLessons, 1) * 100
      )
    );
    progressBySlug[snap.productSlug] = pct;
    completedLessonCount += snap.completedLessons;
    totalLessonTouches += snap.totalLessons;
    modulesCompleted += snap.completedLessons;
    modulesTotal += snap.totalLessons;
    if (pct >= 100) coursesCompleted += 1;
    if (!ownedProductSlugs.includes(snap.productSlug)) {
      ownedProductSlugs.push(snap.productSlug);
    }
    productNames[snap.productSlug] = snap.productName;
  }
  for (const slug of ownedProductSlugs) {
    if (progressBySlug[slug] == null) progressBySlug[slug] = 20;
  }
  const last = progressSnaps[0];
  const learnSignals = {
    userId,
    ownedProductSlugs,
    completedLessonCount,
    totalLessonTouches,
    coursesCompleted,
    streakDays: 0,
    progressBySlug,
    lastLesson: last ? {
      productId: last.productId,
      productSlug: last.productSlug,
      productName: last.productName,
      lessonTitle: last.lastLessonTitle,
      moduleTitle: last.lastModuleTitle,
      href: last.productId ? `/my-account/course/${last.productId}` : `/produto/${last.productSlug}`
    } : void 0,
    activeGoalId,
    purchasedAtLeastOnce: ownedProductSlugs.length > 0
  };
  return { learnSignals, productNames, modulesCompleted, modulesTotal };
}
async function buildSuccessContext(userId) {
  const { learnSignals, productNames, modulesCompleted, modulesTotal } = await buildLearnSignals(userId);
  const dashboard = learnEngine.buildDashboard({
    signals: learnSignals,
    productNames
  });
  const competencies = competencyEngine.evaluate(learnSignals);
  const goals = goalEngine.evaluate(competencies, learnSignals);
  const competencyAvg = competencies.reduce((s, c) => s + c.progress, 0) / Math.max(1, competencies.length);
  const successIndex = computeSuccessIndex({
    knowledge: competencyAvg,
    application: Math.min(100, learnSignals.completedLessonCount * 4),
    consistency: 0,
    result: Math.min(100, learnSignals.coursesCompleted * 35)
  });
  const achievements = achievementEngine.evaluate({
    signals: learnSignals,
    competencies,
    goals,
    successIndex
  });
  const progresses = Object.values(learnSignals.progressBySlug);
  const avgProgress = progresses.length > 0 ? progresses.reduce((a, b) => a + b, 0) / progresses.length : 0;
  const active = goals.find((g) => g.isActive);
  const goalsCompleted = goals.filter((g) => g.progress >= 70).length;
  const competenciesAcquired = competencies.filter(
    (c) => c.status === "acquired"
  ).length;
  const competenciesInProgress = competencies.filter(
    (c) => c.status === "in_progress"
  ).length;
  const competenciesStagnant = competencies.filter(
    (c) => c.status === "in_progress" && c.progress < 55
  ).length;
  const applicationTasks = learnSignals.completedLessonCount + Math.min(learnSignals.ownedProductSlugs.length, 5);
  const activeDays = Math.min(
    30,
    Math.max(0, Math.ceil(learnSignals.completedLessonCount / 2))
  );
  const streakDays = learnSignals.streakDays;
  const weeklyDeltaPercent = Math.min(
    25,
    Math.max(-10, Math.round(avgProgress * 0.12) - (activeDays > 0 ? 0 : 5))
  );
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const monthlyEvolution = monthNames.slice(0, 4).map((label, i) => {
    const factor = (i + 1) / 4;
    return {
      month: `m${i + 1}`,
      label,
      value: Math.min(100, Math.round(avgProgress * factor))
    };
  });
  const timeline = dashboard.timeline.map((e) => ({
    id: e.id,
    at: e.at,
    kind: e.kind === "achievement" ? "habit" : e.kind === "goal" ? "goal" : e.kind === "competency" ? "competency" : e.kind === "lesson" ? "lesson" : "score",
    title: e.title,
    subtitle: e.subtitle
  }));
  const signals = {
    userId,
    modulesCompleted,
    modulesTotal: Math.max(modulesTotal, modulesCompleted),
    applicationTasks,
    activeDays,
    streakDays,
    goalsCompleted,
    goalsTotal: goals.length,
    competenciesAcquired,
    competenciesInProgress,
    competenciesStagnant,
    avgProgress,
    weeklyDeltaPercent,
    ownedProductSlugs: learnSignals.ownedProductSlugs,
    activeGoalId: active?.goalId,
    activeGoalName: active?.name,
    activeGoalProgress: active?.progress,
    nextStepTitle: dashboard.nextStep?.title,
    nextStepHref: dashboard.nextStep?.href,
    nextStepReason: dashboard.nextStep?.reason,
    monthlyEvolution,
    timeline
  };
  return {
    signals,
    goals,
    competencies,
    achievements,
    nextStep: dashboard.nextStep,
    productNames
  };
}

// server/core/intelligence/config.ts
init_contentfy();
function isPlainObject(v) {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}
function deepMergeConfig2(base, patch) {
  const out = {
    weights: { ...base.weights },
    thresholds: { ...base.thresholds },
    windows: { ...base.windows }
  };
  if (patch.windows) out.windows = { ...out.windows, ...patch.windows };
  if (patch.thresholds) {
    out.thresholds = { ...out.thresholds, ...patch.thresholds };
  }
  if (patch.weights) {
    out.weights = {
      product: { ...out.weights.product, ...patch.weights.product || {} },
      creator: { ...out.weights.creator, ...patch.weights.creator || {} },
      category: { ...out.weights.category, ...patch.weights.category || {} },
      engagement: {
        ...out.weights.engagement,
        ...patch.weights.engagement || {}
      },
      trust: { ...out.weights.trust, ...patch.weights.trust || {} },
      growth: { ...out.weights.growth, ...patch.weights.growth || {} },
      momentum: { ...out.weights.momentum, ...patch.weights.momentum || {} }
    };
  }
  void isPlainObject;
  return out;
}
function resolveIntelligenceConfig(override) {
  let fromEnv = {};
  const raw = process.env.INTELLIGENCE_SCORE_CONFIG_JSON;
  if (raw) {
    try {
      fromEnv = JSON.parse(raw);
    } catch {
      console.warn(
        "[ContentFy Intelligence] INTELLIGENCE_SCORE_CONFIG_JSON inv\xE1lido \u2014 defaults."
      );
    }
  }
  return deepMergeConfig2(
    deepMergeConfig2(DEFAULT_INTELLIGENCE_SCORE_CONFIG, fromEnv),
    override || {}
  );
}
function clamp01to100(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
function pctDelta(recent, prior) {
  if (prior <= 0 && recent <= 0) return null;
  if (prior <= 0) return recent > 0 ? 100 : null;
  return Math.round((recent - prior) / prior * 100);
}
function normalizeAgainst(value, target) {
  if (target <= 0) return 0;
  return clamp01to100(value / target * 100);
}
function weightedScore(components, weights) {
  let sumW = 0;
  let acc = 0;
  const out = {};
  for (const [k, w] of Object.entries(weights)) {
    const v = components[k] ?? 0;
    out[k] = clamp01to100(v);
    sumW += w;
    acc += out[k] * w;
  }
  const score = sumW > 0 ? clamp01to100(acc / sumW) : 0;
  return { score, components: out };
}
function scoreLabel(score) {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Forte";
  if (score >= 40) return "Em evolu\xE7\xE3o";
  if (score >= 20) return "Inicial";
  return "Baixo sinal";
}

// server/core/intelligence/intelligence-engine.ts
init_cache4();

// server/core/intelligence/score-math.ts
function maxOf(rows, key) {
  let m = 1;
  for (const r of rows) {
    const v = Number(r[key]);
    if (Number.isFinite(v) && v > m) m = v;
  }
  return m;
}
function computeProductScores(signal, peers, config) {
  const maxViews = maxOf(peers, "views");
  const maxSales = maxOf(peers, "sales");
  const maxFav = maxOf(peers, "favorites");
  const salesDeltaPercent = pctDelta(signal.recentSales, signal.priorSales);
  const viewsDeltaPercent = pctDelta(signal.recentViews, signal.priorViews);
  const product = weightedScore(
    {
      views: normalizeAgainst(signal.views, maxViews),
      sales: normalizeAgainst(signal.sales, maxSales),
      favorites: normalizeAgainst(signal.favorites, maxFav),
      completion: signal.completionRate,
      retention: signal.retentionProxy,
      refundPenalty: 100 - Math.min(100, signal.refunds > 0 ? signal.refunds / Math.max(signal.sales, 1) * 100 * 2 : 0),
      abandonmentPenalty: 100 - signal.abandonmentRate
    },
    config.weights.product
  );
  const engagement = weightedScore(
    {
      sessionsProxy: normalizeAgainst(signal.views, maxViews),
      favorites: normalizeAgainst(signal.favorites, maxFav),
      progress: signal.avgProgress
    },
    config.weights.engagement
  );
  const refundRate = signal.sales > 0 ? signal.refunds / signal.sales * 100 : 0;
  const trust = weightedScore(
    {
      completion: signal.completionRate,
      lowRefund: clampRefund(refundRate),
      retention: signal.retentionProxy
    },
    config.weights.trust
  );
  const growth = weightedScore(
    {
      salesDelta: deltaToScore(salesDeltaPercent),
      viewsDelta: deltaToScore(viewsDeltaPercent)
    },
    config.weights.growth
  );
  const momentum = weightedScore(
    {
      recentSales: normalizeAgainst(signal.recentSales, Math.max(1, maxOf(peers, "recentSales"))),
      recentViews: normalizeAgainst(signal.recentViews, Math.max(1, maxOf(peers, "recentViews"))),
      acceleration: deltaToScore(
        salesDeltaPercent != null && viewsDeltaPercent != null ? (salesDeltaPercent + viewsDeltaPercent) / 2 : salesDeltaPercent ?? viewsDeltaPercent
      )
    },
    config.weights.momentum
  );
  let lifecycle = "unknown";
  if (salesDeltaPercent != null) {
    if (salesDeltaPercent >= config.thresholds.emergingGrowthPercent) {
      lifecycle = "emerging";
    } else if (salesDeltaPercent <= config.thresholds.decliningGrowthPercent) {
      lifecycle = "declining";
    } else {
      lifecycle = "stable";
    }
  }
  return {
    productScore: {
      score: product.score,
      label: scoreLabel(product.score),
      components: product.components
    },
    engagementScore: {
      score: engagement.score,
      label: scoreLabel(engagement.score),
      components: engagement.components
    },
    trustScore: {
      score: trust.score,
      label: scoreLabel(trust.score),
      components: trust.components
    },
    growthScore: {
      score: growth.score,
      label: scoreLabel(growth.score),
      components: growth.components
    },
    momentumScore: {
      score: momentum.score,
      label: scoreLabel(momentum.score),
      components: momentum.components
    },
    salesDeltaPercent,
    viewsDeltaPercent,
    lifecycle
  };
}
function clampRefund(refundRatePercent) {
  return Math.max(0, Math.min(100, 100 - refundRatePercent * 4));
}
function deltaToScore(delta) {
  if (delta == null) return 50;
  return Math.max(0, Math.min(100, Math.round(50 + delta / 2)));
}
function computeCreatorScore(input, config) {
  const w = weightedScore(
    {
      conversion: input.conversionRate,
      retention: input.retentionProxy,
      satisfaction: input.satisfactionProxy,
      volume: normalizeAgainst(input.sales, Math.max(1, input.maxSales))
    },
    config.weights.creator
  );
  return {
    score: w.score,
    label: scoreLabel(w.score),
    components: w.components
  };
}
function computeCategoryScore(input, config) {
  const w = weightedScore(
    {
      growth: deltaToScore(input.growthDelta),
      sales: normalizeAgainst(input.sales, Math.max(1, input.maxSales)),
      engagement: normalizeAgainst(
        input.engagement,
        Math.max(1, input.maxEngagement)
      )
    },
    config.weights.category
  );
  return {
    score: w.score,
    label: scoreLabel(w.score),
    components: w.components
  };
}

// server/core/intelligence/behavior-engine.ts
var BehaviorEngine = class {
  toProductRows(signals, config) {
    return signals.map((s) => {
      const scores = computeProductScores(s, signals, config);
      const refundRate = s.sales > 0 ? Math.round(s.refunds / s.sales * 1e3) / 10 : 0;
      return {
        productId: s.productId,
        slug: s.slug,
        name: s.name,
        category: s.category,
        author: s.author,
        views: s.views,
        sales: s.sales,
        favorites: s.favorites,
        refunds: s.refunds,
        refundRate,
        completionRate: s.completionRate,
        abandonmentRate: s.abandonmentRate,
        retentionProxy: s.retentionProxy,
        avgProgress: s.avgProgress,
        revenueCents: s.revenueCents,
        recentSales: s.recentSales,
        priorSales: s.priorSales,
        salesDeltaPercent: scores.salesDeltaPercent,
        recentViews: s.recentViews,
        priorViews: s.priorViews,
        viewsDeltaPercent: scores.viewsDeltaPercent,
        productScore: scores.productScore,
        engagementScore: scores.engagementScore,
        trustScore: scores.trustScore,
        growthScore: scores.growthScore,
        momentumScore: scores.momentumScore,
        lifecycle: scores.lifecycle
      };
    });
  }
};
var behaviorEngine = new BehaviorEngine();

// server/core/intelligence/analytics-engine.ts
var AnalyticsEngine = class {
  marketplaceHealth(rows) {
    const revenueCents = rows.reduce((s, r) => s + r.revenueCents, 0);
    const ordersCompleted = rows.reduce((s, r) => s + r.sales, 0);
    const totalViews = rows.reduce((s, r) => s + r.views, 0);
    const totalFavorites = rows.reduce((s, r) => s + r.favorites, 0);
    const refunds = rows.reduce((s, r) => s + r.refunds, 0);
    const withLearners = rows.filter((r) => r.avgProgress > 0 || r.sales > 0);
    const conversionProxy = totalViews > 0 ? Math.round(ordersCompleted / totalViews * 1e3) / 10 : 0;
    const retentionProxy = withLearners.length > 0 ? Math.round(
      withLearners.reduce((s, r) => s + r.retentionProxy, 0) / withLearners.length
    ) : 0;
    const completionProxy = withLearners.length > 0 ? Math.round(
      withLearners.reduce((s, r) => s + r.completionRate, 0) / withLearners.length
    ) : 0;
    const refundRate = ordersCompleted > 0 ? Math.round(refunds / ordersCompleted * 1e3) / 10 : 0;
    return {
      revenueCents,
      ordersCompleted,
      conversionProxy,
      retentionProxy,
      completionProxy,
      refundRate,
      activeProducts: rows.length,
      totalViews,
      totalFavorites
    };
  }
};
var analyticsEngine = new AnalyticsEngine();

// server/core/intelligence/retention-engine.ts
var RetentionEngine = class {
  topRetained(rows, limit = 10) {
    return [...rows].filter((r) => r.sales > 0 || r.avgProgress > 0).sort((a, b) => b.retentionProxy - a.retentionProxy).slice(0, limit);
  }
  highAbandonment(rows, threshold, limit = 10) {
    return [...rows].filter((r) => r.abandonmentRate >= threshold && (r.sales > 0 || r.views > 0)).sort((a, b) => b.abandonmentRate - a.abandonmentRate).slice(0, limit);
  }
};
var retentionEngine = new RetentionEngine();

// server/core/intelligence/conversion-engine.ts
var ConversionEngine = class {
  rate(views, sales) {
    if (views <= 0) return 0;
    return Math.round(sales / views * 1e3) / 10;
  }
  topByConversion(rows, limit = 10) {
    return [...rows].filter((r) => r.views >= 5).map((r) => ({
      ...r,
      conversionRate: this.rate(r.views, r.sales)
    })).sort((a, b) => b.conversionRate - a.conversionRate).slice(0, limit);
  }
};
var conversionEngine = new ConversionEngine();

// server/core/intelligence/marketplace-insights.ts
var MarketplaceInsights = class {
  topProducts(rows, limit = 10) {
    return [...rows].sort(
      (a, b) => b.productScore.score - a.productScore.score || b.sales - a.sales
    ).slice(0, limit);
  }
  byLifecycle(rows) {
    return {
      emerging: rows.filter((r) => r.lifecycle === "emerging"),
      stable: rows.filter((r) => r.lifecycle === "stable"),
      declining: rows.filter((r) => r.lifecycle === "declining")
    };
  }
  highRefund(rows, threshold, limit = 10) {
    return [...rows].filter((r) => r.refundRate >= threshold && r.sales > 0).sort((a, b) => b.refundRate - a.refundRate).slice(0, limit);
  }
  creators(rows, config) {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const key = (r.author || "").trim() || "__unassigned__";
      const list = map.get(key) || [];
      list.push(r);
      map.set(key, list);
    }
    const maxSales = Math.max(1, ...rows.map((r) => r.sales));
    const out = [];
    for (const [key, list] of Array.from(map.entries())) {
      const views = list.reduce(
        (s, r) => s + r.views,
        0
      );
      const sales = list.reduce(
        (s, r) => s + r.sales,
        0
      );
      const revenueCents = list.reduce(
        (s, r) => s + r.revenueCents,
        0
      );
      const refunds = list.reduce(
        (s, r) => s + r.refunds,
        0
      );
      const completionRate = list.length > 0 ? Math.round(
        list.reduce(
          (s, r) => s + r.completionRate,
          0
        ) / list.length
      ) : 0;
      const retentionProxy = list.length > 0 ? Math.round(
        list.reduce(
          (s, r) => s + r.retentionProxy,
          0
        ) / list.length
      ) : 0;
      const refundRate = sales > 0 ? Math.round(refunds / sales * 1e3) / 10 : 0;
      const conversionRate = conversionEngine.rate(views, sales);
      const satisfactionProxy = Math.max(0, 100 - refundRate * 4);
      out.push({
        authorKey: key,
        authorLabel: key === "__unassigned__" ? "Sem autor (meta)" : key,
        productCount: list.length,
        views,
        sales,
        conversionRate,
        completionRate,
        retentionProxy,
        refundRate,
        revenueCents,
        creatorScore: computeCreatorScore(
          {
            conversionRate,
            retentionProxy,
            satisfactionProxy,
            sales,
            maxSales
          },
          config
        )
      });
    }
    return out.sort(
      (a, b) => b.creatorScore.score - a.creatorScore.score || b.sales - a.sales
    );
  }
  categories(rows, config) {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const key = r.category || "Sem categoria";
      const list = map.get(key) || [];
      list.push(r);
      map.set(key, list);
    }
    const maxSales = Math.max(1, ...rows.map((r) => r.sales));
    const maxEng = Math.max(
      1,
      ...rows.map((r) => r.views + r.favorites)
    );
    const out = [];
    for (const [category, list] of Array.from(map.entries())) {
      const views = list.reduce(
        (s, r) => s + r.views,
        0
      );
      const sales = list.reduce(
        (s, r) => s + r.sales,
        0
      );
      const favorites = list.reduce(
        (s, r) => s + r.favorites,
        0
      );
      const recentSales = list.reduce(
        (s, r) => s + r.recentSales,
        0
      );
      const priorSales = list.reduce(
        (s, r) => s + r.priorSales,
        0
      );
      const salesDeltaPercent = pctDelta(recentSales, priorSales);
      let trend = "unknown";
      if (salesDeltaPercent != null) {
        if (salesDeltaPercent >= config.thresholds.categoryHeatGrowthPercent) {
          trend = "heating";
        } else if (salesDeltaPercent <= config.thresholds.categoryCoolDropPercent) {
          trend = "cooling";
        } else {
          trend = "stable";
        }
      }
      out.push({
        category,
        productCount: list.length,
        views,
        sales,
        favorites,
        salesDeltaPercent,
        trend,
        categoryScore: computeCategoryScore(
          {
            growthDelta: salesDeltaPercent,
            sales,
            maxSales,
            engagement: views + favorites,
            maxEngagement: maxEng
          },
          config
        )
      });
    }
    return out.sort(
      (a, b) => b.categoryScore.score - a.categoryScore.score || b.sales - a.sales
    );
  }
};
var marketplaceInsights = new MarketplaceInsights();

// server/core/intelligence/detection.ts
function detectAlerts(products2, categories, config) {
  const alerts = [];
  const t2 = config.thresholds;
  for (const p of products2) {
    if (p.salesDeltaPercent != null && p.salesDeltaPercent <= -t2.salesDropPercent && p.priorSales > 0) {
      alerts.push({
        id: `sales_drop:${p.slug}`,
        kind: "sales_drop",
        severity: p.salesDeltaPercent <= -40 ? "critical" : "watch",
        title: "Queda de vendas",
        body: `\u201C${p.name}\u201D caiu ${Math.abs(p.salesDeltaPercent)}% nas vendas vs janela anterior.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.salesDeltaPercent,
        unit: "%"
      });
    }
    if (p.viewsDeltaPercent != null && p.retentionProxy > 0 && p.salesDeltaPercent != null && p.salesDeltaPercent <= -t2.retentionDropPercent && p.priorSales > 0) {
      if (p.retentionProxy < 40) {
        alerts.push({
          id: `retention_drop:${p.slug}`,
          kind: "retention_drop",
          severity: "watch",
          title: "Reten\xE7\xE3o sob press\xE3o",
          body: `\u201C${p.name}\u201D apresenta reten\xE7\xE3o proxy de ${p.retentionProxy}% com demanda em queda.`,
          entityType: "product",
          entityId: p.slug,
          metric: p.retentionProxy,
          unit: "%"
        });
      }
    }
    if (p.abandonmentRate >= t2.highAbandonmentPercent && p.sales > 0) {
      alerts.push({
        id: `abandon:${p.slug}`,
        kind: "high_abandonment",
        severity: p.abandonmentRate >= 60 ? "critical" : "watch",
        title: "Alto abandono",
        body: `\u201C${p.name}\u201D tem abandono estimado de ${p.abandonmentRate}%.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.abandonmentRate,
        unit: "%"
      });
    }
    if (p.refundRate >= t2.highRefundPercent && p.sales > 0) {
      alerts.push({
        id: `refund:${p.slug}`,
        kind: "high_refund",
        severity: p.refundRate >= 15 ? "critical" : "watch",
        title: "Alta de reembolso",
        body: `\u201C${p.name}\u201D registra ${p.refundRate}% de reembolsos sobre vendas.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.refundRate,
        unit: "%"
      });
    }
    if (p.salesDeltaPercent != null && p.salesDeltaPercent >= t2.emergingGrowthPercent && p.recentSales > 0) {
      alerts.push({
        id: `growth:${p.slug}`,
        kind: "accelerated_growth",
        severity: "info",
        title: "Crescimento acelerado",
        body: `\u201C${p.name}\u201D cresceu ${p.salesDeltaPercent}% em vendas na janela recente.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.salesDeltaPercent,
        unit: "%"
      });
    }
    if (p.recentViews >= t2.viralViewsMin && p.recentSales >= t2.viralSalesMin) {
      alerts.push({
        id: `viral:${p.slug}`,
        kind: "viral_product",
        severity: "info",
        title: "Produto com tra\xE7\xE3o viral",
        body: `\u201C${p.name}\u201D somou ${p.recentViews} views e ${p.recentSales} vendas na janela recente.`,
        entityType: "product",
        entityId: p.slug,
        metric: p.recentViews,
        unit: "views"
      });
    }
  }
  for (const c of categories) {
    if (c.trend === "heating" && c.salesDeltaPercent != null) {
      alerts.push({
        id: `cat_heat:${c.category}`,
        kind: "category_heating",
        severity: "info",
        title: "Categoria aquecendo",
        body: `\u201C${c.category}\u201D acelerou ${c.salesDeltaPercent}% em vendas.`,
        entityType: "category",
        entityId: c.category,
        metric: c.salesDeltaPercent,
        unit: "%"
      });
    }
    if (c.trend === "cooling" && c.salesDeltaPercent != null) {
      alerts.push({
        id: `cat_cool:${c.category}`,
        kind: "category_cooling",
        severity: "watch",
        title: "Categoria esfriando",
        body: `\u201C${c.category}\u201D recuou ${Math.abs(c.salesDeltaPercent)}% em vendas.`,
        entityType: "category",
        entityId: c.category,
        metric: c.salesDeltaPercent,
        unit: "%"
      });
    }
  }
  return alerts.slice(0, 40);
}

// server/core/intelligence/recommendation-analytics.ts
var RecommendationAnalytics = class {
  categoryCompanions(rows, limit = 6) {
    const byCat = /* @__PURE__ */ new Map();
    for (const r of rows) {
      if (!r.category || r.sales < 1) continue;
      const list = byCat.get(r.category) || [];
      list.push(r);
      byCat.set(r.category, list);
    }
    const insights = [];
    for (const [category, list] of Array.from(byCat.entries())) {
      if (list.length < 2) continue;
      const sorted = [...list].sort((a2, b2) => b2.sales - a2.sales);
      const a = sorted[0];
      const b = sorted[1];
      insights.push({
        id: `co:${a.slug}:${b.slug}`,
        kind: "co_purchase",
        title: "Produtos da mesma categoria com demanda conjunta",
        body: `\u201C${a.name}\u201D e \u201C${b.name}\u201D lideram vendas em ${category} (${a.sales} e ${b.sales} pedidos).`,
        entityType: "category",
        entityId: category,
        evidence: {
          category,
          productA: a.slug,
          productB: b.slug,
          salesA: a.sales,
          salesB: b.sales
        }
      });
      if (insights.length >= limit) break;
    }
    return insights;
  }
};
var recommendationAnalytics = new RecommendationAnalytics();

// server/core/intelligence/insights.ts
function buildInsights2(rows) {
  const insights = [];
  for (const p of rows) {
    if (p.salesDeltaPercent != null && p.salesDeltaPercent !== 0 && p.priorSales > 0) {
      const dir = p.salesDeltaPercent > 0 ? "aumento" : "queda";
      insights.push({
        id: `ret:${p.slug}`,
        kind: "retention_change",
        title: p.salesDeltaPercent > 0 ? "Demanda em alta" : "Demanda em ajuste",
        body: `\u201C${p.name}\u201D teve ${dir} de ${Math.abs(p.salesDeltaPercent)}% nas vendas vs janela anterior.`,
        entityType: "product",
        entityId: p.slug,
        evidence: {
          salesDeltaPercent: p.salesDeltaPercent,
          recentSales: p.recentSales,
          priorSales: p.priorSales
        }
      });
    }
    if (p.abandonmentRate >= 40 && p.sales > 0) {
      insights.push({
        id: `abd:${p.slug}`,
        kind: "abandonment_hotspot",
        title: "Ponto de aten\xE7\xE3o no progresso",
        body: `\u201C${p.name}\u201D concentra abandono estimado de ${p.abandonmentRate}% (progresso m\xE9dio ${p.avgProgress}%).`,
        entityType: "product",
        entityId: p.slug,
        evidence: {
          abandonmentRate: p.abandonmentRate,
          avgProgress: p.avgProgress
        }
      });
    }
  }
  insights.push(...recommendationAnalytics.categoryCompanions(rows));
  return insights.slice(0, 30);
}
function buildCreatorSuggestions(rows) {
  const suggestions = [];
  for (const p of rows) {
    if (p.views >= 10 && p.sales === 0) {
      suggestions.push({
        id: `sug:conv:${p.slug}`,
        kind: "generic_metric",
        title: "Oportunidade de convers\xE3o",
        body: `\u201C${p.name}\u201D tem ${p.views} visualiza\xE7\xF5es e ainda sem vendas registradas neste recorte.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { views: p.views, sales: p.sales }
      });
    }
    if (p.refundRate >= 8 && p.sales > 0) {
      suggestions.push({
        id: `sug:trust:${p.slug}`,
        kind: "generic_metric",
        title: "Revisar expectativa do produto",
        body: `Taxa de reembolso de ${p.refundRate}% em \u201C${p.name}\u201D \u2014 revise descri\xE7\xE3o e onboarding.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { refundRate: p.refundRate, sales: p.sales }
      });
    }
    if (p.abandonmentRate >= 50 && p.sales > 0) {
      suggestions.push({
        id: `sug:retain:${p.slug}`,
        kind: "abandonment_hotspot",
        title: "Refor\xE7ar in\xEDcio da jornada",
        body: `Abandono estimado de ${p.abandonmentRate}% em \u201C${p.name}\u201D \u2014 priorize as primeiras aulas.`,
        entityType: "product",
        entityId: p.slug,
        evidence: { abandonmentRate: p.abandonmentRate }
      });
    }
  }
  return suggestions.slice(0, 12);
}

// server/intelligence-store.ts
init_db();
init_schema();
init_db();
import { and as and4, eq as eq5, gte as gte4, lt, sql as sql4 } from "drizzle-orm";
function dayAgo(days) {
  return new Date(Date.now() - days * 864e5);
}
async function buildIntelligenceSnapshot() {
  const config = resolveIntelligenceConfig();
  const recentDays = config.windows.recentDays;
  const priorDays = config.windows.priorDays;
  const recentStart = dayAgo(recentDays);
  const priorStart = dayAgo(recentDays + priorDays);
  const priorEnd = recentStart;
  try {
    const database = await getDb();
    if (!database) throw new Error("no db");
    const [allProducts, insights, meta] = await Promise.all([
      getAllProducts(),
      getAdminDiscoveryInsights(),
      listDiscoveryDbMeta()
    ]);
    const viewMap = new Map(insights.mostViewed.map((v) => [v.slug, v.count]));
    const soldMap = new Map(insights.mostSold.map((v) => [v.slug, v.count]));
    const favMap = new Map(
      insights.mostFavorited.map((v) => [v.slug, v.count])
    );
    const metaBySlug = new Map(meta.map((m) => [m.slug, m]));
    const recentSalesRows = await database.select({
      productId: orders.productId,
      count: sql4`count(*)`,
      revenue: sql4`coalesce(sum(${orders.amount}), 0)`
    }).from(orders).where(
      and4(eq5(orders.status, "completed"), gte4(orders.createdAt, recentStart))
    ).groupBy(orders.productId);
    const priorSalesRows = await database.select({
      productId: orders.productId,
      count: sql4`count(*)`
    }).from(orders).where(
      and4(
        eq5(orders.status, "completed"),
        gte4(orders.createdAt, priorStart),
        lt(orders.createdAt, priorEnd)
      )
    ).groupBy(orders.productId);
    const allSalesRows = await database.select({
      productId: orders.productId,
      count: sql4`count(*)`,
      revenue: sql4`coalesce(sum(${orders.amount}), 0)`
    }).from(orders).where(eq5(orders.status, "completed")).groupBy(orders.productId);
    const recentViewsRows = await database.select({
      slug: discoveryEvents.productSlug,
      count: sql4`count(*)`
    }).from(discoveryEvents).where(
      and4(
        eq5(discoveryEvents.eventType, "view"),
        gte4(discoveryEvents.createdAt, recentStart)
      )
    ).groupBy(discoveryEvents.productSlug);
    const priorViewsRows = await database.select({
      slug: discoveryEvents.productSlug,
      count: sql4`count(*)`
    }).from(discoveryEvents).where(
      and4(
        eq5(discoveryEvents.eventType, "view"),
        gte4(discoveryEvents.createdAt, priorStart),
        lt(discoveryEvents.createdAt, priorEnd)
      )
    ).groupBy(discoveryEvents.productSlug);
    const refundRows = await database.select({
      productId: orders.productId,
      count: sql4`count(*)`
    }).from(refundRequests).innerJoin(orders, eq5(refundRequests.orderId, orders.id)).where(
      sql4`${refundRequests.status} in ('refunded','approved','processing')`
    ).groupBy(orders.productId);
    const progressRows = await database.select({
      productId: products.id,
      learners: sql4`count(distinct ${lessonProgress.userId})`,
      completed: sql4`sum(case when ${lessonProgress.isCompleted} then 1 else 0 end)`,
      touches: sql4`count(*)`
    }).from(lessonProgress).innerJoin(courseLessons, eq5(lessonProgress.lessonId, courseLessons.id)).innerJoin(courseModules, eq5(courseLessons.moduleId, courseModules.id)).innerJoin(courses, eq5(courseModules.courseId, courses.id)).innerJoin(products, eq5(courses.productId, products.id)).groupBy(products.id);
    const recentSalesMap = new Map(
      recentSalesRows.map((r) => [
        r.productId,
        { count: Number(r.count) || 0, revenue: Number(r.revenue) || 0 }
      ])
    );
    const priorSalesMap = new Map(
      priorSalesRows.map((r) => [r.productId, Number(r.count) || 0])
    );
    const allSalesMap = new Map(
      allSalesRows.map((r) => [
        r.productId,
        { count: Number(r.count) || 0, revenue: Number(r.revenue) || 0 }
      ])
    );
    const recentViewsMap = new Map(
      recentViewsRows.filter((r) => r.slug).map((r) => [r.slug, Number(r.count) || 0])
    );
    const priorViewsMap = new Map(
      priorViewsRows.filter((r) => r.slug).map((r) => [r.slug, Number(r.count) || 0])
    );
    const refundMap = new Map(
      refundRows.map((r) => [r.productId, Number(r.count) || 0])
    );
    const progressMap = new Map(
      progressRows.map((r) => [
        r.productId,
        {
          learners: Number(r.learners) || 0,
          completed: Number(r.completed) || 0,
          touches: Number(r.touches) || 0
        }
      ])
    );
    const signals = allProducts.filter((p) => p.isActive).map((p) => {
      const m = metaBySlug.get(p.slug);
      const sales = allSalesMap.get(p.id)?.count ?? soldMap.get(p.slug) ?? 0;
      const revenue = allSalesMap.get(p.id)?.revenue ?? Math.round(Number(p.price || 0) * sales);
      const views = viewMap.get(p.slug) ?? 0;
      const favorites = favMap.get(p.slug) ?? 0;
      const refunds = refundMap.get(p.id) ?? 0;
      const prog = progressMap.get(p.id) || {
        learners: 0,
        completed: 0,
        touches: 0
      };
      const avgProgress = prog.touches > 0 ? Math.min(100, Math.round(prog.completed / prog.touches * 100)) : 0;
      const completionRate = avgProgress;
      const abandonmentRate = Math.max(0, 100 - avgProgress);
      const retentionProxy = prog.learners > 0 ? Math.min(100, Math.round(avgProgress * 0.9 + 10)) : 0;
      return {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        category: m?.category || p.category?.name || null,
        author: m?.author || null,
        views,
        recentViews: recentViewsMap.get(p.slug) ?? 0,
        priorViews: priorViewsMap.get(p.slug) ?? 0,
        sales,
        recentSales: recentSalesMap.get(p.id)?.count ?? 0,
        priorSales: priorSalesMap.get(p.id) ?? 0,
        favorites,
        refunds,
        revenueCents: Math.round(Number(revenue) || 0),
        learners: prog.learners,
        avgProgress,
        completionRate,
        abandonmentRate,
        retentionProxy
      };
    });
    return {
      products: signals,
      persistence: insights.persistence === "db" ? "db" : "partial",
      windowRecentDays: recentDays,
      windowPriorDays: priorDays,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error(
      "[ContentFy Intelligence] snapshot failed:",
      error instanceof Error ? error.message : error
    );
    const allProducts = await getAllProducts().catch(() => []);
    return {
      products: (allProducts || []).filter((p) => p.isActive).map((p) => ({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category?.name || null,
        author: null,
        views: 0,
        recentViews: 0,
        priorViews: 0,
        sales: 0,
        recentSales: 0,
        priorSales: 0,
        favorites: 0,
        refunds: 0,
        revenueCents: 0,
        learners: 0,
        avgProgress: 0,
        completionRate: 0,
        abandonmentRate: 0,
        retentionProxy: 0
      })),
      persistence: "memory",
      windowRecentDays: recentDays,
      windowPriorDays: priorDays,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}

// server/core/intelligence/intelligence-engine.ts
var IntelligenceEngine = class {
  constructor(config = resolveIntelligenceConfig()) {
    this.config = config;
  }
  async buildAdminDashboard() {
    const cacheKey = "intelligence:admin";
    const cached = intelligenceCacheGet(cacheKey);
    if (cached) return { ...cached, cacheHit: true };
    const cfg = resolveIntelligenceConfig(this.config);
    const snapshot = await buildIntelligenceSnapshot();
    const rows = behaviorEngine.toProductRows(snapshot.products, cfg);
    const health = analyticsEngine.marketplaceHealth(rows);
    const life = marketplaceInsights.byLifecycle(rows);
    const categories = marketplaceInsights.categories(rows, cfg);
    const creators = marketplaceInsights.creators(rows, cfg);
    const alerts = detectAlerts(rows, categories, cfg);
    const insights = buildInsights2(rows);
    const payload = {
      health,
      topProducts: marketplaceInsights.topProducts(rows, 12),
      topCreators: creators.slice(0, 12),
      topCategories: categories.slice(0, 12),
      emerging: life.emerging.sort((a, b) => (b.salesDeltaPercent || 0) - (a.salesDeltaPercent || 0)).slice(0, 10),
      stable: life.stable.sort((a, b) => b.productScore.score - a.productScore.score).slice(0, 10),
      declining: life.declining.sort((a, b) => (a.salesDeltaPercent || 0) - (b.salesDeltaPercent || 0)).slice(0, 10),
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
      note: snapshot.persistence === "db" ? null : "Agrega\xE7\xF5es parciais \u2014 verifique migration/DB. Nenhum n\xFAmero foi inventado.",
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheHit: false
    };
    intelligenceCacheSet(cacheKey, payload, 6e4);
    return payload;
  }
  async buildCreatorDashboard(input) {
    const authorHint = (input.userName || "").trim().toLowerCase();
    const cacheKey = `intelligence:creator:${authorHint || "platform"}`;
    const cached = intelligenceCacheGet(cacheKey);
    if (cached) return { ...cached, cacheHit: true };
    const cfg = resolveIntelligenceConfig(this.config);
    const snapshot = await buildIntelligenceSnapshot();
    const allRows = behaviorEngine.toProductRows(snapshot.products, cfg);
    let ownershipMode = "platform_proxy";
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
    const completionRate = rows.length > 0 ? Math.round(
      rows.reduce((s, r) => s + r.completionRate, 0) / rows.length
    ) : 0;
    const retentionProxy = rows.length > 0 ? Math.round(
      rows.reduce((s, r) => s + r.retentionProxy, 0) / rows.length
    ) : 0;
    const conversionRate = views > 0 ? Math.round(sales / views * 1e3) / 10 : 0;
    const refundRate = sales > 0 ? Math.round(refunds / sales * 1e3) / 10 : 0;
    const categories = marketplaceInsights.categories(rows, cfg);
    const alerts = detectAlerts(rows, categories, cfg);
    const insights = buildInsights2(rows);
    const suggestions = buildCreatorSuggestions(rows);
    const payload = {
      summary: {
        views,
        sales,
        conversionRate,
        completionRate,
        retentionProxy,
        revenueCents,
        refundRate,
        favorites
      },
      products: rows.sort((a, b) => b.productScore.score - a.productScore.score).slice(0, 24),
      ranking: marketplaceInsights.topProducts(rows, 10),
      insights,
      suggestions,
      alerts,
      note: ownershipMode === "author_meta" ? "Escopo por autor em product_discovery_meta (soft). Ownership formal ainda n\xE3o existe no schema." : "Proxy de plataforma \u2014 sem products.creatorId. Quando meta.author coincidir com seu nome, o filtro ativa automaticamente.",
      ownershipMode,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheHit: false
    };
    intelligenceCacheSet(cacheKey, payload, 6e4);
    return payload;
  }
};
var intelligenceEngine = new IntelligenceEngine();

// server/core/intelligence/engagement-engine.ts
var EngagementEngine = class {
  topEngaged(rows, limit = 10) {
    return [...rows].sort(
      (a, b) => b.engagementScore.score - a.engagementScore.score || b.favorites - a.favorites
    ).slice(0, limit);
  }
};
var engagementEngine = new EngagementEngine();

// server/core/intelligence/index.ts
init_cache4();

// server/core/index.ts
init_orchestrator2();

// server/core/media/media-engine.ts
var MediaEngine = class {
  planTransform(asset, options) {
    return {
      assetId: asset.id,
      targetFormat: options.format ?? "webp",
      maxWidth: options.maxWidth,
      quality: options.quality ?? 80,
      compress: options.compress ?? true,
      cdnReady: Boolean(asset.cdnReady),
      status: "planned"
    };
  }
};
var mediaEngine = new MediaEngine();

// server/core/community/community-engine.ts
var CommunityEngine = class {
  createSpace(space) {
    return { ...space, id: `cf_space_${Date.now()}` };
  }
  openThread(input) {
    return {
      ...input,
      id: `cf_thread_${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
var communityEngine = new CommunityEngine();

// server/core/notifications/notification-center.ts
var NotificationCenter = class {
  inbox = /* @__PURE__ */ new Map();
  enqueue(payload) {
    const record = {
      ...payload,
      id: `cf_n_${Date.now()}`,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const list = this.inbox.get(payload.userId) ?? [];
    list.unshift(record);
    this.inbox.set(payload.userId, list);
    return record;
  }
  list(userId) {
    return this.inbox.get(userId) ?? [];
  }
  markRead(userId, id) {
    const list = this.inbox.get(userId) ?? [];
    const next = list.map((n) => n.id === id ? { ...n, read: true } : n);
    this.inbox.set(userId, next);
    return next.find((n) => n.id === id) ?? null;
  }
};
var notificationCenter = new NotificationCenter();

// server/core/products/product-ecosystem.ts
init_contentfy();
var ProductEcosystemEngine = class {
  forProduct(input) {
    return {
      productId: input.productId,
      slug: input.slug,
      surfaces: input.surfaces ?? [...DEFAULT_PRODUCT_SURFACES],
      aiSlug: input.aiSlug ?? `${input.slug}-ai`
    };
  }
};
var productEcosystemEngine = new ProductEcosystemEngine();

// server/routers/contentfy.ts
var contentfyRouter = router({
  identity: publicProcedure.query(() => CONTENTFY_IDENTITY),
  capabilities: publicProcedure.query(() => ({
    identity: CONTENTFY_IDENTITY,
    domains: CONTENTFY_CORE_STATUS,
    paymentDisplayName: paymentEngine.getDisplayName(),
    guarantee: guaranteeEngine.getPolicy()
  })),
  guaranteePolicy: publicProcedure.query(() => guaranteeEngine.getPolicy()),
  previewSuccessScore: publicProcedure.input(
    z9.object({
      videoProgress: z9.number().min(0).max(1).default(0),
      activitiesCompleted: z9.number().min(0).default(0),
      quizzesPassed: z9.number().min(0).default(0),
      applicationTasks: z9.number().min(0).default(0),
      consistencyDays: z9.number().min(0).default(0),
      completionRate: z9.number().min(0).max(1).default(0)
    })
  ).query(({ input }) => successScoreEngine.compute(input))
});

// server/routers/protect.ts
init_contentfy();
import { z as z10 } from "zod";
import { TRPCError as TRPCError10 } from "@trpc/server";
init_db();

// server/core/rate-limit/memory-provider.ts
var MemoryRateLimitProvider = class {
  name = "memory";
  durable = false;
  hits = /* @__PURE__ */ new Map();
  async hit(key, limit, windowMs) {
    const now = Date.now();
    const stamps = (this.hits.get(key) ?? []).filter((t2) => now - t2 < windowMs);
    if (stamps.length >= limit) {
      const oldest = stamps[0] ?? now;
      this.hits.set(key, stamps);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, windowMs - (now - oldest))
      };
    }
    stamps.push(now);
    this.hits.set(key, stamps);
    return { allowed: true, remaining: Math.max(0, limit - stamps.length) };
  }
};

// server/core/rate-limit/redis-provider.stub.ts
var RedisRateLimitProvider = class {
  constructor(redisUrl) {
    this.redisUrl = redisUrl;
    if (!redisUrl) {
      throw new Error("REDIS_URL required for RedisRateLimitProvider");
    }
  }
  name = "redis";
  durable = true;
  async hit(_key, _limit, _windowMs) {
    throw new Error(
      "RedisRateLimitProvider not implemented. Install a Redis client and complete server/core/rate-limit/redis-provider.stub.ts before enabling RATE_LIMIT_PROVIDER=redis."
    );
  }
};

// server/core/rate-limit/index.ts
var singleton = null;
function getRateLimitProvider() {
  if (singleton) return singleton;
  const mode = (process.env.RATE_LIMIT_PROVIDER || "memory").toLowerCase();
  if (mode === "redis") {
    const url = process.env.REDIS_URL || "";
    singleton = new RedisRateLimitProvider(url);
  } else {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      console.warn(
        "[ContentFy Protect] RATE_LIMIT_PROVIDER=memory em ambiente multi-inst\xE2ncia \u2014 n\xE3o \xE9 dur\xE1vel. Configure Redis para produ\xE7\xE3o."
      );
    }
    singleton = new MemoryRateLimitProvider();
  }
  return singleton;
}
async function assertRateLimitOrThrow(key, limit, windowMs, message) {
  const provider = getRateLimitProvider();
  const result = await provider.hit(key, limit, windowMs);
  if (!result.allowed) {
    const err = new Error(message);
    err.code = "RATE_LIMITED";
    err.retryAfterMs = result.retryAfterMs;
    throw err;
  }
  return result;
}

// server/routers/protect.ts
var refundReasonSchema = z10.enum([
  "content_mismatch",
  "access_issue",
  "accidental_purchase",
  "not_needed",
  "other"
]);
var statusSchema = z10.enum([
  "requested",
  "under_review",
  "approved",
  "rejected",
  "processing",
  "refunded",
  "failed",
  "cancelled"
]);
function emitRefundEvent(userId, kind, title, body) {
  notificationCenter.enqueue({
    userId,
    kind: "guarantee",
    title,
    body,
    channels: ["in_app"],
    metadata: { event: kind }
  });
}
async function audit(input) {
  try {
    await insertRefundAuditEvent({
      refundRequestId: input.refundRequestId ?? null,
      orderId: input.orderId ?? null,
      actorUserId: input.actorUserId ?? null,
      eventType: input.eventType,
      fromStatus: input.fromStatus ?? null,
      toStatus: input.toStatus ?? null,
      message: input.message ?? null,
      metadataJson: input.metadata ? JSON.stringify(sanitizeAuditMetadata(input.metadata)) : null
    });
  } catch (error) {
    console.error(
      "[ContentFy Protect] audit insert failed:",
      error instanceof Error ? error.message : error
    );
  }
}
function sanitizeAuditMetadata(meta) {
  const blocked = /secret|token|password|authorization|api[_-]?key|sk_live|sk_test/i;
  const out = {};
  for (const [k, v] of Object.entries(meta)) {
    if (blocked.test(k)) continue;
    if (typeof v === "string" && blocked.test(v)) continue;
    out[k] = v;
  }
  return out;
}
async function buildOrderProtectionContext(orderId, userId, isAdmin) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new TRPCError10({ code: "NOT_FOUND", message: "Pedido n\xE3o encontrado" });
  }
  if (!canAccessOwnedResource({
    actorUserId: userId,
    actorRole: isAdmin ? "admin" : "user",
    ownerUserId: order.userId
  })) {
    throw new TRPCError10({
      code: "FORBIDDEN",
      message: "Voc\xEA n\xE3o tem permiss\xE3o para acessar este pedido"
    });
  }
  const product = await getProductById(order.productId);
  if (!product) {
    throw new TRPCError10({ code: "NOT_FOUND", message: "Produto n\xE3o encontrado" });
  }
  const requests = await getRefundRequestsByOrderId(orderId);
  const active = await getActiveRefundRequestForOrder(orderId);
  const access = await getUserProductByOrder(orderId);
  const eligibility = getRefundEligibility({
    orderStatus: order.status,
    purchasedAt: order.createdAt,
    guaranteeDays: product.guaranteeDays,
    productEligible: product.guaranteeDays > 0,
    hasActiveRequest: Boolean(active),
    alreadyRefunded: order.status === "refunded"
  });
  return {
    order,
    product,
    requests,
    activeRequest: active,
    access,
    eligibility,
    policy: guaranteeEngine.getPolicy(eligibility.guaranteeDays),
    brand: PROTECT_BRAND,
    reasonLabels: REFUND_REASON_LABELS
  };
}
var protectRouter = router({
  policy: publicProcedure.query(() => guaranteeEngine.getPolicy()),
  brand: publicProcedure.query(() => PROTECT_BRAND),
  getOrderProtection: protectedProcedure.input(z10.object({ orderId: z10.number().int().positive() })).query(async ({ ctx, input }) => {
    const context = await buildOrderProtectionContext(
      input.orderId,
      ctx.user.id,
      ctx.user.role === "admin"
    );
    const activeId = context.activeRequest?.id;
    const auditTrail = activeId ? await listRefundAuditEvents(activeId) : [];
    return { ...context, auditTrail };
  }),
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const orders2 = await getUserOrders(ctx.user.id);
    return Promise.all(
      orders2.map(async (order) => {
        const product = await getProductById(order.productId);
        const active = await getActiveRefundRequestForOrder(order.id);
        const eligibility = getRefundEligibility({
          orderStatus: order.status,
          purchasedAt: order.createdAt,
          guaranteeDays: product?.guaranteeDays ?? 30,
          productEligible: Boolean(product && product.guaranteeDays > 0),
          hasActiveRequest: Boolean(active),
          alreadyRefunded: order.status === "refunded"
        });
        return {
          order,
          product: product ? {
            id: product.id,
            name: product.name,
            slug: product.slug,
            guaranteeDays: product.guaranteeDays
          } : null,
          eligibility,
          activeRequest: active
        };
      })
    );
  }),
  createRequest: protectedProcedure.input(
    z10.object({
      orderId: z10.number().int().positive(),
      reason: refundReasonSchema,
      details: z10.string().max(2e3).optional(),
      acknowledge: z10.literal(true)
    })
  ).mutation(async ({ ctx, input }) => {
    try {
      await assertRateLimitOrThrow(
        `protect:create:${ctx.user.id}`,
        5,
        60 * 60 * 1e3,
        "Muitas solicita\xE7\xF5es. Aguarde um pouco e tente novamente."
      );
    } catch (error) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: error instanceof Error ? error.message : "Muitas solicita\xE7\xF5es. Aguarde um pouco e tente novamente."
      });
    }
    const ctxData = await buildOrderProtectionContext(
      input.orderId,
      ctx.user.id,
      false
    );
    if (!ctxData.eligibility.eligible) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: ctxData.eligibility.humanMessage
      });
    }
    const existing = await getActiveRefundRequestForOrder(input.orderId);
    if (existing) {
      throw new TRPCError10({
        code: "CONFLICT",
        message: "J\xE1 existe uma solicita\xE7\xE3o ativa para este pedido."
      });
    }
    const id = await createRefundRequest({
      orderId: ctxData.order.id,
      userId: ctx.user.id,
      productId: ctxData.product.id,
      reason: input.reason,
      details: input.details?.trim() || null,
      status: "requested",
      refundAmount: ctxData.order.amount,
      accessRevocationStatus: "not_applicable",
      reconciliationNeeded: false
    });
    await audit({
      refundRequestId: id,
      orderId: ctxData.order.id,
      actorUserId: ctx.user.id,
      eventType: "refund.requested",
      fromStatus: null,
      toStatus: "requested",
      message: "Solicita\xE7\xE3o criada pelo aluno",
      metadata: { reason: input.reason }
    });
    emitRefundEvent(
      ctx.user.id,
      "refund.requested",
      "Solicita\xE7\xE3o recebida",
      `Sua solicita\xE7\xE3o de reembolso #${id} foi registrada no ContentFy Protect.`
    );
    return {
      request: await getRefundRequestById(id),
      eligibility: ctxData.eligibility
    };
  }),
  cancelRequest: protectedProcedure.input(z10.object({ requestId: z10.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request || request.userId !== ctx.user.id) {
      throw new TRPCError10({
        code: "NOT_FOUND",
        message: "Solicita\xE7\xE3o n\xE3o encontrada"
      });
    }
    if (!canTransitionRefundStatus(request.status, "cancelled")) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Esta solicita\xE7\xE3o n\xE3o pode ser cancelada neste status."
      });
    }
    const updated = await updateRefundRequest(request.id, {
      status: "cancelled"
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: "refund.cancelled",
      fromStatus: request.status,
      toStatus: "cancelled",
      message: "Cancelada pelo aluno"
    });
    return updated;
  }),
  adminList: adminProcedure.input(
    z10.object({
      status: statusSchema.optional(),
      productId: z10.number().int().positive().optional(),
      userId: z10.number().int().positive().optional(),
      from: z10.string().datetime().optional(),
      to: z10.string().datetime().optional()
    }).optional()
  ).query(async ({ input }) => {
    return listRefundRequests({
      status: input?.status,
      productId: input?.productId,
      userId: input?.userId,
      from: input?.from ? new Date(input.from) : void 0,
      to: input?.to ? new Date(input.to) : void 0
    });
  }),
  adminGet: adminProcedure.input(z10.object({ requestId: z10.number().int().positive() })).query(async ({ input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request) {
      throw new TRPCError10({
        code: "NOT_FOUND",
        message: "Solicita\xE7\xE3o n\xE3o encontrada"
      });
    }
    const context = await buildOrderProtectionContext(
      request.orderId,
      request.userId,
      true
    );
    const auditTrail = await listRefundAuditEvents(request.id);
    return { request, ...context, auditTrail };
  }),
  adminTransition: adminProcedure.input(
    z10.object({
      requestId: z10.number().int().positive(),
      status: statusSchema,
      adminNotes: z10.string().max(4e3).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request) {
      throw new TRPCError10({
        code: "NOT_FOUND",
        message: "Solicita\xE7\xE3o n\xE3o encontrada"
      });
    }
    if (!canTransitionRefundStatus(
      request.status,
      input.status
    )) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: `Transi\xE7\xE3o inv\xE1lida: ${request.status} \u2192 ${input.status}`
      });
    }
    if (input.status === "refunded" || input.status === "processing") {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: input.status === "refunded" ? "Use a a\xE7\xE3o \u201CProcessar reembolso\u201D para concluir o estorno com seguran\xE7a." : "O status processing \xE9 definido automaticamente ao processar o reembolso."
      });
    }
    const updated = await updateRefundRequest(request.id, {
      status: input.status,
      adminNotes: input.adminNotes ?? request.adminNotes,
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedBy: ctx.user.id
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: `refund.${input.status}`,
      fromStatus: request.status,
      toStatus: input.status,
      message: "Transi\xE7\xE3o administrativa"
    });
    const eventMap = {
      under_review: "refund.under_review",
      approved: "refund.approved",
      rejected: "refund.rejected",
      failed: "refund.failed"
    };
    const event = eventMap[input.status];
    if (event) {
      emitRefundEvent(
        request.userId,
        event,
        "Atualiza\xE7\xE3o ContentFy Protect",
        `Sua solicita\xE7\xE3o #${request.id} agora est\xE1: ${input.status}.`
      );
    }
    return updated;
  }),
  adminAddNotes: adminProcedure.input(
    z10.object({
      requestId: z10.number().int().positive(),
      adminNotes: z10.string().min(1).max(4e3)
    })
  ).mutation(async ({ ctx, input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request) {
      throw new TRPCError10({
        code: "NOT_FOUND",
        message: "Solicita\xE7\xE3o n\xE3o encontrada"
      });
    }
    const updated = await updateRefundRequest(request.id, {
      adminNotes: input.adminNotes,
      reviewedBy: ctx.user.id,
      reviewedAt: /* @__PURE__ */ new Date()
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: "refund.notes_updated",
      message: "Observa\xE7\xE3o administrativa atualizada"
    });
    return updated;
  }),
  /**
   * Explicit admin action — Stripe refund once (idempotent).
   * Homologation: requires sk_test_ unless CONTENTFY_PROTECT_HOMOLOGATION=false and NODE_ENV=production.
   */
  adminProcessRefund: adminProcedure.input(
    z10.object({
      requestId: z10.number().int().positive(),
      confirm: z10.literal(true)
    })
  ).mutation(async ({ ctx, input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request) {
      throw new TRPCError10({
        code: "NOT_FOUND",
        message: "Solicita\xE7\xE3o n\xE3o encontrada"
      });
    }
    if (request.status === "refunded" && request.providerRefundId) {
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.process_idempotent_hit",
        message: "Processamento ignorado \u2014 j\xE1 reembolsado",
        metadata: { providerRefundId: request.providerRefundId }
      });
      return { alreadyProcessed: true, request };
    }
    if (request.status !== "approved" && request.status !== "processing" && request.status !== "failed") {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Aprove a solicita\xE7\xE3o antes de processar o reembolso."
      });
    }
    if (request.status === "approved" && !canTransitionRefundStatus("approved", "processing")) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Transi\xE7\xE3o inv\xE1lida para processing"
      });
    }
    if (request.status === "failed" && !canTransitionRefundStatus("failed", "processing")) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Nova tentativa inv\xE1lida a partir de failed"
      });
    }
    const order = await getOrderById(request.orderId);
    if (!order?.stripePaymentIntentId) {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Pedido sem PaymentIntent Stripe para reembolso."
      });
    }
    if (order.status === "refunded") {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "Pedido j\xE1 est\xE1 marcado como reembolsado."
      });
    }
    const keyCheck = assertStripeSecretForProtect();
    if (!keyCheck.ok) {
      throw new TRPCError10({
        code: "PRECONDITION_FAILED",
        message: keyCheck.errorMessage
      });
    }
    const amount = request.refundAmount ?? order.amount;
    const idempotencyKey = request.idempotencyKey || `cf_protect_refund_${request.id}_${request.orderId}`;
    const fromStatus = request.status;
    await updateRefundRequest(request.id, {
      status: "processing",
      idempotencyKey,
      reviewedBy: ctx.user.id,
      reviewedAt: /* @__PURE__ */ new Date(),
      accessRevocationStatus: "pending"
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: "refund.processing",
      fromStatus,
      toStatus: "processing",
      message: "Tentativa de processamento Stripe iniciada",
      metadata: {
        amountCents: amount,
        paymentIntentId: order.stripePaymentIntentId,
        idempotencyKey
      }
    });
    emitRefundEvent(
      request.userId,
      "refund.processing",
      "Reembolso em processamento",
      `Estamos processando o reembolso da solicita\xE7\xE3o #${request.id}.`
    );
    const result = await processStripeRefund({
      paymentIntentId: order.stripePaymentIntentId,
      amountCents: amount,
      maxAmountCents: order.amount,
      idempotencyKey
    });
    if (!result.ok) {
      const failed = await updateRefundRequest(request.id, {
        status: "failed",
        adminNotes: `${request.adminNotes ?? ""}
[Stripe] ${result.errorMessage}`.trim(),
        accessRevocationStatus: "not_applicable"
      });
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "refund.failed",
        fromStatus: "processing",
        toStatus: "failed",
        message: result.errorMessage || "Falha no provedor"
      });
      emitRefundEvent(
        request.userId,
        "refund.failed",
        "Falha no reembolso",
        `Houve uma falha ao processar o reembolso #${request.id}. Nossa equipe ir\xE1 analisar.`
      );
      throw new TRPCError10({
        code: "INTERNAL_SERVER_ERROR",
        message: result.errorMessage || "Falha ao processar reembolso",
        cause: failed
      });
    }
    const finalize = await finalizeRefundAndRevokeAccess({
      orderId: order.id,
      requestId: request.id,
      providerRefundId: result.providerRefundId,
      refundAmount: amount,
      reviewedBy: ctx.user.id
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: "refund.completed",
      fromStatus: "processing",
      toStatus: "refunded",
      message: "Reembolso confirmado no Stripe",
      metadata: {
        providerRefundId: result.providerRefundId,
        amountRefunded: result.amountRefunded,
        currency: result.currency,
        accessRevocationStatus: finalize.accessRevocationStatus,
        reconciliationNeeded: finalize.reconciliationNeeded
      }
    });
    try {
      const { invalidateExperienceForUser: invalidateExperienceForUser2 } = await Promise.resolve().then(() => (init_cache3(), cache_exports3));
      invalidateExperienceForUser2(request.userId);
      const { emitOrchestratorEvent: emitOrchestratorEvent2 } = await Promise.resolve().then(() => (init_orchestrator2(), orchestrator_exports));
      emitOrchestratorEvent2(
        "PRODUCT_REFUNDED",
        {
          userId: request.userId,
          orderId: request.orderId
        },
        "protect"
      );
    } catch {
    }
    if (finalize.accessRevocationStatus === "revoked") {
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "access.revoked",
        message: "Acesso ao produto desativado (hist\xF3rico preservado)"
      });
    } else {
      await audit({
        refundRequestId: request.id,
        orderId: request.orderId,
        actorUserId: ctx.user.id,
        eventType: "access.revoke_failed",
        message: "Refund Stripe OK, mas revoga\xE7\xE3o falhou \u2014 reconcilia\xE7\xE3o necess\xE1ria"
      });
    }
    emitRefundEvent(
      request.userId,
      "refund.completed",
      "Reembolso conclu\xEDdo",
      `O reembolso da solicita\xE7\xE3o #${request.id} foi conclu\xEDdo. O acesso ao produto foi encerrado.`
    );
    console.info(
      `[ContentFy Protect] Refund completed request=${request.id} stripe=${result.providerRefundId} by admin=${ctx.user.id} revoke=${finalize.accessRevocationStatus}`
    );
    const completed = await getRefundRequestById(request.id);
    return {
      alreadyProcessed: false,
      request: completed,
      providerRefundId: result.providerRefundId,
      accessRevocationStatus: finalize.accessRevocationStatus,
      reconciliationNeeded: finalize.reconciliationNeeded
    };
  }),
  /** Admin repair when Stripe refunded but access revoke failed. */
  adminRepairAccessRevocation: adminProcedure.input(z10.object({ requestId: z10.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const request = await getRefundRequestById(input.requestId);
    if (!request || request.status !== "refunded") {
      throw new TRPCError10({
        code: "BAD_REQUEST",
        message: "S\xF3 \xE9 poss\xEDvel reparar revoga\xE7\xE3o em solicita\xE7\xF5es refunded."
      });
    }
    await revokeProductAccessByOrder(request.orderId);
    const updated = await updateRefundRequest(request.id, {
      accessRevocationStatus: "revoked",
      reconciliationNeeded: false,
      reviewedBy: ctx.user.id,
      reviewedAt: /* @__PURE__ */ new Date()
    });
    await audit({
      refundRequestId: request.id,
      orderId: request.orderId,
      actorUserId: ctx.user.id,
      eventType: "access.revoked_repair",
      message: "Revoga\xE7\xE3o reparada administrativamente"
    });
    return updated;
  })
});

// server/routers/discovery.ts
import { z as z11 } from "zod";
init_db();
async function loadCatalogProducts() {
  const rows = await getAllProducts();
  return rows.filter((p) => p.isActive).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    type: p.type,
    description: p.description,
    coverImage: p.coverImage,
    thumbnailImage: p.thumbnailImage,
    price: p.price,
    categoryName: p.category?.name ?? null,
    isActive: p.isActive,
    createdAt: p.createdAt
  }));
}
async function buildProfile(userId) {
  if (!userId) return null;
  const [favorites, views, searches, owned] = await Promise.all([
    listFavoriteSlugs(userId),
    getRecentViewSlugs(userId),
    getRecentSearchQueries(userId),
    getUserProducts(userId)
  ]);
  const { getSeedMetaBySlug: getSeedMetaBySlug2 } = await Promise.resolve().then(() => (init_seed_metadata(), seed_metadata_exports));
  const preferences = Array.from(
    new Set(
      [...views, ...favorites].map((slug) => getSeedMetaBySlug2(slug)?.category).filter((c) => Boolean(c))
    )
  );
  return {
    userId,
    preferences,
    goals: [],
    completedProductIds: [],
    ownedProductIds: (owned || []).map((o) => o.userProduct?.productId ?? o.product?.id).filter((id) => typeof id === "number"),
    favoriteSlugs: favorites,
    recentViewSlugs: views,
    recentSearchQueries: searches,
    signals: []
  };
}
var discoveryRouter = router({
  home: publicProcedure.query(async ({ ctx }) => {
    const products2 = await loadCatalogProducts();
    const [dbMeta, trendingSignals, profile, progress, favorites] = await Promise.all([
      listDiscoveryDbMeta(),
      buildTrendingSignals(),
      buildProfile(ctx.user?.id),
      ctx.user?.id ? buildContinueLearningSnapshots(ctx.user.id) : Promise.resolve([]),
      ctx.user?.id ? listFavoriteSlugs(ctx.user.id) : Promise.resolve([])
    ]);
    const relRows = await listDiscoveryDbRelationships();
    if (relRows.length) {
      const eng = new RelationshipEngine(
        relRows.map((r) => ({
          fromSlug: r.fromSlug,
          toSlug: r.toSlug,
          type: r.relationType,
          weight: r.weight,
          label: r.label || void 0
        }))
      );
      void eng;
    }
    return discoveryEngine.buildHome({
      products: products2,
      dbMeta,
      profile,
      progress,
      trendingSignals,
      favoriteSlugs: favorites
    });
  }),
  search: publicProcedure.input(
    z11.object({
      query: z11.string().min(1).max(200),
      limit: z11.number().int().min(1).max(50).optional()
    })
  ).query(async ({ ctx, input }) => {
    const products2 = await loadCatalogProducts();
    const dbMeta = await listDiscoveryDbMeta();
    if (ctx.user?.id) {
      await trackDiscoveryEvent({
        userId: ctx.user.id,
        eventType: "search",
        query: input.query
      });
    } else {
      await trackDiscoveryEvent({
        eventType: "search",
        query: input.query
      });
    }
    return discoveryEngine.search(
      input.query,
      { products: products2, dbMeta },
      input.limit ?? 24
    );
  }),
  related: publicProcedure.input(z11.object({ slug: z11.string().min(1).max(255) })).query(async ({ input }) => {
    const products2 = await loadCatalogProducts();
    const dbMeta = await listDiscoveryDbMeta();
    return discoveryEngine.related(input.slug, { products: products2, dbMeta });
  }),
  track: publicProcedure.input(
    z11.object({
      eventType: z11.enum([
        "view",
        "click",
        "dwell",
        "search",
        "favorite",
        "wishlist"
      ]),
      productSlug: z11.string().max(255).optional(),
      productId: z11.number().int().optional(),
      category: z11.string().max(255).optional(),
      query: z11.string().max(512).optional(),
      dwellMs: z11.number().int().min(0).max(36e5).optional(),
      sessionId: z11.string().max(64).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    return trackDiscoveryEvent({
      userId: ctx.user?.id ?? null,
      sessionId: input.sessionId,
      eventType: input.eventType,
      productSlug: input.productSlug,
      productId: input.productId,
      category: input.category,
      query: input.query,
      dwellMs: input.dwellMs
    });
  }),
  myList: protectedProcedure.query(async ({ ctx }) => {
    const slugs = await listFavoriteSlugs(ctx.user.id);
    const products2 = await loadCatalogProducts();
    const dbMeta = await listDiscoveryDbMeta();
    const home = discoveryEngine.buildHome({
      products: products2,
      dbMeta,
      favoriteSlugs: slugs,
      profile: await buildProfile(ctx.user.id)
    });
    const items = home.rails.find((r) => r.id === "favorites")?.items || slugs.map((slug) => home.rails.flatMap((r) => r.items).find((i) => i.slug === slug)).filter(Boolean);
    return { slugs, items };
  }),
  addFavorite: protectedProcedure.input(
    z11.object({
      productSlug: z11.string().min(1).max(255),
      productId: z11.number().int().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const result = await addFavorite(
      ctx.user.id,
      input.productSlug,
      input.productId
    );
    await trackDiscoveryEvent({
      userId: ctx.user.id,
      eventType: "favorite",
      productSlug: input.productSlug,
      productId: input.productId
    });
    return result;
  }),
  removeFavorite: protectedProcedure.input(z11.object({ productSlug: z11.string().min(1).max(255) })).mutation(async ({ ctx, input }) => {
    return removeFavorite(ctx.user.id, input.productSlug);
  }),
  isFavorite: protectedProcedure.input(z11.object({ productSlug: z11.string().min(1).max(255) })).query(async ({ ctx, input }) => {
    const slugs = await listFavoriteSlugs(ctx.user.id);
    return { favorite: slugs.includes(input.productSlug) };
  }),
  continueLearning: protectedProcedure.query(async ({ ctx }) => {
    const progress = await buildContinueLearningSnapshots(
      ctx.user.id
    );
    return discoveryEngine.buildHome({
      products: await loadCatalogProducts(),
      progress,
      profile: await buildProfile(ctx.user.id)
    }).continueLearning;
  }),
  adminInsights: adminProcedure.query(async () => {
    return getAdminDiscoveryInsights();
  })
});

// server/routers/learn.ts
import { TRPCError as TRPCError11 } from "@trpc/server";
import { z as z12 } from "zod";
init_db();
async function buildSignals(userId) {
  const [owned, progressSnaps, activeGoalId, allProducts] = await Promise.all([
    getUserProducts(userId),
    buildContinueLearningSnapshots(userId),
    getActiveGoalId(userId),
    getAllProducts()
  ]);
  const productNames = {};
  for (const p of allProducts) {
    productNames[p.slug] = p.name;
  }
  const ownedProductSlugs = [];
  for (const row of owned || []) {
    const slug = row.product?.slug;
    if (slug) {
      ownedProductSlugs.push(slug);
      if (row.product?.name) productNames[slug] = row.product.name;
    }
  }
  const progressBySlug = {};
  let completedLessonCount = 0;
  let totalLessonTouches = 0;
  let coursesCompleted = 0;
  for (const snap of progressSnaps) {
    const pct = Math.min(
      100,
      Math.round(
        snap.completedLessons / Math.max(snap.totalLessons, 1) * 100
      )
    );
    progressBySlug[snap.productSlug] = pct;
    completedLessonCount += snap.completedLessons;
    totalLessonTouches += snap.totalLessons;
    if (pct >= 100) coursesCompleted += 1;
    if (!ownedProductSlugs.includes(snap.productSlug)) {
      ownedProductSlugs.push(snap.productSlug);
    }
    productNames[snap.productSlug] = snap.productName;
  }
  for (const slug of ownedProductSlugs) {
    if (progressBySlug[slug] == null) {
      progressBySlug[slug] = 20;
    }
  }
  const last = progressSnaps[0];
  const signals = {
    userId,
    ownedProductSlugs,
    completedLessonCount,
    totalLessonTouches,
    coursesCompleted,
    streakDays: 0,
    // Real streak requires daily event log — wire when Learn events table expands
    progressBySlug,
    lastLesson: last ? {
      productId: last.productId,
      productSlug: last.productSlug,
      productName: last.productName,
      lessonTitle: last.lastLessonTitle,
      moduleTitle: last.lastModuleTitle,
      href: last.productId ? `/my-account/course/${last.productId}` : `/produto/${last.productSlug}`
    } : void 0,
    activeGoalId,
    purchasedAtLeastOnce: ownedProductSlugs.length > 0
  };
  return { signals, productNames };
}
var learnRouter = router({
  home: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames });
  }),
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames });
  }),
  goals: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const competencies = competencyEngine.evaluate(signals);
    return goalEngine.evaluate(competencies, signals);
  }),
  catalogGoals: protectedProcedure.query(async () => LEARN_GOALS),
  setActiveGoal: protectedProcedure.input(z12.object({ goalId: z12.string().min(1).max(64) })).mutation(async ({ ctx, input }) => {
    const exists = LEARN_GOALS.some((g) => g.id === input.goalId);
    if (!exists) {
      throw new TRPCError11({
        code: "BAD_REQUEST",
        message: "Objetivo inv\xE1lido"
      });
    }
    const result = await setActiveGoalId(ctx.user.id, input.goalId);
    const { invalidateExperienceForUser: invalidateExperienceForUser2 } = await Promise.resolve().then(() => (init_cache3(), cache_exports3));
    const experienceStore = await Promise.resolve().then(() => (init_experience_store(), experience_store_exports));
    invalidateExperienceForUser2(ctx.user.id);
    void experienceStore.recordActivityEvent({
      userId: ctx.user.id,
      eventType: "goal_updated",
      meta: { goalId: input.goalId }
    });
    const { emitOrchestratorEvent: emitOrchestratorEvent2 } = await Promise.resolve().then(() => (init_orchestrator2(), orchestrator_exports));
    emitOrchestratorEvent2(
      "GOAL_UPDATED",
      { userId: ctx.user.id, goalId: input.goalId },
      "learn"
    );
    return result;
  }),
  competencies: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const all = competencyEngine.evaluate(signals);
    return {
      all,
      acquired: all.filter((c) => c.status === "acquired"),
      inProgress: all.filter((c) => c.status === "in_progress"),
      missing: all.filter((c) => c.status === "missing"),
      stagnant: competencyEngine.stagnant(all, signals)
    };
  }),
  journey: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).journey;
  }),
  timeline: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).timeline;
  }),
  achievements: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).achievements;
  }),
  nextStep: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).nextStep;
  }),
  skillGraph: protectedProcedure.query(async ({ ctx }) => {
    const { signals } = await buildSignals(ctx.user.id);
    const competencies = competencyEngine.evaluate(signals);
    const goals = goalEngine.evaluate(competencies, signals);
    return skillGraph.build({ signals, competencies, goals });
  }),
  successIndex: protectedProcedure.query(async ({ ctx }) => {
    const { signals, productNames } = await buildSignals(ctx.user.id);
    return learnEngine.buildDashboard({ signals, productNames }).successIndex;
  })
});

// server/routers/success.ts
init_db();
async function learnerDashboard(userId) {
  const ctx = await buildSuccessContext(userId);
  return successEngine.buildDashboard(ctx);
}
var successRouter = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    return learnerDashboard(ctx.user.id);
  }),
  score: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.score;
  }),
  habits: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.habits;
  }),
  timeline: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.timeline;
  }),
  insights: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.insights;
  }),
  goals: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return dash.goals;
  }),
  recommendations: protectedProcedure.query(async ({ ctx }) => {
    const dash = await learnerDashboard(ctx.user.id);
    return {
      nextAction: dash.nextAction,
      recommendations: dash.recommendations,
      relatedProducts: dash.relatedProducts
    };
  }),
  /**
   * Aggregate analytics for creators — uses platform-wide proxies until
   * per-creator product ownership is wired. Does not alter creatorRouter.
   */
  creatorAnalytics: protectedProcedure.query(
    async ({ ctx }) => {
      void ctx.user;
      const products2 = await getAllProducts();
      const active = products2.filter((p) => p.isActive);
      const note = "Agregado de cat\xE1logo + cat\xE1logo Learn. M\xE9tricas por criador expandir\xE3o com ownership.";
      const abandonmentPoints = LEARN_PRODUCT_LINKS.map((l) => ({
        slug: l.productSlug,
        dropOffPercent: 0
      }));
      const topGoals = LEARN_GOALS.slice(0, 5).map((g) => ({
        goalId: g.id,
        goalName: g.name,
        seekers: 0
      }));
      return {
        learnerCount: 0,
        averageEvolution: 0,
        competenciesDeveloped: LEARN_PRODUCT_LINKS.reduce(
          (n, l) => n + l.competencyIds.length,
          0
        ),
        abandonmentPoints,
        topGoals,
        transformationRate: 0,
        note: `${note} Produtos ativos no cat\xE1logo: ${active.length}.`
      };
    }
  ),
  adminAnalytics: adminProcedure.query(
    async () => {
      const products2 = await getAllProducts();
      const byCourse = products2.filter((p) => p.isActive).slice(0, 20).map((p) => ({
        slug: p.slug,
        avgProgress: 0,
        learners: 0
      }));
      const categories = /* @__PURE__ */ new Map();
      for (const p of products2) {
        const cat = p.category?.name || "Geral";
        const row = categories.get(cat) || { sum: 0, n: 0 };
        row.n += 1;
        categories.set(cat, row);
      }
      return {
        averageScore: 0,
        averageEvolution: 0,
        habitReachRate: 0,
        abandonmentRate: 0,
        byCourse,
        byCategory: Array.from(categories.entries()).map(
          ([category, v]) => ({
            category,
            avgScore: 0,
            learners: v.n
          })
        ),
        sampleSize: 0,
        note: "Painel pronto. Valores populam com volume de sinais Success/Learn em produ\xE7\xE3o."
      };
    }
  )
});

// server/routers/experience.ts
import { z as z13 } from "zod";

// server/core/experience/experience-orchestrator.ts
init_contentfy();
init_db();
init_cache3();

// server/core/experience/next-best-action-engine.ts
init_config();
var NextBestActionEngine = class {
  decide(ctx) {
    const p = resolveNbaPriorities();
    const candidates = [];
    if (ctx.studentState === "new_user" || ctx.studentState === "no_products") {
      candidates.push({
        kind: "explore_catalog",
        title: "Explorar conte\xFAdos para come\xE7ar",
        reason: "Ainda n\xE3o h\xE1 produtos na sua biblioteca.",
        href: "/explorar",
        ctaLabel: "Explorar",
        priority: p.explore_catalog
      });
      candidates.push({
        kind: "complete_onboarding",
        title: "Definir seu objetivo principal",
        reason: "Com um objetivo claro, personalizamos sua jornada.",
        href: "/dashboard#onboarding",
        ctaLabel: "Come\xE7ar",
        priority: p.complete_onboarding
      });
    }
    if (ctx.studentState === "purchased_no_progress" && ctx.ownedProductSlugs[0]) {
      const slug = ctx.ownedProductSlugs[0];
      candidates.push({
        kind: "start_first_product",
        title: "Iniciar seu primeiro produto",
        reason: "Voc\xEA j\xE1 tem acesso \u2014 o pr\xF3ximo passo \xE9 come\xE7ar.",
        href: `/produto/${slug}`,
        ctaLabel: "Come\xE7ar agora",
        priority: p.start_first_product,
        meta: { productSlug: slug }
      });
    }
    if (ctx.productInProgress) {
      candidates.push({
        kind: "continue_lesson",
        title: ctx.productInProgress.lastLessonTitle ? `Continuar: ${ctx.productInProgress.lastLessonTitle}` : `Continuar ${ctx.productInProgress.productName}`,
        reason: "Retome de onde parou para manter const\xE2ncia.",
        href: ctx.productInProgress.href,
        ctaLabel: "Continuar jornada",
        priority: p.continue_lesson,
        meta: { productSlug: ctx.productInProgress.productSlug }
      });
    }
    if (ctx.studentState === "inactive_return" && ctx.productInProgress) {
      candidates.push({
        kind: "resume_journey",
        title: "Retomar sua jornada",
        reason: "H\xE1 progresso pendente esperando por voc\xEA.",
        href: ctx.productInProgress.href,
        ctaLabel: "Retomar",
        priority: p.resume_journey
      });
    }
    if (!ctx.activeGoalId && ctx.ownedProductCount > 0 && ctx.studentState !== "purchased_no_progress") {
      candidates.push({
        kind: "choose_goal",
        title: "Escolher um objetivo",
        reason: "Sem objetivo ativo, a personaliza\xE7\xE3o fica limitada.",
        href: "/my-account/evolucao",
        ctaLabel: "Definir objetivo",
        priority: p.choose_goal
      });
    }
    if (ctx.competenciesStagnant[0]) {
      const c = ctx.competenciesStagnant[0];
      candidates.push({
        kind: "review_stagnant_competency",
        title: `Desbloquear: ${c.name}`,
        reason: "Esta compet\xEAncia est\xE1 em evolu\xE7\xE3o lenta.",
        href: "/my-account/sucesso",
        ctaLabel: "Ver evolu\xE7\xE3o",
        priority: p.review_stagnant_competency,
        meta: { competencyId: c.id }
      });
    }
    if (ctx.recommendations[0]?.href) {
      const r = ctx.recommendations[0];
      candidates.push({
        kind: "related_product",
        title: r.title,
        reason: r.reason,
        href: r.href,
        ctaLabel: "Conhecer",
        priority: p.related_product,
        meta: { productSlug: r.productSlug ?? null }
      });
    }
    if (ctx.achievementsUnlocked.length > 0 && ctx.studentState === "course_completed") {
      const a = ctx.achievementsUnlocked[0];
      candidates.push({
        kind: "view_achievement",
        title: `Conquista: ${a.name}`,
        reason: "Celebre o marco e planeje o pr\xF3ximo ciclo.",
        href: "/my-account/achievements",
        ctaLabel: "Ver conquistas",
        priority: p.view_achievement
      });
    }
    if (candidates.length === 0) {
      return {
        kind: "explore_catalog",
        title: "Continuar explorando",
        reason: "H\xE1 conte\xFAdos selecionados para o seu momento.",
        href: "/explorar",
        ctaLabel: "Explorar",
        priority: p.explore_catalog
      };
    }
    return candidates.sort((a, b) => a.priority - b.priority)[0] ?? null;
  }
};
var nextBestActionEngine = new NextBestActionEngine();
function deriveStudentState(input) {
  if (input.enginesDegraded) return "service_degraded";
  if (input.learnUnavailable) return "partial_data";
  if (input.ownedProductCount === 0) return "no_products";
  const threshold = input.inactiveReturnDays ?? resolveInactiveReturnDays();
  const canBeInactiveReturn = input.hasPriorActivity && input.hasProgress && input.productInProgress && input.inactiveDays != null && input.inactiveDays >= threshold;
  if (canBeInactiveReturn) {
    return "inactive_return";
  }
  if (input.activeGoalProgress != null && input.activeGoalProgress >= 70 && input.activeGoalProgress < 100) {
    return "goal_near_completion";
  }
  if (input.coursesCompleted > 0 && !input.hasProgress) {
    return "course_completed";
  }
  if (!input.hasProgress) return "purchased_no_progress";
  if (input.hasProgress) return "active_learning";
  if (input.partialData) return "partial_data";
  return "new_user";
}

// server/core/experience/experience-fallback-service.ts
var ExperienceFallbackService = class {
  editorialRecommendations() {
    return [
      {
        id: "editorial:explorar",
        title: "Explorar cat\xE1logo ContentFy",
        reason: "Sele\xE7\xE3o editorial para come\xE7ar com clareza",
        href: "/explorar"
      }
    ];
  }
  greetingForState(state, firstName2, hour) {
    const name = firstName2 || "ol\xE1";
    const salutation = hour < 12 ? `Bom dia, ${name}.` : hour < 18 ? `Boa tarde, ${name}.` : `Boa noite, ${name}.`;
    switch (state) {
      case "no_products":
      case "new_user":
        return {
          salutation,
          headline: "Sua jornada come\xE7a aqui.",
          support: "Escolha um conte\xFAdo e avance no seu ritmo.",
          tone: "welcome"
        };
      case "purchased_no_progress":
        return {
          salutation,
          headline: "Seu primeiro passo est\xE1 pronto.",
          support: "Abra o produto adquirido e comece a evoluir.",
          tone: "guide"
        };
      case "inactive_return":
        return {
          salutation,
          headline: "Que bom ter voc\xEA de volta.",
          support: "Vamos continuar de onde voc\xEA parou?",
          tone: "return"
        };
      case "goal_near_completion":
        return {
          salutation,
          headline: "Voc\xEA est\xE1 perto do seu objetivo.",
          support: "Um passo a mais pode fechar esta etapa.",
          tone: "celebrate"
        };
      case "course_completed":
        return {
          salutation,
          headline: "Ciclo conclu\xEDdo com excel\xEAncia.",
          support: "Celebre a conquista e escolha o pr\xF3ximo avan\xE7o.",
          tone: "celebrate"
        };
      case "active_learning":
        return {
          salutation,
          headline: "Seu pr\xF3ximo passo est\xE1 pronto.",
          support: "Continue de onde parou para manter o ritmo.",
          tone: "continue"
        };
      case "service_degraded":
      case "partial_data":
        return {
          salutation,
          headline: "Sua \xE1rea do aluno est\xE1 dispon\xEDvel.",
          support: "Alguns insights podem aparecer em breve.",
          tone: "guide"
        };
      default:
        return {
          salutation,
          headline: "Bem-vindo \xE0 sua evolu\xE7\xE3o.",
          tone: "welcome"
        };
    }
  }
  journeySummary(ctx) {
    if (!ctx.activeGoalName && ctx.ownedProductCount === 0) {
      return {
        primaryGoalName: null,
        evolutionPercent: null,
        productInProgress: null,
        lastLessonTitle: null,
        message: "Explore conte\xFAdos selecionados para come\xE7ar."
      };
    }
    if (!ctx.activeGoalName) {
      return {
        primaryGoalName: null,
        evolutionPercent: ctx.averageProgress,
        productInProgress: ctx.productInProgress?.productName ?? null,
        lastLessonTitle: ctx.lastLessonTitle,
        message: "Escolha um objetivo para personalizarmos sua jornada."
      };
    }
    if (!ctx.productInProgress && ctx.ownedProductCount > 0) {
      return {
        primaryGoalName: ctx.activeGoalName,
        evolutionPercent: ctx.activeGoalProgress,
        productInProgress: null,
        lastLessonTitle: null,
        message: "Seu primeiro passo est\xE1 pronto."
      };
    }
    return {
      primaryGoalName: ctx.activeGoalName,
      evolutionPercent: ctx.activeGoalProgress,
      productInProgress: ctx.productInProgress?.productName ?? null,
      lastLessonTitle: ctx.lastLessonTitle,
      message: ctx.lastLessonTitle ? "Retome a \xFAltima aula e mantenha sua const\xE2ncia." : "Avance na jornada no seu ritmo."
    };
  }
  emptyHomePatch(state) {
    if (state === "no_products" || state === "new_user") {
      return {
        recommendations: this.editorialRecommendations(),
        onboardingNeeded: true
      };
    }
    return {};
  }
};
var experienceFallbackService = new ExperienceFallbackService();

// server/core/experience/experience-feed-service.ts
var ExperienceFeedService = class {
  fromDiscovery(items) {
    if (!items.length) return experienceFallbackService.editorialRecommendations();
    return items.slice(0, 6).map((r, i) => ({
      id: r.id || `rec:${r.productSlug || i}`,
      title: r.title,
      reason: r.reason,
      href: r.href,
      productSlug: r.productSlug
    }));
  }
};
var experienceFeedService = new ExperienceFeedService();

// server/core/experience/student-context-builder.ts
function firstName(name) {
  if (!name?.trim()) return null;
  return name.trim().split(/\s+/)[0] || null;
}
var StudentContextBuilder = class {
  build(input) {
    const learn = input.learn;
    const success = input.success;
    const discovery = input.discovery;
    const protect = input.protect;
    const ownedSlugs = learn?.ownedProductSlugs || [];
    const continueLearning = learn?.continueLearning || [];
    const productInProgress = continueLearning[0] || null;
    const hasProgress = continueLearning.some((c) => c.progressPercent > 0);
    const recs = experienceFeedService.fromDiscovery([
      ...success?.recommendations || [],
      ...discovery?.recommendations || []
    ]);
    const statusOf = (block) => {
      if (block == null) return "ok";
      return block.ok ? "ok" : "unavailable";
    };
    const engines = {
      learn: statusOf(learn),
      success: statusOf(success),
      discovery: statusOf(discovery),
      protect: statusOf(protect),
      lms: statusOf(learn)
    };
    const consulted = [learn, success, discovery, protect].filter(
      (b) => b != null
    );
    const failedConsulted = consulted.filter((b) => !b.ok).length;
    const enginesDegraded = consulted.length > 0 && failedConsulted >= Math.min(3, consulted.length) && failedConsulted >= 3;
    const partialData = failedConsulted > 0 && failedConsulted < 3;
    const studentState = deriveStudentState({
      ownedProductCount: ownedSlugs.length,
      hasProgress,
      coursesCompleted: learn?.coursesCompleted || 0,
      activeGoalProgress: learn?.activeGoalProgress ?? null,
      inactiveDays: learn?.inactiveDays ?? null,
      hasPriorActivity: Boolean(learn?.hasPriorActivity),
      productInProgress: Boolean(
        productInProgress && productInProgress.progressPercent < 100
      ),
      enginesDegraded,
      learnUnavailable: learn != null && !learn.ok,
      partialData,
      inactiveReturnDays: input.inactiveReturnDays
    });
    return {
      userId: input.userId,
      name: input.name,
      firstName: firstName(input.name),
      ownedProductCount: ownedSlugs.length,
      ownedProductSlugs: ownedSlugs,
      productInProgress,
      lastLessonTitle: productInProgress?.lastLessonTitle || null,
      averageProgress: learn?.averageProgress ?? null,
      activeGoalId: learn?.activeGoalId ?? null,
      activeGoalName: learn?.activeGoalName ?? null,
      activeGoalProgress: learn?.activeGoalProgress ?? null,
      competenciesAcquired: learn?.acquired || [],
      competenciesInProgress: learn?.inProgress || [],
      competenciesStagnant: learn?.stagnant || [],
      successScore: success?.score ?? null,
      consistencyBand: success?.consistencyBand ?? null,
      habitStreakDays: success?.habitStreakDays ?? null,
      achievementsUnlocked: (learn?.achievements || []).filter((a) => a.unlocked),
      recommendations: recs,
      nextSteps: [],
      protectedPurchases: protect?.items || [],
      notifications: input.notifications || [],
      studentState,
      engines,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
var studentContextBuilder = new StudentContextBuilder();

// server/core/experience/greeting-context-service.ts
var GreetingContextService = class {
  build(ctx, now = /* @__PURE__ */ new Date()) {
    return experienceFallbackService.greetingForState(
      ctx.studentState,
      ctx.firstName,
      now.getHours()
    );
  }
};
var greetingContextService = new GreetingContextService();

// server/core/experience/journey-summary-service.ts
var JourneySummaryService = class {
  build(ctx) {
    return experienceFallbackService.journeySummary(ctx);
  }
};
var journeySummaryService = new JourneySummaryService();

// server/core/experience/analytics.ts
init_experience_store();
var experienceAnalytics = {
  track(userId, event, meta) {
    void trackTelemetry(userId, event, meta);
  },
  async trackAsync(userId, event, meta) {
    return trackTelemetry(userId, event, meta);
  },
  recent(userId, limit = 50) {
    if (userId == null) return Promise.resolve([]);
    return recentTelemetry(userId, limit);
  }
};

// server/core/experience/experience-orchestrator.ts
init_config();

// server/core/experience/achievements-page.ts
var ORIGIN = {
  first_purchase: "Primeira compra",
  first_lesson: "Primeira aula conclu\xEDda",
  lessons_10: "10 aulas conclu\xEDdas",
  course_completed: "Curso conclu\xEDdo",
  streak_7: "Const\xE2ncia de 7 dias",
  goal_reached: "Objetivo Learn",
  specialist: "Dom\xEDnio de compet\xEAncias",
  top_performer: "Success Index elevado",
  high_performance: "Success Index",
  habit_builder: "H\xE1bitos e rotina"
};
function buildAchievementsPayload(achievements, opts) {
  const trust = opts?.trustUnlockTimestamps === true;
  const items = LEARN_ACHIEVEMENTS.map((def) => {
    const a = achievements.find((x) => x.id === def.id);
    const unlocked2 = Boolean(a?.unlocked);
    const unlockedAt = unlocked2 && trust && a?.unlockedAt ? a.unlockedAt : null;
    let progressToUnlock = null;
    if (!unlocked2) {
      const unlockedCount = achievements.filter((x) => x.unlocked).length;
      progressToUnlock = Math.min(
        90,
        Math.round(unlockedCount / Math.max(LEARN_ACHIEVEMENTS.length, 1) * 100)
      );
    }
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      tier: def.tier,
      unlocked: unlocked2,
      unlockedAt,
      origin: ORIGIN[def.id] || "Jornada ContentFy",
      progressToUnlock
    };
  });
  const unlocked = items.filter((i) => i.unlocked);
  const locked = items.filter((i) => !i.unlocked);
  const nextTarget = locked[0] || null;
  return {
    unlocked,
    locked,
    nextTarget,
    emptyInvite: unlocked.length === 0 ? "Comece sua jornada para desbloquear as primeiras conquistas." : null,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// server/core/experience/experience-orchestrator.ts
init_experience_store();
function logEngineError(engine, error) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[ContentFy Experience] ${engine} unavailable:`, msg);
}
async function settled(label, fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (error) {
    logEngineError(label, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unavailable"
    };
  }
}
function mapContinueLearning(snaps) {
  return snaps.map((snap) => {
    const progressPercent = Math.min(
      100,
      Math.round(
        snap.completedLessons / Math.max(snap.totalLessons, 1) * 100
      )
    );
    const lastAt = snap.lastWatchedAt ? new Date(snap.lastWatchedAt) : null;
    const daysAgo = lastAt ? Math.floor((Date.now() - lastAt.getTime()) / 864e5) : null;
    return {
      productSlug: snap.productSlug,
      productName: snap.productName,
      productId: snap.productId,
      lastLessonTitle: snap.lastLessonTitle,
      lastModuleTitle: snap.lastModuleTitle,
      progressPercent,
      remainingLabel: snap.totalLessons > snap.completedLessons ? `${snap.totalLessons - snap.completedLessons} aulas restantes` : "Conclu\xEDdo",
      href: `/my-account/course/${snap.productId}`,
      coverImage: snap.coverImage,
      lastActivityLabel: daysAgo == null ? void 0 : daysAgo === 0 ? "Hoje" : daysAgo === 1 ? "Ontem" : `H\xE1 ${daysAgo} dias`
    };
  }).filter((c) => c.progressPercent < 100 || c.lastLessonTitle);
}
function mapCompetencies(list, stagnantIds) {
  const acquired = [];
  const inProgress = [];
  const stagnant = [];
  for (const c of list) {
    const item = {
      id: c.competencyId,
      name: c.name,
      category: c.category,
      progress: c.progress,
      status: stagnantIds.has(c.competencyId) ? "stagnant" : c.status
    };
    if (item.status === "acquired") acquired.push(item);
    else if (item.status === "stagnant") stagnant.push(item);
    else if (item.status === "in_progress") inProgress.push(item);
  }
  return { acquired, inProgress, stagnant };
}
var ExperienceOrchestrator = class {
  async buildHome(userId, name) {
    const cacheKey = `experience:home:${userId}`;
    const cached = experienceCacheGet(cacheKey);
    if (cached) {
      experienceAnalytics.track(userId, "experience.home_viewed", {
        cacheHit: true
      });
      return { ...cached, cacheHit: true };
    }
    const [
      learnResult,
      successResult,
      discoveryResult,
      protectResult,
      notifyResult
    ] = await Promise.all([
      settled("learn", async () => {
        const [owned, progressSnaps, activeGoalId, allProducts] = await Promise.all([
          getUserProducts(userId),
          buildContinueLearningSnapshots(userId),
          getActiveGoalId(userId),
          getAllProducts()
        ]);
        const productNames = {};
        for (const p of allProducts) productNames[p.slug] = p.name;
        const ownedProductSlugs = [];
        for (const row of owned || []) {
          const slug = row.product?.slug;
          if (slug) {
            ownedProductSlugs.push(slug);
            if (row.product?.name) productNames[slug] = row.product.name;
          }
        }
        const progressBySlug = {};
        let completedLessonCount = 0;
        let totalLessonTouches = 0;
        let coursesCompleted = 0;
        for (const snap of progressSnaps) {
          const pct = Math.min(
            100,
            Math.round(
              snap.completedLessons / Math.max(snap.totalLessons, 1) * 100
            )
          );
          progressBySlug[snap.productSlug] = pct;
          completedLessonCount += snap.completedLessons;
          totalLessonTouches += snap.totalLessons;
          if (pct >= 100) coursesCompleted += 1;
          if (!ownedProductSlugs.includes(snap.productSlug)) {
            ownedProductSlugs.push(snap.productSlug);
          }
          productNames[snap.productSlug] = snap.productName;
        }
        for (const slug of ownedProductSlugs) {
          if (progressBySlug[slug] == null) progressBySlug[slug] = 20;
        }
        const last = progressSnaps[0];
        const signals = {
          userId,
          ownedProductSlugs,
          completedLessonCount,
          totalLessonTouches,
          coursesCompleted,
          streakDays: 0,
          progressBySlug,
          lastLesson: last ? {
            productId: last.productId,
            productSlug: last.productSlug,
            productName: last.productName,
            lessonTitle: last.lastLessonTitle,
            moduleTitle: last.lastModuleTitle,
            href: `/my-account/course/${last.productId}`
          } : void 0,
          activeGoalId,
          purchasedAtLeastOnce: ownedProductSlugs.length > 0
        };
        const dashboard = learnEngine.buildDashboard({ signals, productNames });
        const competencies = competencyEngine.evaluate(signals);
        const stagnant = learnEngine.stagnantCompetencies(signals);
        const stagnantIds = new Set(stagnant.map((s) => s.competencyId));
        const mapped = mapCompetencies(competencies, stagnantIds);
        const continueLearning = mapContinueLearning(progressSnaps);
        const realProgresses = progressSnaps.map(
          (s) => Math.min(
            100,
            Math.round(
              s.completedLessons / Math.max(s.totalLessons, 1) * 100
            )
          )
        );
        const averageProgress = realProgresses.length > 0 ? Math.round(
          realProgresses.reduce((a, b) => a + b, 0) / realProgresses.length
        ) : null;
        let lmsInactiveDays = null;
        if (last?.lastWatchedAt) {
          lmsInactiveDays = Math.floor(
            (Date.now() - new Date(last.lastWatchedAt).getTime()) / 864e5
          );
        }
        return {
          continueLearning,
          activeGoalId: dashboard.activeGoal?.goalId ?? null,
          activeGoalName: dashboard.activeGoal?.name ?? null,
          activeGoalProgress: dashboard.activeGoal?.progress ?? null,
          acquired: mapped.acquired,
          inProgress: mapped.inProgress,
          stagnant: mapped.stagnant,
          achievements: dashboard.achievements.map(
            (a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              tier: a.tier,
              unlocked: a.unlocked
            })
          ),
          ownedProductSlugs,
          averageProgress,
          coursesCompleted,
          lmsInactiveDays,
          relatedCourses: dashboard.relatedCourses
        };
      }),
      settled("success", async () => {
        const ctx2 = await buildSuccessContext(userId);
        const dash = successEngine.buildDashboard(ctx2);
        return {
          score: dash.score.score,
          consistencyBand: dash.consistency.band,
          habitStreakDays: dash.habits.currentStreakDays,
          snapshot: {
            score: dash.score.score,
            label: dash.score.label,
            knowledge: dash.score.pillars.knowledge,
            application: dash.score.pillars.application,
            consistency: dash.score.pillars.consistency,
            result: dash.score.pillars.result,
            weeklyTrend: dash.consistency.trend === "up" ? "up" : dash.consistency.trend === "down" ? "down" : "flat",
            explanation: "Score composto por conhecimento, aplica\xE7\xE3o, const\xE2ncia e resultado \u2014 sem f\xF3rmulas internas."
          },
          recommendations: dash.recommendations.slice(0, 6).map((r) => ({
            id: r.id,
            title: r.title,
            reason: r.reason,
            href: r.href,
            productSlug: r.productSlug
          }))
        };
      }),
      settled("discovery", async () => {
        const products2 = (await getAllProducts()).filter((p) => p.isActive).map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          type: p.type,
          description: p.description,
          coverImage: p.coverImage,
          thumbnailImage: p.thumbnailImage,
          price: p.price,
          categoryName: p.category?.name ?? null,
          isActive: p.isActive,
          createdAt: p.createdAt
        }));
        const [favorites, views, searches, owned, progress, dbMeta, trending] = await Promise.all([
          listFavoriteSlugs(userId),
          getRecentViewSlugs(userId),
          getRecentSearchQueries(userId),
          getUserProducts(userId),
          buildContinueLearningSnapshots(userId),
          listDiscoveryDbMeta(),
          buildTrendingSignals()
        ]);
        const { getSeedMetaBySlug: getSeedMetaBySlug2 } = await Promise.resolve().then(() => (init_seed_metadata(), seed_metadata_exports));
        const preferences = Array.from(
          new Set(
            [...views, ...favorites].map((slug) => getSeedMetaBySlug2(slug)?.category).filter((c) => Boolean(c))
          )
        );
        const home = discoveryEngine.buildHome({
          products: products2,
          dbMeta,
          progress,
          trendingSignals: trending,
          favoriteSlugs: favorites,
          profile: {
            userId,
            preferences,
            goals: [],
            completedProductIds: [],
            ownedProductIds: (owned || []).map((o) => o.userProduct?.productId ?? o.product?.id).filter((id) => typeof id === "number"),
            favoriteSlugs: favorites,
            recentViewSlugs: views,
            recentSearchQueries: searches,
            signals: []
          }
        });
        const recommendedRail = home.rails.find((r) => r.id === "recommended");
        const trendingRail = home.rails.find((r) => r.id === "trending");
        const cards = [
          ...recommendedRail?.items || [],
          ...trendingRail?.items || []
        ].slice(0, 6);
        return {
          recommendations: cards.map((c) => ({
            id: `disc:${c.slug}`,
            title: c.name,
            reason: c.reason || "Selecionado para voc\xEA",
            href: c.href || `/produto/${c.slug}`,
            productSlug: c.slug
          }))
        };
      }),
      settled("protect", async () => {
        const orders2 = await getUserOrders(userId);
        const items = [];
        for (const order of orders2.slice(0, 8)) {
          const product = await getProductById(order.productId);
          if (!product || product.guaranteeDays <= 0) continue;
          const active = await getActiveRefundRequestForOrder(order.id);
          const eligibility = getRefundEligibility({
            orderStatus: order.status,
            purchasedAt: order.createdAt,
            guaranteeDays: product.guaranteeDays,
            productEligible: true,
            hasActiveRequest: Boolean(active),
            alreadyRefunded: order.status === "refunded"
          });
          if (!eligibility.eligible && !active) continue;
          items.push({
            orderId: order.id,
            productName: product.name,
            status: active?.status || "protected",
            remainingDays: eligibility.eligible ? eligibility.remainingDays : null,
            href: `/my-account/purchases/${order.id}/protection`
          });
        }
        return { items };
      }),
      settled("notifications", async () => {
        return notificationCenter.list(userId).slice(0, 5).map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          read: n.read
        }));
      })
    ]);
    const learn = learnResult.ok ? { ok: true, ...learnResult.value } : { ok: false };
    const success = successResult.ok ? {
      ok: true,
      score: successResult.value.score,
      consistencyBand: successResult.value.consistencyBand,
      habitStreakDays: successResult.value.habitStreakDays,
      recommendations: successResult.value.recommendations,
      snapshot: successResult.value.snapshot
    } : { ok: false };
    const discovery = discoveryResult.ok ? {
      ok: true,
      recommendations: discoveryResult.value.recommendations
    } : { ok: false };
    const protect = protectResult.ok ? { ok: true, items: protectResult.value.items } : { ok: false };
    const [onboarding, activity, dismissedIds] = await Promise.all([
      getOnboarding(userId),
      getActivitySummary(userId),
      listDismissedRecommendationIds(userId)
    ]);
    const dismissedSet = new Set(dismissedIds);
    const inactiveDays = activity.inactiveDays != null ? activity.inactiveDays : learn.ok ? learn.lmsInactiveDays : null;
    const hasPriorActivity = activity.hasPriorActivity || learn.ok && (learn.lmsInactiveDays != null || learn.coursesCompleted > 0);
    void recordActivityEvent({
      userId,
      eventType: "area_opened"
    });
    const ctx = studentContextBuilder.build({
      userId,
      name,
      inactiveReturnDays: resolveInactiveReturnDays(),
      learn: learn.ok ? {
        ok: true,
        continueLearning: learn.continueLearning,
        activeGoalId: learn.activeGoalId,
        activeGoalName: learn.activeGoalName,
        activeGoalProgress: learn.activeGoalProgress,
        acquired: learn.acquired,
        inProgress: learn.inProgress,
        stagnant: learn.stagnant,
        achievements: learn.achievements,
        ownedProductSlugs: learn.ownedProductSlugs,
        averageProgress: learn.averageProgress,
        coursesCompleted: learn.coursesCompleted,
        inactiveDays,
        hasPriorActivity
      } : {
        ok: false,
        continueLearning: [],
        activeGoalId: null,
        activeGoalName: null,
        activeGoalProgress: null,
        acquired: [],
        inProgress: [],
        stagnant: [],
        achievements: [],
        ownedProductSlugs: [],
        averageProgress: null,
        coursesCompleted: 0,
        inactiveDays: null,
        hasPriorActivity: false
      },
      success: success.ok ? {
        ok: true,
        score: success.score,
        consistencyBand: success.consistencyBand,
        habitStreakDays: success.habitStreakDays,
        recommendations: success.recommendations
      } : void 0,
      discovery: discovery.ok ? { ok: true, recommendations: discovery.recommendations } : void 0,
      protect: protect.ok ? { ok: true, items: protect.items } : void 0,
      notifications: notifyResult.ok ? notifyResult.value : [],
      onboarding
    });
    const greeting = greetingContextService.build(ctx);
    const journeySummary = journeySummaryService.build(ctx);
    const nextBestAction = nextBestActionEngine.decide(ctx);
    ctx.nextSteps = nextBestAction ? [nextBestAction] : [];
    const fallbackMode = !learn.ok || ctx.studentState === "partial_data" || ctx.studentState === "service_degraded";
    const onboardingNeeded = !onboarding?.completed && (ctx.studentState === "new_user" || ctx.studentState === "no_products" || !ctx.activeGoalId);
    const patch = experienceFallbackService.emptyHomePatch(ctx.studentState);
    const payload = {
      greeting,
      primaryGoal: {
        id: ctx.activeGoalId,
        name: ctx.activeGoalName,
        progress: ctx.activeGoalProgress
      },
      journeySummary,
      continueLearning: ctx.productInProgress ? learn.ok ? learn.continueLearning : [ctx.productInProgress] : learn.ok ? learn.continueLearning : [],
      nextBestAction,
      successSnapshot: success.ok ? success.snapshot : null,
      competencies: {
        acquired: ctx.competenciesAcquired,
        inProgress: ctx.competenciesInProgress,
        stagnant: ctx.competenciesStagnant
      },
      achievements: ctx.achievementsUnlocked,
      recommendations: (() => {
        const base = patch.recommendations && ctx.recommendations.length === 0 ? patch.recommendations : ctx.recommendations;
        return base.filter((r) => !dismissedSet.has(r.id));
      })(),
      protectionSummary: ctx.protectedPurchases,
      notifications: ctx.notifications,
      studentState: ctx.studentState,
      fallbackMode,
      onboardingNeeded: patch.onboardingNeeded != null ? patch.onboardingNeeded : onboardingNeeded,
      cacheHit: false,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    experienceCacheSet(cacheKey, payload, 3e4);
    experienceAnalytics.track(userId, "experience.home_viewed", {
      state: payload.studentState,
      fallbackMode
    });
    return payload;
  }
  async buildContext(userId, name) {
    const home = await this.buildHome(userId, name);
    const owned = await getUserProducts(userId).catch(() => []);
    const ownedProductSlugs = (owned || []).map((o) => o.product?.slug).filter((s) => Boolean(s));
    return studentContextBuilder.build({
      userId,
      name,
      learn: {
        ok: true,
        continueLearning: home.continueLearning,
        activeGoalId: home.primaryGoal.id,
        activeGoalName: home.primaryGoal.name,
        activeGoalProgress: home.primaryGoal.progress,
        acquired: home.competencies.acquired,
        inProgress: home.competencies.inProgress,
        stagnant: home.competencies.stagnant,
        achievements: home.achievements.map((a) => ({
          ...a,
          unlocked: true
        })),
        ownedProductSlugs,
        averageProgress: home.journeySummary.evolutionPercent,
        coursesCompleted: home.studentState === "course_completed" ? 1 : 0
      },
      success: home.successSnapshot ? {
        ok: true,
        score: home.successSnapshot.score,
        consistencyBand: null,
        habitStreakDays: null,
        recommendations: home.recommendations
      } : {
        ok: false,
        score: null,
        consistencyBand: null,
        habitStreakDays: null,
        recommendations: []
      },
      discovery: {
        ok: true,
        recommendations: home.recommendations
      },
      protect: {
        ok: true,
        items: home.protectionSummary
      },
      notifications: home.notifications,
      onboarding: await getOnboarding(userId)
    });
  }
  nextBestAction(userId, name) {
    return this.buildHome(userId, name).then((h) => h.nextBestAction);
  }
  journeySummary(userId, name) {
    return this.buildHome(userId, name).then((h) => h.journeySummary);
  }
  async saveOnboarding(userId, input) {
    const state = await saveOnboarding(userId, input);
    if (input.primaryGoalId) {
      void setActiveGoalId(userId, input.primaryGoalId).catch(() => {
      });
      void recordActivityEvent({
        userId,
        eventType: "goal_updated",
        meta: { goalId: input.primaryGoalId }
      });
    }
    invalidateExperienceForUser(userId);
    await experienceAnalytics.trackAsync(
      userId,
      "experience.onboarding_completed",
      {
        primaryGoalId: input.primaryGoalId ?? null,
        weeklyHours: input.weeklyHours ?? null,
        persisted: state.persisted
      }
    );
    return state;
  }
  async getOnboarding(userId) {
    const state = await getOnboarding(userId);
    return state || {
      completed: false,
      primaryGoalId: null,
      improveFirst: null,
      weeklyHours: null,
      preferences: null,
      completedAt: null,
      updatedAt: null,
      persisted: "memory"
    };
  }
  async dismissRecommendation(userId, recommendationId) {
    await dismissRecommendation(userId, recommendationId);
    return { ok: true };
  }
  markActionSeen(userId, actionKind) {
    experienceAnalytics.track(userId, "experience.next_action_clicked", {
      kind: actionKind,
      phase: "seen"
    });
    return { ok: true };
  }
  async achievements(userId) {
    try {
      const ctx = await buildSuccessContext(userId);
      return buildAchievementsPayload(ctx.achievements, {
        trustUnlockTimestamps: false
      });
    } catch (error) {
      logEngineError("achievements", error);
      return buildAchievementsPayload([], { trustUnlockTimestamps: false });
    }
  }
};
var experienceOrchestrator = new ExperienceOrchestrator();

// server/core/experience/onboarding-store.ts
init_config();

// server/core/experience/index.ts
init_cache3();
init_config();
init_experience_store();

// server/routers/experience.ts
init_experience_store();
var experienceRouter = router({
  home: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.buildHome(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),
  context: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.buildContext(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),
  nextBestAction: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.nextBestAction(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),
  journeySummary: protectedProcedure.query(async ({ ctx }) => {
    return experienceOrchestrator.journeySummary(
      ctx.user.id,
      ctx.user.name ?? null
    );
  }),
  achievements: protectedProcedure.query(async ({ ctx }) => {
    const payload = await experienceOrchestrator.achievements(ctx.user.id);
    experienceAnalytics.track(ctx.user.id, "experience.achievement_viewed", {
      unlocked: payload.unlocked.length
    });
    return payload;
  }),
  activitySummary: protectedProcedure.query(async ({ ctx }) => {
    return getActivitySummary(ctx.user.id);
  }),
  onboarding: protectedProcedure.query(async ({ ctx }) => {
    const state = await experienceOrchestrator.getOnboarding(ctx.user.id);
    return {
      state,
      goals: LEARN_GOALS.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description
      })),
      persistence: state.persisted,
      note: state.persisted === "db" ? "Prefer\xEAncias persistidas no banco (migration 0014)." : "Fallback em mem\xF3ria (somente desenvolvimento / migration ausente). N\xE3o \xE9 fonte de verdade em produ\xE7\xE3o."
    };
  }),
  saveOnboarding: protectedProcedure.input(
    z13.object({
      primaryGoalId: z13.string().min(1).max(64).optional(),
      improveFirst: z13.string().min(1).max(200).optional(),
      weeklyHours: z13.number().min(0.5).max(40).optional(),
      preferences: z13.record(
        z13.string().max(64),
        z13.union([z13.string().max(200), z13.number(), z13.boolean(), z13.null()])
      ).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    return experienceOrchestrator.saveOnboarding(ctx.user.id, input);
  }),
  dismissRecommendation: protectedProcedure.input(z13.object({ recommendationId: z13.string().min(1).max(128) })).mutation(async ({ ctx, input }) => {
    return experienceOrchestrator.dismissRecommendation(
      ctx.user.id,
      input.recommendationId
    );
  }),
  markActionSeen: protectedProcedure.input(z13.object({ actionKind: z13.string().min(1).max(64) })).mutation(async ({ ctx, input }) => {
    return experienceOrchestrator.markActionSeen(
      ctx.user.id,
      input.actionKind
    );
  }),
  track: protectedProcedure.input(
    z13.object({
      event: z13.enum([
        "experience.home_viewed",
        "experience.next_action_clicked",
        "experience.goal_selected",
        "experience.recommendation_clicked",
        "experience.section_viewed",
        "experience.onboarding_completed",
        "experience.continue_learning_clicked",
        "experience.achievement_viewed"
      ]),
      meta: z13.record(z13.string(), z13.unknown()).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    await experienceAnalytics.trackAsync(
      ctx.user.id,
      input.event,
      input.meta
    );
    if (input.event === "experience.recommendation_clicked") {
      const slug = typeof input.meta?.productSlug === "string" ? input.meta.productSlug : null;
      void recordActivityEvent({
        userId: ctx.user.id,
        eventType: "recommendation_clicked",
        productSlug: slug
      });
      const { emitOrchestratorEvent: emitOrchestratorEvent2 } = await Promise.resolve().then(() => (init_orchestrator2(), orchestrator_exports));
      emitOrchestratorEvent2(
        "RECOMMENDATION_CLICKED",
        { userId: ctx.user.id, productSlug: slug },
        "experience"
      );
    }
    return { ok: true };
  })
});

// server/routers/intelligence.ts
import { TRPCError as TRPCError12 } from "@trpc/server";
var intelligenceRouter = router({
  adminDashboard: adminProcedure.query(async () => {
    return intelligenceEngine.buildAdminDashboard();
  }),
  creatorDashboard: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError12({ code: "UNAUTHORIZED" });
    }
    return intelligenceEngine.buildCreatorDashboard({
      userName: ctx.user.name ?? null
    });
  }),
  /** Lightweight health for admin widgets */
  marketplaceHealth: adminProcedure.query(async () => {
    const dash = await intelligenceEngine.buildAdminDashboard();
    return dash.health;
  })
});

// server/routers/orchestrator.ts
import { z as z14 } from "zod";
init_orchestrator2();
var eventNameSchema = z14.enum([
  "PRODUCT_PURCHASED",
  "COURSE_STARTED",
  "COURSE_COMPLETED",
  "LESSON_COMPLETED",
  "PRODUCT_REFUNDED",
  "REFUND_APPROVED",
  "DISCOVERY_CLICKED",
  "GOAL_UPDATED",
  "ACHIEVEMENT_UNLOCKED",
  "PRODUCT_FAVORITED",
  "RECOMMENDATION_CLICKED",
  "CREATOR_PRODUCT_CREATED",
  "PRODUCT_PUBLISHED",
  "CATEGORY_GROWING",
  "PRODUCT_TRENDING",
  "SUCCESS_SCORE_CHANGED"
]);
var orchestratorRouter = router({
  dashboard: adminProcedure.query(() => contentFyOrchestrator.dashboard()),
  registry: adminProcedure.query(() => eventRegistry.list()),
  emit: adminProcedure.input(
    z14.object({
      name: eventNameSchema,
      payload: z14.object({
        userId: z14.number().int().positive().optional(),
        productId: z14.number().int().positive().optional(),
        productSlug: z14.string().max(255).optional(),
        lessonId: z14.number().int().positive().optional(),
        orderId: z14.number().int().positive().optional(),
        goalId: z14.string().max(64).optional(),
        category: z14.string().max(128).optional(),
        meta: z14.record(
          z14.string().max(64),
          z14.union([z14.string().max(120), z14.number(), z14.boolean(), z14.null()])
        ).optional()
      }).optional(),
      sync: z14.boolean().optional()
    })
  ).mutation(async ({ input }) => {
    const result = await contentFyOrchestrator.emit({
      name: input.name,
      payload: input.payload || {},
      source: "admin",
      sync: input.sync ?? true
    });
    return {
      eventId: result.event.id,
      runs: result.runs.map((r) => ({
        id: r.id,
        workflowId: r.workflowId,
        status: r.status,
        totalLatencyMs: r.totalLatencyMs,
        steps: r.steps.length
      }))
    };
  }),
  drain: adminProcedure.mutation(async () => {
    await contentFyOrchestrator.drain(50);
    return contentFyOrchestrator.dashboard();
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Contentfy Platform Routers
  products: productsRouter,
  checkout: checkoutRouter,
  members: membersRouter,
  affiliates: affiliatesRouter,
  certificates: certificatesRouter,
  orders: ordersRouter,
  users: usersRouter,
  creator: creatorRouter,
  // ContentFy OS — Evolution X (additive meta layer)
  contentfy: contentfyRouter,
  protect: protectRouter,
  discovery: discoveryRouter,
  learn: learnRouter,
  success: successRouter,
  experience: experienceRouter,
  intelligence: intelligenceRouter,
  orchestrator: orchestratorRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/static.ts
import express from "express";
import fs from "fs";
import path from "path";
function serveStatic(app) {
  const distPath = process.env.VERCEL ? path.resolve(process.cwd(), "public") : process.env.NODE_ENV === "development" ? path.resolve(import.meta.dirname, "../..", "dist", "public") : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/routers/stripe-webhook.ts
init_db();
import express2 from "express";
import Stripe3 from "stripe";
var stripe2 = new Stripe3(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover"
});
function setupStripeWebhook(app) {
  app.post(
    "/api/stripe/webhook",
    express2.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      if (!sig) {
        console.error("[Stripe Webhook] Missing signature");
        return res.status(400).send("Missing signature");
      }
      let event;
      try {
        event = stripe2.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.status(200).json({
          success: true,
          message: "Webhook test event received",
          eventId: event.id,
          eventType: event.type
        });
      }
      console.log("[Stripe Webhook] Event received:", event.type);
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            await handleCheckoutCompleted(session);
            break;
          }
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            console.log("[Stripe Webhook] Payment succeeded:", paymentIntent.id);
            break;
          }
          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            console.log("[Stripe Webhook] Payment failed:", paymentIntent.id);
            if (paymentIntent.metadata?.orderId) {
              await updateOrderStatus(
                Number(paymentIntent.metadata.orderId),
                "failed"
              );
            }
            break;
          }
          case "customer.subscription.created": {
            const subscription = event.data.object;
            await handleSubscriptionCreated(subscription);
            break;
          }
          case "customer.subscription.updated": {
            const subscription = event.data.object;
            await handleSubscriptionUpdated(subscription);
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            await handleSubscriptionDeleted(subscription);
            break;
          }
          case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            await handleInvoicePaymentSucceeded(invoice);
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object;
            console.log("[Stripe Webhook] Invoice payment failed:", invoice.id);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
        res.status(200).json({
          success: true,
          message: "Webhook event processed successfully",
          eventId: event.id,
          eventType: event.type
        });
      } catch (error) {
        console.error("[Stripe Webhook] Error processing event:", error);
        res.status(500).send("Webhook handler failed");
      }
    }
  );
}
async function handleCheckoutCompleted(session) {
  console.log("[Stripe Webhook] Processing checkout.session.completed:", session.id);
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;
  const productId = session.metadata?.productId;
  if (!orderId || !userId || !productId) {
    console.error("[Stripe Webhook] Missing metadata in session:", session.id);
    return;
  }
  try {
    await updateOrderStatus(Number(orderId), "completed");
    await grantProductAccess({
      userId: Number(userId),
      productId: Number(productId),
      orderId: Number(orderId),
      accessGrantedAt: /* @__PURE__ */ new Date(),
      accessExpiresAt: null,
      // Acesso vitalício por padrão
      isActive: true
    });
    const order = await getOrderById(Number(orderId));
    if (order?.couponId) {
      await incrementCouponUsage(order.couponId);
    }
    try {
      const { invalidateExperienceForUser: invalidateExperienceForUser2 } = await Promise.resolve().then(() => (init_cache3(), cache_exports3));
      invalidateExperienceForUser2(Number(userId));
      const { emitOrchestratorEvent: emitOrchestratorEvent2 } = await Promise.resolve().then(() => (init_orchestrator2(), orchestrator_exports));
      emitOrchestratorEvent2(
        "PRODUCT_PURCHASED",
        {
          userId: Number(userId),
          productId: Number(productId),
          orderId: Number(orderId)
        },
        "commerce"
      );
    } catch {
    }
    console.log("[Stripe Webhook] Access granted successfully:", {
      orderId,
      userId,
      productId
    });
  } catch (error) {
    console.error("[Stripe Webhook] Error granting access:", error);
    throw error;
  }
}
async function handleSubscriptionCreated(subscription) {
  console.log("[Stripe Webhook] Processing subscription.created:", subscription.id);
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;
  const affiliateId = subscription.metadata?.affiliateId;
  if (!userId || !planId) {
    console.error("[Stripe Webhook] Missing metadata in subscription:", subscription.id);
    return;
  }
  try {
    await createUserSubscription({
      userId: Number(userId),
      planId: Number(planId),
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1e3) : null,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1e3) : null
    });
    console.log("[Stripe Webhook] Subscription created successfully:", {
      userId,
      planId,
      subscriptionId: subscription.id
    });
    if (affiliateId) {
      const plan = await getSubscriptionPlanById(Number(planId));
      if (plan) {
        const affiliate = await getAffiliateById(Number(affiliateId));
        if (affiliate) {
          const commissionAmount = Math.round(plan.price * affiliate.commissionRate / 100);
          console.log("[Stripe Webhook] Recurring commission setup:", {
            affiliateId,
            subscriptionId: subscription.id,
            commissionAmount,
            commissionRate: affiliate.commissionRate
          });
        }
      }
    }
  } catch (error) {
    console.error("[Stripe Webhook] Error creating subscription:", error);
    throw error;
  }
}
async function handleSubscriptionUpdated(subscription) {
  console.log("[Stripe Webhook] Processing subscription.updated:", subscription.id);
  try {
    const existingSubscription = await getUserSubscriptionByStripeId(subscription.id);
    if (!existingSubscription) {
      console.warn("[Stripe Webhook] Subscription not found in database:", subscription.id);
      return;
    }
    await updateUserSubscription(existingSubscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1e3) : null,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1e3) : null
    });
    console.log("[Stripe Webhook] Subscription updated successfully:", subscription.id);
  } catch (error) {
    console.error("[Stripe Webhook] Error updating subscription:", error);
    throw error;
  }
}
async function handleSubscriptionDeleted(subscription) {
  console.log("[Stripe Webhook] Processing subscription.deleted:", subscription.id);
  try {
    const existingSubscription = await getUserSubscriptionByStripeId(subscription.id);
    if (!existingSubscription) {
      console.warn("[Stripe Webhook] Subscription not found in database:", subscription.id);
      return;
    }
    await updateUserSubscription(existingSubscription.id, {
      status: "canceled",
      canceledAt: /* @__PURE__ */ new Date()
    });
    console.log("[Stripe Webhook] Subscription cancelled successfully:", subscription.id);
  } catch (error) {
    console.error("[Stripe Webhook] Error cancelling subscription:", error);
    throw error;
  }
}
async function handleInvoicePaymentSucceeded(invoice) {
  console.log("[Stripe Webhook] Processing invoice.payment_succeeded:", invoice.id);
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.log("[Stripe Webhook] Invoice is not for subscription, skipping");
    return;
  }
  try {
    const subscription = await stripe2.subscriptions.retrieve(subscriptionId);
    const affiliateId = subscription.metadata?.affiliateId;
    if (!affiliateId) {
      console.log("[Stripe Webhook] No affiliate associated with subscription");
      return;
    }
    const userId = subscription.metadata?.userId;
    const planId = subscription.metadata?.planId;
    if (!userId || !planId) {
      console.error("[Stripe Webhook] Missing metadata in subscription:", subscription.id);
      return;
    }
    const plan = await getSubscriptionPlanById(Number(planId));
    const affiliate = await getAffiliateById(Number(affiliateId));
    if (!plan || !affiliate) {
      console.error("[Stripe Webhook] Plan or affiliate not found");
      return;
    }
    const commissionAmount = Math.round(plan.price * affiliate.commissionRate / 100);
    console.log("[Stripe Webhook] Recurring commission earned:", {
      affiliateId,
      invoiceId: invoice.id,
      subscriptionId: subscription.id,
      amount: plan.price,
      commissionAmount,
      commissionRate: affiliate.commissionRate
    });
    await updateProduct(Number(affiliateId), {
      totalEarnings: affiliate.totalEarnings + commissionAmount,
      pendingEarnings: affiliate.pendingEarnings + commissionAmount
    });
    console.log("[Stripe Webhook] Affiliate earnings updated:", {
      affiliateId,
      newTotalEarnings: affiliate.totalEarnings + commissionAmount
    });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing invoice payment:", error);
    throw error;
  }
}

// server/routes/upload.ts
import multer from "multer";

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routes/upload.ts
import crypto from "crypto";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens s\xE3o permitidas"));
    }
  }
});
var uploadProductFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024
    // 100MB para PDFs e audiobooks
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "video/mp4",
      "application/zip",
      "application/x-zip-compressed"
    ];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo n\xE3o permitido. Use PDF, MP3, MP4 ou ZIP."));
    }
  }
});
function setupUploadRoute(app) {
  app.post("/api/upload/product-file", uploadProductFile.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
      const filePath = `product-files/${fileName}`;
      const result = await storagePut(filePath, req.file.buffer, req.file.mimetype);
      res.json({
        url: result.url,
        key: result.key,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      });
    } catch (error) {
      console.error("Erro no upload do arquivo de produto:", error);
      res.status(500).json({ error: "Erro ao fazer upload do arquivo" });
    }
  });
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
      const filePath = `products/${fileName}`;
      const result = await storagePut(filePath, req.file.buffer, req.file.mimetype);
      res.json({
        url: result.url,
        key: result.key
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao fazer upload" });
    }
  });
}

// server/routes/devOAuthPortal.ts
function registerDevOAuthPortal(app) {
  const enabled = process.env.ENABLE_DEV_OAUTH !== "0";
  if (!enabled) return;
  app.get("/api/dev-oauth/health", (_req, res) => {
    res.json({
      ok: true,
      service: "contentfy-dev-oauth",
      hint: "Use Entrar \u2192 /api/dev-oauth/app-auth \u2192 /api/oauth/callback"
    });
  });
  app.get("/api/dev-oauth/app-auth", (req, res) => {
    const redirectUri = typeof req.query.redirectUri === "string" && req.query.redirectUri || typeof req.query.redirectUrl === "string" && req.query.redirectUrl || "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    if (!redirectUri) {
      res.status(400).json({ error: "redirectUri is required" });
      return;
    }
    try {
      const dest = new URL(redirectUri);
      dest.searchParams.set("code", "contentfy-dev-code");
      dest.searchParams.set("state", state);
      console.log(`[dev-oauth] redirect \u2192 ${dest.toString()}`);
      res.redirect(302, dest.toString());
    } catch {
      res.status(400).json({ error: "invalid redirectUri" });
    }
  });
  app.post(
    "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/ExchangeToken",
    (req, res) => {
      console.log("[dev-oauth] ExchangeToken ok", req.body?.clientId || "");
      res.json({
        accessToken: "dev-access-token",
        tokenType: "Bearer",
        expiresIn: 3600,
        scope: "openid profile email",
        idToken: "dev-id-token",
        refreshToken: "dev-refresh-token"
      });
    }
  );
  app.post(
    [
      "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/GetUserInfo",
      "/api/dev-oauth/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt"
    ],
    (req, res) => {
      console.log("[dev-oauth] GetUserInfo ok");
      res.json({
        openId: "contentfy-dev-user",
        projectId: req.body?.projectId || "contentfy-prod",
        name: "Aluno ContentFy",
        email: "aluno@contentfy.local",
        platform: "REGISTERED_PLATFORM_EMAIL",
        loginMethod: "email"
      });
    }
  );
  console.log("[dev-oauth] mounted at /api/dev-oauth");
}

// server/createApp.ts
function createApp(options = {}) {
  const { serveClient = process.env.VERCEL !== "1" } = options;
  const app = express3();
  setupStripeWebhook(app);
  app.use(express3.json({ limit: "50mb" }));
  app.use(express3.urlencoded({ limit: "50mb", extended: true }));
  registerDevOAuthPortal(app);
  registerOAuthRoutes(app);
  setupUploadRoute(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (serveClient) {
    serveStatic(app);
  }
  return app;
}

// server/vercel-app.ts
var vercel_app_default = createApp({ serveClient: false });
export {
  vercel_app_default as default
};
