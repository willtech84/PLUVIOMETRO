import { describe,it,expect } from 'vitest';
import { prepareImport } from './import-pipeline.js';

describe('pipeline de importação',()=>{
 it('aceita CSV brasileiro e rejeita duplicados',()=>{
   const csv='date;time;rain;temp\n2026-08-01;08:00;12,5;18,2\n2026-08-01;08:00;12,5;18,2';
   const r=prepareImport(csv,[]);
   expect(r.accepted).toHaveLength(1); expect(r.errors).toHaveLength(1); expect(r.accepted[0].rain).toBe(12.5);
 });
 it('não duplica registro já existente',()=>{
   const existing=[{id:'x',date:'2026-08-01',time:'08:00',rain:12.5,location:'Mafra',uf:'SC'}];
   const r=prepareImport('date,time,rain,location,uf\n2026-08-01,08:00,12.5,Mafra,SC',existing);
   expect(r.accepted).toHaveLength(0); expect(r.errors[0].error).toBe('Registro duplicado');
 });
});
