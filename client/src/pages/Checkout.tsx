import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ContentFyLogo } from "@/components/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Lock,
  Shield,
  Zap,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";

const TYPE_LABELS: Record<string, string> = {
  course: "Curso",
  ebook: "E-book",
  audiobook: "Audiobook",
  app: "App",
};

function formatBrl(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function Checkout() {
  const { slug } = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    finalPrice: number;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = trpc.checkout.getProduct.useQuery(
    { slug: slug || "" },
    { enabled: Boolean(slug) }
  );

  const applyCouponMutation = trpc.checkout.applyCoupon.useMutation();
  const calculateInstallmentsMutation = trpc.checkout.calculateInstallments.useQuery(
    {
      amount: appliedCoupon ? appliedCoupon.finalPrice : product?.price || 0,
      maxInstallments: product?.maxInstallments || 12,
    },
    { enabled: !!product }
  );

  const createSessionMutation = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Faça login para continuar a compra");
      const returnPath = `/checkout/${slug}`;
      sessionStorage.setItem("contentfy_post_login_redirect", returnPath);
      window.location.href = getLoginUrl();
    }
  }, [authLoading, user, slug]);

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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Cupom inválido";
      toast.error(message);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    if (!product || !acceptTerms) {
      toast.error("Aceite os termos para continuar");
      return;
    }

    setIsProcessing(true);
    try {
      await createSessionMutation.mutateAsync({
        productId: product.id,
        couponCode: appliedCoupon ? couponCode.trim().toUpperCase() : undefined,
      });
    } catch {
      // onError
    }
  };

  if (productLoading || authLoading) {
    return <CheckoutShell loading />;
  }

  if (!product || productError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b12] px-6 text-center">
        <AlertCircle className="w-14 h-14 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-white mb-2">
          Produto não encontrado
        </h1>
        <p className="text-white/60 mb-8 max-w-md">
          Este link de checkout não está disponível. Confira o slug do produto
          ou explore o catálogo ContentFy.
        </p>
        <Button asChild className="cf-btn-gradient">
          <Link href="/explorar">Explorar produtos</Link>
        </Button>
      </div>
    );
  }

  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : product.price;
  const installments = calculateInstallmentsMutation.data?.installments || [];
  const guaranteeDays = product.guaranteeDays ?? 30;
  const cover = product.thumbnailImage || product.coverImage;

  return (
    <div className="cf-checkout-v2 min-h-screen lg:grid lg:grid-cols-2">
      {/* Painel esquerdo — resumo do produto */}
      <aside
        className="relative flex flex-col bg-[#070b12] text-white px-6 py-8 sm:px-10 lg:px-14 lg:py-12"
        aria-label="Resumo do pedido"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(249,115,22,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 mb-8 lg:mb-10">
          <Link href="/">
            <a
              className="cf-brand-logo-link cf-checkout-brand-link inline-flex items-center shrink-0 py-0 opacity-95 hover:opacity-100 transition-opacity duration-200 motion-safe:transition-opacity"
              aria-label="Voltar à ContentFy"
            >
              <ContentFyLogo
                variant="horizontal"
                theme="dark"
                priority
                wrapClassName="!h-[3.94rem] sm:!h-[4.5rem]"
                className="!h-[3.94rem] !max-h-[3.94rem] sm:!h-[4.5rem] sm:!max-h-[4.5rem] !w-auto"
              />
            </a>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-normal text-white/45">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            SSL
          </span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <p className="text-[11px] uppercase tracking-[0.18em] text-orange-300/75 font-medium mb-4">
            {TYPE_LABELS[product.type] || "Produto digital"}
          </p>
          <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight leading-snug mb-8 lg:mb-10">
            {product.name}
          </h2>

          {cover ? (
            <div className="cf-checkout-product-card mb-10 lg:mb-12">
              <img
                src={cover}
                alt=""
                className="cf-checkout-mockup-img"
                decoding="async"
              />
            </div>
          ) : null}

          <div className="cf-checkout-price-block">
            <p className="cf-checkout-price-label">Pagamento único</p>
            <p className="cf-checkout-price-value" aria-live="polite">
              {formatBrl(finalPrice)}
            </p>
            {selectedInstallments > 1 ? (
              <p className="text-sm font-normal text-white/48 pt-2">
                {selectedInstallments}x de{" "}
                {formatBrl(Math.round(finalPrice / selectedInstallments))}
              </p>
            ) : null}
          </div>

          <ul className="cf-checkout-benefits" aria-label="Benefícios da compra">
            <li>
              <Zap aria-hidden />
              <span>Acesso imediato após confirmação</span>
            </li>
            <li>
              <Shield aria-hidden />
              <span>Garantia ContentFy de {guaranteeDays} dias</span>
            </li>
            <li>
              <CreditCard aria-hidden />
              <span>Cartão, PIX e boleto via Stripe</span>
            </li>
          </ul>
        </div>

        <p className="relative z-10 mt-8 lg:mt-10 pb-6 lg:pb-8 cf-checkout-footer">
          Powered by ContentFy · Pagamentos processados pelo Stripe
        </p>
      </aside>

      {/* Painel direito — pagamento */}
      <main className="flex flex-col bg-background px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center">
          <header className="mb-8 lg:mb-10">
            <p className="cf-checkout-hero-eyebrow">Checkout seguro</p>
            <h1 className="cf-checkout-hero-title">Finalizar compra</h1>
            <p className="cf-checkout-hero-sub">
              Revise seu pedido e conclua sua compra com segurança.
            </p>
          </header>

          <div className="cf-checkout-form-stack">
            <section
              className="cf-checkout-panel-card"
              aria-labelledby="checkout-coupon-label"
            >
              <Label
                id="checkout-coupon-label"
                className="cf-checkout-label mb-3 block"
              >
                Cupom de desconto
              </Label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2
                      className="h-4 w-4 text-emerald-500 shrink-0"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {couponCode.toUpperCase()} aplicado
                      </p>
                      <p className="text-xs font-normal text-muted-foreground">
                        −{formatBrl(appliedCoupon.discountAmount)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
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
                    id="coupon-code"
                    className="cf-checkout-input flex-1"
                    placeholder="Ex.: CONTENTFY10"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCoupon();
                    }}
                    aria-label="Código do cupom de desconto"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="cf-checkout-apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={
                      !couponCode.trim() || applyCouponMutation.isPending
                    }
                  >
                    {applyCouponMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Aplicar"
                    )}
                  </Button>
                </div>
              )}
            </section>

            {product.allowInstallments &&
            !product.isRecurring &&
            installments.length > 1 ? (
              <section
                className="cf-checkout-panel-card"
                aria-labelledby="checkout-installments-label"
              >
                <Label
                  id="checkout-installments-label"
                  htmlFor="installments"
                  className="cf-checkout-label"
                >
                  Parcelamento no cartão
                </Label>
                <select
                  id="installments"
                  value={selectedInstallments}
                  onChange={(e) =>
                    setSelectedInstallments(parseInt(e.target.value, 10))
                  }
                  className="cf-checkout-select"
                  aria-label="Número de parcelas"
                >
                  {installments.map((inst) => (
                    <option key={inst.number} value={inst.number}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </section>
            ) : null}

            <section
              className="cf-checkout-panel-card space-y-4"
              aria-labelledby="checkout-summary-label"
            >
              <h2 id="checkout-summary-label" className="sr-only">
                Resumo e pagamento
              </h2>
              <div className="flex justify-between text-sm font-normal">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBrl(product.price)}</span>
              </div>
              {appliedCoupon ? (
                <div className="flex justify-between text-sm font-normal text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" aria-hidden />
                    Desconto
                  </span>
                  <span>−{formatBrl(appliedCoupon.discountAmount)}</span>
                </div>
              ) : null}
              <Separator className="cf-checkout-summary-sep" />
              <div className="cf-checkout-total-row" role="status">
                <span>Total</span>
                <span>{formatBrl(finalPrice)}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  aria-describedby="terms-description"
                />
                <label
                  id="terms-description"
                  htmlFor="terms"
                  className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer"
                >
                  Concordo com os{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <Button
                size="lg"
                className="cf-checkout-pay-btn cf-btn-gradient"
                onClick={handleCheckout}
                disabled={!acceptTerms || isProcessing}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirecionando ao Stripe…
                  </>
                ) : (
                  `Pagar ${formatBrl(finalPrice)}`
                )}
              </Button>

              <p className="cf-checkout-stripe-note">
                Você será redirecionado ao checkout seguro do Stripe para
                concluir o pagamento.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckoutShell({ loading }: { loading?: boolean }) {
  return (
    <div className="cf-checkout-v2 min-h-screen lg:grid lg:grid-cols-2">
      <aside className="bg-[#070b12] p-10">
        <Skeleton className="h-8 w-36 bg-white/10 mb-12" />
        <Skeleton className="h-10 w-3/4 bg-white/10 mb-4" />
        <Skeleton className="h-48 w-full bg-white/10 rounded-xl" />
      </aside>
      <main className="p-10 flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : null}
      </main>
    </div>
  );
}
