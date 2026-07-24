import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, DollarSign, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function AffiliateRegister() {
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "bank_transfer">("pix");
  const [paymentDetails, setPaymentDetails] = useState("");

  const { data: user } = trpc.auth.me.useQuery();
  const { data: affiliateData } = trpc.affiliates.getMyAffiliateData.useQuery();
  const registerMutation = trpc.affiliates.register.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDetails.trim()) {
      toast.error("Preencha os dados de pagamento");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        paymentMethod,
        paymentDetails: paymentDetails.trim(),
      });

      toast.success("Cadastro enviado com sucesso! Aguarde aprovação.");
      navigate("/affiliate");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar");
    }
  };

  // Se não estiver logado
  if (!user) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para se cadastrar como afiliado.
              </p>
              <Button onClick={() => (window.location.href = "/")}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <PublicFooter />
      </>
    );
  }

  // Se já é afiliado
  if (affiliateData) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Você já é um afiliado!</h2>
              <p className="text-muted-foreground mb-6">
                Acesse seu dashboard para gerenciar suas vendas e comissões.
              </p>
              <Button onClick={() => navigate("/affiliate")}>
                Ir para Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
        <div className="container max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Torne-se um Afiliado ContentFy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ganhe comissões promovendo nossos produtos digitais de alta qualidade
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Comissões Atrativas</h3>
                <p className="text-sm text-muted-foreground">
                  Ganhe de 50% a 70% de comissão em cada venda (padrão 60%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Produtos de Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Promova cursos, e-books e apps com alto valor agregado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Suporte Completo</h3>
                <p className="text-sm text-muted-foreground">
                  Dashboard completo com estatísticas e links rastreáveis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Cadastro de Afiliado</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para se cadastrar como afiliado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info (Read-only) */}
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm text-muted-foreground">Nome</Label>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Método de Pagamento *</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "pix" | "bank_transfer")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="font-normal cursor-pointer">
                        PIX
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="font-normal cursor-pointer">
                        Transferência Bancária
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Details */}
                <div className="space-y-2">
                  <Label htmlFor="paymentDetails">
                    {paymentMethod === "pix" ? "Chave PIX *" : "Dados Bancários *"}
                  </Label>
                  <Textarea
                    id="paymentDetails"
                    placeholder={
                      paymentMethod === "pix"
                        ? "Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
                        : "Digite seus dados bancários completos (Banco, Agência, Conta, CPF)"
                    }
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Essas informações serão usadas para enviar suas comissões
                  </p>
                </div>

                {/* Terms */}
                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  <p>
                    Ao se cadastrar, você concorda em promover nossos produtos de forma ética
                    e seguir nossas diretrizes de afiliados. Seu cadastro será analisado e
                    você receberá uma resposta em até 48 horas.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Cadastro"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
