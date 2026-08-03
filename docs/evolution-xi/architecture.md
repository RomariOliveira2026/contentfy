# Evolution XI — Architecture

## Layers

```
shared/contentfy/contracts/learn.ts     # contracts + Success Index formula
server/core/learn/
  catalog.ts              # data-driven competencies/goals/links/achievements
  competency-engine.ts
  goal-engine.ts
  journey-engine.ts
  skill-graph.ts
  achievement-engine.ts
  learn-engine.ts         # orchestrator + dashboard payload
  cache.ts                # TTL in-process
server/learn-store.ts     # active goal persistence
server/routers/learn.ts   # trpc.learn.*
client/src/core/learn/    # type re-exports
client/src/components/learn/
client/src/pages/members/Evolution.tsx
```

## Engine responsibilities

| Engine | Answers |
|---|---|
| GoalEngine | Qual objetivo? Inferência + progresso |
| CompetencyEngine | Quais competências? Níveis por progresso×peso |
| JourneyEngine | Qual próximo passo? Trilha objetivo→competência→curso |
| SkillGraph | Grafo curso↔competência↔objetivo↔aluno↔produto |
| AchievementEngine | Marcos desbloqueados por regras |
| LearnEngine | Dashboard unificado + cache |

## Data flow

```
user_products + lesson_progress (LMS read)
        ↓
LearnLearnerSignals
        ↓
CompetencyEngine → GoalEngine → AchievementEngine
        ↓
JourneyEngine + Success Index
        ↓
LearnDashboardPayload → UI Evolução
```

## Non-goals (this release)

- Não reescreve LMS
- Não altera Discovery engines
- Não processa pagamentos
- Não chama modelos de IA
