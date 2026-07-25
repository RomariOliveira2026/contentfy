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

// server/db.ts
import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
var productCategories = mysqlTable("product_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var products = mysqlTable("products", {
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
var coupons = mysqlTable("coupons", {
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
var orders = mysqlTable("orders", {
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
var userProducts = mysqlTable("user_products", {
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
var courses = mysqlTable("courses", {
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
var courseModules = mysqlTable("course_modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").notNull(),
  // Ordem do módulo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var courseLessons = mysqlTable("course_lessons", {
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
var lessonProgress = mysqlTable("lesson_progress", {
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
var digitalAssets = mysqlTable("digital_assets", {
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
var affiliates = mysqlTable("affiliates", {
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
var affiliateSales = mysqlTable("affiliate_sales", {
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
var certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  certificateCode: varchar("certificateCode", { length: 100 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var productReviews = mysqlTable("product_reviews", {
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
var subscriptionPlans = mysqlTable("subscription_plans", {
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
var userSubscriptions = mysqlTable("user_subscriptions", {
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

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
  return await db.select().from(users).orderBy(desc(users.createdAt));
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
  const result = await db.select({
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
  return result;
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
import { z as z7 } from "zod";
var ordersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getAllOrders();
  }),
  getById: protectedProcedure.input(z7.object({ id: z7.number() })).query(async ({ input }) => {
    return await getOrderById(input.id);
  })
});

// server/routers/users.tsx
var usersRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllUsers();
  })
});

// server/routers/creator.ts
import { z as z8 } from "zod";
import { TRPCError as TRPCError8 } from "@trpc/server";
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
      throw new TRPCError8({ code: "NOT_FOUND", message: "Produto n\xE3o encontrado" });
    }
    if (product.type !== "course") {
      throw new TRPCError8({
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
      throw new TRPCError8({ code: "NOT_FOUND", message: "M\xF3dulo n\xE3o encontrado" });
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
      throw new TRPCError8({ code: "NOT_FOUND", message: "Aula n\xE3o encontrada" });
    }
    const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) {
      return { success: true };
    }
    await swapLessonOrder(lessons[idx].id, lessons[swapIdx].id);
    return { success: true };
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
  creator: creatorRouter
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
import express2 from "express";
import Stripe2 from "stripe";
var stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY, {
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

// server/createApp.ts
function createApp(options = {}) {
  const { serveClient = process.env.VERCEL !== "1" } = options;
  const app = express3();
  setupStripeWebhook(app);
  app.use(express3.json({ limit: "50mb" }));
  app.use(express3.urlencoded({ limit: "50mb", extended: true }));
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
var vercel_app_default = createApp({ serveClient: true });
export {
  vercel_app_default as default
};
