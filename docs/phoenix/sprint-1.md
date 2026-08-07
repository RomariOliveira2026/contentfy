# PROJECT PHOENIX — Sprint 1

**The ContentFy Experience™** — nascimento da identidade de produto.

## Princípio

Não alterar funcionalidades. Alterar percepção.

Toda decisão: *isto aumenta o valor percebido?*

## Entregas

### ContentFy DNA™

- Contrato e resolver em `shared/contentfy/contentfy-dna.ts`
- Objetivos, competências, resultados, jornadas, relacionamentos
- Consumido por Discovery cards, PDP, Skill Map

### Evolution Graph™

- Componente proprietário radial (`client/src/components/phoenix/EvolutionGraph.tsx`)
- Integrado no Centro de Evolução (Experience dashboard)

### Skill Map™

- Mapa de competências do produto (`SkillMap.tsx`)
- Exibido na página premium `/produto/:slug`

### Centro de Descoberta

- Trilhos renomeados com identidade (não genéricos) via `DISCOVERY_RAIL_DEFS`
- Hero vivo `DiscoveryCenterHero`
- Cards Discovery redesenhados (mockup, autor, competências, tempo, nível, status, CTA, hover)
- Home e Explorar alinhados à linguagem de jornada

### Página do produto

- Transformação + DNA + Skill Map + roadmap + preview + garantia + recomendações
- Tom inspirado em clareza Apple — sem copiar layout de LMS genérico

### Centro de Evolução

- Framing de jornada (não “cursos”)
- Evolution Graph + painéis existentes (Success Score, continue, conquistas)

## Fora de escopo (intencional)

- Deploy / migrations / commits automáticos
- Mudança de checkout, Stripe, OAuth, LMS writers
- Avaliações inventadas (só exibir quando houver dado real)
- Seção “Criadores em Destaque” sem fonte de dados real

## Qualidade

Executar: `npm run check` · `npm test` · `npm run build`

## Sprint 2 (roadmap)

1. DNA persistido por produto (painel editorial) — sem hardcode de seeds
2. Criadores em Destaque com autor real do catálogo
3. Motion system unificado (tokens de duração/easing compartilhados)
4. Empty/loading states em toda biblioteca e filtros
5. Audit completo de ícones + tipografia em telas legacy members
6. Performance: lazy rails + image priority policy
