# ContentFy Orchestrator — Evolution XV

Camada de **coordenação** entre motores. Não executa regras de negócio de Discovery, Learn, Success, Experience, Intelligence ou Protect.

## Arquitetura

```
shared/contentfy/contracts/orchestrator.ts
server/core/orchestrator/
  ContentFyOrchestrator
  EventBus
  EventRegistry
  WorkflowEngine
  ReactionEngine
  RuleDispatcher
  ActionPipeline
  handlers (invalidate-only adapters)
```

API admin: `trpc.orchestrator.{dashboard,registry,emit,drain}`  
UI: `/admin/orchestrator`  
Config: `ORCHESTRATOR_RULES_JSON`

## Princípio

Motores não se conhecem. Edge/webhooks emitem eventos → Orchestrator dispara ações de coordenação (invalidação de cache / métricas).

## Docs

- `events.md`
- `workflows.md`
- `roadmap-xvi.md`
