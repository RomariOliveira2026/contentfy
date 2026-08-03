import MembersLayout from "@/components/MembersLayout";
import {
  GuaranteeCountdown,
  ProtectionBadge,
  RefundRequestForm,
  RefundStatusCard,
  RefundTimeline,
} from "@/components/commerce";
import { EmptyState, LoadingState, PageShell } from "@/components/experience";
import { Button } from "@/components/ui/button";
import { PROTECT_BRAND } from "@shared/contentfy";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function OrderProtection() {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId);
  const utils = trpc.useUtils();

  const query = trpc.protect.getOrderProtection.useQuery(
    { orderId },
    { enabled: Number.isFinite(orderId) && orderId > 0 }
  );

  const createMutation = trpc.protect.createRequest.useMutation({
    onSuccess: async () => {
      toast.success("Solicitação enviada ao ContentFy Protect");
      await utils.protect.getOrderProtection.invalidate({ orderId });
    },
    onError: (err) => toast.error(err.message),
  });

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return (
      <MembersLayout>
        <EmptyState title="Pedido inválido" />
      </MembersLayout>
    );
  }

  if (query.isLoading) {
    return (
      <MembersLayout>
        <PageShell title="ContentFy Protect">
          <LoadingState />
        </PageShell>
      </MembersLayout>
    );
  }

  if (query.isError || !query.data) {
    return (
      <MembersLayout>
        <EmptyState
          title="Não foi possível abrir a proteção"
          description={query.error?.message || "Pedido não encontrado."}
          action={
            <Link href="/my-account/purchases">
              <Button variant="secondary">Voltar às compras</Button>
            </Link>
          }
        />
      </MembersLayout>
    );
  }

  const { order, product, eligibility, activeRequest, brand, policy } =
    query.data;
  const amount = (order.amount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <MembersLayout>
      <PageShell
        title="ContentFy Protect"
        description={brand.purchaseProtected}
        actions={<ProtectionBadge days={eligibility.guaranteeDays} />}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-muted-foreground">
                Pedido #{order.id} · Compra em{" "}
                {new Date(order.createdAt).toLocaleDateString("pt-BR")} · {amount}
              </p>
            </div>

            <GuaranteeCountdown
              remainingDays={eligibility.remainingDays}
              deadline={eligibility.deadline}
            />

            <p className="text-sm text-muted-foreground">
              {eligibility.humanMessage}
            </p>
            <p className="text-sm text-muted-foreground">{policy.description}</p>
            <p className="text-xs text-muted-foreground">{PROTECT_BRAND.paymentCopy}</p>
            <p className="text-xs text-muted-foreground">{PROTECT_BRAND.microcopy}</p>

            {activeRequest ? (
              <div className="space-y-3">
                <RefundStatusCard
                  status={activeRequest.status}
                  requestedAt={activeRequest.requestedAt}
                />
                <RefundTimeline status={activeRequest.status} />
              </div>
            ) : null}

            {eligibility.eligible ? (
              <RefundRequestForm
                productName={product.name}
                amountCents={order.amount}
                loading={createMutation.isPending}
                onSubmit={async (data) => {
                  await createMutation.mutateAsync({
                    orderId,
                    ...data,
                  });
                }}
              />
            ) : (
              <div
                className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm"
                data-cf-state="not-eligible"
              >
                <p className="font-medium text-amber-200">
                  Solicitação indisponível neste momento
                </p>
                <p className="mt-1 text-amber-100/80">{eligibility.humanMessage}</p>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Como funciona</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Você envia a solicitação com um motivo simples.</li>
                <li>Nossa equipe analisa com cuidado (prazo estimado: até 5 dias úteis).</li>
                <li>Se aprovado, o estorno é processado e o acesso é encerrado.</li>
              </ol>
              <Link href="/garantia">
                <a className="mt-4 inline-block text-emerald-300 hover:underline">
                  Ler Política de Garantia ContentFy
                </a>
              </Link>
            </div>
          </aside>
        </div>
      </PageShell>
    </MembersLayout>
  );
}
