import { describe, it, expect } from 'vitest';
import { parseCSV, parseBrazilianNumber, normalizeRainEntry } from './data-utils.js';

describe('compatibilidade de importação/exportação', () => {
  it('preserva chuva decimal e observação com vírgula', () => {
    const csv = 'id,date,time,rain,temp,phenomena,notes,location,uf\n"a1","2026-08-24","08:00","12.5","21.3","none","chuva forte, contínua","Mafra","SC"';
    const [row] = parseCSV(csv);
    const normalized = normalizeRainEntry(row);
    expect(normalized.error).toBeUndefined();
    expect(normalized.value.rain).toBe(12.5);
    expect(normalized.value.notes).toBe('chuva forte, contínua');
  });

  it('preserva formato brasileiro de milhar e decimal', () => {
    expect(parseBrazilianNumber('1.234,56')).toBe(1234.56);
    expect(parseBrazilianNumber('1234,56')).toBe(1234.56);
    expect(parseBrazilianNumber('1234.56')).toBe(1234.56);
  });
});
