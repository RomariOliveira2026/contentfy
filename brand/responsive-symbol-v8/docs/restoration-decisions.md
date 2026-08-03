# ContentFy V8 — Decisões de Restauração

## Princípio
Vetorização fiel da **imagem original**. Sem redesign. Sem V5/V6/V7 como base.

## Removido (e por quê)

| Removido | Motivo |
|---|---|
| Textura couro/escamas | Efeito raster; não é estrutura |
| Bevel / relevo 3D | Não escala; planos flat preservam leitura |
| Glow / bloom | Ilegível em UI; anéis sólidos mantêm o olhar |
| Gradientes complexos | Brief: sólidos; máx. 3 escuros + 2 quentes + 1 clara |
| Reflexos especulares | Ornamento, não DNA |

## Preservado (e por quê)

| Preservado | Motivo |
|---|---|
| Aspecto 1.204 | Medido no bbox original |
| Olhos (33.8 / 94.7), r=18.1 | Centros e diâmetro medidos |
| Sobrancelhas em V ~33° | Elemento #1 de autoridade |
| Bico no eixo, integrado | Não é triângulo colado |
| Tufts nos extremos | Silhueta proprietária |
| Peito em camadas (Master) | Verticalidade e presença |
| Acentos laterais curvos | Assinatura da original |
| Wordmark / paleta tokens | Fora de escopo |

## Sistema responsivo (por quê 3 níveis)
Uma única geometria não serve a 16px e a 512px.  
Master preserva presença; Compact opera; Micro reconhece.

## Critério de sucesso
- Master → “É a coruja original, vetorial.”  
- Compact → “Mesma marca, mais funcional.”  
- Micro → “Reconheço a ContentFy.”
