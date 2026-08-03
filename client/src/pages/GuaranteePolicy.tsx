import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { ProtectionBadge } from "@/components/commerce";
import { PROTECT_BRAND, PROTECT_DEFAULT_DAYS } from "@shared/contentfy";
import { Link } from "wouter";

const EFFECTIVE_DATE = "2026-08-03";
const VERSION = "1.0";

export default function GuaranteePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-[#070B12]">
          <div className="container max-w-3xl py-14 space-y-4">
            <ProtectionBadge showLink={false} />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Política de Garantia ContentFy
            </h1>
            <p className="text-muted-foreground">
              {PROTECT_BRAND.purchaseProtected}. Versão {VERSION} · Vigência a
              partir de {new Date(EFFECTIVE_DATE).toLocaleDateString("pt-BR")}.
            </p>
          </div>
        </section>

        <article className="container max-w-3xl py-10 prose prose-invert prose-p:text-muted-foreground space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Prazo</h2>
            <p>
              O ContentFy Protect oferece, por padrão, garantia de{" "}
              {PROTECT_DEFAULT_DAYS} dias corridos a partir da data da compra
              confirmada, salvo indicação diferente na página do produto.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              2. Elegibilidade
            </h2>
            <p>
              A garantia vale para compras confirmadas de produtos elegíveis,
              dentro do prazo, sem reembolso anterior e sem solicitação ativa.
              Pedidos pendentes, falhos ou já reembolsados não entram na
              cobertura.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              3. Como solicitar
            </h2>
            <p>
              Acesse <strong>Minha Conta → Minhas compras → ContentFy Protect</strong>,
              escolha o pedido e envie a solicitação com um motivo. Não exigimos
              justificativas humilhantes nem excessivas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              4. Etapas da análise
            </h2>
            <p>
              Após o envio, a solicitação passa por análise da equipe ContentFy
              (prazo estimado: até 5 dias úteis). Possíveis status: solicitada,
              em análise, aprovada, recusada, processando, reembolsada ou falha.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Estorno</h2>
            <p>
              {PROTECT_BRAND.paymentCopy} Quando o reembolso é aprovado e
              processado, o valor retorna pela mesma via da compra. Prazos
              bancários ou da operadora do cartão podem variar (geralmente alguns
              dias úteis).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              6. Acesso ao conteúdo
            </h2>
            <p>
              O acesso ao produto permanece ativo durante a análise. Somente após
              a conclusão efetiva do reembolso o acesso é encerrado. O histórico
              da compra é preservado para auditoria.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              7. Exceções legítimas
            </h2>
            <p>
              Podemos recusar solicitações fora do prazo, duplicadas, de produtos
              não elegíveis, ou em casos de uso abusivo / indícios de fraude. A
              ContentFy não é instituição financeira; atua como plataforma
              digital com proteção ao comprador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Contato</h2>
            <p>
              Dúvidas sobre esta política: use a página{" "}
              <Link href="/contact">
                <a className="text-emerald-300 hover:underline">Contato</a>
              </Link>{" "}
              ou o canal de suporte da sua conta.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4">
            {PROTECT_BRAND.microcopy}
          </p>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
