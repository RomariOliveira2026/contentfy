/**
 * Campos recomendados na Área do Criador / Admin para alimentar a vitrine.
 * Não duplica colunas já existentes no schema `products` — lista gaps e aliases.
 *
 * Já existem no banco:
 * - name, slug, description, type, categoryId, price
 * - coverImage, thumbnailImage, salesPageUrl, contentUrl
 * - isActive (publicação), guaranteeDays
 *
 * Preparar (futuro — sem migration nesta entrega):
 */
export const SHOWCASE_CREATOR_FIELD_PLAN = [
  { key: "heroImage", label: "Imagem do Hero (horizontal)", status: "planned" },
  { key: "landscapeImage", label: "Imagem horizontal da vitrine", status: "planned" },
  { key: "portraitCover", label: "Capa vertical", status: "planned" },
  { key: "slogan", label: "Slogan", status: "planned" },
  { key: "shortDescription", label: "Descrição curta", status: "planned" },
  { key: "tags", label: "Tags", status: "planned" },
  { key: "collections", label: "Coleções / trilhos", status: "planned" },
  { key: "isFeatured", label: "Destaque", status: "planned" },
  { key: "isLaunch", label: "Lançamento", status: "planned" },
  { key: "sortOrder", label: "Ordem", status: "planned" },
  { key: "seoTitle", label: "SEO title", status: "planned" },
  { key: "seoDescription", label: "SEO description", status: "planned" },
] as const;
