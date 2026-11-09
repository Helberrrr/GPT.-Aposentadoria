# Plano de homologação — loja, Stripe e túnel Cloudflare (sem afetar clientes)

**Estado em 08/11/2026:** **PARCIAL**. Testes públicos leves de leitura concluídos; stress real de 100 usuários e checkout Stripe de teste **NÃO EXECUTADOS**, porque não há acesso ao servidor isolado de homologação nem às chaves/contas de teste por esta integração. **Não confundir 5.000 mensagens simuladas em memória com 100 clientes simultâneos na Vitrine em produção.**

**Objetivo:** validar código e infraestrutura da **Vitrine Autônoma**, principalmente HN Replay e coexistência de outros produtos, sem usar pagamentos reais nem risco de causar indisponibilidade em produção.

## 1. Evidências já obtidas — leitura pública, sem carga

Em 08/11/2026, consultas GET individuais às páginas públicas retornaram conteúdo:
- [x] https://vitrineautonoma.com.br/ — vitrine inicial
- [x] https://vitrineautonoma.com.br/p/hn-replay — produto HN Replay, preço R$ 1.490
- [x] https://vitrineautonoma.com.br/termos — termos **AINDA** com "48 horas + 1 revisão" universal
- [x] https://vitrineautonoma.com.br/reembolso — reembolso **AINDA** com "revisão incluída"
- [x] https://vitrineautonoma.com.br/privacidade — privacidade genérica; uso de IA sem distinção por categoria
- [x] https://helberrrr.github.io/GPT.-Aposentadoria/ — demonstração HN Replay

**Limite:** o serviço respondeu aos testes de leitura; isso não valida checkout, assinatura de webhook, persistência, fluxo ZIP, entrega após pagamento, estorno, disponibilidade por dias, p95/p99 ou capacidade de 100 usuários.

## 2. Regras de segurança do teste

**Proibido** iniciar carga em \`https://vitrineautonoma.com.br\`, em seu Cloudflare Tunnel real, Stripe live, GitHub Pages ou no servidor Node que atende clientes. Nem mesmo com autorização comercial genérica: isso poderia prejudicar pedidos, gerar taxas e provocar bloqueios Cloudflare/Stripe.

**Ambiente correto:** cópia isolada do servidor \`app\` no próprio PC ou em máquina de homologação, porta **3001** (não 3000), **SQLite separado**, pasta de produtos/dados fictícios, sem DNS real, túnel de produção ou credenciais live. Os testes de pagamentos usam **Stripe TEST**, com eventos e cartão de teste da documentação oficial, em ambiente que não mistura eventos com pedidos reais.

Regra de infraestrutura: não usar tokens, certificados, webhook secrets e IDs reais em scripts versionados. Nunca enviar informações pessoais para log ou terminal.

## 3. Matriz de teste (por etapa, de menor para maior risco)

| ID | Ambiente | Teste | Aceite mínimo |
|---|---|---|---|
| SM-01 | produção, GET leve | Abertura de home/produto/termos/reembolso/privacidade/demo | 200 e texto esperado. **Executado: páginas acessíveis** |
| SM-02 | produção, 1 sessão read-only | Formulário HN Replay renderiza, sem POST/checkout | Preço, campos, aviso de licença corretos. **Já observado em inspeção anterior, não nesta rodada** |
| LG-01 | staging | HN Replay não herda SLA de 48h/1 revisão/geração IA | Passa |
| LG-02 | staging | Produto sob demanda mantém seu próprio prazo/revisão conforme sua oferta | Passa |
| LG-03 | staging | Snapshot do pedido preserva versão/termos aceitos | Passa mesmo após atualizar catálogo |
| LG-04 | staging | /reembolso é consistente para produto sem revisão | Passa |
| LG-05 | staging | Política de privacidade reflete finalidade e dados reais por produto | Passa |
| OR-01 | staging | Simular novo pedido de HN Replay e falha/atraso do pagamento | Nunca libera ZIP a pedido sem pagamento |
| OR-02 | staging | Confirmar pagamento em **Stripe TEST** e emitir webhook assinado | Pedido vai para pago e ZIP disponível uma vez |
| OR-03 | staging | Reenviar o mesmo webhook | Idempotência: sem duplicação |
| OR-04 | staging | Webhook com assinatura inválida | Recusa com segurança |
| OR-05 | staging | Produto indisponível/ZIP ausente | Sem entrega vazia; cliente vê status correto |
| OR-06 | staging | Reembolso em Stripe TEST | Registro coerente, sem promessa antes de confirmação |
| AC-01 | staging | Acesso de cliente A ao pedido de B | Negado |
| AC-02 | staging | Tentativas de path traversal no arquivo de entrega | Negado |
| AC-03 | staging | Dados pessoais ou segredos em logs | Nenhuma exposição |
| AP-01 | staging local | 5, 25, 50 e **100 usuários virtuais**, GET em URLs públicas | Sem travamento; p95, taxa de erro, timeout medidos |
| AP-02 | staging local | Repetição e estabilidade 10-15 minutos (iniciar só após AP-01) | Sem vazamento de memória ou degradação acentuada |
| CF-01 | staging local | Interromper/reiniciar processo de staging Node | Serviço se recupera sem duplicar processos |
| CF-02 | staging tunnel isolado | Interromper/reconectar túnel **de teste**, nunca \`automaton\` real | Reconexão sem afetar loja pública |
| CF-03 | staging | Reinício durante pedido simulado | Estado preservado, sem dupla entrega |
| BK-01 | staging | Backup e rollback | Recuperação testada, sem perder pedido validado |
| PR-01 | produção após release | Smoke GET + compra apenas via fluxo previamente acordado e seguro | Verificar páginas sem gasto real; não executar compra real não autorizada |

**Aceite sugerido de performance para homologação inicial:** p95 GET inferior a 2 s em LAN, erro 5xx = 0, timeout = 0 durante ramp-up 5→25→50→100. Isto é **meta**, não benchmark garantido. Para servidor local/Cloudflare, latência de internet/túnel deverá ser medida separadamente com tráfego de teste proporcional, não 100 simultâneos no host real.

## 4. Como rodar a carga local sem atingir produção

Foi adicionado \`scripts/stress-vitrine-staging.mjs\` neste repositório de documentação. É um **harness de leitura somente GET**; recusa automaticamente qualquer alvo diferente de loopback em porta que NÃO seja 3000 e exige a confirmação \`CONFIRM_STAGING=1\`. O script não executa checkout, não grava cliente, não dispara Stripe e não acessa o túnel real.

### Pré-requisitos (time de implementação)
1. Clonar/copie a **loja de produção** para diretório de homologação.
2. Configurar \`PORT=3001\`, \`PUBLIC_SITE_URL=http://127.0.0.1:3001\`, \`MODE=test\` (ou modo seguro equivalente) **e dados de testes isolados**. Verificar as variáveis conforme o código real — não presumir que a aplicação usa exatamente esses nomes.
3. Inicializar banco de testes sem copiar informações pessoais de pedidos reais; substituir dados sensíveis por fixtures falsas.
4. Subir o staging; verificar \`http://127.0.0.1:3001/saude\` e página do HN Replay. Corrigir respostas antes de rodar carga.
5. Abrir outro terminal no PC e executar:
\`\`\`powershell
$env:CONFIRM_STAGING="1"
node scripts/stress-vitrine-staging.mjs --base http://127.0.0.1:3001 --vus 5 --requests 10
node scripts/stress-vitrine-staging.mjs --base http://127.0.0.1:3001 --vus 25 --requests 10
node scripts/stress-vitrine-staging.mjs --base http://127.0.0.1:3001 --vus 50 --requests 10
node scripts/stress-vitrine-staging.mjs --base http://127.0.0.1:3001 --vus 100 --requests 10
\`\`\`
**Atenção:** os testes progressivos equivalem a 50, 250, 500 e 1.000 requisições GET contra a réplica LOCAL, não 100 compras/usuários reais. Guardar relatórios stdout em arquivo interno sem PII. Se o teste 5/25 falhar, não avançar a 50/100.

### Condições de interrupção
- A qualquer 5xx, erros de rede/timeouts ou erros de segurança, pausar ramp-up e inspecionar logs.
- p95 acima da meta, CPU/RAM saturadas, SQLite locked ou reinícios involuntários impedem promoção a produção.
- Não desativar WAF, rate limits, proteção anti-bot ou segurança da Stripe para "melhorar o benchmark".
- Executar eventual carga com endpoints de **escrita/pedidos** somente em staging isolado, com limites e autorização técnicos específicos; este script só usa GET.

## 5. Stripe TEST (não pode ser substituído por simulação de frontend)

Usar documentação oficial atual da Stripe para sessões de teste e webhooks. Critérios:
- [ ] \`sk_test_\` e secret de webhook de **ambiente de teste**, fora do repositório.
- [ ] Simular pagamento bem-sucedido/negado; só uma compra de teste gera artefato, nunca receita real.
- [ ] Reconhecer \`checkout.session.completed\`/evento apropriado **com confirmação válida de pagamento** — não só retorno do usuário à página.
- [ ] Validar assinatura do webhook sobre o corpo bruto, valor/moeda, vínculo ao pedido e idempotência.
- [ ] Reenviar eventos, variar ordem, simular desconexão, testar entrega/reembolso.
- [ ] Separar todos os registros e IDs de TEST e LIVE; dados de teste não contam como venda.
- [ ] Nunca cobrar a conta/cartão real do dono para "confirmar" fluxo sem necessidade.

**Sem acesso ao ambiente Stripe TEST e ao checkout staging, os itens OR-02/OR-06 permanecem PENDENTES.**

## 6. Cloudflare Tunnel (apenas replica isolada)

O túnel \`automaton\` real mapeia produção. Não derrubar/reconfigurar. Testar a lógica de \`killTree()\`, reinício do processo e reconexão primeiro em processos filhos fictícios/local, depois em túnel de homologação **com nome e credenciais próprios**, sem DNS público da loja. Inspecionar porta 3000 ocupada e garantir que o processo novo escute na porta 3001 da réplica. A atualização "28" era mencionada como ainda pendente na documentação de 08/11/2026; verificar se foi de fato aplicada antes de classificar "corrigido".

## 7. Relatório obrigatório após implementação

Criar \`RELATORIO_TESTES_VITRINE_<DATA>.md\` no repositório **privado** de código ou anexo do processo de deploy contendo:
- hash do commit em staging e em produção, ambiente, número da versão, versão Node;
- cenários rodados (ID), status PASS/FAIL/BLOCKED e evidência sanitizada;
- métricas 5/25/50/100 (p50/p95/p99, 2xx/4xx/5xx, timeout, RPS, CPU/RAM) e duração;
- Stripe modo test: IDs sintéticos/test de eventos, webhook assinado, retries, ZIP, reembolso (sem segredos);
- túnel de homologação: reinício, porta livre, nenhuma interferência em produção;
- incidentes e correções versionadas; autorização, backup, plano rollback;
- **se não for possível testar, documentar "BLOQUEADO" com motivo**. Nunca preencher PASS por inferência.

## 8. Estado e próximos passos após esta documentação

**PASS:** seis páginas GET publicamente acessíveis, identificada inconsistência de termos.  
**TESTES SIMULADOS DE AGENTE (outro escopo):** 26 cenários, 5.000 interações em memória; isso não mede a infraestrutura.  
**BLOQUEADO/pendente:** carga simultânea em staging real, testes Stripe TEST ponta a ponta, Cloudflare em staging isolado e verificação de entrega/reembolso real.

**O que enviar ao agente técnico que administra o PC:** "Leia [VITRINE_REGRAS_PRODUTOS.md](VITRINE_REGRAS_PRODUTOS.md) e este arquivo; aplique as regras independentes por produto no servidor local, prepare staging isolado e execute a matriz de testes. Registre PASS/FAIL/BLOCKED sem tocar no túnel de produção ou Stripe live. Não publique correção sem testes e rollback."

## 9. Cuidados jurídicos
CDC: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm  
Comércio eletrônico: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm  
Direitos dos titulares (ANPD): https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
