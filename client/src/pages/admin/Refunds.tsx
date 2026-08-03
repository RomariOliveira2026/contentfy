import AdminLayout from "@/components/AdminLayout";
import {
  AdminRefundDrawer,
  AdminRefundTable,
  type AdminRefundRow,
} from "@/components/commerce";
import { LoadingState, PageShell } from "@/components/experience";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function AdminRefunds() {
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const listQuery = trpc.protect.adminList.useQuery(
    status === "all" ? undefined : { status: status as any }
  );

  const detailQuery = trpc.protect.adminGet.useQuery(
    { requestId: selectedId! },
    { enabled: selectedId != null }
  );

  const transitionMutation = trpc.protect.adminTransition.useMutation({
    onSuccess: async () => {
      toast.success("Status atualizado");
      await utils.protect.adminList.invalidate();
      if (selectedId) await utils.protect.adminGet.invalidate({ requestId: selectedId });
    },
    onError: (e) => toast.error(e.message),
  });

  const processMutation = trpc.protect.adminProcessRefund.useMutation({
    onSuccess: async () => {
      toast.success("Reembolso processado");
      await utils.protect.adminList.invalidate();
      if (selectedId) await utils.protect.adminGet.invalidate({ requestId: selectedId });
    },
    onError: (e) => toast.error(e.message),
  });

  const notesMutation = trpc.protect.adminAddNotes.useMutation({
    onSuccess: () => toast.success("Observação salva"),
    onError: (e) => toast.error(e.message),
  });

  const repairMutation = trpc.protect.adminRepairAccessRevocation.useMutation({
    onSuccess: async () => {
      toast.success("Revogação reparada");
      await utils.protect.adminList.invalidate();
      if (selectedId) await utils.protect.adminGet.invalidate({ requestId: selectedId });
    },
    onError: (e) => toast.error(e.message),
  });

  const rows = useMemo(
    () => (listQuery.data ?? []) as unknown as AdminRefundRow[],
    [listQuery.data]
  );

  return (
    <AdminLayout>
      <PageShell
        title="ContentFy Protect"
        description="Solicitações de garantia e reembolso"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="requested">Pendentes</SelectItem>
              <SelectItem value="under_review">Em análise</SelectItem>
              <SelectItem value="approved">Aprovadas</SelectItem>
              <SelectItem value="rejected">Recusadas</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="refunded">Concluídas</SelectItem>
              <SelectItem value="failed">Falhas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {listQuery.isLoading ? (
          <LoadingState />
        ) : (
          <AdminRefundTable
            rows={rows}
            onOpen={(id) => setSelectedId(id)}
          />
        )}

        <AdminRefundDrawer
          open={selectedId != null}
          onOpenChange={(open) => {
            if (!open) setSelectedId(null);
          }}
          loading={detailQuery.isLoading}
          data={
            detailQuery.data
              ? {
                  request: detailQuery.data.request as any,
                  product: {
                    name: detailQuery.data.product.name,
                    guaranteeDays: detailQuery.data.product.guaranteeDays,
                  },
                  order: {
                    id: detailQuery.data.order.id,
                    amount: detailQuery.data.order.amount,
                    status: detailQuery.data.order.status,
                    createdAt: detailQuery.data.order.createdAt,
                  },
                  user: {
                    name: detailQuery.data.order.user?.name ?? null,
                    email: detailQuery.data.order.user?.email ?? null,
                  },
                  eligibility: detailQuery.data.eligibility,
                  access: detailQuery.data.access
                    ? { isActive: detailQuery.data.access.isActive }
                    : null,
                }
              : null
          }
          onTransition={async (nextStatus, adminNotes) => {
            if (!selectedId) return;
            await transitionMutation.mutateAsync({
              requestId: selectedId,
              status: nextStatus as any,
              adminNotes,
            });
          }}
          onProcessRefund={async () => {
            if (!selectedId) return;
            await processMutation.mutateAsync({
              requestId: selectedId,
              confirm: true,
            });
          }}
          onSaveNotes={async (adminNotes) => {
            if (!selectedId) return;
            await notesMutation.mutateAsync({
              requestId: selectedId,
              adminNotes,
            });
          }}
          onRepairAccess={async () => {
            if (!selectedId) return;
            await repairMutation.mutateAsync({ requestId: selectedId });
          }}
        />
      </PageShell>
    </AdminLayout>
  );
}
