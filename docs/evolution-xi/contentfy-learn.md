# ContentFy Learn v1 — Evolution XI

Sistema proprietário de evolução do aluno baseado em **objetivos**, **competências**, **jornadas** e **progresso inteligente**.

Sem OpenAI, embeddings, LLM ou IA generativa.

## O que é

O Learn transforma cursos em jornadas de evolução. Em vez de medir só compra e progresso de aula, a plataforma passa a medir:

- competências adquiridas / em evolução / faltantes
- objetivos ativos
- próximo passo recomendado (regras)
- Success Index (Conhecimento · Aplicação · Constância · Resultado)
- conquistas elegantes (sem gamificação infantil)

## Integração

- **LMS:** somente leitura de progresso (`lesson_progress`, `user_products`)
- **Discovery:** Skill Graph exportável (`trpc.learn.skillGraph`) para uso futuro
- **Protect / Checkout / Stripe / OAuth / Creator / Admin / rotas públicas:** intocados

## API

```
trpc.learn.home
trpc.learn.dashboard
trpc.learn.goals
trpc.learn.catalogGoals
trpc.learn.setActiveGoal
trpc.learn.competencies
trpc.learn.journey
trpc.learn.timeline
trpc.learn.achievements
trpc.learn.nextStep
trpc.learn.skillGraph
trpc.learn.successIndex
```

## UI

- Rota membros: `/my-account/evolucao` (lazy)
- Nav: “Evolução” no `MembersLayout`
- Componentes: `@/components/learn/*`

## Migration

`drizzle/0013_contentfy_learn.sql` — preferência de objetivo do aluno.

```bash
npx drizzle-kit migrate
```

Sem migration → objetivo ativo em memória de processo (não durável).

## Catálogo

Definições em `server/core/learn/catalog.ts` (competências, objetivos, links produto↔competência).  
UI **não** hardcoda mapas — tudo vem do catálogo / API.

## Qualidade

`npm run check` · `npm test` · `npm run build`
