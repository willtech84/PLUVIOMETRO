// Filtros e comparações de chuva, independentes da interface.
export function filterEntries(entries, { years = [], months = [], from = '', to = '' } = {}) {
  const yearSet = new Set(years.map(Number));
  const monthSet = new Set(months.map(Number));
  return (entries || []).filter(e => {
    if (!e?.date) return false;
    const [y, m] = e.date.split('-').map(Number);
    if (yearSet.size && !yearSet.has(y)) return false;
    if (monthSet.size && !monthSet.has(m)) return false;
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    return true;
  });
}

export function monthlyTotals(entries) {
  const totals = new Map();
  (entries || []).forEach(e => {
    const rain = Number(e.rain);
    if (!e?.date || !Number.isFinite(rain)) return;
    const [year, month] = e.date.split('-').map(Number);
    const key = `${year}-${String(month).padStart(2,'0')}`;
    totals.set(key, (totals.get(key) || 0) + rain);
  });
  return [...totals.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([key, rain]) => {
    const [year, month] = key.split('-').map(Number);
    return { key, year, month, rain: Number(rain.toFixed(2)) };
  });
}

export function compareMonthByYears(entries, month, years) {
  const selected = filterEntries(entries, { months: [month], years });
  const yearSet = [...new Set(years.map(Number))];
  return yearSet.sort((a,b)=>a-b).map(year => {
    const rows = selected.filter(e => Number(e.date.slice(0,4)) === year);
    const rain = rows.reduce((sum,e)=>sum + (Number(e.rain)||0), 0);
    return { year, month: Number(month), rain: Number(rain.toFixed(2)), records: rows.length };
  });
}

export function compareStats(entries, { years = [], months = [] } = {}) {
  const filtered = filterEntries(entries, { years, months });
  const groups = new Map();
  filtered.forEach(e => {
    const year = Number(e.date.slice(0,4));
    const g = groups.get(year) || { year, rain: 0, records: 0, rainyDays: new Set() };
    g.rain += Number(e.rain)||0; g.records++; g.rainyDays.add(e.date); groups.set(year,g);
  });
  return [...groups.values()].sort((a,b)=>a.year-b.year).map(g=>({year:g.year,rain:Number(g.rain.toFixed(2)),records:g.records,rainyDays:g.rainyDays.size}));
}

export function availableYears(entries) { return [...new Set((entries||[]).map(e=>Number(e.date?.slice(0,4))).filter(Number.isFinite))].sort((a,b)=>b-a); }
export function availableMonths(entries) { return [...new Set((entries||[]).map(e=>Number(e.date?.slice(5,7))).filter(Number.isFinite))].sort((a,b)=>a-b); }
