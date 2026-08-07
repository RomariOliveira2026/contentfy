# Workflows & Pipeline

## Pipeline phases

`before` → `main` (paralelo entre steps) → `after` → `onSuccess` | `onFailure` → `fallback`

- Timeout configurável por step / global
- Retry configurável
- Falha em um motor **não** cancela os demais (`Promise.all` por fase + `allSettled` entre workflows)

## Workflows default

- `wf_lesson_completed`
- `wf_course_completed`
- `wf_product_purchased`
- `wf_product_refunded`
- `wf_goal_updated`
- `wf_recommendation_clicked`
- `wf_discovery_clicked`
- `wf_product_favorited`

## Reactions (SE/ENTÃO)

Exemplos em `DEFAULT_ORCHESTRATOR_RULES.reactions`:

- muitas compras (`meta.purchaseBurst >= 5`) → invalidate Discovery/Intelligence
- reembolso alto (`meta.refundRateProxy >= 8`) → invalidate Discovery
- retenção sobe (`meta.retentionDelta >= 10`) → invalidate Experience

Override completo via `ORCHESTRATOR_RULES_JSON`.
