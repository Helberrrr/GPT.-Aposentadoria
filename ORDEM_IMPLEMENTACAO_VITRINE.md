# ORDEM DE EXECUÇÃO — enviar à IA que administra a Vitrine Autônoma no PC

> **Instrução para implementação.** Não confundir a existência deste documento no GitHub com atualização da loja em produção.

Você é responsável por alterar **o código REAL da Vitrine Autônoma** que está instalado no PC do titular (Node.js/SQLite, túnel Cloudflare), preservando pedidos, dados, pagamentos, licenças e credenciais.

Leia INTEGRALMENTE antes de editar:
1. [VITRINE_REGRAS_PRODUTOS.md](VITRINE_REGRAS_PRODUTOS.md)
2. [TESTES_STAGING_VITRINE.md](TESTES_STAGING_VITRINE.md)
3. [VITRINE_E_TUNEL.md](VITRINE_E_TUNEL.md)

## O que alterar

**Problema prioritário:** os termos gerais da Vitrine dizem que todos os produtos são gerados com IA, entregues em até 48h e têm 1 revisão; entretanto, **HN Replay é um produto independente** com ZIP pronto após pagamento confirmado, licença não exclusiva e **0 revisões/0 personalizações**.

**Regra da empresa:** a Vitrine é **uma plataforma de múltiplas vendas de produtos distintos**, não um serviço único. Cada produto possui suas regras específicas; comprador do produto A não recebe B e a política do A não deve ser herdada pelo B. Os direitos gerais de consumidores e titulares de dados se mantêm para todos.

**Faça no código local:**
1. Separar as configurações/contratos de cada produto, nunca usar fallback global 48h/1 revisão.
2. Ajustar **/termos**: regras gerais neutras, específicas na oferta e no resumo do pedido, sem permitir prejuízo de direitos legais.
3. Ajustar **/reembolso**: não falar em "revisão incluída" para itens sem revisão. Permitir autoatendimento **e/ou e-mail** apenas conforme recursos que realmente funcionam; preservar arrependimento/direitos legais.
4. Ajustar **/privacidade**: informações e operadores conforme finalidades de cada produto; HN Replay não precisa de briefing nem IA para gerar o ZIP. Manter retenção legal de registros financeiros, não prometer apagar todo e qualquer dado em 90 dias.
5. Ajustar **/p/hn-replay** e checkout para registrar versão da oferta, preço, licença, ZIP, 5 vídeos, prazo/entrega, zero revisão e limitações; não afirmar que contém 35 vídeos/importador sem inspecionar o ZIP entregue.
6. Garantir que a entrega exija pagamento validado por webhook Stripe, com assinatura e idempotência; ZIP acessível somente ao titular autorizado.
7. Preservar o comportamento comercial específico dos demais produtos, revisões onde contratadas, dados existentes e histórico de pedidos.
8. Adicionar testes unitários/de integração para independência de políticas, snapshots de pedidos, checkout, ZIP, reembolso, LGPD e não regressão.

## Testes obrigatórios

**Não fazer stress na loja pública ou no túnel de produção.** Montar staging local isolado (ou ambiente dedicado) e executar as verificações do arquivo TESTES_STAGING_VITRINE.md, inclusive rampa de 5/25/50/100 usuários virtuais com o script \`scripts/stress-vitrine-staging.mjs\`. Também testar Stripe TEST e reinício do túnel **de teste**. **Não usar Stripe LIVE nem criar pedidos/cobranças reais nos testes.**

Execute testes e restaure o serviço em caso de falha. **Se não houver acesso a staging, Stripe TEST ou túnel de homologação, registrar exatamente quais cenários foram BLOQUEADOS** e nunca dizer "todos passaram".

## Entrega esperada

Um resumo objetivo contendo:
- caminhos dos arquivos alterados, commits/hashes e ambiente;
- capturas ou evidências sanitizadas das páginas /termos, /reembolso, /privacidade e /p/hn-replay;
- lista de testes PASS/FAIL/BLOCKED e relatório de carga, incluindo p95, 5xx e timeout;
- evidência do fluxo Stripe TEST sem dados de cartão e sem segredos;
- backup realizado e plano de rollback testado;
- confirmação de que a loja de produção continua acessível.

**Não alterar preço, contratos históricos, credenciais, domínio, Stripe LIVE, produtos de terceiros ou política de gastos.** Se encontrar divergência jurídica relevante, interromper a publicação da mudança e solicitar revisão profissional. **Não executar anúncio pago antes de 20 vendas reais verificadas; não contar compras de teste.**
