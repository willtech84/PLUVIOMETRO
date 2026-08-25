import { describe,it,expect } from 'vitest';
import { buildComparisonView, comparisonChartData } from './comparison-view-model.js';
const data=[{id:'1',date:'2001-07-10',rain:20},{id:'2',date:'2001-07-20',rain:30},{id:'3',date:'2010-07-05',rain:50},{id:'4',date:'2025-07-01',rain:80},{id:'5',date:'2025-08-01',rain:10}];
describe('modelo de comparação',()=>{
 it('retorna somente o período selecionado e permite limite de amostragem',()=>{const r=buildComparisonView(data,{years:[2001,2010,2025],month:7,displayLimit:2});expect(r.totalFiltered).toBe(4);expect(r.filtered).toHaveLength(2);expect(r.rows.map(x=>x.rain)).toEqual([50,50,80]);});
 it('gera dados simples para gráfico',()=>expect(comparisonChartData([{year:2001,rain:50},{year:2025,rain:80}])).toEqual([{label:'2001',value:50},{label:'2025',value:80}]));
});
