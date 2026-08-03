# ContentFy Evolution X — Architecture

```
shared/contentfy          → contracts & identity
        ↓
server/core/*             → engines (Pay, Protect, AI, Learn, Insight…)
        ↓
server/routers/*          → live tRPC (unchanged) + contentfy meta-router
        ↓
client experience/core    → UX layer + component namespaces
```

## ContentFy Pay

- UI label: **Pagamento ContentFy**
- Active provider: **Stripe** (checkout + webhook intact)
- Abstraction: `server/core/payments/PaymentEngine`

## ContentFy Protect

- Default guarantee: **30 days**
- Engine: `server/core/protect/GuaranteeEngine`
- Persistence / antifraud: planned

## ContentFy AI

- Engine ready for OpenAI / Anthropic / Google / local
- Product AI slugs: `representante-ai`, `desacelere-ai`, etc.
- Live generation still via existing `llm.ts` / ai-studio

## ContentFy Learn / Insight / Discovery / Success Score / Media / Community / Notifications

Scaffolded as engines + contracts. Wire gradually without moving LMS/DB.

## Public API readiness

New domains expose typed contracts in `shared/contentfy` so future public API can reuse the same shapes.
