# ContentFy — Identidade Visual Oficial

**STATUS:** DESIGN FREEZE **v1.0**  
**READY FOR PRODUCTION**

Esta pasta é a **fonte oficial** da identidade visual da ContentFy.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `svg/` | Símbolos e lockups oficiais (fonte) |
| `png/` | Raster derivados dos SVGs (favicon + escalas do Master) |
| `app-icons/` | Ícones de app (iOS · Android · PWA) |
| `archive/studies/` | Estudos e versões históricas (não oficiais) |

## Regras

1. **Todos os SVG oficiais** ficam em `brand/svg/`.
2. **PNGs são derivados** dos SVGs — não editar PNG como fonte.
3. **Favicons** derivam da versão **Micro** (`svg/micro.svg` → `svg/favicon.svg` / `png/favicon-*.png`).
4. Alterações na marca exigem atualização do **Brand Book** e novo Design Freeze.
5. A identidade visual encontra-se em **DESIGN FREEZE v1.0** — sem alteração estrutural sem aprovação explícita.

## Níveis responsivos

| Arquivo | Uso | Tamanho |
|---|---|---|
| `svg/master.svg` | Landing, hero, brand | ≥ 96px |
| `svg/compact.svg` | Header, dashboard, checkout | 32–95px |
| `svg/micro.svg` | Favicon, sidebar, avatar | 16–32px |

## Pacote de referência (estudos)

O trabalho de restauração e Brand Book permanece em `brand/signature-edition/` (arquivo de processo).  
Os assets **oficiais de produção** nesta pasta (`brand/svg`, `brand/png`, `brand/app-icons`) são a cópia canônica v1.0.

## Integração na aplicação

| Camada | Caminho |
|---|---|
| Fonte oficial | `/brand` |
| Cópias de runtime (Vite public) | `client/public/brand/` |
| API TypeScript | `client/src/brand/` |
| Componentes | `client/src/components/branding/` |

`client/public/brand` contém **somente cópias de distribuição**. Editar sempre `/brand` e re-copiar.

Lockup para superfície clara: `svg/logo-horizontal-on-light.svg` (wordmark Midnight).  
Lockup para superfície escura: `svg/logo-horizontal.svg` (wordmark Snow).
