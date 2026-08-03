# ContentFy Responsive Symbol V8 — Medições

**Fonte única:** `client/public/favicon.png` (512×512)  
**Método:** amostragem de pixels + grade sobre o bbox da coruja.  
**V5/V6/V7:** não usadas como base.

## Canvas e bbox

| Métrica | Valor (px originais) |
|---|---|
| Canvas | 512 × 512 |
| Bbox corpo | (54, 14) → (456, 498) |
| Largura útil | 402 |
| Altura útil | 484 |
| Aspecto H/W | **1.204** |
| Eixo vertical | x = 256 (centro do canvas) |

## ViewBox oficial V8

`viewBox="0 0 128 154"` — mesma proporção 1.204.

Mapeamento:
- `x' = (x - 54) × (128 / 402)`
- `y' = (y - 14) × (154 / 484)`

## Olhos (elemento #1)

| | Esquerdo | Direito |
|---|---|---|
| Extensão laranja (y≈185) | x 103–217 | x 294–409 |
| Centro aproximado | (160, 195) | (351.5, 195) |
| Em viewBox 128×154 | **(33.8, 57.6)** | **(94.7, 57.6)** |
| Diâmetro anel | ~114 px | → **r ≈ 18.1** |
| Gap centros | 191.5 px | → **60.9** u |
| Gap entre bordas internas | ≈ 77 px ≈ 0.68× diâmetro | |

## Sobrancelhas

- Forma: **V** hooded, inclinadas ~30–35° do temple ao eixo.
- Integram-se à testa; encontram-se na ponte sobre o bico.
- Em viewBox: planos a partir de y≈28–42, descendo sobre os olhos.

## Bico

- Triângulo vertical no eixo x=64.
- Nasce sob a ponte das sobrancelhas (não flutuante).
- Topo ≈ y 62–64; base ≈ y 82–86 (Master).

## Cabeça / tufts

- Pontas das orelhas nos extremos superiores do bbox.
- Em viewBox: ~`(3.5, 0.6)` e `(124.5, 0.6)`.
- Coroa com leve fenda/V entre tufts.

## Peito

- Camadas em folha/lágrima em V descendente (3 faixas principais).
- Topo do peito ≈ y 85–90; base ≈ y 148–154.

## Acentos laterais

- Curvas ao longo do contorno externo do busto.
- Original: glow laranja→vermelho (substituído por traços sólidos Orange + Deep red).

## DNA essencial (não negociável)

1. Olhar (anéis + contraste interno)  
2. Sobrancelhas em V  
3. Silhueta com tufts  
4. Proporção / gap dos olhos  
5. Bico no eixo  
6. Postura frontal simétrica  
7. Verticalidade do corpo (Master/Compact)
