import MembersLayout from "@/components/MembersLayout";
import { ProtectionBadge } from "@/components/commerce";
import { EmptyState, LoadingState, PageShell } from "@/components/experience";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function MyPurchases() {
  const { data, isLoading, isError, error } = trpc.protect.myPurchases.useQuery();

  return (
    <MembersLayout>
      <PageShell
        title="Minhas compras"
        description="Pedidos confirmados e proteção ContentFy Protect"
        actions={<ProtectionBadge showLink />}
      >
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <EmptyState
            title="Não foi possível carregar suas compras"
            description={error.message}
          />
        ) : null}
        {!isLoading && !isError && (!data || data.length === 0) ? (
          <EmptyState
            title="Nenhuma compra ainda"
            description="Quando você adquirir um produto, ele aparecerá aqui com a proteção ContentFy."
            action={
              <Link href="/explorar">
                <Button>Explorar produtos</Button>
              </Link>
            }
          />
        ) : null}

        <div className="space-y-3">
          {data?.map((item) => (
            <div
              key={item.order.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">
                  {item.product?.name || `Produto #${item.order.productId}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pedido #{item.order.id} ·{" "}
                  {new Date(item.order.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                  {(item.order.amount / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.eligibility.humanMessage}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{item.order.status}</Badge>
                <Link href={`/my-account/purchases/${item.order.id}/protection`}>
                  <Button size="sm" variant="secondary">
                    ContentFy Protect
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </MembersLayout>
  );
}
