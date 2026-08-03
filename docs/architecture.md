# ContentFy — Architecture

## Visão geral

A ContentFy é uma plataforma de infoprodutos digitais com:

- **Client** — interface web (React / Vite)
- **Server** — API e regras de negócio (Express / tRPC)
- **Billing** — Stripe (checkout, webhooks, assinaturas)
- **Auth** — OAuth / sessão
- **LMS** — entrega e acesso a produtos digitais

## Princípios

- Separar claramente UI, API e integrações externas
- Não acoplar identidade visual a lógica de produto
- Assets de marca vivem em `/brand` (Design Freeze v1.0)

## Próximos documentos

Detalhar fluxos de compra, afiliados, área do produtor e membros neste arquivo conforme o roadmap.
