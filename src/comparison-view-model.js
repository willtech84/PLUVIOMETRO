import { filterEntries, compareMonthByYears, compareStats, availableYears, availableMonths } from './comparison.js';

export const MONTHS_PT=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export function buildComparisonView(entries,{years=[],month=null,displayLimit=1000}={}){
  const selectedYears=years.map(Number).filter(Number.isFinite);
  const filtered=filterEntries(entries,{years:selectedYears,months:month?[Number(month)]:[]});
  const rows=month ? compareMonthByYears(entries,Number(month),selectedYears) : compareStats(entries,{years:selectedYears});
  return {rows,filtered:filtered.slice(0,Math.max(0,Number(displayLimit)||0)),totalFiltered:filtered.length,availableYears:availableYears(entries),availableMonths:availableMonths(entries),monthLabel:month?MONTHS_PT[Number(month)-1]:null};
}

export function comparisonChartData(rows){return rows.map(r=>({label:String(r.year),value:Number(r.rain)||0}));}
