import AdminLayout from "@/components/AdminLayout";
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
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Package, Eye, Copy } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado com sucesso");
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar produto");
    },
  });

  const duplicateMutation = trpc.products.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Produto duplicado com sucesso!");
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao duplicar produto");
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (error) {
      // Error handled in onError
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync({ id });
    } catch (error) {
      // Error handled in onError
    }
  };

  const getProductTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      ebook: { label: "E-book", variant: "default" },
      audiobook: { label: "Audiobook", variant: "secondary" },
      course: { label: "Curso", variant: "outline" },
      app: { label: "App", variant: "default" },
    };

    const config = variants[type] || { label: type, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seus e-books, audiobooks, cursos e apps
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getProductTypeBadge(product.type)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              R$ {(product.price / 100).toFixed(2)}
                            </p>
                            {product.isRecurring && (
                              <p className="text-xs text-muted-foreground">
                                /{product.recurringInterval === "month" ? "mês" : "ano"}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                          >
                            {product.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" title="Visualizar">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </a>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon" title="Editar">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Duplicar"
                              onClick={() => handleDuplicate(product.id)}
                              disabled={duplicateMutation.isPending}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Deletar"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja deletar o produto "
                                    {product.name}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Deletar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum produto cadastrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comece criando seu primeiro produto para vender na plataforma
                </p>
                <Link href="/admin/products/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Produto
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
