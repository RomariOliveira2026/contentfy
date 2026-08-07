# Experience Orchestration

## Fluxo

```
Client (ExperienceDashboard)
  → trpc.experience.home
    → ExperienceOrchestrator.buildHome
      → Promise.all [learn, success, discovery, protect, notifications]
        (cada um via settled — falha isolada)
      → StudentContextBuilder
      → GreetingContextService
      → JourneySummaryService
      → NextBestActionEngine
      → ExperienceFallbackService (patches)
      → cache TTL ~30s
```

## Dependências

```
Experience
 ├─ LearnEngine / competency / goal / achievement
 ├─ SuccessEngine ← buildSuccessContext (Learn + LMS)
 ├─ DiscoveryEngine.buildHome
 ├─ Protect eligibility (getRefundEligibility + orders)
 └─ NotificationCenter (in-memory)
```

Experience **não** recalcula Success Score, elegibilidade Protect, nem ranking Discovery.

## Resiliência

| Falha | Comportamento |
|-------|----------------|
| Discovery | Continue Learning + Success seguem; recs editoriais se vazio |
| Success | Snapshot ausente; CL e Learn seguem |
| Protect | Seção omitida |
| Learn | `fallbackMode`; saudação degradada |
| ≥3 motores | `service_degraded` |

Erros são logados sem secrets: `[ContentFy Experience] <engine> unavailable`.

## Performance

- Consultas paralelas com `Promise.all`
- Cache por aluno (`experience:home:{userId}`, 30s)
- Invalidação após onboarding / dismiss
- UI: skeletons, error boundaries por seção, carrosséis com snap no mobile
