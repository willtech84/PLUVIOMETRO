import { describe, it, expect } from 'vitest';
import { createComparisonState, updateComparisonState, formatComparisonSummary } from './comparison-ui.js';

const entries=[
 {id:'1',date:'2001-07-10',rain:20},{id:'2',date:'2001-07-20',rain:30},
 {id:'3',date:'2010-07-05',rain:50},{id:'4',date:'2025-07-01',rain:80},
 {id:'5',date:'2025-08-01',rain:10}
];

describe('interface de comparação',()=>{
 it('atualiza filtro de julho e múltiplos anos',()=>{let s=createComparisonState(entries);s=updateComparisonState(entries,s,{years:[2001,2010,2025],month:7,displayLimit:2});expect(s.result.totalFiltered).toBe(4);expect(s.result.filtered).toHaveLength(2);expect(s.chart).toEqual([{label:'2001',value:50},{label:'2010',value:50},{label:'2025',value:80}]);});
 it('informa total real e amostra visual',()=>{const s=updateComparisonState(entries,createComparisonState(entries),{years:[2001],month:7,displayLimit:1});expect(formatComparisonSummary(s.result)).toContain('2 registros encontrados');expect(formatComparisonSummary(s.result)).toContain('mostrando 1');});
});
