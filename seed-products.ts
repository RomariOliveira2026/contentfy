import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema";

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection, { schema, mode: "default" });

  await db.insert(schema.products).values([
    {
      name: "Curso Dominando o TDAH",
      slug: "curso-dominando-tdah",
      description: "Aprenda técnicas práticas para foco, organização e produtividade.",
      type: "course",
      categoryId: 1,
      price: 6700,
      isRecurring: false,
      recurringInterval: null,
      allowInstallments: true,
      maxInstallments: 12,
      coverImage: null,
      thumbnailImage: null,
      salesPageUrl: null,
      isActive: true,
    },
    {
      name: "Desacelere",
      slug: "desacelere",
      description:
        "Paz e equilíbrio para sua mente — guia completo com módulos, exercícios e quizzes.",
      type: "ebook",
      categoryId: 1,
      price: 9700,
      isRecurring: false,
      recurringInterval: null,
      allowInstallments: true,
      maxInstallments: 10,
      coverImage: "/products/desacelere/mockup-kit.webp",
      thumbnailImage: "/products/desacelere/mockup-kit.webp",
      salesPageUrl: "https://desacelere.contentfy.com.br/",
      guaranteeDays: 30,
      isActive: true,
    },
    {
      name: "Manual Representante 4.0",
      slug: "manual-do-representante-comercial",
      description:
        "Ecossistema premium do representante comercial moderno com IA — manual, CRM e bônus.",
      type: "ebook",
      categoryId: 1,
      price: 9700,
      isRecurring: false,
      recurringInterval: null,
      allowInstallments: true,
      maxInstallments: 10,
      coverImage: "/products/representante40/mockup-kit.webp",
      thumbnailImage: "/products/representante40/cover-premium.webp",
      salesPageUrl: "https://representante40.com.br/",
      guaranteeDays: 30,
      isActive: true,
    },
  ]);

  console.log("Produtos inseridos!");
  await connection.end();
}
seedProducts().catch(console.error);
