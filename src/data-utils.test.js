import { getLocalDateTimeParts, parseBrazilianNumber, parseCSV, normalizeRainEntry } from './data-utils.js';

test('usa data e hora locais sem conversão UTC', () => {
  const result = getLocalDateTimeParts(new Date(2026, 7, 24, 23, 5));
  expect(result).toEqual({ date: '2026-08-24', time: '23:05' });
});

test('aceita números brasileiros', () => {
  expect(parseBrazilianNumber('12,5')).toBe(12.5);
  expect(parseBrazilianNumber('1.234,56')).toBe(1234.56);
  expect(parseBrazilianNumber('')).toBeNull();
});

test('lê CSV separado por ponto e vírgula', () => {
  const rows = parseCSV('date;rain;temp\n2026-08-24;12,5;21,3');
  expect(rows[0]).toEqual({ date: '2026-08-24', rain: '12,5', temp: '21,3' });
});

test('lê CSV com campo entre aspas', () => {
  const rows = parseCSV('date,rain,notes\n2026-08-24,10,"chuva forte, à noite"');
  expect(rows[0].notes).toBe('chuva forte, à noite');
});

test('valida uma leitura de chuva', () => {
  expect(normalizeRainEntry({ date: '2026-08-24', rain: '12,5', temp: '21,3' }).value.rain).toBe(12.5);
  expect(normalizeRainEntry({ date: '24/08/2026', rain: '10' }).error).toBe('Data inválida');
  expect(normalizeRainEntry({ date: '2026-08-24', rain: '-1' }).error).toBe('Volume de chuva inválido');
});
