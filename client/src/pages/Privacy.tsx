import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#FFD43B] to-[#FF8C42] bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              <strong>Última atualização:</strong> 02 de janeiro de 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p>
                A ContentFy, operada pela empresa do Grupo O Especialista, inscrita no CNPJ nº 46.709.692/0001-42 
                ("nós", "nosso" ou "ContentFy"), está comprometida em proteger a privacidade e os dados pessoais de 
                seus usuários ("você" ou "usuário").
              </p>
              <p className="mt-4">
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e protegemos 
                suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e demais legislações aplicáveis.
              </p>
              <p className="mt-4">
                Ao usar nossa Plataforma, você concorda com as práticas descritas nesta Política de Privacidade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Definições</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Dados Pessoais:</strong> Informações relacionadas a pessoa natural identificada ou identificável</li>
                <li><strong>Titular:</strong> Pessoa natural a quem se referem os dados pessoais</li>
                <li><strong>Controlador:</strong> ContentFy, responsável pelas decisões sobre o tratamento de dados pessoais</li>
                <li><strong>Tratamento:</strong> Toda operação realizada com dados pessoais (coleta, armazenamento, uso, etc.)</li>
                <li><strong>Consentimento:</strong> Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Dados Pessoais Coletados</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Dados Fornecidos Diretamente por Você</h3>
              <p>Coletamos os seguintes dados quando você se cadastra ou usa nossa Plataforma:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Dados de Identificação:</strong> Nome completo, e-mail, CPF/CNPJ</li>
                <li><strong>Dados de Contato:</strong> Telefone, endereço</li>
                <li><strong>Dados de Acesso:</strong> Nome de usuário, senha (criptografada)</li>
                <li><strong>Dados de Pagamento:</strong> Informações de cartão de crédito (processadas por terceiros seguros)</li>
                <li><strong>Dados de Comunicação:</strong> Mensagens enviadas através de formulários de contato ou suporte</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Dados Coletados Automaticamente</h3>
              <p>Quando você acessa nossa Plataforma, coletamos automaticamente:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência</li>
                <li><strong>Dados de Dispositivo:</strong> Modelo do dispositivo, identificadores únicos, dados de localização aproximada</li>
                <li><strong>Cookies e Tecnologias Similares:</strong> Informações armazenadas em seu dispositivo para melhorar sua experiência</li>
                <li><strong>Dados de Uso:</strong> Produtos visualizados, compras realizadas, progresso em cursos, interações com conteúdo</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Dados de Terceiros</h3>
              <p>Podemos receber dados de:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Processadores de Pagamento:</strong> Confirmações de transações (Stripe)</li>
                <li><strong>Redes Sociais:</strong> Dados de perfil se você optar por login social</li>
                <li><strong>Parceiros de Marketing:</strong> Dados de campanhas publicitárias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Finalidades do Tratamento de Dados</h2>
              <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Execução de Contrato</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Criar e gerenciar sua conta</li>
                <li>Processar compras e pagamentos</li>
                <li>Fornecer acesso aos produtos adquiridos</li>
                <li>Gerenciar assinaturas e renovações</li>
                <li>Emitir notas fiscais e recibos</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Interesses Legítimos</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Melhorar e personalizar sua experiência na Plataforma</li>
                <li>Realizar análises estatísticas e pesquisas de mercado</li>
                <li>Prevenir fraudes e garantir a segurança da Plataforma</li>
                <li>Resolver disputas e fazer cumprir nossos termos</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Consentimento</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Enviar comunicações de marketing e ofertas personalizadas</li>
                <li>Coletar dados de localização precisa</li>
                <li>Usar cookies não essenciais</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Obrigações Legais</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Cumprir obrigações fiscais e contábeis</li>
                <li>Responder a solicitações de autoridades competentes</li>
                <li>Exercer direitos em processos judiciais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Dados</h2>
              <p>Podemos compartilhar seus dados pessoais com:</p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Prestadores de Serviços</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Processamento de Pagamentos:</strong> Stripe (para processar transações)</li>
                <li><strong>Hospedagem:</strong> Provedores de servidores e infraestrutura</li>
                <li><strong>E-mail e Comunicações:</strong> Serviços de envio de e-mails transacionais</li>
                <li><strong>Análise de Dados:</strong> Google Analytics e ferramentas similares</li>
                <li><strong>Armazenamento:</strong> AWS S3 para arquivos e conteúdo</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Parceiros de Negócios</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Criadores de Conteúdo:</strong> Produtores dos infoprodutos vendidos na Plataforma</li>
                <li><strong>Afiliados:</strong> Dados de vendas geradas por links de afiliados</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Autoridades e Terceiros</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Autoridades Governamentais:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Sucessores Empresariais:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>

              <p className="mt-4">
                <strong>Importante:</strong> Todos os terceiros com quem compartilhamos dados são contratualmente 
                obrigados a proteger suas informações e usá-las apenas para as finalidades especificadas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Transferência Internacional de Dados</h2>
              <p>
                Alguns de nossos prestadores de serviços estão localizados fora do Brasil. Quando transferimos dados 
                para outros países, garantimos que:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>O país de destino oferece nível adequado de proteção de dados, ou</li>
                <li>Adotamos cláusulas contratuais padrão aprovadas pela ANPD, ou</li>
                <li>Obtemos seu consentimento explícito para a transferência</li>
              </ul>
              <p className="mt-4">
                Atualmente, utilizamos serviços da Stripe (EUA) e AWS (EUA), ambos certificados e em conformidade 
                com padrões internacionais de proteção de dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Armazenamento e Segurança dos Dados</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Período de Armazenamento</h3>
              <p>Mantemos seus dados pessoais pelo tempo necessário para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cumprir as finalidades para as quais foram coletados</li>
                <li>Cumprir obrigações legais (ex: dados fiscais por 5 anos)</li>
                <li>Resolver disputas e fazer cumprir acordos</li>
              </ul>
              <p className="mt-4">
                Após o término desses períodos, seus dados serão excluídos ou anonimizados de forma irreversível.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Medidas de Segurança</h3>
              <p>Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Criptografia de dados em trânsito (SSL/TLS) e em repouso</li>
                <li>Controles de acesso rigorosos e autenticação multifator</li>
                <li>Monitoramento contínuo de segurança e detecção de ameaças</li>
                <li>Backups regulares e planos de recuperação de desastres</li>
                <li>Treinamento de funcionários em segurança da informação</li>
                <li>Auditorias de segurança periódicas</li>
              </ul>
              <p className="mt-4">
                Apesar de nossos esforços, nenhum sistema é 100% seguro. Você também deve proteger suas credenciais 
                de acesso e nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies e Tecnologias Similares</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 O Que São Cookies</h3>
              <p>
                Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nossa Plataforma. 
                Eles nos ajudam a melhorar sua experiência, lembrar suas preferências e analisar o uso da Plataforma.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Tipos de Cookies Utilizados</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico da Plataforma (login, carrinho de compras)</li>
                <li><strong>Cookies de Desempenho:</strong> Coletam informações sobre como você usa a Plataforma (Google Analytics)</li>
                <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências (idioma, tema)</li>
                <li><strong>Cookies de Marketing:</strong> Rastreiam sua navegação para exibir anúncios relevantes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Gerenciamento de Cookies</h3>
              <p>
                Você pode gerenciar ou desativar cookies através das configurações do seu navegador. Note que desativar 
                cookies essenciais pode afetar o funcionamento da Plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Seus Direitos como Titular de Dados</h2>
              <p>
                De acordo com a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
              </p>
              
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Confirmação e Acesso:</strong> Confirmar se tratamos seus dados e acessar seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado e legível por máquina</li>
                <li><strong>Eliminação:</strong> Solicitar a exclusão de dados tratados com base em consentimento</li>
                <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
                <li><strong>Informação sobre Não Consentimento:</strong> Ser informado sobre as consequências de não fornecer consentimento</li>
                <li><strong>Revogação de Consentimento:</strong> Revogar seu consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas situações</li>
                <li><strong>Revisão de Decisões Automatizadas:</strong> Solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">9.1 Como Exercer Seus Direitos</h3>
              <p>
                Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail: 
                <a href="mailto:privacidade@contentfy.com.br" className="text-primary hover:underline ml-1">
                  privacidade@contentfy.com.br
                </a>
              </p>
              <p className="mt-4">
                Responderemos sua solicitação em até 15 dias. Em alguns casos, podemos solicitar informações adicionais 
                para verificar sua identidade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Dados de Menores de Idade</h2>
              <p>
                Nossa Plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente dados pessoais 
                de crianças ou adolescentes sem o consentimento dos pais ou responsáveis legais.
              </p>
              <p className="mt-4">
                Se você é pai, mãe ou responsável legal e acredita que seu filho forneceu dados pessoais sem seu 
                consentimento, entre em contato conosco para que possamos tomar as medidas apropriadas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Alterações nesta Política de Privacidade</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas 
                ou na legislação aplicável. Quando fizermos alterações significativas, notificaremos você por e-mail 
                ou através de aviso destacado na Plataforma.
              </p>
              <p className="mt-4">
                A data da última atualização será sempre indicada no topo desta página. Recomendamos que você revise 
                esta Política regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Encarregado de Proteção de Dados (DPO)</h2>
              <p>
                Designamos um Encarregado de Proteção de Dados (Data Protection Officer - DPO) para atuar como canal 
                de comunicação entre você, a ContentFy e a Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
              <div className="bg-muted p-6 rounded-lg mt-4">
                <p><strong>Contato do DPO:</strong></p>
                <p className="mt-2">
                  E-mail: <a href="mailto:dpo@contentfy.com.br" className="text-primary hover:underline">dpo@contentfy.com.br</a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Legislação e Foro</h2>
              <p>
                Esta Política de Privacidade é regida pelas leis da República Federativa do Brasil, especialmente pela 
                Lei Geral de Proteção de Dados (Lei nº 13.709/2018), pelo Marco Civil da Internet (Lei nº 12.965/2014) 
                e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
              </p>
              <p className="mt-4">
                Qualquer disputa relacionada a esta Política será submetida ao foro da comarca de sua residência.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Contato</h2>
              <p>
                Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao 
                tratamento de seus dados pessoais, entre em contato conosco:
              </p>
              <div className="bg-muted p-6 rounded-lg mt-4">
                <p><strong>ContentFy</strong></p>
                <p>Grupo O Especialista</p>
                <p>CNPJ: 46.709.692/0001-42</p>
                <p className="mt-2">
                  E-mail Geral: <a href="mailto:contato@contentfy.com.br" className="text-primary hover:underline">contato@contentfy.com.br</a>
                </p>
                <p>
                  E-mail Privacidade: <a href="mailto:privacidade@contentfy.com.br" className="text-primary hover:underline">privacidade@contentfy.com.br</a>
                </p>
                <p>
                  E-mail DPO: <a href="mailto:dpo@contentfy.com.br" className="text-primary hover:underline">dpo@contentfy.com.br</a>
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-muted rounded-lg border-l-4 border-primary">
              <p className="text-sm">
                <strong>Compromisso com a Privacidade:</strong> A ContentFy está comprometida em proteger sua privacidade 
                e tratar seus dados pessoais com transparência, segurança e em conformidade com a legislação brasileira. 
                Seus dados são valiosos para nós e trabalhamos continuamente para garantir sua proteção.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
