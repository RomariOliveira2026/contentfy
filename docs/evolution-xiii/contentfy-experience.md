# ContentFy Experience Layer — Evolution XIII

Camada proprietária de experiência que **orquestra** Learn, Success, Discovery, Protect e LMS — sem criar outro motor independente de score/recomendação.

## Objetivo

Transformar dados reais dos motores existentes em uma jornada clara na área do aluno (**Centro de Evolução**).

## Contratos

- `shared/contentfy/contracts/experience.ts`
  - `StudentContext`
  - `ExperienceHomePayload`
  - `NextBestAction`
  - estados `ExperienceStudentState`
  - eventos de analytics internos

## Servidor

```
server/core/experience/
  experience-orchestrator.ts
  student-context-builder.ts
  next-best-action-engine.ts
  experience-feed-service.ts
  greeting-context-service.ts
  journey-summary-service.ts
  experience-fallback-service.ts
  analytics.ts
  onboarding-store.ts
  cache.ts
  config.ts
```

API: `trpc.experience.*` (`server/routers/experience.ts`)

| Procedure | Tipo | Descrição |
|-----------|------|-----------|
| `home` | query | Payload único do Centro de Evolução |
| `context` | query | `StudentContext` consolidado |
| `nextBestAction` | query | NBA |
| `journeySummary` | query | Resumo da jornada |
| `onboarding` | query | Estado + catálogo de objetivos |
| `saveOnboarding` | mutation | Persiste em memória de processo (+ goal Learn quando possível) |
| `dismissRecommendation` | mutation | Dispensa recomendação (sessão) |
| `markActionSeen` | mutation | Analytics NBA |
| `track` | mutation | Eventos `experience.*` |

Todas usam `protectedProcedure` — o aluno vem da sessão, nunca do cliente.

## Cliente

- Página: `/dashboard` e alias `/my-account/home`
- `/my-account` permanece conta/billing
- Componentes em `client/src/components/experience/`
- Helpers em `client/src/core/experience/`

## Motores consumidos (read-only)

| Motor | Uso |
|-------|-----|
| Learn | objetivos, competências, conquistas, jornada |
| Success | Success Score, hábitos, consistência, recomendações |
| Discovery | rails recommended/trending |
| Protect | resumo de compras protegidas |
| LMS / Discovery store | continue learning (progresso real de aulas) |

## Regras absolutas desta versão

- Sem OpenAI / LLM / embeddings
- Sem migrations automáticas
- Sem dados inventados como reais
- Falha parcial de motor → página degrada, não quebra
- Onboarding em memória até migration futura

## Configuração opcional

- `EXPERIENCE_NBA_PRIORITIES_JSON` — override de prioridades NBA
- `EXPERIENCE_INACTIVE_RETURN_DAYS` — limiar de inatividade (default 7)

## XIII.1

Ver `persistence-homologation.md` — migration `0014_contentfy_experience`, onboarding/atividade/telemetria persistentes, rota `/my-account/achievements`.
