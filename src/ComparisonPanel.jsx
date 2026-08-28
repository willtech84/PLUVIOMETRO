import React from 'react';
import { MONTHS_PT, createComparisonState, updateComparisonState } from './comparison-ui.js';

export default function ComparisonPanel({ entries }) {
  const [state, setState] = React.useState(() => createComparisonState(entries));
  const change = patch => setState(s => updateComparisonState(entries, s, patch));
  const result = state.result;
  const years = result.availableYears;

  return <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
    <div><h2 className="text-xl font-bold">Análise e comparação histórica</h2><p className="text-sm text-slate-500">Compare o mesmo mês entre vários anos sem alterar o histórico.</p></div>
    <div className="grid md:grid-cols-3 gap-3">
      <label className="text-sm">Mês<select className="mt-1 w-full border rounded-lg p-2" value={state.month} onChange={e=>change({month:e.target.value})}><option value="">Todos</option>{MONTHS_PT.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></label>
      <label className="text-sm">Anos<select multiple className="mt-1 w-full border rounded-lg p-2 h-28" value={state.years.map(String)} onChange={e=>change({years:Array.from(e.target.selectedOptions,x=>Number(x.value))})}>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
      <label className="text-sm">Amostragem da tabela<select className="mt-1 w-full border rounded-lg p-2" value={state.displayLimit} onChange={e=>change({displayLimit:Number(e.target.value)})}>{[10,25,50,100,250,500,1000].map(n=><option key={n} value={n}>{n}</option>)}<option value={999999}>Todos</option></select></label>
    </div>
    <div className="grid md:grid-cols-3 gap-3"><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Registros encontrados</span><strong className="block text-xl">{result.totalFiltered}</strong></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Exibidos</span><strong className="block text-xl">{result.filtered.length}</strong></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Período</span><strong className="block text-xl">{result.monthLabel || 'Todos os meses'}</strong></div></div>
    {state.chart?.length ? <div><h3 className="font-semibold mb-2">Volume de chuva por ano (mm)</h3><div className="flex items-end gap-4 h-56 border-b border-l p-4">{state.chart.map(x=>{const max=Math.max(...state.chart.map(y=>y.value),1);const height=Math.max(4,x.value/max*100);return <div key={x.label} className="flex-1 h-full flex flex-col justify-end items-center"><span className="text-xs mb-1">{x.value.toFixed(1)} mm</span><div className="w-full max-w-20 bg-blue-600 rounded-t" style={{height:`${height}%`}}/><span className="text-xs mt-1">{x.label}</span></div>})}</div></div>:null}
    <div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-100"><th className="p-2 text-left">Ano</th><th className="p-2 text-right">Chuva (mm)</th><th className="p-2 text-right">Registros</th><th className="p-2 text-right">Dias</th></tr></thead><tbody>{result.rows.map(r=><tr key={r.year} className="border-t"><td className="p-2">{r.year}</td><td className="p-2 text-right">{Number(r.rain||0).toFixed(1)}</td><td className="p-2 text-right">{r.count ?? '-'}</td><td className="p-2 text-right">{r.daysWithRain ?? '-'}</td></tr>)}</tbody></table></div>
    <p className="text-xs text-slate-500">A amostragem limita somente as linhas exibidas. Totais e gráficos usam todos os registros encontrados pelo filtro.</p>
  </section>;
}
