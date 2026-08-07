# Future AI Integration (não nesta versão)

Evolution XIII é **rule-based**. Pontos de integração futura (quando houver política, custo e consentimento):

1. **Greeting** — variação de tom via LLM com guardrails editoriais (fallback atual permanece).
2. **NBA** — ranking assistido por modelo sobre candidatos já gerados por regras (nunca inventar progresso).
3. **Onboarding** — inferência de objetivo a partir de histórico (com confirmação humana).
4. **Feed** — re-rank de Discovery rails (o Discovery continua source of truth).
5. **Explicações** — textos “por que este conteúdo” mais naturais, sempre ancorados em razões estruturadas.

## Restrições

- Sem embeddings nesta versão
- Sem OpenAI/LLM na Experience Layer atual
- Qualquer IA futura deve degradar para os fallbacks editoriais já implementados
- Ownership e sessão continuam no servidor
