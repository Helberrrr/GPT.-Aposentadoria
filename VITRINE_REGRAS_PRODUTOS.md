# Vitrine Autônoma — regras independentes por produto e correção dos termos (SPEC PARA IMPLEMENTAÇÃO)

**Status:** proposta técnica/jurídico-comercial **DOCUMENTADA; NÃO APLICADA NA LOJA**.  
**Revisão:** 2026-11-08. **Prioridade:** P0 — corrigir antes de ampliar divulgação.  
**Loja:** https://vitrineautonoma.com.br/  
**HN Replay:** https://vitrineautonoma.com.br/p/hn-replay  
**Demonstração:** https://helberrrr.github.io/GPT.-Aposentadoria/  
**Código em produção:** PC do titular, Node.js/SQLite e Cloudflare Tunnel, conforme [VITRINE_E_TUNEL.md](VITRINE_E_TUNEL.md). Este repositório público guarda **documentos**, não o servidor privado nem suas credenciais.

## 1. Decisão de arquitetura: UM marketplace/catálogo, VÁRIOS produtos independentes

A Vitrine Autônoma é a **plataforma de checkout, pagamento, pedidos, entrega e suporte** para vários produtos distintos. Não é um produto único com entregas intercambiáveis. Cada item é uma **oferta contratual própria**, sujeita a seus próprios requisitos de entrada, preço, SLA, licença, tipo de entrega e possibilidade de revisão.

**Não** presumir que comprar o produto A concede o produto B, nem que a regra comercial do A passa ao B. Isso não elimina a responsabilidade da mesma empresa fornecedora nem direitos legais de qualquer cliente: direitos do CDC, canais de atendimento, segurança, privacidade/LGPD e demais deveres legais continuam aplicáveis à plataforma como um todo.

**Ordem de aplicação obrigatória:**
1. **Lei aplicável e direitos irrenunciáveis** do consumidor e titular de dados (sempre prevalecem).
2. **Oferta específica do produto e versão aceita no checkout**: componentes, prazo, licença, dependências, revisão e limites. A oferta apresentada ao público vincula o fornecedor — nunca prometer algo diferente do que será entregue.
3. **Termos gerais da plataforma:** identidade do fornecedor, checkout, pagamentos, prevenção de fraude, canais de contato, direitos gerais e mecanismos de solução.
4. Políticas operacionais internas e orientações de agentes, desde que não contrariem os itens anteriores.

Não usar o enunciado "a página específica sempre prevalece" para restringir direitos legais ou mudar retroativamente contratos. Em conflito ou ambiguidade sobre pedido antigo, preservar a evidência da oferta que o cliente de fato aceitou, apurar o caso e consultar o responsável jurídico.

## 2. Defeito específico encontrado na Vitrine (reproduzido em 08/11/2026)

### Hoje, /termos diz, de forma genérica:
- Conteúdo feito por inteligência artificial a partir de material enviado pelo cliente.
- **Prazo de até 48 horas.**
- **Uma revisão incluída.**

### Mas /p/hn-replay promete:
- Código HTML/CSS/JS, com **5 vídeos de exemplo** + guia para GitHub Pages.
- **Pagamento único de R$ 1.490,00**; cópia **não exclusiva**.
- **Download do ZIP no link seguro do pedido após confirmação de pagamento** — não é produção sob demanda em 48h.
- Não solicita briefing/material; basta os dados essenciais ao pedido.
- **Sem suporte de personalização e sem revisão criativa.**
- Não inclui domínio/hospedagem/receita/audiência/direitos de vídeos de terceiros.
- Reembolso divulgado em até sete dias, respeitados os direitos aplicáveis.

**Problema:** quem lê os termos gerais antes de pagar pode entender que HN Replay inclui revisão, IA, 48 horas e entrega feita sob demanda. Além de atrito comercial, pode aumentar disputas e risco de descumprimento da oferta.

### Outro conflito: /reembolso
Hoje o texto diz "se a entrega não corresponder ... peça a revisão incluída ou o reembolso"; esta formulação é inadequada para itens com **zero revisões**, como HN Replay. Os meios de reembolso e atendimento devem funcionar também para produtos estáticos. A política de sete dias e outros direitos aplicáveis não devem ser suprimidos por ser conteúdo digital.

### Outro conflito: /privacidade
A página atual fala genericamente de material enviado e de provedor de IA. Em **HN Replay** o processamento de material do cliente por IA não integra a entrega. A declaração deve ser condicional por categoria, distinguir Stripe e não afirmar retenção/exclusão integral de todos os registros em 90 dias quando existirem obrigações legais/fiscais de conservação.

## 3. Texto proposto para alterar /termos

> ### Produtos e regras específicas
> A Vitrine Autônoma é uma plataforma que reúne **produtos e serviços independentes**, cada qual com características e condições próprias. A compra de um item não inclui outros produtos do catálogo.
>
> Antes do pagamento, a página de cada produto e o resumo do pedido informam preço, o que está incluído, dados necessários, entrega, prazos, possibilidade de revisão, licença e limitações. **As condições específicas exibidas e aceitas no momento da compra integram a oferta daquele produto.**
>
> ### Formas de entrega
> Alguns produtos são serviços sob demanda, que podem exigir material do cliente, utilizar inteligência artificial, prever prazo de produção e incluir revisões **quando isso for expressamente indicado na oferta**. Outros são produtos digitais prontos, com entrega automatizada de arquivos depois de verificado o pagamento, sem revisão ou personalização. **Não existe prazo ou quantidade de revisões universal para todo o catálogo.**
>
> ### Reembolso e atendimento
> Aplicam-se a todos os pedidos os direitos previstos na legislação e nossa Política de Reembolso e Cancelamento. A inexistência de revisão no produto não impede atendimento, correção de falhas de entrega nem exercício dos direitos de reembolso aplicáveis.
>
> ### Vigência
> Para esclarecimento de pedidos anteriores, são preservadas a versão dos termos gerais e a oferta específica apresentadas no momento da contratação. Mudanças posteriores não reduzem retroativamente direitos já constituídos.

**Implementação:** substituir os parágrafos universais dos atuais itens "Como é produzido" e "Prazo e entrega" por esses textos. Manter ou harmonizar os demais itens de pagamento, propriedade de material, responsabilidade, contato e proteção ao consumidor. Assegurar identidade/contato do fornecedor em local ostensivo.

## 4. Texto específico HN Replay — não reutilizar no restante do catálogo

> **HN Replay — licença de código-fonte não exclusiva**
>
> Você adquire uma **cópia não exclusiva** do código-fonte de um site estático de curadoria de vídeos, fornecido em ZIP, com estrutura HTML/CSS/JavaScript, cinco vídeos de exemplo e guia de publicação no GitHub Pages.
>
> **Entrega:** download no link seguro do pedido **assim que o sistema registrar e confirmar o pagamento**. Em caso de falha técnica, o cliente pode usar o canal de atendimento e as opções de reembolso previstas na política aplicável. Não declarar "entrega concluída" antes de registrar o arquivo disponível.
>
> **Não inclui:** domínio, contratação de hospedagem, dados de tráfego, faturamento, base de clientes, exclusividade do código, customizações sob demanda, revisão criativa, suporte técnico contínuo ou direitos sobre vídeos/miniaturas/marcas de terceiros.
>
> **Uso de terceiros:** o comprador deve respeitar licenças e direitos aplicáveis ao incorporar conteúdo de terceiros. HN Replay não é afiliado ao YouTube, Hacker News ou HackerTube.
>
> **Preço:** preço indicado na página do produto e confirmado no checkout (em 08/11/2026: R$ 1.490,00, pagamento único).
>
> **Arrependimento/reembolso:** conforme Política de Reembolso da Vitrine e direitos previstos no CDC. A entrega de um ZIP não constitui renúncia automática a direitos legais.

**Não anunciar 35 vídeos, importador Python ou outro componente** sem comparar e validar o ZIP efetivamente entregue. Não chamar a compra de "aquisição do negócio completo" ou "propriedade exclusiva da plataforma". Se o ZIP só contém 5 vídeos, é isso que se deve vender.

## 5. Texto proposto para alterar /reembolso

> **Arrependimento:** o consumidor pode exercer o direito legal de arrependimento no prazo aplicável em compras online, inclusive quando o produto digital já tiver sido disponibilizado, ressalvadas situações que dependam de análise jurídica específica. Não acrescentar cláusulas de renúncia automática ou condições ilegais.
>
> **Produto sem revisões:** alguns itens são arquivos digitais prontos, sem revisão ou personalização, mas a falta de revisão contratada **não elimina** o direito de correção de falhas, atendimento ou reembolso devido.
>
> **Produto com revisões:** se a oferta específica incluir revisão, esse recurso pode ser solicitado nos limites anunciados, sem prejudicar direitos legais.
>
> **Como solicitar:** pelo recurso disponível no link seguro do pedido ou pelo canal de atendimento divulgado na loja. O atendimento deve confirmar o recebimento da solicitação e informar o estado real do processamento do pagamento/reembolso. Nunca declarar reembolso concluído sem confirmação do processador.
>
> **Prazos e comprovantes:** divulgar somente prazos que o fluxo operacional possa cumprir e explicar que o crédito na fatura pode depender do banco/emissor. Se o prazo de "5 dias úteis" continuar divulgado, instrumentar um controle que o respeite e registre eventuais incidentes.

**Atenção:** o texto atual de /reembolso menciona solicitação por e-mail, enquanto a página HN Replay menciona autoatendimento pelo link do pedido. As duas opções devem ser verdadeiras e testadas, ou a comunicação deve ser alinhada ao mecanismo que existe de fato.

## 6. Orientação para /privacidade e LGPD

Criar **camadas**: aviso geral da Vitrine + informação adicional por categoria de produto. No HN Replay, informações do pedido incluem nome, e-mail e empresa opcional; não pedir material de trabalho para gerar o ZIP. Identificar finalidades e respectivas bases legais de tratamento **após análise jurídica concreta**, bem como operadores/fornecedores efetivamente utilizados; não inventar "consentimento obrigatório" para execução contratual. Stripe trata pagamentos; avaliar os papéis jurídicos dos agentes conforme contratos e orientações da ANPD.

- Guardar logs, comprovantes, versão da oferta/termos, horário de aceite, data do pagamento, entrega disponibilizada, solicitações e reembolsos com controle de acesso e prazos apropriados.
- Aplicar minimização, restrição de acesso, exclusão/anonimização conforme finalidade e retenção legal, segurança de tokens de pedido, proteção contra links de outro cliente, criptografia em trânsito e registros sem segredos.
- Não anunciar "dados apagados integralmente em 90 dias" se comprovantes fiscais/financeiros precisam sobreviver; explicar quais categorias são apagadas em 90 dias e quais ficam por obrigação legal, com período/critério.
- O vendedor_especialista3 não deve coletar CPF/Pix/cartão/senha nem inventar confirmação de pagamento, reembolso ou entrega.

Esta é uma especificação preventiva, **não um parecer jurídico nem certificação LGPD**.

## 7. Modelo de dados / execução no Node.js da loja

Definir, por produto/versionamento, campos como:

\`\`\`js
const products = {
  hn_replay: {
    offerVersion: 'hn-replay-2026-11-v1',
    productKind: 'static_digital_download',
    priceBRL: 1490,
    deliverAfterVerifiedPayment: true,
    delivery: { kind: 'zip', sourceDir: 'data/produtos/hn-replay' },
    requiredCustomerFields: ['name', 'email'],
    requiredMaterial: false,
    usesGenerativeAIForFulfillment: false,
    includedRevisions: 0,
    license: 'nonexclusive_source_code',
    support: 'delivery_failures_and_statutory_rights_only',
    productTermsUrl: '/p/hn-replay'
  },
  content_pack: {
    offerVersion: 'content-pack-current',
    productKind: 'made_to_order',
    requiredMaterial: true,
    usesGenerativeAIForFulfillment: true,
    delivery: { kind: 'generated', deadlineHours: 48 },
    includedRevisions: 1 // APENAS se a oferta vigente realmente anunciar 1
  }
};
\`\`\`

**Mecanismo obrigatório**: resolver \`policy = productPolicies[order.product_type]\` usando o tipo/código do próprio produto; nunca usar \`deadlineHours=48\` ou \`includedRevisions=1\` como fallback global silencioso.

**Snapshot imutável no pedido** (\`offer_snapshot\`): ID de produto, nome, preço, moeda, versão da oferta específica, versões dos termos gerais/reembolso/privacidade, prazo prometido, revisões, tipo de entrega, licença, canal/horário de aceitação. Evitar salvar PII redundante no snapshot. Não recalcular condições de pedido pago com o catálogo atual. A interface "Ver resumo/contrato" deve refletir o snapshot aceito.

**Webhook Stripe**: validar assinatura, valor, moeda, produto e ID de pedido; processar eventos idempotentemente; transicionar para "pago" somente com confirmação apropriada; disponibilizar ZIP apenas para pedido pago autenticado; não usar redirecionamento de checkout como prova de pagamento. Não expor caminhos de disco. Diferenciar "pago", "arquivo disponível", "download realizado" e "reembolso".

**Isolamento por produto**:
- \`hn_replay\`: liberar ZIP existente após confirmação; checar arquivo e integridade; revisões=0; nunca enviar para fila de IA/briefing; não gerar entrega de outro produto.
- \`content_pack\`: preencher briefing, produzir entrega conforme SLA específico e permitir 1 revisão apenas se prometida.
- Novos produtos: definição explícita de políticas e testes; não herdar regras de HN Replay nem de conteúdo.

## 8. Instruções para o responsável que vai alterar o código da loja

1. Localizar templates/rotas de \`/termos\`, \`/reembolso\`, \`/privacidade\`, \`/p/:slug\`, resumo do checkout e criação/entrega dos pedidos na aplicação **real** que roda no PC.
2. Salvar backup/versionamento; NÃO apagar banco SQLite, pedidos, logs de auditoria ou dados de cliente.
3. Introduzir \`productPolicies\` explícito e snapshots versionados; migrar com segurança sem reescrever contratos anteriores; se houver pedidos históricos, definir tratamento de exceções.
4. Reescrever os textos gerais para remover o universal "48 horas + 1 revisão + IA" e a revisão universal na política de reembolso.
5. Mostrar termos específicos e política de reembolso corretos na página/checkout do HN Replay, com link para textos gerais; não impor aceite enganoso nem ocultar limitações.
6. Ajustar /privacidade para **finalidades por produto**, refletindo integrações realmente utilizadas e retenções verificadas.
7. Garantir entrega e reembolso independente de novas vendas, mesmo quando o fornecedor de IA estiver indisponível.
8. Executar todos os testes de \`TESTES_STAGING_VITRINE.md\` em homologação, incluindo o fluxo Stripe de teste e 100 usuários virtuais **somente em ambiente isolado**.
9. Aplicar via mecanismo de atualização autorizado do PC, com testes, backup e rollback. Não usar deploy direto ou credenciais versionadas.
10. Inspecionar as páginas publicadas após o deploy e registrar evidência com data, revisão, testes, rollback e responsável.

## 9. Critérios de aceite — obrigação de demonstrar

- [ ] /termos informa expressamente que produtos são independentes e regras de entrega/revisão dependem da oferta.
- [ ] /reembolso não exige revisão inexistente para o HN Replay nem dificulta arrependimento.
- [ ] /privacidade reflete minimização no produto estático e tratamento de IA apenas onde ocorrer.
- [ ] A página HN Replay e checkout concordam em preço, 5 vídeos, zero revisão, download após pagamento validado, licença não exclusiva.
- [ ] Página de conteúdo sob demanda ainda preserva prazo/revisão efetivamente anunciados.
- [ ] Pedido antigo mantém snapshot original, sem mudança retroativa.
- [ ] Acesso a ZIP de pedido alheio é rejeitado; Stripe webhook repetido não duplica entrega/cobrança.
- [ ] Reclamações, incidentes, solicitações LGPD e reembolso possuem canal e evidência de processamento.
- [ ] Nenhuma ação de stress executada no host público de produção.
- [ ] Se um dos requisitos falhar, **não declarar "produção corrigida"**.

## 10. Referências oficiais para revisão jurídica

- Código de Defesa do Consumidor (arts. 30, 31, 46, 47 e 49): https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- Decreto 7.962/2013 (comércio eletrônico, transparência, atendimento e arrependimento): https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD — direitos dos titulares: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
- ANPD — guia de agentes de tratamento e encarregado: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/

**Revisão final por profissional jurídico qualificado recomendada**, principalmente nas cláusulas de licença do código, consumo digital, tributação e retenção de dados. Nenhum texto "blinda" a empresa de descumprir a legislação.
