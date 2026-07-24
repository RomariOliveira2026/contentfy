import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#FFD43B] to-[#FF8C42] bg-clip-text text-transparent">
            Termos de Uso
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              <strong>Última atualização:</strong> 02 de janeiro de 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma ContentFy ("Plataforma"), operada pela empresa do Grupo O Especialista, 
                inscrita no CNPJ nº 46.709.692/0001-42, você concorda em cumprir e estar vinculado aos seguintes 
                Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossa Plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p>
                A ContentFy é uma plataforma digital que oferece acesso a infoprodutos, incluindo mas não se limitando a:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cursos online</li>
                <li>E-books digitais</li>
                <li>Audiobooks</li>
                <li>Aplicativos e ferramentas digitais</li>
              </ul>
              <p>
                Os produtos são disponibilizados mediante pagamento único ou assinatura recorrente, conforme especificado 
                em cada produto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta de Usuário</h2>
              <p>
                Para acessar determinados recursos da Plataforma, você precisará criar uma conta. Você concorda em:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornecer informações verdadeiras, precisas e completas durante o cadastro</li>
                <li>Manter suas informações de conta atualizadas</li>
                <li>Manter a confidencialidade de sua senha</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Compra e Pagamento</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Preços</h3>
              <p>
                Todos os preços são exibidos em Reais (BRL) e incluem os impostos aplicáveis. Reservamo-nos o direito 
                de alterar os preços a qualquer momento, mas as alterações não afetarão pedidos já confirmados.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Formas de Pagamento</h3>
              <p>
                Aceitamos pagamentos via cartão de crédito, débito e outros métodos disponibilizados na Plataforma. 
                O processamento de pagamentos é realizado por parceiros terceirizados seguros (Stripe).
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Parcelamento</h3>
              <p>
                Alguns produtos podem ser parcelados conforme indicado na página do produto. As condições de parcelamento 
                são definidas pela operadora do cartão de crédito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Política de Reembolso e Garantia</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Garantia de 30 Dias</h3>
              <p>
                Oferecemos garantia incondicional de 30 dias para todos os produtos digitais. Se você não estiver 
                satisfeito com sua compra, pode solicitar o reembolso total dentro deste prazo.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Como Solicitar Reembolso</h3>
              <p>
                Para solicitar reembolso, entre em contato através do e-mail de suporte ou pela página de contato. 
                O reembolso será processado no mesmo método de pagamento utilizado na compra, em até 10 dias úteis.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Exceções</h3>
              <p>
                Não oferecemos reembolso após o período de garantia de 30 dias, exceto em casos de defeito comprovado 
                no produto digital que não possa ser corrigido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Licença de Uso e Propriedade Intelectual</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Licença Concedida</h3>
              <p>
                Ao adquirir um produto, você recebe uma licença pessoal, não exclusiva, intransferível e revogável 
                para acessar e usar o conteúdo exclusivamente para fins pessoais e não comerciais.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Restrições de Uso</h3>
              <p>Você não pode:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Copiar, reproduzir ou distribuir o conteúdo sem autorização expressa</li>
                <li>Modificar, adaptar ou criar obras derivadas</li>
                <li>Fazer engenharia reversa ou descompilar aplicativos</li>
                <li>Remover avisos de direitos autorais ou marcas registradas</li>
                <li>Revender, sublicenciar ou transferir sua licença a terceiros</li>
                <li>Usar o conteúdo para fins comerciais sem autorização</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Direitos Autorais</h3>
              <p>
                Todo o conteúdo disponibilizado na Plataforma é protegido por direitos autorais e outras leis de 
                propriedade intelectual. Os direitos pertencem à ContentFy ou aos criadores de conteúdo parceiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Assinaturas e Renovação Automática</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Planos de Assinatura</h3>
              <p>
                Alguns produtos são oferecidos mediante assinatura mensal ou anual. As assinaturas são renovadas 
                automaticamente no final de cada período, a menos que você cancele antes da data de renovação.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Cancelamento</h3>
              <p>
                Você pode cancelar sua assinatura a qualquer momento através da área de membros. O cancelamento 
                terá efeito no final do período de cobrança atual. Não oferecemos reembolso proporcional para 
                cancelamentos no meio do ciclo.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Alteração de Preços</h3>
              <p>
                Podemos alterar os preços das assinaturas mediante aviso prévio de 30 dias. Você terá a opção de 
                aceitar o novo preço ou cancelar sua assinatura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Sistema de Afiliados</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Programa de Afiliados</h3>
              <p>
                A ContentFy oferece um programa de afiliados que permite aos usuários ganhar comissões promovendo 
                produtos da Plataforma. As comissões variam por produto e são especificadas no painel do afiliado.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Regras de Conduta</h3>
              <p>Afiliados não podem:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fazer propaganda enganosa ou falsa sobre os produtos</li>
                <li>Usar spam ou práticas de marketing não éticas</li>
                <li>Registrar domínios ou marcas relacionadas à ContentFy</li>
                <li>Fazer bid em termos de marca da ContentFy em anúncios pagos</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Pagamento de Comissões</h3>
              <p>
                As comissões são pagas mensalmente mediante solicitação, desde que o saldo mínimo seja atingido. 
                Reservamo-nos o direito de reter pagamentos em caso de suspeita de fraude ou violação dos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Conduta do Usuário</h2>
              <p>Ao usar a Plataforma, você concorda em não:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Infringir direitos de propriedade intelectual de terceiros</li>
                <li>Transmitir vírus, malware ou código malicioso</li>
                <li>Tentar obter acesso não autorizado a sistemas ou contas</li>
                <li>Interferir no funcionamento da Plataforma</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
                <li>Usar a Plataforma para fins ilegais ou não autorizados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Suspensão e Encerramento de Conta</h2>
              <p>
                Reservamo-nos o direito de suspender ou encerrar sua conta, a nosso exclusivo critério, sem aviso 
                prévio, se você violar estes Termos de Uso ou se envolvermos em atividades fraudulentas ou ilegais.
              </p>
              <p className="mt-4">
                Você pode encerrar sua conta a qualquer momento através das configurações da conta ou entrando em 
                contato conosco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Isenção de Garantias</h2>
              <p>
                A Plataforma e todo o conteúdo são fornecidos "como estão" e "conforme disponíveis", sem garantias 
                de qualquer tipo, expressas ou implícitas, incluindo mas não se limitando a garantias de comercialização, 
                adequação a um propósito específico ou não violação.
              </p>
              <p className="mt-4">
                Não garantimos que a Plataforma estará sempre disponível, livre de erros ou vírus, ou que atenderá 
                às suas expectativas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Limitação de Responsabilidade</h2>
              <p>
                Em nenhuma circunstância a ContentFy, seus diretores, funcionários ou parceiros serão responsáveis 
                por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo 
                mas não se limitando a perda de lucros, dados, uso ou outros prejuízos intangíveis, resultantes de:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Uso ou incapacidade de usar a Plataforma</li>
                <li>Acesso não autorizado ou alteração de suas transmissões ou dados</li>
                <li>Declarações ou conduta de terceiros na Plataforma</li>
                <li>Qualquer outro assunto relacionado à Plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Indenização</h2>
              <p>
                Você concorda em indenizar, defender e isentar a ContentFy, suas afiliadas, diretores, funcionários e 
                agentes de qualquer reivindicação, dano, obrigação, perda, responsabilidade, custo ou dívida, e despesas 
                (incluindo honorários advocatícios) decorrentes de:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Seu uso da Plataforma</li>
                <li>Violação destes Termos de Uso</li>
                <li>Violação de direitos de terceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação na Plataforma. Seu uso continuado da Plataforma após as 
                alterações constitui aceitação dos novos termos.
              </p>
              <p className="mt-4">
                Recomendamos que você revise periodicamente estes Termos de Uso para se manter informado sobre 
                quaisquer alterações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Lei Aplicável e Jurisdição</h2>
              <p>
                Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do 
                Brasil. Qualquer disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais 
                brasileiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Disposições Gerais</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">16.1 Acordo Integral</h3>
              <p>
                Estes Termos de Uso constituem o acordo integral entre você e a ContentFy em relação ao uso da Plataforma.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">16.2 Divisibilidade</h3>
              <p>
                Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais disposições 
                permanecerão em pleno vigor e efeito.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">16.3 Renúncia</h3>
              <p>
                A falha da ContentFy em exercer ou fazer cumprir qualquer direito ou disposição destes Termos de Uso 
                não constituirá renúncia a tal direito ou disposição.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">17. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="bg-muted p-6 rounded-lg mt-4">
                <p><strong>ContentFy</strong></p>
                <p>Grupo O Especialista</p>
                <p>CNPJ: 46.709.692/0001-42</p>
                <p className="mt-2">
                  E-mail: <a href="mailto:contato@contentfy.com.br" className="text-primary hover:underline">contato@contentfy.com.br</a>
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-muted rounded-lg border-l-4 border-primary">
              <p className="text-sm">
                Ao usar a plataforma ContentFy, você reconhece que leu, compreendeu e concorda em estar vinculado 
                a estes Termos de Uso e à nossa Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
