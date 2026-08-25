import { describe,it,expect } from 'vitest';
import { filterEntries, compareMonthByYears, compareStats } from './comparison.js';
const data=[
 {id:'1',date:'2001-07-10',rain:20},{id:'2',date:'2001-07-20',rain:30},
 {id:'3',date:'2010-07-05',rain:50},{id:'4',date:'2025-07-01',rain:80},
 {id:'5',date:'2025-08-01',rain:10}
];
describe('filtros e comparações',()=>{
 it('filtra por ano e mês',()=>expect(filterEntries(data,{years:[2001],months:[7]})).toHaveLength(2));
 it('compara julho de anos diferentes',()=>expect(compareMonthByYears(data,7,[2001,2010,2025])).toEqual([
  {year:2001,month:7,rain:50,records:2},{year:2010,month:7,rain:50,records:1},{year:2025,month:7,rain:80,records:1}
 ]));
 it('calcula estatísticas por ano',()=>expect(compareStats(data,{months:[7]})).toEqual([
  {year:2001,rain:50,records:2,rainyDays:2},{year:2010,rain:50,records:1,rainyDays:1},{year:2025,rain:80,records:1,rainyDays:1}
 ]));
});
