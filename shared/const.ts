export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Product Categories
export const PRODUCT_CATEGORIES = [
  "Desenvolvimento Pessoal",
  "Relacionamentos & Inteligência Emocional",
  "Saúde Mental & Neurociência",
  "Comunicação & Oratória",
  "Finanças & Prosperidade",
  "Negócios Digitais & Empreendedorismo",
  "Carreira & Produtividade",
  "Ferramentas & Profissões do Futuro",
  "Vícios & Reprogramação Emocional",
  "Saúde, Corpo & Performance",
  "Espiritualidade & Cultura",
  "Estilo de Vida & Conhecimento Premium"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
