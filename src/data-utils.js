// Utilitários de dados da Fase 1 da auditoria.

export function getLocalDateTimeParts(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return { date: `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}` };
}

export function parseBrazilianNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  let normalized = String(value).trim().replace(/\s/g, '');
  if (normalized.includes(',') && normalized.includes('.')) {
    normalized = normalized.lastIndexOf(',') > normalized.lastIndexOf('.') ? normalized.replace(/\./g, '').replace(',', '.') : normalized.replace(/,/g, '');
  } else if (normalized.includes(',')) normalized = normalized.replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function parseCSV(text) {
  const source = String(text || '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!source.trim()) return [];
  const firstLine = source.split('\n')[0];
  const separator = (firstLine.match(/;/g)||[]).length > (firstLine.match(/,/g)||[]).length ? ';' : ',';
  const rows=[]; let row=[], field='', quoted=false;
  for(let i=0;i<source.length;i+=1){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){field+='"';i+=1}else quoted=!quoted}else if(c===separator&&!quoted){row.push(field.trim());field=''}else if(c==='\n'&&!quoted){row.push(field.trim());if(row.some(Boolean))rows.push(row);row=[];field=''}else field+=c}
  row.push(field.trim());if(row.some(Boolean))rows.push(row);if(rows.length<2)return[];
  const headers=rows[0].map(h=>h.trim().toLowerCase());
  return rows.slice(1).map(cells=>Object.fromEntries(headers.map((h,i)=>[h,cells[i]??''])));
}

export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const [y,m,d]=String(value).split('-').map(Number); const dt=new Date(y,m-1,d);
  return dt.getFullYear()===y && dt.getMonth()===m-1 && dt.getDate()===d;
}

export function normalizeRainEntry(raw) {
  const date=String(raw.date??'').trim(), rain=parseBrazilianNumber(raw.rain), temp=parseBrazilianNumber(raw.temp);
  if(!isValidISODate(date)) return {error:'Data inválida'};
  if(rain===null||rain<0) return {error:'Volume de chuva inválido'};
  if(temp!==null&&(temp<-80||temp>80)) return {error:'Temperatura inválida'};
  return {value:{...raw,date,rain,temp:temp??0}};
}

export function entryKey(entry) {
  return [entry.date, entry.time || '', Number(entry.rain), entry.location || '', entry.uf || ''].join('|');
}

export function deduplicateEntries(entries) {
  const seenIds=new Set(), seenKeys=new Set();
  return (Array.isArray(entries)?entries:[]).filter(entry=>{
    if(!entry || !entry.id) return false;
    const id=String(entry.id), key=entryKey(entry);
    if(seenIds.has(id)||seenKeys.has(key)) return false;
    seenIds.add(id); seenKeys.add(key); return true;
  });
}
