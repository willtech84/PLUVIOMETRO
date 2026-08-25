import React, { useMemo, useState } from 'react';
import ComparisonPanel from './ComparisonPanel.jsx';

export function AnalysisEntryPoint({ entries = [] }) {
  const [open, setOpen] = useState(false);
  const count = useMemo(() => Array.isArray(entries) ? entries.length : 0, [entries]);
  return React.createElement(React.Fragment, null,
    React.createElement('button', {
      type: 'button',
      onClick: () => setOpen(true),
      className: 'bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold',
      'aria-label': `Abrir análise comparativa (${count} registros)`
    }, '📊 Análise / Comparação'),
    open ? React.createElement('div', { className: 'fixed inset-0 z-50 bg-slate-100 overflow-auto' },
      React.createElement('div', { className: 'max-w-6xl mx-auto p-4' },
        React.createElement('div', { className: 'flex justify-between items-center mb-4' },
          React.createElement('h1', { className: 'text-2xl font-bold' }, 'Análise pluviométrica'),
          React.createElement('button', { onClick: () => setOpen(false), className: 'px-4 py-2 rounded-lg bg-slate-800 text-white' }, 'Fechar')
        ),
        React.createElement(ComparisonPanel, { entries })
      )
    ) : null
  );
}
