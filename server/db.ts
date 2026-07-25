import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  products,
  Product,
  InsertProduct,
  productCategories,
  ProductCategory,
  InsertProductCategory,
  coupons,
  Coupon,
  InsertCoupon,
  orders,
  Order,
  InsertOrder,
  userProducts,
  UserProduct,
  InsertUserProduct,
  courses,
  Course,
  InsertCourse,
  courseModules,
  CourseModule,
  InsertCourseModule,
  courseLessons,
  CourseLesson,
  InsertCourseLesson,
  lessonProgress,
  LessonProgress,
  InsertLessonProgress,
  digitalAssets,
  DigitalAsset,
  InsertDigitalAsset,
  affiliates,
  Affiliate,
  InsertAffiliate,
  affiliateSales,
  AffiliateSale,
  InsertAffiliateSale,
  certificates,
  Certificate,
  InsertCertificate,
  subscriptionPlans,
  SubscriptionPlan,
  InsertSubscriptionPlan,
  userSubscriptions,
  UserSubscription,
  InsertUserSubscription,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return _db;

  // Vercel cannot reach a MySQL on the developer's machine.
  if (
    process.env.VERCEL &&
    /localhost|127\.0\.0\.1|::1/i.test(url)
  ) {
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

// ============================================================================
// USER FUNCTIONS
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "stripeCustomerId"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error("[Database] getAllUsers failed:", error);
    return [];
  }
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

export async function getAllProductCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(productCategories).orderBy(productCategories.name);
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select({
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
        category: productCategories,
      })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .orderBy(desc(products.createdAt));
  } catch (error) {
    console.error("[Database] getAllProducts failed:", error);
    return [];
  }
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(product);
  const insertId = Number(
    (result as unknown as [{ insertId?: number }])[0]?.insertId ??
      (result as unknown as { insertId?: number }).insertId ??
      0
  );
  return { insertId, result };
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set(product).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Soft delete
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
}

export async function getProductsByType(type: "ebook" | "audiobook" | "course" | "app") {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products)
    .where(and(eq(products.type, type), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));
}

// ============================================================================
// CATEGORY FUNCTIONS
// ============================================================================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(productCategories).orderBy(productCategories.name);
}

export async function createCategory(category: InsertProductCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(productCategories).values(category);
  return result;
}

// ============================================================================
// COUPON FUNCTIONS
// ============================================================================

export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, true)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function incrementCouponUsage(couponId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1` })
    .where(eq(coupons.id, couponId));
}

export async function createCoupon(coupon: InsertCoupon) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coupons).values(coupon);
  return result;
}

// ============================================================================
// ORDER FUNCTIONS
// ============================================================================

export async function createOrder(order: InsertOrder): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orders).values(order);
  // MySQL/Drizzle retorna insertId em result[0].insertId
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  if (!insertId) {
    throw new Error("Failed to get order ID after insert");
  }
  return Number(insertId);
}

export async function getOrderById(id: number) {
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
      email: users.email,
    },
  })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getOrderByStripeSessionId(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders)
    .where(eq(orders.stripeCheckoutSessionId, sessionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateOrderStatus(orderId: number, status: "pending" | "completed" | "failed" | "refunded") {
  const db = await getDb();
  if (!db) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function updateOrder(orderId: number, data: Partial<typeof orders.$inferInsert>) {
  const db = await getDb();
  if (!db) return;

  await db.update(orders).set(data).where(eq(orders.id, orderId));
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getAllOrders() {
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
        email: users.email,
      },
    })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] getAllOrders failed:", error);
    return [];
  }
}



// ============================================================================
// USER PRODUCT FUNCTIONS (Acesso aos produtos)
// ============================================================================

export async function grantProductAccess(userProduct: InsertUserProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(userProducts).values(userProduct);
  return result;
}

export async function getUserProducts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    userProduct: userProducts,
    product: products,
  })
  .from(userProducts)
  .leftJoin(products, eq(userProducts.productId, products.id))
  .where(and(
    eq(userProducts.userId, userId),
    eq(userProducts.isActive, true)
  ))
  .orderBy(desc(userProducts.accessGrantedAt));
}

export async function hasProductAccess(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select().from(userProducts)
    .where(and(
      eq(userProducts.userId, userId),
      eq(userProducts.productId, productId),
      eq(userProducts.isActive, true)
    ))
    .limit(1);

  return result.length > 0;
}

// ============================================================================
// COURSE FUNCTIONS
// ============================================================================

export async function getCourseByProductId(productId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses)
    .where(eq(courses.productId, productId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function ensureCourseForProduct(productId: number) {
  const existing = await getCourseByProductId(productId);
  if (existing) return existing;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(courses).values({
    productId,
    level: "beginner",
    certificateEnabled: true,
  });
  const insertId = Number(
    (result as unknown as [{ insertId?: number }])[0]?.insertId ??
      (result as unknown as { insertId?: number }).insertId ??
      0
  );
  const created = await getCourseByProductId(productId);
  if (!created) {
    throw new Error(`Failed to create course row (insertId=${insertId})`);
  }
  return created;
}

export async function getCourseModules(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(courseModules)
    .where(eq(courseModules.courseId, courseId))
    .orderBy(courseModules.order);
}

export async function getModuleLessons(moduleId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(courseLessons)
    .where(eq(courseLessons.moduleId, moduleId))
    .orderBy(courseLessons.order);
}

export async function getCourseStructureForBuilder(productId: number) {
  const course = await ensureCourseForProduct(productId);
  const modules = await getCourseModules(course.id);
  const withLessons = await Promise.all(
    modules.map(async (mod) => ({
      ...mod,
      lessons: await getModuleLessons(mod.id),
    }))
  );
  return { course, modules: withLessons };
}

export async function createCourseModule(data: InsertCourseModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseModules).values(data);
  const insertId = Number(
    (result as unknown as [{ insertId?: number }])[0]?.insertId ??
      (result as unknown as { insertId?: number }).insertId ??
      0
  );
  return insertId;
}

export async function updateCourseModule(
  id: number,
  data: Partial<InsertCourseModule>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseModules).set(data).where(eq(courseModules.id, id));
}

export async function deleteCourseModule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const lessons = await getModuleLessons(id);
  for (const lesson of lessons) {
    await db.delete(courseLessons).where(eq(courseLessons.id, lesson.id));
  }
  await db.delete(courseModules).where(eq(courseModules.id, id));
}

export async function createCourseLesson(data: InsertCourseLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseLessons).values(data);
  return Number(
    (result as unknown as [{ insertId?: number }])[0]?.insertId ??
      (result as unknown as { insertId?: number }).insertId ??
      0
  );
}

export async function updateCourseLesson(
  id: number,
  data: Partial<InsertCourseLesson>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseLessons).set(data).where(eq(courseLessons.id, id));
}

export async function deleteCourseLesson(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseLessons).where(eq(courseLessons.id, id));
}

export async function swapModuleOrder(moduleIdA: number, moduleIdB: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [a] = await db.select().from(courseModules).where(eq(courseModules.id, moduleIdA)).limit(1);
  const [b] = await db.select().from(courseModules).where(eq(courseModules.id, moduleIdB)).limit(1);
  if (!a || !b) throw new Error("Módulo não encontrado");
  await db.update(courseModules).set({ order: b.order }).where(eq(courseModules.id, a.id));
  await db.update(courseModules).set({ order: a.order }).where(eq(courseModules.id, b.id));
}

export async function swapLessonOrder(lessonIdA: number, lessonIdB: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [a] = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonIdA)).limit(1);
  const [b] = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonIdB)).limit(1);
  if (!a || !b) throw new Error("Aula não encontrada");
  await db.update(courseLessons).set({ order: b.order }).where(eq(courseLessons.id, a.id));
  await db.update(courseLessons).set({ order: a.order }).where(eq(courseLessons.id, b.id));
}

export async function countStudentsByProduct(productId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProducts)
    .where(and(eq(userProducts.productId, productId), eq(userProducts.isActive, true)));
  return Number(result[0]?.count ?? 0);
}

export async function countDistinctStudents() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(distinct ${userProducts.userId})` })
    .from(userProducts)
    .where(eq(userProducts.isActive, true));
  return Number(result[0]?.count ?? 0);
}

export async function getUserLessonProgress(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(lessonProgress)
    .where(and(
      eq(lessonProgress.userId, userId),
      eq(lessonProgress.lessonId, lessonId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateLessonProgress(progress: InsertLessonProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Upsert progress
  const existing = await getUserLessonProgress(progress.userId!, progress.lessonId!);
  
  if (existing) {
    await db.update(lessonProgress)
      .set(progress)
      .where(eq(lessonProgress.id, existing.id));
  } else {
    await db.insert(lessonProgress).values(progress);
  }
}

// ============================================================================
// DIGITAL ASSET FUNCTIONS
// ============================================================================

export async function getDigitalAssetByProductId(productId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(digitalAssets)
    .where(eq(digitalAssets.productId, productId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createDigitalAsset(asset: InsertDigitalAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(digitalAssets).values(asset);
  return result;
}

// ============================================================================
// AFFILIATE FUNCTIONS
// ============================================================================

export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(affiliates)
    .where(eq(affiliates.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createAffiliate(affiliate: InsertAffiliate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(affiliates).values(affiliate);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(affiliates)
    .where(eq(affiliates.id, insertId))
    .limit(1);
  
  return created[0];
}

export async function getAffiliateSales(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];

  const sales = await db.select().from(affiliateSales)
    .where(eq(affiliateSales.affiliateId, affiliateId))
    .orderBy(affiliateSales.createdAt);

  return sales;
}

export async function getAllAffiliates() {
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
      userEmail: users.email,
    })
      .from(affiliates)
      .leftJoin(users, eq(affiliates.userId, users.id))
      .orderBy(affiliates.createdAt);
  } catch (error) {
    console.error("[Database] getAllAffiliates failed:", error);
    return [];
  }
}

export async function updateAffiliateStatus(
  affiliateId: number,
  isActive: boolean
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(affiliates)
    .set({ isActive })
    .where(eq(affiliates.id, affiliateId));
}


// ==================== CERTIFICATES ====================

export async function createCertificate(certificate: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(certificates).values(certificate);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(certificates)
    .where(eq(certificates.id, insertId))
    .limit(1);
  
  return created[0];
}

export async function getCertificateByUserAndCourse(
  userId: number,
  courseId: number
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(certificates)
    .where(
      and(
        eq(certificates.userId, userId),
        eq(certificates.courseId, courseId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    id: certificates.id,
    userId: certificates.userId,
    courseId: certificates.courseId,
    certificateCode: certificates.certificateCode,
    issuedAt: certificates.issuedAt,
    courseName: products.name,
    courseCoverImage: products.coverImage,
  })
    .from(certificates)
    .leftJoin(products, eq(certificates.courseId, products.id))
    .where(eq(certificates.userId, userId))
    .orderBy(certificates.issuedAt);

  return result;
}

export async function getCertificateByCode(certificateCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select({
    id: certificates.id,
    userId: certificates.userId,
    courseId: certificates.courseId,
    certificateCode: certificates.certificateCode,
    issuedAt: certificates.issuedAt,
    userName: users.name,
    courseName: products.name,
  })
    .from(certificates)
    .leftJoin(users, eq(certificates.userId, users.id))
    .leftJoin(products, eq(certificates.courseId, products.id))
    .where(eq(certificates.certificateCode, certificateCode))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export async function getAllSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(subscriptionPlans);
  return result;
}

export async function getSubscriptionPlanById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionPlanBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// USER SUBSCRIPTIONS
// ============================================================================

export async function getUserActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    subscription: userSubscriptions,
    plan: subscriptionPlans,
  })
    .from(userSubscriptions)
    .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(eq(userSubscriptions.userId, userId))
    .orderBy(desc(userSubscriptions.createdAt));

  return result;
}

export async function createUserSubscription(subscription: InsertUserSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const result = await db.insert(userSubscriptions).values(subscription);
  return result;
}

export async function updateUserSubscription(id: number, subscription: Partial<InsertUserSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db.update(userSubscriptions).set(subscription).where(eq(userSubscriptions.id, id));
}

export async function getUserSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// AFFILIATES - Funções adicionais
// ============================================================================

export async function getAffiliateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(affiliates)
    .where(eq(affiliates.affiliateCode, code))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(affiliates)
    .where(eq(affiliates.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}


// ============================================================================
// Affiliate MRR Functions
// ============================================================================

export async function getAffiliateActiveSubscriptions(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];

  // Query raw SQL para buscar assinaturas ativas geradas pelo afiliado
  const result: any = await db.execute(sql`
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

  return result.rows.map((row: any) => ({
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
    commissionAmount: Math.round(row.planPrice * 0.6), // 60% de comissão
  }));
}

export async function getAffiliateTotalClicks(affiliateId: number) {
  // TODO: Implementar rastreamento de cliques
  // Por enquanto, retornar 0
  return 0;
}

export async function getAffiliateMRRHistory(affiliateId: number, months: number) {
  const db = await getDb();
  if (!db) return [];

  // Gerar últimos N meses
  const monthsArray = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    monthsArray.push({
      month: date.toISOString().slice(0, 7), // YYYY-MM
      newSubscribers: 0,
      mrr: 0,
    });
  }

  // Buscar assinaturas criadas nos últimos N meses
  const result: any = await db.execute(sql`
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

  // Mesclar com meses vazios
  const dataMap = new Map(result.rows.map((row: any) => [
    row.month,
    {
      month: row.month,
      newSubscribers: parseInt(row.newSubscribers),
      mrr: Math.round(parseFloat(row.mrr)),
    }
  ]));

  return monthsArray.map(m => dataMap.get(m.month) || m);
}
