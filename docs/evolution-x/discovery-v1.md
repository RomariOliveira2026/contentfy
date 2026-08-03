# ContentFy Discovery v1

Motor proprietário de descoberta baseado em **regras**, **comportamento** e **relacionamentos**.  
Sem OpenAI, sem embeddings, sem IA generativa.

## Arquitetura

```
shared/contentfy/contracts/discovery.ts   # contratos + scoring
server/core/discovery/
  discovery-engine.ts          # orquestrador (home, search, related)
  recommendation-service.ts    # recomendados para você
  category-engine.ts           # trilhos por coleção/categoria
  relationship-engine.ts       # grafo de produtos
  trending-engine.ts           # views/compras/favoritos/ratings/crescimento
  continue-learning-engine.ts  # progresso LMS (leitura; não altera LMS)
  cache.ts                     # TTL em memória
  seed-metadata.ts             # tags/nível/objetivos (seed)
  seed-relationships.ts        # trilhas (Representante / Desacelere)
server/discovery-store.ts      # favoritos, eventos, insights (DB + fallback memória)
server/routers/discovery.ts    # tRPC
```

## Migration

Arquivo: `drizzle/0012_contentfy_discovery.sql`  
**Não executada automaticamente.**

```bash
# backup antes
mysqldump -h HOST -u USER -p DATABASE > backup_pre_discovery.sql

npx drizzle-kit migrate
```

Não use `db:push` só para aplicar Discovery.

Rollback (ordem):

```sql
DROP TABLE IF EXISTS discovery_search_stats;
DROP TABLE IF EXISTS discovery_events;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS product_discovery_relationships;
DROP TABLE IF EXISTS product_discovery_meta;
```

Sem migration, favoritos/eventos usam **memória de processo** (não durável — aviso no log).

## Rotas

| Rota | Uso |
|---|---|
| `trpc.discovery.home` | Home personalizada / trilhos |
| `trpc.discovery.search` | Busca título/autor/categoria/tags/keywords/objetivos |
| `trpc.discovery.related` | Grafo de relacionamento |
| `trpc.discovery.track` | view/click/dwell/search/favorite |
| `trpc.discovery.myList` / add / remove | Minha Lista |
| `trpc.discovery.continueLearning` | Continue aprendendo |
| `trpc.discovery.adminInsights` | Painel admin |
| `/explorar` | Feed Discovery + vitrine |
| `/explorar/categoria/:slug` | URL amigável de categoria |
| `/minha-lista` | Favoritos |
| `/admin/discovery` | Insights |

## Algoritmos

- **Trending:** `views*1 + purchases*8 + favorites*4 + ratings*3 + recentGrowth*6`
- **Search:** pesos título > autor > categoria > tags > keywords > objetivos
- **Recommend:** grafo + preferências/objetivos + buscas recentes; fallback editorial
- **Continue learning:** última aula/módulo + % progresso (LMS read-only)

## O que já funciona

- Engines + cache TTL
- Trilhos Netflix-like (seed + catálogo)
- Favoritos (DB ou memória)
- Histórico de eventos (quando migrado)
- Busca Discovery no header
- Home + Explorar personalizados
- SEO (canonical, OG, schema CollectionPage)
- Admin insights

## Depende de dados futuros

- Mais produtos com `product_discovery_meta` preenchido
- Arestas reais no grafo (além do seed)
- Volume de `discovery_events` para trending real
- Redis/cache distribuído se multi-instância
