# Filtros e comparações

A nova camada de análise permite filtrar a amostragem exibida sem alterar os dados armazenados.

## Filtros
- Ano: um ou vários anos.
- Mês: um ou vários meses.
- Intervalo de datas: opcional.
- A amostragem da tela deve usar os resultados filtrados, nunca simplesmente os últimos registros importados.

## Comparação
`compareMonthByYears(entries, month, years)` compara o acumulado de um mês específico entre anos selecionados. Exemplo: julho/2001 x julho/2010 x julho/2025.

A camada retorna chuva acumulada e quantidade de registros para alimentar gráficos.

## Visualização planejada
- barras por ano para volume de chuva;
- linha opcional para tendência;
- cartões com maior/menor volume e média;
- tabela detalhada abaixo do gráfico;
- seleção múltipla de anos e mês.

Os filtros são somente de visualização/análise: não alteram nem excluem registros.
