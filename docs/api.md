# ContentFy — API

## Visão geral

A API da plataforma é exposta principalmente via **tRPC** no servidor Express, com integrações externas (Stripe webhooks, OAuth).

## Escopo deste documento

- Endpoints / routers principais
- Autenticação e autorização
- Eventos de billing
- Contratos de dados públicos

## Regra

Não documentar segredos. Credenciais ficam em variáveis de ambiente — nunca neste repositório de docs.
