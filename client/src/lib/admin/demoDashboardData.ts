/**
 * Dados demonstrativos do Dashboard Admin.
 * Somente para apresentação — não representam métricas reais de produção.
 */

const DESACELERE_MOCKUP = "/products/desacelere/mockup-kit.webp";
const REPRESENTANTE_COVER = "/products/representante40/cover-premium.webp";
const REPRESENTANTE_MOCKUP = "/products/representante40/mockup-kit.webp";

export const DEMO_BADGE_LABEL = "AMBIENTE DE DEMONSTRAÇÃO";

export const demoTodaySummary = {
  sales: 23,
  revenueCents: 482_000,
  newAffiliates: 3,
  newProducts: 2,
};

export const demoPrimaryKpis = [
  {
    id: "revenue",
    title: "Receita Total",
    value: 128450,
    prefix: "R$ ",
    decimals: 0,
    change: "+18%",
    trend: "up" as const,
    changeTone: "positive" as const,
    featured: true,
    sparkline: [42, 48, 45, 52, 58, 55, 62, 70, 68, 74, 82, 88],
    accent: "orange",
  },
  {
    id: "sales",
    title: "Vendas",
    value: 347,
    prefix: "",
    decimals: 0,
    change: "+12%",
    trend: "up" as const,
    changeTone: "positive" as const,
    sparkline: [18, 22, 20, 28, 26, 30, 34, 32, 36, 40, 38, 44],
    accent: "amber",
  },
  {
    id: "products",
    title: "Produtos",
    value: 28,
    prefix: "",
    decimals: 0,
    change: "+4",
    trend: "up" as const,
    changeTone: "neutral" as const,
    sparkline: [12, 14, 15, 16, 18, 19, 20, 22, 23, 25, 26, 28],
    accent: "sky",
  },
  {
    id: "customers",
    title: "Clientes",
    value: 4932,
    prefix: "",
    decimals: 0,
    change: "+15%",
    trend: "up" as const,
    changeTone: "positive" as const,
    sparkline: [2100, 2400, 2600, 2900, 3200, 3500, 3800, 4100, 4300, 4500, 4700, 4932],
    accent: "emerald",
  },
];

export const demoSecondaryKpis = [
  {
    id: "affiliates",
    title: "Afiliados",
    value: 184,
    change: "+9%",
    trend: "up" as const,
    changeTone: "positive" as const,
  },
  {
    id: "ticket",
    title: "Ticket Médio",
    valueLabel: "R$ 168",
    change: "+3%",
    trend: "up" as const,
    changeTone: "positive" as const,
  },
  {
    id: "conversion",
    title: "Conversão",
    valueLabel: "4,9%",
    change: "+0,4pp",
    trend: "up" as const,
    changeTone: "positive" as const,
  },
  {
    id: "refund",
    title: "Reembolso",
    valueLabel: "1,3%",
    change: "-0,2pp",
    trend: "down" as const,
    changeTone: "inverse" as const,
  },
];

export const demoRevenueByMonth = [
  { month: "Set", revenue: 6200 },
  { month: "Out", revenue: 7800 },
  { month: "Nov", revenue: 9100 },
  { month: "Dez", revenue: 12400 },
  { month: "Jan", revenue: 9800 },
  { month: "Fev", revenue: 11200 },
  { month: "Mar", revenue: 13100 },
  { month: "Abr", revenue: 14600 },
  { month: "Mai", revenue: 15200 },
  { month: "Jun", revenue: 16800 },
  { month: "Jul", revenue: 18100 },
  { month: "Ago", revenue: 19450 },
];

/** Últimos 30 dias — vendas diárias */
export const demoSalesByDay = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 8 + ((i * 3) % 7);
  const weekendBoost = i % 7 === 5 || i % 7 === 6 ? 4 : 0;
  return {
    day: String(day).padStart(2, "0"),
    sales: base + weekendBoost + (i % 5),
  };
});

export const demoProducts = [
  {
    id: "desacelere",
    name: "Desacelere",
    category: "E-book",
    priceLabel: "R$ 97",
    status: "Publicado" as const,
    sales: 128,
    rating: 4.9,
    cover: DESACELERE_MOCKUP,
  },
  {
    id: "representante",
    name: "Manual Representante 4.0",
    category: "Manual",
    priceLabel: "R$ 147",
    status: "Publicado" as const,
    sales: 96,
    rating: 4.8,
    cover: REPRESENTANTE_COVER,
  },
  {
    id: "magnetismo",
    name: "Magnetismo Social",
    category: "Curso",
    priceLabel: "R$ 97",
    status: "Publicado" as const,
    sales: 74,
    rating: 4.7,
    cover: REPRESENTANTE_MOCKUP,
  },
  {
    id: "arquitetura",
    name: "Arquitetura da Prosperidade",
    category: "E-book",
    priceLabel: "R$ 67",
    status: "Publicado" as const,
    sales: 58,
    rating: 4.6,
    cover: DESACELERE_MOCKUP,
  },
  {
    id: "leis",
    name: "Leis Implacáveis do Dinheiro",
    category: "E-book",
    priceLabel: "R$ 87",
    status: "Rascunho" as const,
    sales: 41,
    rating: 4.5,
    cover: REPRESENTANTE_COVER,
  },
];

export const demoRecentSales = [
  {
    id: "1",
    customer: "Carlos Mendes",
    product: "Desacelere",
    amountLabel: "R$ 97",
    status: "Pago" as const,
    time: "10:42",
  },
  {
    id: "2",
    customer: "Maria Silva",
    product: "Manual Representante",
    amountLabel: "R$ 147",
    status: "Pago" as const,
    time: "10:35",
  },
  {
    id: "3",
    customer: "Lucas Oliveira",
    product: "Magnetismo Social",
    amountLabel: "R$ 97",
    status: "Processando" as const,
    time: "10:20",
  },
  {
    id: "4",
    customer: "Ana Paula Costa",
    product: "Arquitetura da Prosperidade",
    amountLabel: "R$ 67",
    status: "Pago" as const,
    time: "09:58",
  },
  {
    id: "5",
    customer: "Roberto Alves",
    product: "Desacelere",
    amountLabel: "R$ 97",
    status: "Pago" as const,
    time: "09:41",
  },
  {
    id: "6",
    customer: "Juliana Costa",
    product: "Manual Representante",
    amountLabel: "R$ 147",
    status: "Pago" as const,
    time: "09:18",
  },
];

export const demoLiveActivity = [
  { id: "a1", type: "affiliate", text: "Novo afiliado cadastrado — Pedro Nunes" },
  { id: "a2", type: "sale", text: "Venda realizada — Desacelere · R$ 97" },
  { id: "a3", type: "product", text: "Produto atualizado — Manual Representante 4.0" },
  { id: "a4", type: "commission", text: "Comissão liberada — R$ 28,40" },
  { id: "a5", type: "sale", text: "Venda realizada — Magnetismo Social · R$ 97" },
  { id: "a6", type: "affiliate", text: "Novo afiliado cadastrado — Fernanda Dias" },
];

export const demoTopProducts = [
  { rank: 1, name: "Desacelere", sales: 128, pct: 100 },
  { rank: 2, name: "Manual Representante", sales: 96, pct: 75 },
  { rank: 3, name: "Magnetismo Social", sales: 74, pct: 58 },
  { rank: 4, name: "Arquitetura da Prosperidade", sales: 58, pct: 45 },
  { rank: 5, name: "Código da Comunicação", sales: 49, pct: 38 },
];

export const demoRevenueMap = {
  todayLabel: "R$ 4.820",
  weekLabel: "R$ 28.640",
  monthLabel: "R$ 94.210",
  goalLabel: "R$ 120.000",
  goalProgress: 78,
};

export const demoQuickActions = [
  { id: "product", label: "Criar Produto", href: "/admin/products/new" },
  { id: "course", label: "Novo Curso", href: "/admin/courses" },
  { id: "landing", label: "Nova Landing Page", href: "/creator/ai" },
  { id: "affiliate", label: "Cadastrar Afiliado", href: "/admin/affiliates" },
  { id: "import", label: "Importar Conteúdo", href: "/admin/products" },
  { id: "coupon", label: "Enviar Cupom", href: "/admin/sales" },
];

export function formatBRLFromNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function greetingForHour(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function adminDisplayName(full?: string | null) {
  const first = full?.trim().split(/\s+/)[0];
  if (!first) return "Administrador";
  if (/^aluno/i.test(first)) return "Romário";
  return first;
}

export function firstName(full?: string | null) {
  return adminDisplayName(full);
}
