# Auditoria do Pluviometro Digital

## Status

Branch de trabalho: `correcao/auditoria-pluviometro`

A `main` permanece preservada.

## Correcoes aplicadas

- Utilitarios de data local, numeros brasileiros e CSV em `src/data-utils.js`.
- Testes unitarios iniciais em `src/data-utils.test.js`.
- Service Worker revisado para melhorar o cache offline e atualizar a versao do PWA.
- Google Apps Script revisado para validar payloads, rejeitar chuva invalida, eliminar duplicatas por ID inclusive dentro do mesmo lote e gravar lotes em uma unica operacao.

## Pontos ainda em integracao

- Integrar os utilitarios de dados ao `index.html` sem substituir o arquivo inteiro.
- Migrar gradualmente o armazenamento de registros para IndexedDB, preservando o `localStorage` existente durante a migracao.
- Substituir a regra de duplicidade baseada em `date + rain + time` por identificacao estavel por registro.
- Revisar a exibicao dos dados historicos simulados para impedir que sejam confundidos com dados medidos.
- Testar importacao com CSV brasileiro usando `;`, decimal com virgula, BOM e campos entre aspas.
- Testar backup, restauracao, PWA offline e atualizacao do Service Worker em navegador real.

## Regra de seguranca

Nenhuma alteracao desta auditoria deve apagar ou substituir silenciosamente registros existentes. Toda migracao deve ser reversivel e manter compatibilidade com os dados armazenados atualmente.
