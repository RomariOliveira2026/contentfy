# ContentFy Evolution X

**Visão:** Sistema Operacional do Conhecimento Digital  
**Empresa:** BuilderTudo Technologies  
**Princípio:** evolução incremental — nunca reconstrução

## Camadas

| Camada | Path |
|---|---|
| Shared contracts | `shared/contentfy/` |
| Server Core engines | `server/core/` |
| Meta API | `server/routers/contentfy.ts` → `trpc.contentfy.*` |
| Client Core | `client/src/core/` |
| Experience | `client/src/experience/` + `components/experience/` |
| Component namespaces | `components/{core,experience,commerce,learning,ai,community,shared}` |
| Brand | `/brand` + `client/src/brand` (Design Freeze v1.0) |

## Regra absoluta

Não quebrar: Stripe, Checkout, OAuth, Banco, LMS, Biblioteca, Creator, Marketplace, Admin, APIs, Segurança, SEO, rotas públicas.

## Documentos

- [architecture.md](./architecture.md)
- [roadmap.md](./roadmap.md)
