# Intelligence Orchestration

```
UI Admin/Creator
  → trpc.intelligence.*
    → IntelligenceEngine
      → buildIntelligenceSnapshot (orders, discovery_events, favorites, refunds, lesson_progress, products, meta)
      → BehaviorEngine (product rows + scores)
      → Analytics / Conversion / Engagement / Retention
      → MarketplaceInsights (TOP / lifecycle / authors / categories)
      → detectAlerts + buildInsights
      → cache 60s
```

## Fontes (read-only)

| Sinal | Origem |
|-------|--------|
| Views | `discovery_events` |
| Vendas / receita | `orders` completed |
| Favoritos | `user_favorites` (+ Discovery admin insights) |
| Reembolsos | `refund_requests` |
| Progresso / conclusão / abandono | `lesson_progress` → course tree |
| Autor / categoria | `product_discovery_meta` + product category |

## Segurança

- Admin: visão total
- Creator: filtro por `author` meta quando match; senão proxy com nota
- Members/aluno: sem rotas Intelligence
