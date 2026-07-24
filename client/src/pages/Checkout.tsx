import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PublicHeader from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, AlertCircle, Tag } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export default function Checkout() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const product = products?.find((p) => p.slug === slug);

  const applyCouponMutation = trpc.checkout.applyCoupon.useMutation();
  const calculateInstallmentsMutation = trpc.checkout.calculateInstallments.useQuery(
    {
      amount: appliedCoupon ? appliedCoupon.finalPrice : product?.price || 0,
      maxInstallments: product?.maxInstallments || 12,
    },
    {
      enabled: !!product,
    }
  );

  const createSessionMutation = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      // Redirecionar para Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(false);
    },
  });

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Você precisa fazer login para comprar");
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !product) return;

    try {
      const result = await applyCouponMutation.mutateAsync({
        couponCode: couponCode.trim().toUpperCase(),
        productId: product.id,
        originalPrice: product.price,
      });

      setAppliedCoupon(result);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Cupom inválido");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    if (!product || !acceptTerms) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    setIsProcessing(true);

    try {
      await createSessionMutation.mutateAsync({
        productId: product.id,
        couponCode: appliedCoupon ? couponCode.trim().toUpperCase() : undefined,
      });
    } catch (error) {
      // Erro já tratado no onError
    }
  };

  if (authLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 py-12">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O produto que você está tentando comprar não existe.
            </p>
            <Button onClick={() => setLocation("/products")}>
              Ver Produtos
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : product.price;
  const installments = calculateInstallmentsMutation.data?.installments || [];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <PublicHeader />

      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-muted-foreground">
              Complete os dados para finalizar sua compra
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Produto */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FFD43B] to-[#FF8C42] rounded-lg flex-shrink-0 overflow-hidden">
                      {product.thumbnailImage ? (
                        <img
                          src={product.thumbnailImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-2" variant="secondary">
                        {product.type === "course" && "Curso"}
                        {product.type === "ebook" && "E-book"}
                        {product.type === "audiobook" && "Audiobook"}
                        {product.type === "app" && "App"}
                      </Badge>
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Preços */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {(product.price / 100).toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          Desconto ({couponCode})
                        </span>
                        <span>
                          -R$ {(appliedCoupon.discountAmount / 100).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R$ {(finalPrice / 100).toFixed(2)}</span>
                    </div>

                    {selectedInstallments > 1 && (
                      <p className="text-sm text-muted-foreground text-center">
                        {selectedInstallments}x de R${" "}
                        {((finalPrice / 100) / selectedInstallments).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Benefícios */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acesso imediato</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Garantia de 7 dias</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pagamento seguro</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Pagamento */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Cupom de Desconto</CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Cupom aplicado!
                          </p>
                          <p className="text-sm text-green-700">
                            {couponCode.toUpperCase()} -{" "}
                            {appliedCoupon.discountType === "percentage"
                              ? `${appliedCoupon.discountValue}%`
                              : `R$ ${(appliedCoupon.discountValue / 100).toFixed(2)}`}{" "}
                            de desconto
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleApplyCoupon();
                          }
                        }}
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || applyCouponMutation.isPending}
                      >
                        {applyCouponMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {product.allowInstallments && !product.isRecurring && installments.length > 1 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Parcelamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="installments" className="mb-2 block">
                      Número de parcelas
                    </Label>
                    <select
                      id="installments"
                      value={selectedInstallments}
                      onChange={(e) => setSelectedInstallments(parseInt(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {installments.length > 0 ? (
                        installments.map((inst) => (
                          <option key={inst.number} value={inst.number}>
                            {inst.label}
                          </option>
                        ))
                      ) : (
                        <option value="1">À vista</option>
                      )}
                    </select>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Você será redirecionado para o checkout seguro do Stripe para
                      finalizar o pagamento.
                    </p>

                    {/* Termos */}
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm cursor-pointer leading-relaxed"
                      >
                        Eu li e concordo com os{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Termos de Uso
                        </a>{" "}
                        e{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          Política de Privacidade
                        </a>
                      </label>
                    </div>

                    {/* Botão de Finalizar */}
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={!acceptTerms || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        `Finalizar Compra - R$ ${(finalPrice / 100).toFixed(2)}`
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Pagamento processado de forma segura pelo Stripe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
