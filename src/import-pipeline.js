import { parseCSV, normalizeRainEntry, entryKey } from './data-utils.js';

export function prepareImport(csvText, existingEntries = [], location = {}) {
  const rows = parseCSV(csvText);
  const existingIds = new Set(existingEntries.map(e => String(e?.id || '')).filter(Boolean));
  const existingKeys = new Set(existingEntries.map(entryKey));
  const accepted=[]; const errors=[]; const batchIds=new Set(); const batchKeys=new Set();
  rows.forEach((row,index)=>{
    const normalized=normalizeRainEntry(row);
    if(normalized.error){ errors.push({line:index+2,error:normalized.error}); return; }
    const value=normalized.value;
    const id=String(value.id || `${value.date}-${value.time || '12:00'}-${value.rain}-${value.location || location.city || ''}-${value.uf || location.uf || ''}`);
    const candidate={...value,id,time:value.time || '12:00',phenomena:value.phenomena || 'none',notes:value.notes || '',location:value.location || location.city || '',uf:value.uf || location.uf || '',year:Number(value.date.slice(0,4)),month:Number(value.date.slice(5,7))};
    const key=entryKey(candidate);
    if(existingIds.has(id) || batchIds.has(id)){errors.push({line:index+2,error:'Registro duplicado por ID'});return;}
    if(existingKeys.has(key) || batchKeys.has(key)){errors.push({line:index+2,error:'Registro duplicado'});return;}
    existingIds.add(id);existingKeys.add(key);batchIds.add(id);batchKeys.add(key);accepted.push(candidate);
  });
  return {accepted,errors,total:rows.length};
}
