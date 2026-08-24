# Plano de testes do PLUVIOMETRO

## Integridade dos dados
- [x] Data/hora local sem conversão UTC
- [x] Números decimais brasileiros
- [x] CSV com `;` e `,`
- [x] CSV com campos entre aspas
- [x] Data calendário inválida rejeitada
- [x] Chuva negativa rejeitada
- [x] Temperatura fora da faixa rejeitada
- [x] Duplicidade por ID e chave de leitura
- [x] Backup do último estado local

## Próximos testes de integração
- [ ] Importar a planilha histórica real do usuário
- [ ] Conferir totais mensal/anual antes e depois da importação
- [ ] Testar exportação e reimportação sem alteração dos valores
- [ ] Testar restauração após armazenamento corrompido
- [ ] Testar offline após atualização do PWA
- [ ] Testar sincronização com Google Sheets/Drive
- [ ] Testar atualização do service worker sem perder dados
