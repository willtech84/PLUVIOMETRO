// Utilitários de dados da Fase 1 da auditoria.
// Mantidos em módulo separado para permitir testes antes da integração na interface.

export function getLocalDateTimeParts(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function parseBrazilianNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const normalized = String(value).trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

// Parser CSV RFC4180 simples, aceitando vírgula ou ponto e vírgula como separador.
export function parseCSV(text) {
  const source = String(text || '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!source.trim()) return [];

  const firstLine = source.split('\n')[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const separator = semicolonCount > commaCount ? ';' : ',';
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === separator && !quoted) {
      row.push(field.trim()); field = '';
    } else if (char === '\n' && !quoted) {
      row.push(field.trim()); field = '';
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  row.push(field.trim());
  if (row.some(cell => cell !== '')) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map(header => header.trim().toLowerCase());
  return rows.slice(1).map(cells => {
    const item = {};
    headers.forEach((header, index) => { item[header] = cells[index] ?? ''; });
    return item;
  });
}

export function normalizeRainEntry(raw) {
  const date = String(raw.date ?? '').trim();
  const rain = parseBrazilianNumber(raw.rain);
  const temp = parseBrazilianNumber(raw.temp);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'Data inválida' };
  if (rain === null || rain < 0) return { error: 'Volume de chuva inválido' };
  if (temp !== null && (temp < -80 || temp > 80)) return { error: 'Temperatura inválida' };
  return { value: { ...raw, date, rain, temp: temp ?? 0 } };
}
