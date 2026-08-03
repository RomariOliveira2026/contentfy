# Brand layer decisions — Design Freeze v1.0

## ContentFyBrandProvider

**Not created.**

Reasons:
- `ThemeContext` already owns light/dark application theme.
- Asset paths are static constants (`assets.ts`).
- Metadata is a plain object (`metadata.ts`).
- A React provider would add context overhead without changing resolution rules.

Consumers import from `@/brand` and `@/components/branding`.

## Runtime distribution

- Source of truth: `/brand`
- Vite serves copies from `client/public/brand/`
- Legacy public root favicon/logo paths are updated copies for `index.html` / manifest compatibility
- Old logos live in `client/public/archive/brand-legacy/`
