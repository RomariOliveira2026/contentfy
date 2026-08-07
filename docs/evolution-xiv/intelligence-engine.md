# ContentFy Intelligence Engine — Evolution XIV

Motor proprietário de **Inteligência de Plataforma** baseado em comportamento, eventos, métricas, regras configuráveis e estatística simples.

**Não usa** OpenAI, LLM, embeddings ou IA generativa.

**Não altera** Stripe, Checkout, OAuth, Protect, Discovery, Learn, Success, Experience ou LMS — apenas consome dados.

## Arquitetura

```
shared/contentfy/contracts/intelligence.ts
server/core/intelligence/
  IntelligenceEngine
  BehaviorEngine
  AnalyticsEngine
  ConversionEngine
  EngagementEngine
  RetentionEngine
  RecommendationAnalytics
  MarketplaceInsights
  score-math / detection / insights / config / cache
server/intelligence-store.ts   # agregações SQL read-only
server/routers/intelligence.ts
```

## APIs

| Procedure | Auth | Descrição |
|-----------|------|-----------|
| `intelligence.adminDashboard` | admin | Marketplace Health completo |
| `intelligence.creatorDashboard` | authenticated (creator area) | Escopo autor-meta ou proxy |
| `intelligence.marketplaceHealth` | admin | Health compacto |

Aluno **não** possui procedure Intelligence na área members.

## Configuração

`INTELLIGENCE_SCORE_CONFIG_JSON` — merge sobre `DEFAULT_INTELLIGENCE_SCORE_CONFIG`.

Scores: Product, Creator, Category, Engagement, Trust, Growth, Momentum.

## UI

- `/admin/intelligence`
- `/creator/intelligence`

## Honestidade de dados

- Insights só com evidência agregada
- Padrões hora-do-dia / weekday **não** são emitidos até existir agregação temporal suficiente
- Creator ownership: soft `product_discovery_meta.author` ou proxy de plataforma (sem `products.creatorId`)

## Docs

- `orchestration.md`
- `scores.md`
- `roadmap-xv.md`
