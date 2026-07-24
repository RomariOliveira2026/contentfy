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
      description: "Controle a ansiedade e recupere a paz mental.",
      type: "ebook",
      categoryId: 1,
      price: 4700,
      isRecurring: false,
      recurringInterval: null,
      allowInstallments: true,
      maxInstallments: 6,
      coverImage: null,
      thumbnailImage: null,
      salesPageUrl: null,
      isActive: true,
    },
  ]);

  console.log("Produtos inseridos!");
  await connection.end();
}
seedProducts().catch(console.error);
   