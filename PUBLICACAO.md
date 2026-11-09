# Publicação da demonstração (GitHub Pages)

Registro de como a demonstração do HN Replay foi publicada e testada.

## Endereço público

https://helberrrr.github.io/GPT.-Aposentadoria/

## Configuração

- Fonte: **Deploy from a branch**
- Branch: `main`
- Pasta: `/docs` (arquivo principal: `docs/index.html`)
- Custo: R$ 0 (GitHub Pages gratuito; nenhum serviço pago contratado)
- Data: 08/11/2026. O primeiro build levou cerca de 2 minutos (até lá a URL respondeu 404).

A configuração foi feita em **Settings → Pages**, pela interface do GitHub. Nenhum arquivo existente foi apagado ou alterado, e o pacote comercial completo não está neste repositório.

## Testes realizados

| Teste | Resultado |
|---|---|
| Página abre na URL pública | OK |
| Miniaturas (5 vídeos) | Carregam na página publicada |
| Pesquisa | "karpathy" → 1 resultado; "linear" → 1; termo sem resultado → "Nenhum vídeo encontrado" |
| Reprodução | O clique na miniatura abre o modal com o player incorporado (youtube-nocookie) e o vídeo começa a tocar; fecha com Esc e no botão ×. Verificado no Chrome com o vídeo do Karpathy; os outros 4 usam o mesmo código |
| Desktop 1366 px, tablet 768 px, celular 390 px (iPhone 13) | Sem rolagem horizontal; 5 cards; pesquisa e player funcionam. Emulação feita sobre o mesmo `docs/index.html`, em cópia local |

Limites do teste: não foi visto em celular físico, e a emulação não carrega as miniaturas do YouTube (verificadas só na página publicada).

## Atualizar a página

Qualquer commit em `main` que altere `docs/` republica automaticamente (aba **Actions** → *pages build and deployment*).

## Observações

- Os vídeos, as miniaturas e as marcas pertencem aos respectivos titulares. Não há afiliação com YouTube, Hacker News ou HackerTube (ver `README.md`).
- Este projeto não inclui domínio, audiência verificada nem receita.
