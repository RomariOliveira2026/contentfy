# Next Best Action

Motor: `NextBestActionEngine` (`server/core/experience/next-best-action-engine.ts`)

## Prioridades padrão (menor = mais urgente)

| Kind | Prioridade |
|------|------------|
| `continue_lesson` | 10 |
| `resume_journey` | 20 |
| `review_stagnant_competency` | 30 |
| `choose_goal` | 40 |
| `start_first_product` | 50 |
| `complete_onboarding` | 55 |
| `related_product` | 60 |
| `view_achievement` | 70 |
| `explore_catalog` | 80 |
| `support` | 90 |

Override: `EXPERIENCE_NBA_PRIORITIES_JSON`.

## Regras

1. Com produto em andamento → continuar última aula (texto contextual com título da aula).
2. Compra sem progresso → iniciar primeiro produto.
3. Retorno após inatividade → retomar jornada.
4. Sem objetivo e com produtos → escolher objetivo.
5. Competência estagnada (regra Learn) → revisar.
6. Sem produtos → explorar / onboarding.
7. Nunca texto genérico se houver ação contextual.

NBA **não** duplica Success recommendations — usa contexto já consolidado e prioriza ações de jornada.
