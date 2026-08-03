# ContentFy Success Engine v1 — Evolution XII

Motor proprietário de **evolução, aplicação e transformação**.

Trabalha com Learn (leitura), Discovery (recomendações futuras) e Protect (ecossistema) — **sem alterar** esses módulos.

Sem IA generativa.

## O que mede

| Pilar | Sinais (configuráveis) |
|---|---|
| Conhecimento | módulos / progresso |
| Aplicação | tarefas / práticas (proxy LMS) |
| Constância | dias ativos / sequência |
| Resultado | objetivos e competências |

Pesos via `DEFAULT_SUCCESS_SCORE_CONFIG` ou `SUCCESS_SCORE_CONFIG_JSON`.

## API

```
trpc.success.dashboard
trpc.success.score
trpc.success.habits
trpc.success.timeline
trpc.success.insights
trpc.success.goals
trpc.success.recommendations
trpc.success.creatorAnalytics
trpc.success.adminAnalytics
```

## UI

- Aluno: `/my-account/sucesso` — **Minha Evolução**
- Admin: `/admin/success`
- Creator: `/creator/success`

Learn permanece em `/my-account/evolucao`.

## Engines

`SuccessEngine` · `ScoreEngine` · `HabitEngine` · `EvolutionEngine` · `ConsistencyEngine` · `RecommendationScore` · `GoalProgressEngine`
