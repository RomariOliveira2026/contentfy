# Orchestrator Events

| Evento | Origem típica | Consumidores (coordenação) |
|--------|---------------|----------------------------|
| PRODUCT_PURCHASED | commerce webhook | experience, intelligence, discovery, learn |
| COURSE_STARTED | members edge | learn, experience, success |
| COURSE_COMPLETED | edge | success, learn, experience, discovery, intelligence |
| LESSON_COMPLETED | members | experience, learn, success, intelligence |
| PRODUCT_REFUNDED | protect | experience, intelligence, discovery |
| REFUND_APPROVED | protect | intelligence, experience |
| DISCOVERY_CLICKED | discovery | discovery, intelligence |
| GOAL_UPDATED | learn | learn, experience, success |
| ACHIEVEMENT_UNLOCKED | learn | experience, success |
| PRODUCT_FAVORITED | discovery | discovery, intelligence |
| RECOMMENDATION_CLICKED | experience | intelligence |
| CREATOR_PRODUCT_CREATED | edge | intelligence, discovery |
| PRODUCT_PUBLISHED | edge | discovery, intelligence |
| CATEGORY_GROWING | intelligence | discovery, experience |
| PRODUCT_TRENDING | intelligence | discovery, experience |
| SUCCESS_SCORE_CHANGED | success | experience |

Cada definição no `EventRegistry` inclui: origem, payload keys, consumidores, prioridade, retry e timeout defaults.
