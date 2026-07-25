import { useState } from "react";
import { Link, useLocation } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen,
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TYPE_LABEL: Record<string, string> = {
  course: "Curso",
  ebook: "E-book",
  audiobook: "Audiobook",
  app: "App",
};

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function CreatorProducts() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data, isLoading, isError, error, refetch } =
    trpc.creator.listProducts.useQuery();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const duplicateMutation = trpc.products.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Produto duplicado como rascunho");
      utils.creator.listProducts.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado");
      utils.creator.listProducts.invalidate();
      utils.creator.dashboard.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto despublicado (exclusão suave)");
      setDeleteId(null);
      utils.creator.listProducts.invalidate();
      utils.creator.dashboard.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre, edite e organize seus produtos digitais.
            </p>
          </div>
          <Link href="/creator/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar produto
            </Button>
          </Link>
        </div>

        <Card className="border-white/[0.08] bg-[#0f1522]">
          <CardHeader>
            <CardTitle>Seus produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
                ))}
              </div>
            )}

            {isError && (
              <div className="py-8 text-center space-y-3">
                <p className="text-destructive">{error.message}</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {data && data.length === 0 && (
              <div className="py-14 text-center">
                <PackageEmpty />
                <h3 className="mt-4 text-lg font-semibold">Nenhum produto ainda</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Crie seu primeiro produto digital para começar.
                </p>
                <Link href="/creator/products/new">
                  <Button>Criar produto</Button>
                </Link>
              </div>
            )}

            {data && data.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                              {product.coverImage || product.thumbnailImage ? (
                                <img
                                  src={product.coverImage || product.thumbnailImage || ""}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  Sem capa
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                /{product.slug}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{TYPE_LABEL[product.type] || product.type}</TableCell>
                        <TableCell>
                          {product.price === 0 ? "Gratuito" : formatBRL(product.price)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.status === "published" ? "default" : "secondary"}
                          >
                            {product.status === "published" ? "Publicado" : "Rascunho"}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.studentCount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(new Date(product.updatedAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end flex-wrap gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Editar"
                              onClick={() =>
                                navigate(`/creator/products/${product.id}/edit`)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {product.type === "course" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Construtor de curso"
                                onClick={() =>
                                  navigate(`/creator/courses/${product.id}/builder`)
                                }
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Visualizar"
                              onClick={() =>
                                window.open(`/products/${product.slug}`, "_blank")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Duplicar"
                              onClick={() => duplicateMutation.mutate({ id: product.id })}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              title={
                                product.isActive ? "Despublicar" : "Publicar"
                              }
                              onClick={() =>
                                updateMutation.mutate({
                                  id: product.id,
                                  isActive: !product.isActive,
                                })
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Excluir"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação desativa o produto (soft delete). Ele deixa de aparecer
              como publicado na loja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CreatorLayout>
  );
}

function PackageEmpty() {
  return (
    <div className="mx-auto h-12 w-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
      <Plus className="h-6 w-6 text-muted-foreground" />
    </div>
  );
}
