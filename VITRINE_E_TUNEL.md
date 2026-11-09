# Vitrine Autônoma + túnel: como funciona e como religar

Registro operacional de 08/11/2026. **Não contém senhas, tokens, links de login nem IDs de conta.** Esses dados ficam só no PC e na conta Cloudflare.

## Visão geral

- A **Vitrine Autônoma** (https://vitrineautonoma.com.br) é uma loja Node.js (22+, SQLite, sem dependências) que roda **no PC do dono**, na porta 3000. Ela vende, cobra pelo Stripe, entrega pedidos e registra o financeiro sozinha.
- O PC não tem endereço público. Um **túnel do Cloudflare** (`cloudflared`) conecta a porta 3000 ao domínio, sem abrir porta no roteador.
- Se o PC estiver desligado, em repouso ou sem internet, a loja sai do ar e o Cloudflare mostra **"Error 1033"**.
- O **HN Replay (demonstração)** é independente disso: roda no GitHub Pages (ver `PUBLICACAO.md`).

```
cliente → vitrineautonoma.com.br → Cloudflare → túnel "automaton" → PC (localhost:3000, loja)
```

## Peças e onde ficam (pasta do projeto no PC)

| Peça | Onde | Para quê |
|---|---|---|
| Loja | `app\src\server.js` (`npm start`) | Site, pedidos, pagamentos, entrega |
| Script do túnel | `app\scripts\publico.js` | Abre o túnel, aponta o domínio e inicia a loja com o endereço público |
| Serviço permanente | `app\scripts\servico.js` (`npm.cmd run servico`) | Mantém loja + túnel no ar: reinicia sozinho após falha (espera crescente, limite por hora) e confere a saúde a cada 5 min |
| Estado do túnel | `app\data\tunel.json` | Guarda o domínio e o nome do túnel (`automaton`) |
| Registros | `app\data\servico.log`, `app\data\tunel.log` | Diagnóstico |
| Credenciais do túnel | pasta `.cloudflared` do usuário do Windows (`cert.pem` + `<id-do-túnel>.json`) | Autorizam o PC a abrir o túnel. **Nunca versionar nem compartilhar** |

## O que aconteceu em 08/11/2026 (Error 1033)

1. O `cloudflared` não estava mais instalado e a pasta `.cloudflared` estava vazia (nada de `cert.pem` nem credencial do túnel).
2. O servidor da loja subia normal; o que caía era o túnel (o `publico.js` encerrava com código 1).

## Como religar do zero (checklist)

1. **Instalar o `cloudflared`** (pacote oficial): `winget install --id Cloudflare.cloudflared`.
2. **Autorizar o PC na conta Cloudflare**: `cloudflared tunnel login`. Abre uma página do Cloudflare; escolha o domínio `vitrineautonoma.com.br` e toque em **Authorize**. Isso grava o `cert.pem`. (Pode ser feito pelo celular: abra o link que o comando mostra.)
3. **Credencial do túnel.** O script espera encontrar o arquivo `<id-do-túnel>.json`.
   - Túnel novo: o `publico.js` cria o túnel `automaton` sozinho.
   - Túnel `automaton` já existente no Cloudflare, mas sem o arquivo no PC (foi o caso): recriar o arquivo a partir do token do túnel, que o `cloudflared` fornece com o `cert.pem`:
     `cloudflared tunnel token automaton` devolve um texto em base64 com três campos (conta, ID do túnel e segredo). Montar o JSON `{"AccountTag":"…","TunnelSecret":"…","TunnelID":"…"}` e salvar como `<TunnelID>.json` na pasta `.cloudflared`. Não imprimir o token nem o conteúdo em logs. Não apagar o túnel antigo.
4. **Subir tudo**: na pasta `app`, `npm.cmd run servico` (ou `node scripts\servico.js` em segundo plano). Ele roda `publico.js vitrineautonoma.com.br`, que aponta o domínio ao túnel e inicia a loja.
5. **Conferir**: `curl.exe -s -o NUL -w "%{http_code}" https://vitrineautonoma.com.br/` deve devolver `200`, e `data\tunel.log` deve ter linhas "Registered tunnel connection".

## Diagnóstico rápido

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Cloudflare "Error 1033" | Túnel desconectado (PC desligado/repouso, `cloudflared` parado) | Subir o serviço (passo 4) |
| `publico.js` diz "cloudflared não encontrado" | Não instalado | Passo 1 |
| `publico.js` diz "Falta autorizar…" | Sem `cert.pem` | Passo 2 |
| `tunel.log`: "tunnel credentials file not found" | Falta o `<id>.json` | Passo 3 |
| `servico.log`: "loja parou (código 1)" em loop | Um dos itens acima | Rodar `node scripts\publico.js vitrineautonoma.com.br` direto e ler a mensagem |

## Operação 24/7 (regra do dono: se travar, fechar tudo e reabrir)

O `servico.js` já aplica a regra: a cada 5 minutos confere `https://vitrineautonoma.com.br/saude`; depois de **3 falhas seguidas** ele fecha a loja e o túnel e abre tudo de novo (espera crescente entre tentativas: 5 s, 10 s, 20 s… até 5 min; passando de 20 reinícios na hora, 15 min).

**Defeito encontrado (08/11/2026):** no Windows, o reinício usava `child.kill()`, que encerra só o processo principal. A loja e o túnel antigos podiam ficar pendurados, a porta 3000 continuava ocupada e a nova tentativa falhava em loop.
**Correção (atualização 28):** `killTree()` usa `taskkill /PID <pid> /T /F`, que fecha o processo e todos os filhos (loja + túnel) antes de reabrir. Também vale para o encerramento do serviço e para o reinício depois de uma atualização.

**Estado em 08/11/2026 22:35:** o pacote `automaton-sessao28.bundle` já está na pasta do projeto no PC, mas **ainda não foi aplicado**: o sistema de segurança bloqueou a troca remota do código e ela não foi forçada. Para aplicar:
- pelo painel da loja: botão **Aplicar atualização** (a senha do painel fica no arquivo `SENHA-PAINEL.txt` do PC), ou
- pelo PowerShell, na pasta `app`: `git pull --ff-only ..\automaton-sessao28.bundle main`, depois `npm.cmd test`; se passar, reiniciar o serviço. Para voltar atrás: `git reset --hard 1d1a6c5` (versão anterior à 27) ou o hash guardado em `data\update27-antes.txt`.

**Início automático ao ligar o PC:** `npm.cmd run instalar-servico` (na pasta `app`) cria a tarefa do Windows `VitrineAutonoma`, que abre a loja ao entrar no sistema (sem senha salva). Ainda **não foi executado**. Limite: se o PC desligar, entrar em repouso ou ficar sem internet, a loja sai do ar até ele voltar. Para não suspender: Configurações → Sistema → Energia → "Suspender" = Nunca (na tomada); essa mudança é do dono do PC.

## Limitações conhecidas

- **O PC precisa ficar ligado e sem repouso.** Enquanto `instalar-servico` não for executado, o serviço **não** sobe sozinho depois de reiniciar o Windows.
- Modo de operação real (Stripe em modo real). Alterações no código só entram pelo botão **"Aplicar atualização"** do painel (pull somente-avanço, testes e volta automática em caso de falha), nunca de forma remota automática.

## Produtos da Vitrine

| Produto | Preço | Entrega | Situação |
|---|---|---|---|
| Pacote de conteúdo (produto padrão) | a partir de R$ 49 (pacote inicial; o preço do pacote completo é definido pelo experimento ativo) | Gerado por IA e validado, em até 48 h | No ar |
| **HN Replay — código-fonte do site** | R$ 1.490 | **Automática**: o `.zip` do código aparece no link do pedido logo após o pagamento. Sem IA e sem custo | **No ar desde 08/11/2026** (atualização 27 aplicada; 85 testes passaram no PC). Página: `/p/hn-replay` |
| Canção da Família | R$ 39 | Letra por IA + música | Pronta no código; só publica com a chave do gerador de música, que ainda não existe |

### Como funciona o produto HN Replay na loja

- É um tipo de produto de **entrega estática** (`hn_replay`): sem modelo de IA, sem material do cliente (só nome e e-mail) e sem revisão do dono.
- Os arquivos entregues vêm da pasta `app\data\produtos\hn-replay` (hoje: `index.html` e `LEIA-ME.md`). O sistema empacota essa pasta em `hn-replay-pacote.zip` a cada pedido.
- A loja **só publica o produto se a pasta existir com `index.html`**, e se o arquivo sumir depois, o pedido pago vira "em análise" (reembolso pelo prazo), nunca uma entrega vazia.
- Convive com os outros produtos: o lançamento da Canção da Família não o aposenta.
- A venda é de **cópia não exclusiva** do código, e a página diz isso. Não inclui domínio, hospedagem, audiência, receita nem direitos de vídeos de terceiros.
- Ajustar o preço: variável `HN_REPLAY_PRICE` (em reais) no `.env`; desligar o lançamento: `LAUNCH_HN_REPLAY=false`.

## Atualizar a loja

1. O código novo chega como pacote git (`automaton-sessaoN.bundle`) na pasta do projeto.
2. No painel da loja (exige a senha do painel), o botão **Aplicar atualização** faz o pull, roda os testes e volta sozinho se algo falhar; o resultado fica em `data\atualizacao.log`.

## Registro de 08/11/2026

| Hora | Fato |
|---|---|
| ~21:50 | Vitrine fora do ar (Error 1033): `cloudflared` e credenciais ausentes no PC |
| ~22:00 | `cloudflared` reinstalado, PC autorizado no Cloudflare, credencial do túnel recriada, loja de volta (HTTP 200) |
| ~22:30 | Atualização 27 aplicada no PC (HN Replay a R$ 1.490); 85 testes passaram; loja reiniciada |
| 22:35 | Pacote 28 (reinício que fecha loja + túnel) enviado ao PC; aplicação pendente |

Pendências: aplicar o pacote 28; executar `instalar-servico`; decidir sobre o repouso do PC; compra de teste real do HN Replay (a entrega do `.zip` foi validada só nos testes automáticos).


## Implementar no PC — regras específicas por produto e teste seguro

A Vitrine é uma **plataforma multivenda**, e não um único serviço. **Documentação para alterar o servidor real:**
- [VITRINE_REGRAS_PRODUTOS.md](VITRINE_REGRAS_PRODUTOS.md) — regra de cada produto, correção de /termos, /reembolso, /privacidade, checkout e entrega.
- [TESTES_STAGING_VITRINE.md](TESTES_STAGING_VITRINE.md) — matriz de testes, Stripe TEST, Cloudflare Tunnel de homologação e 100 usuários virtuais.
- [scripts/stress-vitrine-staging.mjs](scripts/stress-vitrine-staging.mjs) — carga GET **somente em réplica local, nunca na porta 3000, Stripe LIVE ou túnel público**.

**Estado desta implementação:** documentação no GitHub; **nenhuma alteração automática aplicada ao servidor que roda no PC**. A inconsistência "48 horas + 1 revisão" nos termos universais permanece até a atualização da loja ser implantada e verificada. Não substituir histórico de pedidos/contratos nem prometer que produto está corrigido antes de testar.
