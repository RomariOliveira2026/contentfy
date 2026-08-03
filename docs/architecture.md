# ContentFy — Architecture

## Visão

A ContentFy é o **Sistema Operacional do Conhecimento Digital** (BuilderTudo Technologies).

Ela não compete por cópia de marketplaces tradicionais — inaugura categoria própria.

## Stack

- **Client** — React / Vite / Experience Layer
- **Server** — Express / tRPC / ContentFy Core engines
- **Shared** — contratos `@shared/contentfy`
- **Billing** — ContentFy Pay (Stripe internamente)
- **Auth** — OAuth / sessão (inalterado)
- **LMS** — entrega existente + Learn seams

## Princípios

1. Evolução incremental — nunca reconstrução
2. Não quebrar Stripe, Checkout, OAuth, LMS, Admin, Creator, Marketplace
3. Marca e produto proprietários (Design Freeze v1.0)
4. Novas capacidades nascem em Core + contracts tipados

## Evolution X

Ver documentação completa em [`docs/evolution-x/`](./evolution-x/).
