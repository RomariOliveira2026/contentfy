# Evolution XIII.1 — Persistência e Homologação

## Migration

Arquivo: `drizzle/0014_contentfy_experience.sql`  
Journal: idx 14 (`0014_contentfy_experience`)

**Não aplicar automaticamente.** Após backup:

```bash
npx drizzle-kit migrate
```

### Tabelas

| Tabela | Função |
|--------|--------|
| `experience_onboarding` | Onboarding (unique `userId`) |
| `experience_activity_events` | Eventos de atividade |
| `experience_activity_daily` | Agregação diária (unique user+day) |
| `experience_telemetry_events` | Telemetria interna |
| `experience_dismissed_recommendations` | Recs dispensadas |

## Persistência

- Onboarding: objetivo, improveFirst, weeklyHours, preferencesJson, completedAt, updatedAt
- Fonte de verdade: **DB** quando 0014 aplicada
- Fallback memória: **somente** `NODE_ENV !== "production"`, log explícito

## Atividade

Eventos: `login`, `area_opened`, `lesson_started`, `lesson_completed`, `product_returned`, `exercise_completed`, `goal_updated`, `recommendation_clicked`

Agregação: último dia ativo, dias recentes, streak, inatividade, retorno.

## inactive_return

- Exige `hasPriorActivity` + progresso + produto em andamento
- Threshold: `EXPERIENCE_INACTIVE_RETURN_DAYS` (default 7)
- Não classifica aluno novo como inativo

## Conquistas

Rota: `/my-account/achievements`  
API: `trpc.experience.achievements`  
Nav membros atualizada (links antigos de Evolução preservados)

## Cache

TTL 30s em `experience:home:{userId}`  
`invalidateExperienceForUser` após: aula, objetivo, onboarding, compra (webhook), reembolso.

## Homologação manual

1. Aplicar migration 0014 em staging
2. Login → `/dashboard` (saudação + NBA)
3. Completar onboarding → recarregar → `persisted: db`
4. Concluir aula → cache limpo + Continue Learning atualizado
5. Simular inatividade (ajustar daily ou env threshold=1) → `inactive_return`
6. Abrir `/my-account/achievements`
7. Forçar falha Discovery (mock) → Home parcial
8. Verificar Protect discreto e telemetria em `experience_telemetry_events`
