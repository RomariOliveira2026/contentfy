# Intelligence Scores

Todas as fórmulas em `DEFAULT_INTELLIGENCE_SCORE_CONFIG` / `INTELLIGENCE_SCORE_CONFIG_JSON`.

## Product Score

Pesos: views, sales, favorites, completion, retention, refundPenalty, abandonmentPenalty  
Normalização relativa ao máximo do peer set + percentuais 0–100.

## Creator Score

conversion · retention · satisfaction (inverso de refund) · volume

## Category Score

growth (delta janela) · sales · engagement (views+favorites)

## Engagement / Trust / Growth / Momentum

Componentes dedicados; labels: Excelente / Forte / Em evolução / Inicial / Baixo sinal.

## Thresholds de alerta (defaults)

| Alerta | Default |
|--------|---------|
| Queda vendas | ≤ -20% |
| Alto abandono | ≥ 40% |
| Alto reembolso | ≥ 8% |
| Emergente | ≥ +25% |
| Viral | ≥ 50 views e ≥ 5 vendas (janela recente) |
| Categoria aquecendo/esfriando | ±20% / -15% |
