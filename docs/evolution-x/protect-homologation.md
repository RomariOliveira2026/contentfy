# ContentFy Protect v1 — Homologação & Deploy Checklist

**Não executar reembolso real em produção nesta fase.**  
**Homologação apenas com Stripe Test Mode (`sk_test_`).**

---

## 1. Migration

### Arquivos

| Arquivo | Conteúdo |
|---|---|
| `drizzle/0010_contentfy_protect.sql` | Tabela `refund_requests` + FKs + índices |
| `drizzle/0011_contentfy_protect_hardening.sql` | Audit `refund_audit_events` + flags de reconciliação |

### Comando (versionado — preferido)

```bash
npx drizzle-kit migrate
```

Equivalente se o projeto usar o script composto (gera **e** aplica — evite em prod se não quiser generate):

```bash
# NÃO recomendado só para aplicar Protect:
# npm run db:push
```

Use **`npx drizzle-kit migrate`** quando as migrations já estão versionadas em `drizzle/`.

### Backup (antes)

```bash
# Exemplo mysqldump — ajuste host/user/db
mysqldump -h HOST -u USER -p DATABASE > backup_contentfy_pre_protect_$(date +%Y%m%d).sql
```

### Rollback

```sql
-- Ordem inversa
DROP TABLE IF EXISTS refund_audit_events;
ALTER TABLE refund_requests
  DROP COLUMN IF EXISTS accessRevocationStatus,
  DROP COLUMN IF EXISTS reconciliationNeeded;
-- Se 0011 não existir no MySQL antigo, drope as colunas uma a uma.
DROP TABLE IF EXISTS refund_requests;
-- Remova entradas do journal drizzle se necessário (meta/_journal.json) apenas em emergência coordenada.
```

### Se 0010 já foi aplicada sem FKs

Não reexecute 0010. Aplique apenas 0011 e, se precisar de FKs, rode ALTERs manuais equivalentes aos constraints de 0010.

---

## 2. Variáveis de ambiente (homologação)

```bash
STRIPE_SECRET_KEY=sk_test_...
CONTENTFY_PROTECT_HOMOLOGATION=true
CONTENTFY_PROTECT_REQUIRE_TEST_KEY=true
RATE_LIMIT_PROVIDER=memory   # dev; produção multi-instância → redis (quando implementado)
# REDIS_URL=redis://...      # obrigatório quando RATE_LIMIT_PROVIDER=redis
```

Com `CONTENTFY_PROTECT_HOMOLOGATION=true` ou `NODE_ENV!==production`, chaves `sk_live_` são **bloqueadas**.

---

## 3. Máquina de estados

```
requested → under_review | cancelled
under_review → approved | rejected
approved → processing          (somente via Processar reembolso)
processing → refunded | failed
failed → processing            (nova tentativa)
refunded / rejected / cancelled → (terminal)
```

Saltos inválidos são rejeitados. `refunded` nunca via `adminTransition`.

---

## 4. Rate limit

| Provider | Durável | Uso |
|---|---|---|
| `memory` (default) | Não | Dev / single instance |
| `redis` (stub) | Sim (quando implementado) | Produção multi-instância |

Arquivo: `server/core/rate-limit/`.  
**Não fingimos persistência:** em produção multi-instância com `memory`, um warning é emitido.

---

## 5. Roteiro manual Stripe Test Mode

1. Garantir `sk_test_` + migrations aplicadas.
2. Login como aluno de teste.
3. Comprar produto elegível (Checkout Stripe test card `4242…`).
4. Confirmar pedido `completed` e acesso ativo em `user_products`.
5. Ir em **Minhas compras → ContentFy Protect**.
6. Abrir solicitação (motivo + ciência).
7. Login admin → `/admin/refunds`.
8. Colocar em análise → Aprovar.
9. **Processar reembolso** (confirmar dialog).
10. Conferir no Stripe Dashboard (Test): Refund criado; PI `amount_refunded`.
11. Banco: `orders.status=refunded`, `refund_requests.status=refunded`, `providerRefundId` preenchido, `user_products.isActive=0` (linha preservada).
12. Timeline/audit: eventos em `refund_audit_events`.
13. Aluno: acesso ao produto bloqueado; Protect mostra status reembolsado.

### Casos negativos

- Pedido fora do prazo → não elegível.
- Pedido já reembolsado → bloqueado.
- Segunda solicitação ativa → CONFLICT.
- User A acessando pedido de User B → FORBIDDEN.
- `sk_live_` com homologation=true → bloqueado.
- Processar duas vezes → idempotent hit.

---

## 6. Checklist antes do deploy

- [ ] Backup do banco
- [ ] `npx drizzle-kit migrate` em staging
- [ ] `npm run check` / `npm test` / `npm run build` OK
- [ ] Homologação Stripe Test completa
- [ ] `CONTENTFY_PROTECT_HOMOLOGATION` desligado só quando for intencional em prod
- [ ] Confirmar `orders.list` e `users.list` exigem admin
- [ ] Rate limit: planejar Redis se houver >1 instância
- [ ] Sem reembolso live de teste em clientes reais

## 7. Checklist após o deploy

- [ ] Migration 0010+0011 aplicadas (journal)
- [ ] Smoke: criar solicitação em staging/prod com compra test se disponível
- [ ] Admin `/admin/refunds` carrega
- [ ] Logs sem secrets
- [ ] Monitorar `reconciliationNeeded=true`
- [ ] Política `/garantia` acessível
