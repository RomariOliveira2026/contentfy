# Evolution XII — Architecture

```
shared/contentfy/contracts/success.ts
server/core/success/
  config.ts              # pesos / targets / env override
  score-engine.ts
  habit-engine.ts
  evolution-engine.ts
  consistency-engine.ts
  recommendation-score.ts
  goal-progress-engine.ts
  success-engine.ts      # orchestrator + cache
  build-context.ts       # LMS + Learn read-only
server/routers/success.ts
client/src/components/success/
client/src/pages/members/MyEvolution.tsx
client/src/pages/admin/Success.tsx
client/src/pages/creator/Success.tsx
```

## Boundaries

| May use (read) | Must not modify |
|---|---|
| Learn engines / catalog | Learn router/UI |
| LMS progress snapshots | membersRouter writers |
| Discovery continue-learning helper | Discovery engines |
| products list | Checkout / Stripe / OAuth |

## Data flow

```
LMS progress + user_products
        ↓
Learn competency/goal/achievement (read)
        ↓
SuccessRawSignals
        ↓
Score / Habit / Consistency / Evolution / Recommendations
        ↓
SuccessDashboardPayload
```
