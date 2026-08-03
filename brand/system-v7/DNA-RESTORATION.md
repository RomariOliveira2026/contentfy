# ContentFy Symbol V7 — Engenharia Reversa / Restauração

## Missão
Reconstruir o símbolo original em SVG puro. Não redesign. Não interpretação.
Meta de reconhecimento: **~98%** da coruja original, removendo apenas efeitos datados.

## Fonte de verdade
`client/public/favicon.png` (512×512) + lockups oficiais (`logo-contentfy.png`, `logo-oficial.png`)

## Fase 1 — Medições (favicon 512²)

| Métrica | Valor original | V7 (viewBox 128) |
|---|---|---|
| Bbox corpo | (54,14)–(456,498) = 402×484 | encaixa em 128² |
| Aspecto H/W | **1.204** | ~1.20 |
| Centro esq. olho | (160, 188) | **(40, 51)** |
| Centro dir. olho | (353, 188) | **(88, 51)** |
| Gap entre centros | 193 px | **48** u |
| Diâm. anel (laranja) | ~120 px | **r = 15.2** |
| Olho / largura corpo | ~0.28 | preservado |
| Y óptico dos olhos | ~36% do corpo / ~47% canvas | **cy=51** |
| Eixo vertical | x = 256 | x = 64 |
| Tufts / orelhas | extremos do bbox | flare largo V7.1 |

## Fase 2 — DNA essencial (não negociável)
1. **Olhar** — anéis laranja + poço escuro + íris âmbar
2. **Sobrancelhas** — V tenso ~45°, nunca relaxadas
3. **Silhueta** — tufts + busto largo + base arredondada
4. **Proporção dos olhos** — diâmetro e gap medidos
5. **Bico** — keystone sob a ponte das sobrancelhas
6. **Postura** — frontal, simétrica, autoridade

Simplificável: textura, bevel, glow, escamas em relevo, gradientes 3D.

## Fase 3 — O que foi removido (e por quê)
| Removido | Por quê |
|---|---|
| Textura / grain / carbon | efeito datado, não estrutural |
| Bevel / relevo metálico | 3D; substituído por planos flat |
| Glow / bloom | ilegível em UI; anéis sólidos preservam o olhar |
| Gradientes no símbolo | brief V7: sólidos apenas |
| Blur / sombras | não escalam |

## O que foi mantido (e por quê)
| Mantido | Por quê |
|---|---|
| Silhueta larga com tufts | reconhecimento a 32px e silhueta preta |
| Sobrancelhas em V agressivo | autoridade / inteligência |
| Anéis concêntricos (4–5 níveis) | profundidade óptica sem efeitos |
| Ritmo de penas no peito (flat) | continuidade com a original, sem textura |
| Acentos laterais curvos | assinatura lateral da original |
| Bico integrado à ponte | não é “triângulo colado” |
| Wordmark / paleta tokens | fora de escopo — congelados |

## Testes
- **1 segundo:** deve soar “é a mesma coruja”
- **Silhueta preta:** forma proprietária
- **32px / 2 metros:** reconhecimento imediato
- **10 anos:** geometria estável, sem moda de ícone startup

## Critério de falha
Se alguém disser “trocaram a coruja” → falhou.
Se disser “nem percebi… ficou mais elegante” → aprovado.
