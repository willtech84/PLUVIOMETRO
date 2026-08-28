# Tela de análise e comparação

## Filtros
- Ano: múltipla seleção.
- Mês: todos ou um mês específico.
- Período inicial/final para análises livres.
- Amostragem: 10, 25, 50, 100, 250, 500 ou todos.

## Regra de amostragem
O limite controla apenas quantas linhas são renderizadas na tabela. `totalFiltered` permanece o total real encontrado pelo filtro. Gráficos e totais usam todos os registros filtrados, nunca apenas a amostra visual.

## Comparação histórica
Ao escolher um mês e vários anos, cada ano vira uma série independente. O gráfico principal deve mostrar volume total em mm por ano; a tabela apresenta total, média, máximo, mínimo e dias com chuva.

## Exemplo
Julho de 2001, 2010 e 2025: três barras/ pontos independentes, permitindo comparar os volumes sem misturar registros de outros meses.
