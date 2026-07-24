import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const categories = [
  "Desenvolvimento Pessoal",
  "Relacionamentos & Inteligência Emocional",
  "Saúde Mental & Neurociência",
  "Comunicação & Oratória",
  "Finanças & Prosperidade",
  "Negócios Digitais & Empreendedorismo",
  "Carreira & Produtividade",
  "Ferramentas & Profissões do Futuro",
  "Vícios & Reprogramação Emocional",
  "Saúde, Corpo & Performance",
  "Espiritualidade & Cultura",
  "Estilo de Vida & Conhecimento Premium"
];

async function seedCategories() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('🌱 Populando categorias...');

  for (const categoryName of categories) {
    const slug = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      await connection.execute(
        'INSERT INTO product_categories (name, slug) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = name',
        [categoryName, slug]
      );
      console.log(`✅ ${categoryName}`);
    } catch (error) {
      console.error(`❌ Erro ao inserir ${categoryName}:`, error.message);
    }
  }

  console.log('✨ Categorias populadas com sucesso!');
  await connection.end();
}

seedCategories().catch(console.error);
