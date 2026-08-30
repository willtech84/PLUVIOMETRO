/* PLUVIOMETRO — integração externa da Análise/Comparação.
 * Carregada sem modificar o index.html. Cria um botão e um painel independente.
 */
(() => {
  'use strict';
  const BUTTON_ID='pluv-analysis-button'; const PANEL_ID='pluv-analysis-panel';
  const MONTHS=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const read=()=>{ try { const raw=localStorage.getItem('pluviometro_entries')||localStorage.getItem('rainfallEntries'); const a=raw?JSON.parse(raw):[]; return Array.isArray(a)?a:[]; } catch { return []; } };
  const year=e=>Number(String(e.date||e.data||'').slice(0,4)); const month=e=>Number(String(e.date||e.data||'').slice(5,7)); const rain=e=>Number(String(e.rain??e.chuva??e.volume??0).replace(',','.'))||0;
  function render(){
    const entries=read(); let selectedMonth=new Date().getMonth()+1, selectedYears=[];
    const years=[...new Set(entries.map(year).filter(Boolean))].sort((a,b)=>b-a);
    if(!years.length) years.push(new Date().getFullYear()); selectedYears=[...years];
    const panel=document.createElement('div'); panel.id=PANEL_ID; panel.className='fixed inset-0 bg-slate-100 z-[99999] overflow-auto';
    panel.innerHTML=`
      <div class="sticky top-0 z-10 bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow">
        <h1 class="text-lg font-bold">📊 Análise / Comparação</h1>
        <button id="pluv-close" class="bg-white/15 active:scale-95 transition-transform px-4 py-2 rounded-lg text-sm font-bold">Fechar</button>
      </div>
      <div class="max-w-xl mx-auto p-4 space-y-4 pb-20">
        <div class="bg-white rounded-2xl shadow p-4 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">MÊS</label>
            <select id="pluv-month" class="w-full border border-slate-200 rounded-lg p-2.5 text-sm">
              ${MONTHS.map((m,i)=>`<option value="${i+1}" ${i+1===selectedMonth?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">ANOS <span class="font-normal text-slate-400">(toque para escolher)</span></label>
            <div id="pluv-years" class="flex flex-wrap gap-2">
              ${years.map(y=>`<button type="button" data-year="${y}" class="pluv-year-chip px-3 py-1.5 rounded-full text-sm font-bold border transition-colors bg-indigo-600 text-white border-indigo-600">${y}</button>`).join('')}
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">AMOSTRAGEM NA TELA</label>
            <select id="pluv-limit" class="w-full border border-slate-200 rounded-lg p-2.5 text-sm">
              <option>10</option><option>25</option><option>50</option><option selected>100</option><option>500</option><option value="999999">Todos</option>
            </select>
          </div>
        </div>
        <div id="pluv-summary"></div>
        <div id="pluv-chart" class="bg-white rounded-2xl shadow p-4"></div>
        <div id="pluv-table" class="bg-white rounded-2xl shadow p-4 overflow-auto"></div>
      </div>`;
    document.body.appendChild(panel);
    const toggleYear=(btn)=>{
      const y=Number(btn.dataset.year); const active=btn.classList.contains('bg-indigo-600');
      if(active){ btn.classList.remove('bg-indigo-600','text-white','border-indigo-600'); btn.classList.add('bg-white','text-slate-500','border-slate-200'); }
      else{ btn.classList.remove('bg-white','text-slate-500','border-slate-200'); btn.classList.add('bg-indigo-600','text-white','border-indigo-600'); }
      selectedYears = [...panel.querySelectorAll('.pluv-year-chip.bg-indigo-600')].map(b=>Number(b.dataset.year));
      update();
    };
    const update=()=>{
      selectedMonth=Number(document.getElementById('pluv-month').value); const limit=Number(document.getElementById('pluv-limit').value);
      const filtered=entries.filter(e=>month(e)===selectedMonth && (selectedYears.length===0 || selectedYears.includes(year(e))));
      const totals=new Map(selectedYears.map(y=>[y,0])); filtered.forEach(e=>totals.set(year(e),(totals.get(year(e))||0)+rain(e)));
      document.getElementById('pluv-summary').innerHTML=`<div class="text-sm font-bold text-slate-700 px-1">${filtered.length} registros encontrados — mostrando ${Math.min(filtered.length,limit)}</div>`;
      const max=Math.max(1,...totals.values());
      document.getElementById('pluv-chart').innerHTML=`<h2 class="font-bold text-slate-800 mb-3">Comparação — ${MONTHS[selectedMonth-1]}</h2><div class="flex items-end gap-3 h-56 border-b-2 border-slate-300 px-2">${[...totals].map(([y,v])=>`<div class="flex-1 text-center"><div class="text-xs font-bold mb-1">${v.toFixed(1)} mm</div><div class="bg-indigo-600 rounded-t-lg" style="height:${Math.max(3,v/max*190)}px"></div><div class="mt-2 text-xs font-bold text-slate-600">${y}</div></div>`).join('')}</div>`;
      const rows=filtered.slice(0,limit).map(e=>`<tr class="border-t border-slate-100"><td class="p-2">${e.date||e.data||''}</td><td class="p-2">${year(e)}</td><td class="p-2 text-right font-bold">${rain(e).toFixed(1)} mm</td></tr>`).join('');
      document.getElementById('pluv-table').innerHTML=`<h2 class="font-bold text-slate-800 mb-2">Registros filtrados</h2><table class="w-full text-sm"><thead><tr class="text-left text-slate-500"><th class="p-2 font-bold">Data</th><th class="p-2 font-bold">Ano</th><th class="p-2 font-bold text-right">Chuva</th></tr></thead><tbody>${rows||'<tr><td colspan="3" class="p-2 text-slate-400">Nenhum registro para os filtros selecionados.</td></tr>'}</tbody></table>`;
    };
    panel.querySelector('#pluv-close').onclick=()=>panel.remove();
    panel.querySelectorAll('.pluv-year-chip').forEach(b=>b.onclick=()=>toggleYear(b));
    panel.querySelectorAll('select').forEach(x=>x.onchange=update);
    update();
  }
  // Não cria mais botão flutuante global — expõe a função para o app React
  // chamar a partir de um botão fixo dentro da aba Ferramentas.
  window.PluvAnalysis = { open: render };
})();
