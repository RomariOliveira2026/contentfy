# Student States

| Estado | Quando | Experiência |
|--------|--------|-------------|
| `new_user` / `no_products` | Sem produtos | Onboarding + explorar catálogo |
| `purchased_no_progress` | Tem produto, sem progresso LMS | CTA iniciar primeiro produto |
| `active_learning` | Progresso recente | Continuar aula + Success snapshot |
| `inactive_return` | Atividade prévia + progresso + produto em andamento + inatividade ≥ threshold (`EXPERIENCE_INACTIVE_RETURN_DAYS`, default 7). Não aplica a aluno novo. | Tom de retorno + retomar jornada |
| `goal_near_completion` | Objetivo ≥70% e &lt;100% | Mensagem de quase lá |
| `course_completed` | Curso(s) 100% e sem progresso ativo | Celebrar + conquistas |
| `partial_data` | 1–2 motores indisponíveis | Home parcial, aviso discreto |
| `service_degraded` | ≥3 motores indisponíveis | Saudação guia, seções limitadas |

## Princípios

- Não afirmar evolução sem dados
- Não inventar percentuais
- Seções só aparecem quando há conteúdo (ou empty state editorial explícito)
- Componentes não montam `StudentContext` — só consomem o payload da API
