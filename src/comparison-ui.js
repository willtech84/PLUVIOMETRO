import { buildComparisonView, comparisonChartData, MONTHS_PT } from './comparison-view-model.js';

export function createComparisonState(entries) {
  return { years: [], month: '', displayLimit: 100, result: buildComparisonView(entries, { years: [], month: null, displayLimit: 100 }) };
}

export function updateComparisonState(entries, state, patch) {
  const next = { ...state, ...patch };
  const month = next.month === '' ? null : Number(next.month);
  next.result = buildComparisonView(entries, { years: next.years, month, displayLimit: Number(next.displayLimit) || 100 });
  next.chart = comparisonChartData(next.result.rows);
  return next;
}

export function formatComparisonSummary(result) {
  return `${result.totalFiltered} registros encontrados${result.monthLabel ? ` em ${result.monthLabel}` : ''}; mostrando ${result.filtered.length} na amostra.`;
}

export { MONTHS_PT };
