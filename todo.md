# Contentfy Platform TODO

## Infraestrutura e Configuração
- [x] Adicionar recursos web-db-user (backend, database, auth)
- [x] Integrar Stripe para pagamentos
- [ ] Configurar design system com paleta Contentfy (amarelo #FFD43B, laranja #FF8C42)
- [x] Configurar banco de dados e schemas

## Autenticação e Usuários
- [ ] Sistema de registro e login
- [ ] Perfis de usuário (Admin, Cliente)
- [ ] Recuperação de senha
- [ ] Gestão de sessões

## Painel Administrativo
- [ ] Dashboard com métricas e analytics
- [ ] Gestão de produtos (criar, editar, excluir)
- [ ] Gestão de vendas e pedidos
- [ ] Gestão de clientes
- [ ] Gestão de cursos e módulos
- [ ] Upload de arquivos (e-books, vídeos, áudios)
- [ ] Configurações da plataforma

## Sistema de Produtos
- [x] CRUD de produtos (e-books, audiobooks, cursos, apps)
- [x] Categorias e tags
- [x] Preços e descontos
- [ ] Landing pages de produtos
- [ ] Descrições e imagens

## Sistema de Pagamentos
- [x] Integração completa com Stripe
- [x] Checkout seguro
- [x] Processamento de pagamentos
- [x] Webhooks do Stripe
- [x] Histórico de transações
- [ ] Emissão de recibos

## Área de Membros
- [ ] Dashboard do cliente
- [ ] Biblioteca de produtos adquiridos
- [ ] Acesso a cursos comprados
- [ ] Download de e-books
- [ ] Player de audiobooks
- [ ] Progresso de cursos
- [ ] Certificados de conclusão

## Sistema de Cursos Online
- [ ] Estrutura de cursos, módulos e aulas
- [ ] Player de vídeo integrado
- [ ] Materiais complementares
- [ ] Controle de progresso
- [ ] Marcação de aulas concluídas
- [ ] Comentários e dúvidas
- [ ] Quiz e avaliações

## Biblioteca Digital
- [ ] Visualizador de e-books (PDF)
- [ ] Player de audiobooks
- [ ] Download de materiais
- [ ] Marcadores e anotações
- [ ] Organização por categorias

## Sistema de Afiliados (Futuro)
- [ ] Cadastro de afiliados
- [ ] Links de afiliados
- [ ] Comissões e pagamentos
- [ ] Dashboard de afiliados

## Páginas Públicas
- [ ] Homepage da plataforma
- [ ] Página de catálogo de produtos
- [ ] Páginas de vendas individuais
- [ ] Página sobre
- [ ] Página de contato
- [ ] FAQ

## Notificações e E-mails
- [ ] E-mails transacionais (compra, acesso)
- [ ] Notificações em tempo real
- [ ] E-mails de boas-vindas
- [ ] Recuperação de senha por e-mail

## Finalização
- [ ] Testes completos de fluxo
- [ ] Responsividade mobile
- [ ] Otimização de performance
- [ ] Documentação
- [ ] Checkpoint final

## Painel Administrativo - Em Desenvolvimento
- [x] Layout com sidebar de navegação
- [x] Dashboard com métricas (vendas, produtos, clientes)
- [x] Página de listagem de produtos
- [x] Página de criação de produtos
- [x] Página de edição de produtos
- [x] Formulários de produtos com validação
- [x] Tabelas com paginação e filtros

## Páginas Públicas - Em Desenvolvimento
- [x] Homepage da Contentfy
- [ ] Catálogo de produtos
- [ ] Página de detalhes do produto
- [ ] Fluxo de checkout
- [x] Header e Footer públicos

## SEMANA 1 - DIA 1-2: Sistema de Checkout Completo
### Backend - APIs
- [x] API de aplicar cupom no checkout
- [x] API de calcular parcelamento
- [x] API de verificar acesso do usuário ao produto

### Frontend - Páginas
- [x] Página de catálogo de produtos (/products)
- [x] Página de detalhes do produto (/products/[slug])
- [x] Página de checkout (/checkout/[slug])
- [x] Página de sucesso (/checkout/success)
- [x] Página de erro (/checkout/error)

### Integrações
- [x] Stripe Elements no checkout
- [x] Tratamento de erros do Stripe
- [ ] Testes com cartões de teste

## SEMANA 1 - DIA 3-4: Área de Membros
### Backend - APIs
- [x] API para listar produtos do usuário
- [x] API para obter estrutura de curso (módulos + aulas)
- [x] API para marcar aula como concluída
- [x] API para salvar progresso

### Frontend - Páginas
- [x] Layout da área de membros (/my-account)
- [x] Dashboard do aluno
- [x] Biblioteca de produtos adquiridos
- [x] Filtros por tipo de produto
- [x] Cards de produtos com progresso

## SEMANA 1 - DIA 5-6: Sistema de Cursos Online
### Frontend - Páginas
- [x] Página de visualização de curso (/my-account/course/:id)
- [x] Player de vídeo integrado
- [x] Sidebar com módulos e aulas
- [x] Navegação entre aulas
- [x] Marcação de aula como concluída
- [x] Barra de progresso do curso
- [x] Seção de comentários (placeholder)

## SEMANA 1 - DIA 7: Biblioteca Digital
### Frontend - Páginas
- [x] Página de visualização de produto digital (/my-account/product/:id)
- [x] Visualizador de PDF para e-books
- [x] Player de áudio para audiobooks
- [x] Botão de download de materiais
- [x] Informações do produto

## SEMANA 2 - DIA 10-11: Sistema de Afiliados
### Backend - APIs
- [x] API de cadastro como afiliado
- [x] API de geração de link de afiliado
- [x] API de tracking de cliques e vendas
- [x] API de cálculo de comissões
- [x] API de estatísticas do afiliado
- [x] API de solicitação de saque

### Frontend - Dashboard Afiliado
- [ ] Página de cadastro de afiliado
- [x] Dashboard do afiliado
- [x] Gerador de links
- [x] Estatísticas de vendas
- [x] Histórico de comissões
- [ ] Solicitação de saqu### Frontend - Painel Admin
- [x] Listagem de afiliados
- [x] Aprovar/rejeitar afiliados
- [ ] Ajustar taxas de comissão[ ] Processar saques

## Sistema de Certificados
### Backend
- [x] API para gerar certificado quando curso é 100% concluído
- [x] API para validar certificado por código
- [ ] Geração de PDF do certificado (usando HTML template)

### Frontend
- [x] Página de visualização de certificados do aluno
- [x] Botão de download (placeholder)
- [ ] Validador público de certificados (opcional)

## Multimoedas e Multi-idiomas
### Backend
- [ ] Adicionar campo de moeda preferida no usuário (futuro)
- [ ] API para detectar localização do usuário (futuro)
- [ ] Conversão de preços baseada em moeda (Stripe já suporta)
- [x] Suporte a múltiplas moedas no Stripe (nativo)

### Frontend - Internacionalização
- [x] Instalar e configurar react-i18next
- [x] Criar arquivos de tradução (pt, en, es)
- [x] Seletor de idioma no header
- [ ] Traduzir todas as páginas principais (estrutura pronta)
- [ ] Formatação de moeda por região
- [x] Detecção automática de idioma do navegador

### Traduções Necessárias
- [ ] Homepage e páginas públicas
- [ ] Checkout e páginas de compra
- [ ] Área de membros
- [ ] Dashboard administrativo
- [ ] Mensagens de erro e sucesso

## Branding e Identidade Visual
- [x] Adicionar ícone da coruja (logo) na plataforma
- [ ] Atualizar favicon no painel da Manus

## Página Sobre Nós
- [x] Criar página Sobre com história da Contentfy
- [x] Adicionar seções: missão, visão, valores
- [x] Incluir estatísticas e diferenciais
- [x] Adicionar call-to-action

## Correções e Melhorias
- [x] Traduzir página Sobre para português (PT-BR)

## Páginas Institucionais
- [x] Criar página Recursos (funcionalidades da plataforma)
- [x] Criar página Exemplos (casos de uso e produtos)
- [x] Criar página Processo (como funciona)
- [x] Criar página FAQ (perguntas frequentes)
- [x] Atualizar navegação no Header e Footer

## Branding - Título e Favicon
- [x] Atualizar título da página para "Contentfy" (via painel Manus)
- [x] Configurar favicon com ícone da coruja (logo já configurado)

## Prova Social
- [x] Adicionar seção de depoimentos na página inicial

## Bugs Corrigidos
- [x] Ajustar tamanho do ícone da coruja no header (h-10 w-10 object-contain)

## Melhorias Finais
- [x] Atualizar título da página para "Contentfy"
- [x] Criar página de Contato com formulário
- [x] Preparar para publicação

## Funcionalidades Avançadas
- [x] Adicionar seção de estatísticas animadas na homepage
- [x] Criar blog completo para SEO
- [x] Integrar Google Analytics

## Tema Claro/Escuro
- [x] Habilitar tema switchável no App.tsx
- [x] Adicionar botão de troca de tema no Header

## Animações de Scroll
- [x] Adicionar scroll suave global
- [x] Criar botão "Voltar ao Topo" flutuante

## Logo Atualizada
- [x] Gerar logo ContentFy com tipografia moderna
- [x] Atualizar logo na plataforma

## Correção Logo
- [x] Gerar logo ContentFy corrigida (com "t" em Content)

## Sistema de Avaliações
- [x] Criar schema de reviews no banco de dados
- [x] Criar componente de exibição de avaliações
- [x] Adicionar formulário de nova avaliação
- [x] Integrar avaliações na página de produto
- [x] Exibir média de avaliações nos cards de produtos

## Logo Oficial
- [x] Substituir logo atual pela logo oficial (coruja + ContentFy)

## Ajustes do Header
- [x] Posicionar logo da coruja no topo
- [x] Remover slogan "Desenvolvimento de Apps Robustos"
- [x] Botão de alternância claro/escuro já visível

## CORREÇÕES URGENTES - Header
- [x] Logo ContentFy aumentada para h-16 (bem maior e visível)
- [x] Botão claro/escuro com variant="outline" para ficar visível
- [ ] Título "Manus - Desenvolvimento de Apps Robustos" (mudar VITE_APP_TITLE no painel)

## CORREÇÕES FINAIS URGENTES
- [x] Header reescrito do zero
- [x] Logo ContentFy h-20 (MUITO GRANDE)
- [x] Removido TODO texto do logo (só imagem)
- [x] Botão Claro/Escuro variant=outline size=default (GRANDE e VISÍVEL)
- [x] Botão tema também no mobile

## Ajustes Finais Header
- [x] Logo aumentada para h-24 (bem maior e visível)
- [x] Mudado "nav.blog" para "Blog" no menu
- [x] Logo já está sem texto (só imagem)

## Carrossel de Depoimentos
- [x] Criar componente TestimonialsCarousel
- [x] Atualizar Home.tsx com carrossel

## CORREÇÕES URGENTES - Homepage
- [x] Remover palavra "Contentfy" em laranja do hero section
- [x] Aumentar logo no header (h-24 ou maior)
- [x] Adicionar botão Claro/Escuro visível no header
- [x] Verificar se carrossel de depoimentos está funcionando
- [x] Testar todas as correções no preview

## Design System Inspirado na Coruja ContentFy
- [x] Extrair e definir paleta de cores oficial da coruja
- [x] Atualizar variáveis CSS globais (index.css) com nova paleta
- [x] Redesenhar hero section com gradientes e efeitos
- [x] Atualizar estilo dos botões (gradiente laranja → amarelo)
- [x] Aplicar novo estilo nos cards de produtos
- [x] Redesenhar carrossel de depoimentos com tema escuro
- [x] Adicionar glow effects e hover animations
- [x] Atualizar seção de estatísticas com gradientes
- [x] Aplicar tema escuro premium em toda a plataforma
- [x] Testar responsividade e acessibilidade

## Melhorias de UX e Design - Fase 2
- [x] Instalar e configurar biblioteca de animações (Framer Motion ou similar)
- [x] Adicionar animações de scroll (fade in, slide up) na homepage
- [x] Criar página de Preços (/pricing)
- [x] Desenhar cards de planos (Básico, Pro, Premium)
- [x] Destacar plano mais popular com badge e animação
- [x] Otimizar tema claro com paleta da coruja
- [x] Ajustar contraste e acessibilidade no modo claro
- [x] Adicionar link para Preços no header
- [x] Testar animações e responsividade

## Sistema de Categorias Pré-definidas
- [x] Criar constante com 12 categorias no shared/const.ts
- [x] Popular 12 categorias no banco de dados
- [x] Criar query TRPC para listar categorias
- [x] Atualizar formulário de produtos com dropdown de categorias
- [x] Adicionar filtro de categorias na página de produtos
- [x] Testar cadastro de produto com nova categoria
- [x] Testar filtros de categoria na listagem

## Sistema Híbrido de Assinaturas (Compra Única + Recorrente)
- [ ] Analisar schema atual de produtos e orders
- [ ] Criar tabela subscription_plans (Básico, Pro, Premium)
- [ ] Criar tabela user_subscriptions (assinaturas ativas)
- [ ] Migrar schema do banco de dados
- [ ] Criar rotas TRPC para gerenciar planos de assinatura
- [ ] Integrar Stripe Subscriptions API
- [ ] Criar página de checkout híbrido (/checkout/:productId)
- [ ] Adicionar botões "Comprar Agora" e "Assinar Acesso Total" nos produtos
- [ ] Criar painel de gerenciamento de assinatura (/dashboard/subscription)
- [ ] Implementar cancelamento de assinatura
- [ ] Testar fluxo de compra única
- [ ] Testar fluxo de assinatura mensal
- [ ] Testar webhooks do Stripe para renovação

## Correção Urgente - Formulário de Produtos
- [x] Corrigir erro "Select.Item must have a value" no dropdown de categoria
- [x] Remover SelectItem com valor vazio do dropdown
- [x] Testar criação de novo produto

## Correção Urgente - Página de Produtos Pública
- [x] Corrigir erro "Select.Item must have a value" no filtro de categoria em /products
- [x] Remover SelectItem com valor vazio do dropdown de categoria
- [x] Testar filtros na página pública de produtos

## Cadastro do E-book Magnetismo Social
- [ ] Buscar ID da categoria "Relacionamentos & Inteligência Emocional"
- [ ] Cadastrar produto no banco de dados
- [ ] Verificar exibição na homepage e página de produtos

## Implementação de Páginas Admin Faltantes
- [x] Criar página de Vendas/Pedidos (/admin/sales)
- [x] Criar página de Clientes (/admin/customers)
- [x] Criar página de Cursos (/admin/courses)
- [x] Criar página de Configurações (/admin/settings)
- [x] Adicionar rotas no App.tsx
- [x] Testar todas as 4 páginas

## Página de Detalhes do Pedido
- [x] Criar componente OrderDetail.tsx
- [x] Adicionar query TRPC para buscar pedido por ID
- [x] Mostrar informações do pedido (ID, data, status)
- [x] Mostrar dados do cliente
- [x] Listar produtos comprados
- [x] Exibir detalhes de pagamento (Stripe)
- [x] Adicionar ações administrativas (reembolso, cancelamento)
- [x] Adicionar rota no App.tsx
- [x] Integrar com página de Vendas (botão Ver Detalhes)
- [x] Testar fluxo completo

## 4 Recursos Essenciais para Lançamento
- [x] Upload direto de imagens no formulário de produtos
- [x] Integrar com S3 para armazenamento
- [x] Preview em tempo real da imagem
- [x] Badges de categoria nos cards de produtos
- [x] Sistema de busca inteligente global
- [x] Barra de busca no header
- [x] Busca por nome, categoria e tipo
- [x] Menu lateral retrátil estilo Manus
- [x] Sidebar com ícones
- [x] Animações suaves
- [x] Versão mobile responsiva
- [x] Testar todos os recursos

## Bug Urgente - Página de Vendas
- [x] Corrigir link "Vendas" na sidebar do AdminLayout (está apontando para /admin/orders ao invés de /admin/sales)
- [x] Testar acesso à página de Vendas após correção

## Garantia de 30 Dias em Todos os Produtos
- [x] Adicionar campo guaranteeDays no schema de produtos (padrão 30)
- [x] Migrar banco de dados com novo campo
- [x] Atualizar formulário de produtos com campo de garantia
- [x] Exibir badge de garantia nos cards de produtos
- [x] Adicionar seção de garantia na página de detalhes do produto
- [x] Atualizar sidebar da página de detalhes com garantia dinâmica
- [x] Testar exibição em todas as páginas

## Integração do App LibroFy na Área de Membros
- [x] Criar produto LibroFy no banco de dados (tipo: app)
- [x] Adicionar URL do LibroFy no campo salesPageUrl do produto
- [x] Atualizar página MyProducts para detectar apps comprados
- [x] Implementar botão "Acessar App" que abre LibroFy em nova aba
- [x] Adicionar card especial para apps na área de membros
- [x] Testar fluxo: compra → acesso ao app → abertura do LibroFy
- [x] Adicionar ícone e visual diferenciado para apps

## Bug - Botão Visualizar Produto no Painel Admin
- [x] Investigar por que o botão "Visualizar" não está funcionando
- [x] Corrigir implementação do botão
- [x] Testar visualização de produtos

## Feature - Botão Duplicar Produto
- [x] Criar endpoint backend para duplicar produto (products.duplicate)
- [x] Gerar novo slug único ao duplicar (adicionar sufixo -copy ou timestamp)
- [x] Adicionar botão "Duplicar" na lista de produtos do admin
- [x] Implementar confirmação de duplicação
- [x] Testar duplicação de diferentes tipos de produtos
- [x] Adicionar toast de sucesso após duplicação
- [x] Remover filtro isActive do getAllProducts para mostrar produtos inativos no admin

## Bug - Página Meus Produtos com erro 404
- [x] Verificar rota registrada no App.tsx
- [x] Corrigir caminho da rota (links estavam apontando para /my-products ao invés de /my-account/products)
- [x] Testar acesso à página

## Sistema de Afiliados - Ativação Completa
- [x] Adicionar campo de comissão (%) no schema de produtos
- [x] Migrar banco de dados com campo de comissão
- [x] Adicionar campo de comissão no formulário de produtos
- [x] Adicionar affiliateCommission nos endpoints create e update
- [x] Criar router de afiliados no backend (affiliates.ts) - já existia
- [x] Implementar endpoints: register, getMyAffiliate, getStats - já existia
- [x] Criar página de cadastro (/affiliate/register)
- [x] Criar dashboard de afiliados (/affiliate/dashboard) com estatísticas - já existia
- [x] Criar página de links (/affiliate/links) com geração de URLs - já existia
- [x] Criar página de vendas (/affiliate/sales) com relatório de comissões - já existia
- [x] Implementar sistema de aprovação (status: pending/active/rejected) - já existia
- [x] Gerar código único de afiliado automaticamente - já existia
- [x] Testar fluxo completo: cadastro → dashboard → links → vendas

## Correção - Garantia do LibroFy
- [x] Atualizar guaranteeDays do LibroFy de 7 para 30 dias no banco de dados
- [x] Verificar atualização na página do produto

## Ajuste de Comissões de Afiliados (50-70%, padrão 60%)
- [x] Atualizar schema do banco: affiliateCommission padrão 60, min 50, max 70
- [x] Atualizar validação no ProductForm.tsx (min 50, max 70, padrão 60)
- [x] Atualizar validação no products router (min 50, max 70)
- [x] Atualizar produtos existentes no banco para 60%
- [x] Testar criação de novo produto com comissão padrão 60%

## Implementação de PWA (Progressive Web App)
- [x] Criar manifest.json com configurações do app
- [x] Gerar ícones em múltiplos tamanhos (192x192, 512x512)
- [x] Criar Service Worker para cache offline
- [x] Adicionar meta tags PWA no index.html
- [x] Registrar Service Worker no main.tsx
- [x] Testar formulário de produtos com comissão 60%
- [x] Verificar funcionamento do PWA

## Correção da Taxa de Comissão de Afiliados (20% → 60%)
- [x] Verificar schema da tabela affiliates
- [x] Atualizar afiliados existentes no banco para 60%
- [x] Verificar formulário de cadastro de afiliados (/affiliate/register)
- [x] Ajustar valor padrão no formulário se necessário
- [x] Testar página /admin/affiliates
- [x] Verificar dashboard do afiliado (/affiliate)

## Capa de Apresentação do App LibroFy
- [x] Gerar imagem de capa profissional usando IA
- [x] Fazer upload da imagem para S3
- [x] Atualizar produto LibroFy no banco com nova URL da capa
- [x] Verificar exibição na página de produtos

## Precificação Visível e Página de Detalhes do Produto
- [x] Verificar dados do produto LibroFy no banco (preço, descrição, funcionalidades)
- [x] Atualizar componente ProductCard para exibir preço formatado
- [x] Criar página /products/[slug] para detalhes do produto
- [x] Adicionar seção de funcionalidades na página de detalhes
- [x] Adicionar botão "Comprar Agora" na página de detalhes
- [x] Atualizar botão "Ver Mais" nos cards para redirecionar para página de detalhes
- [ ] Testar fluxo: catálogo → detalhes → checkout

## Sistema de Planos Freemium + Assinatura para Apps
- [x] Verificar schema subscription_plans no banco
- [x] Criar planos para LibroFy (Freemium, Premium Mensal R$ 19,90, Premium Anual R$ 197,00)
- [x] Criar página de escolha de planos (/products/[slug]/plans)
- [x] Atualizar ProductDetail para apps mostrarem "Escolher Plano" ao invés de "Comprar"
- [x] Criar componente de comparação de planos (tabela de features)
- [x] Atualizar cards de produtos para mostrar badge "Plano Grátis Disponível"
- [ ] Atualizar checkout para processar assinaturas recorrentes
- [ ] Integrar Stripe Subscriptions API
- [x] Testar fluxo: catálogo → detalhes → escolher plano (checkout pendente de integração Stripe)
- [ ] Documentar modelo de comissões recorrentes para afiliados

## Integração Stripe Subscriptions + Onboarding Freemium + Comissões Recorrentes
- [x] Criar Stripe Price IDs para planos Premium Mensal e Anual
- [x] Atualizar tabela subscription_plans com stripePriceId
- [x] Criar endpoint trpc para criar Stripe Subscription
- [x] Adicionar campo status à tabela affiliates (pending/approved/rejected)
- [x] Implementar webhook Stripe para eventos de assinatura (criada, renovada, cancelada)
- [x] Implementar cálculo automático de comissões recorrentes via webhook
- [ ] Criar fluxo de onboarding Freemium (registro sem cartão)
- [ ] Implementar limite de 3 e-books/mês para plano gratuito
- [ ] Criar tabela affiliate_commissions_recurring para comissões mensais (histórico)
- [ ] Criar dashboard de MRR (Monthly Recurring Revenue) para afiliados
- [ ] Implementar Stripe Customer Portal para gerenciar assinaturas
- [ ] Testar fluxo: escolher Premium → checkout → assinatura criada
- [ ] Testar fluxo: escolher Freemium → cadastro → acesso liberado
- [ ] Testar webhook: renovação → comissão afiliado creditada

## Stripe Customer Portal
- [x] Criar endpoint trpc para gerar link do Customer Portal
- [x] Adicionar botão "Gerenciar Assinatura" no dashboard do usuário
- [x] Configurar URL de retorno do Customer Portal (retorna para /dashboard)
- [x] Testar fluxo: clicar botão → redirecionar para Customer Portal → gerenciar assinatura

## Dashboard MRR para Afiliados
- [x] Criar endpoint tRPC para obter MRR do afiliado
- [x] Criar endpoint para listar assinantes ativos gerados pelo afiliado
- [x] Criar endpoint para histórico mensal de comissões
- [x] Criar componente de card de métricas (MRR, assinantes, conversão)
- [x] Criar gráfico de evolução do MRR (últimos 6 meses)
- [x] Criar tabela de assinantes ativos com status
- [x] Atualizar página /affiliate com novo dashboard (tabs: Assinaturas vs Vendas Únicas)
- [x] Testar dashboard com dados reais no navegador (ambas tabs funcionando)

## Bug Crítico - Dropdown de Categoria no Formulário de Produtos
- [x] Corrigir erro removeChild no dropdown de categoria ao cadastrar produto

## Atualização do Rodapé
- [x] Adicionar informações da empresa no footer (Grupo O Especialista + CNPJ)

## Páginas Legais (LGPD)
- [x] Criar página de Termos de Uso com conteúdo jurídico completo
- [x] Criar página de Política de Privacidade conforme LGPD

## Páginas Legais (LGPD)
- [x] Criar página de Termos de Uso com conteúdo jurídico completo
- [x] Criar página de Política de Privacidade conforme LGPD

## Correção de Webhook Stripe
- [x] Corrigir formato de resposta JSON do webhook para compatibilidade com Manus

## Bug Crítico - Página de Checkout
- [x] Corrigir erro removeChild na página de checkout

## Bug Crítico - Checkout (RESOLVIDO - 07/01/2026)
- [x] Corrigir erro removeChild no Select de parcelas (substituído por select HTML nativo)
- [x] Corrigir erro updateProduct para updateOrder no endpoint createSession
- [x] Criar função updateOrder genérica no db.ts
- [x] Corrigir função createOrder para retornar orderId diretamente
- [x] Testar fluxo completo de checkout até redirecionamento Stripe
- [x] Validar criação de pedido no banco de dados

## Correção Logo Mobile
- [x] Corrigir tamanho e proporção da logo no header mobile
- [x] Garantir que ícone da coruja e texto "ContentFy" fiquem bem alinhados
- [x] Recortar logo para remover espaço em branco excessivo
- [x] Upload da logo recortada para CDN

## Ajuste Logo - Fundo Branco e Tamanho
- [x] Remover fundo branco do "Fy" na logo
- [x] Reduzir tamanho da logo para ficar mais proporcional no header
- [x] Adicionar espaçamento entre ícone da coruja e texto ContentFy na logo
- [x] Reduzir mais o tamanho da logo no header (está grande no site publicado)
- [ ] Corrigir logo ainda grande no mobile - coruja saindo do header

## Correção Logo PublicHeader
- [x] Corrigir logo grande no PublicHeader (era h-24, agora h-7 proporcional)
- [x] Identificar que Home.tsx usa PublicHeader (não Header.tsx)

## Comercialização - Tarefas Críticas
- [ ] Habilitar PIX e Boleto no checkout (payment_method_types no Stripe)
- [ ] Implementar upload de PDF/arquivo no formulário de produto (admin)
- [ ] Implementar entrega real do PDF na área de membros (ProductViewer)
- [ ] Guiar KYC no Stripe para receber dinheiro real

## Comercialização - Tarefas Críticas
- [x] Habilitar PIX e Boleto no checkout Stripe (payment_method_types: card, boleto, pix)
- [x] Adicionar campo contentUrl na tabela products do banco de dados (migração aplicada)
- [x] Criar endpoint /api/upload/product-file para upload de PDF/MP3 (100MB)
- [x] Adicionar campo de upload de arquivo no formulário de produto do admin
- [x] Atualizar visualizador da área de membros para exibir PDF real via iframe
- [x] Corrigir audiobook player para usar contentUrl em vez de coverImage
- [ ] Completar KYC no Stripe para receber dinheiro real
- [ ] Fazer upload do PDF do e-book Magnetismo Social no admin

## Upload E-book PDF - Content Creator
- [ ] Verificar PDF recebido e identificar produto correspondente
- [ ] Fazer upload do PDF para o S3
- [ ] Vincular URL do PDF ao produto no banco de dados
- [ ] Testar visualização na área de membros
