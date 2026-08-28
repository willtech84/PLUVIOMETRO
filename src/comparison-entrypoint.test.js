import { describe, it, expect } from 'vitest';
import { AnalysisEntryPoint } from './comparison-entrypoint.js';

describe('entrada da análise', () => {
  it('exporta o ponto de entrada do painel', () => {
    expect(typeof AnalysisEntryPoint).toBe('function');
  });
});
