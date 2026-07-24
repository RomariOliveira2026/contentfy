import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * CONTENTFY PLATFORM - DATABASE SCHEMA
 * Plataforma completa de infoprodutos com cursos, e-books, audiobooks e apps
 */

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "affiliate"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }), // Stripe Customer ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// PRODUCTS SYSTEM
// ============================================================================

export const productCategories = mysqlTable("product_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: mysqlEnum("type", ["ebook", "audiobook", "course", "app"]).notNull(),
  categoryId: int("categoryId"),
  price: int("price").notNull(), // Preço em centavos (ex: 9990 = R$99,90)
  isRecurring: boolean("isRecurring").default(false).notNull(), // Assinatura recorrente
  recurringInterval: mysqlEnum("recurringInterval", ["month", "year"]), // Intervalo de recorrência
  allowInstallments: boolean("allowInstallments").default(true).notNull(), // Permite parcelamento
  maxInstallments: int("maxInstallments").default(12), // Máximo de parcelas
  coverImage: text("coverImage"), // URL da imagem de capa
  thumbnailImage: text("thumbnailImage"), // URL da thumbnail
  contentUrl: text("contentUrl"), // URL do arquivo do produto (PDF, MP3, etc.)
  salesPageUrl: text("salesPageUrl"), // URL da página de vendas
  isActive: boolean("isActive").default(true).notNull(),
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe Price ID
  stripeProductId: varchar("stripeProductId", { length: 255 }), // Stripe Product ID
  guaranteeDays: int("guaranteeDays").default(30).notNull(), // Garantia em dias (padrão 30)
  affiliateCommission: int("affiliateCommission").default(60).notNull(), // Comissão de afiliados em % (padrão 60%, mínimo 50%, máximo 70%)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ============================================================================
// COUPONS & DISCOUNTS
// ============================================================================

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(), // Porcentagem ou valor em centavos
  maxUses: int("maxUses"), // Máximo de usos (null = ilimitado)
  usedCount: int("usedCount").default(0).notNull(),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

// ============================================================================
// ORDERS & PAYMENTS
// ============================================================================

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  amount: int("amount").notNull(), // Valor total em centavos
  couponId: int("couponId"), // Cupom aplicado
  discountAmount: int("discountAmount").default(0), // Desconto aplicado em centavos
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }), // Stripe Payment Intent ID
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }), // Stripe Checkout Session ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ============================================================================
// USER PRODUCTS (Produtos adquiridos pelo usuário)
// ============================================================================

export const userProducts = mysqlTable("user_products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  orderId: int("orderId").notNull(),
  accessGrantedAt: timestamp("accessGrantedAt").defaultNow().notNull(),
  accessExpiresAt: timestamp("accessExpiresAt"), // null = acesso vitalício
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProduct = typeof userProducts.$inferSelect;
export type InsertUserProduct = typeof userProducts.$inferInsert;

// ============================================================================
// COURSES SYSTEM
// ============================================================================

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().unique(), // Relacionado ao produto
  instructor: varchar("instructor", { length: 255 }),
  duration: int("duration"), // Duração estimada em minutos
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]),
  certificateEnabled: boolean("certificateEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = mysqlTable("course_modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").notNull(), // Ordem do módulo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = typeof courseModules.$inferInsert;

export const courseLessons = mysqlTable("course_lessons", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["video", "text", "pdf", "audio"]).notNull(),
  contentUrl: text("contentUrl"), // URL do vídeo, PDF, áudio
  duration: int("duration"), // Duração em segundos (para vídeo/áudio)
  order: int("order").notNull(), // Ordem da aula
  isFree: boolean("isFree").default(false).notNull(), // Aula gratuita (preview)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseLesson = typeof courseLessons.$inferSelect;
export type InsertCourseLesson = typeof courseLessons.$inferInsert;

export const lessonProgress = mysqlTable("lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  progress: int("progress").default(0), // Progresso em porcentagem (0-100)
  lastWatchedAt: timestamp("lastWatchedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;

// ============================================================================
// DIGITAL LIBRARY (E-books & Audiobooks)
// ============================================================================

export const digitalAssets = mysqlTable("digital_assets", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  fileUrl: text("fileUrl").notNull(), // URL do arquivo (PDF, MP3, etc.)
  fileType: varchar("fileType", { length: 50 }).notNull(), // pdf, mp3, epub, etc.
  fileSize: int("fileSize"), // Tamanho em bytes
  duration: int("duration"), // Duração em segundos (para audiobooks)
  allowDownload: boolean("allowDownload").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DigitalAsset = typeof digitalAssets.$inferSelect;
export type InsertDigitalAsset = typeof digitalAssets.$inferInsert;

// ============================================================================
// AFFILIATES SYSTEM
// ============================================================================

export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  affiliateCode: varchar("affiliateCode", { length: 50 }).notNull().unique(),
  commissionRate: int("commissionRate").default(60).notNull(), // Taxa de comissão padrão (50-70%)
  totalEarnings: int("totalEarnings").default(0).notNull(), // Ganhos totais em centavos
  pendingEarnings: int("pendingEarnings").default(0).notNull(), // Ganhos pendentes
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

export const affiliateSales = mysqlTable("affiliate_sales", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  orderId: int("orderId").notNull(),
  commissionAmount: int("commissionAmount").notNull(), // Comissão em centavos
  status: mysqlEnum("status", ["pending", "approved", "paid"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AffiliateSale = typeof affiliateSales.$inferSelect;
export type InsertAffiliateSale = typeof affiliateSales.$inferInsert;

// ============================================================================
// CERTIFICATES
// ============================================================================

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  certificateCode: varchar("certificateCode", { length: 100 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export const productReviews = mysqlTable("product_reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1 a 5 estrelas
  comment: text("comment"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(), // Compra verificada
  isApproved: boolean("isApproved").default(true).notNull(), // Moderação
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

// ============================================================================
// SUBSCRIPTION PLANS & USER SUBSCRIPTIONS
// ============================================================================

export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Ex: "Básico", "Pro", "Premium"
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: int("price").notNull(), // Preço mensal em centavos
  interval: mysqlEnum("interval", ["month", "year"]).default("month").notNull(),
  features: text("features"), // JSON com lista de features
  maxProducts: int("maxProducts"), // Limite de produtos (null = ilimitado)
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe Price ID
  stripeProductId: varchar("stripeProductId", { length: 255 }), // Stripe Product ID
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0), // Ordem de exibição
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid", "trialing"]).default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }), // Stripe Subscription ID
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }), // Stripe Customer ID
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;
