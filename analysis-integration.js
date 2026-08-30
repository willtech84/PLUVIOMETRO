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
    const entries=read(); let selectedMonth=7, selectedYears=[];
    const years=[...new Set(entries.map(year).filter(Boolean))].sort((a,b)=>a-b);
    if(!years.length) years.push(new Date().getFullYear()); selectedYears=[...years];
    const panel=document.createElement('div'); panel.id=PANEL_ID; panel.style='position:fixed;inset:0;background:#f1f5f9;z-index:99999;overflow:auto;font-family:Arial,sans-serif;color:#0f172a';
    panel.innerHTML=`<div style="max-width:1100px;margin:auto;padding:24px"><div style="display:flex;justify-content:space-between;align-items:center"><h1 style="font-size:26px;margin:0">📊 Análise / Comparação</h1><button id="pluv-close" style="padding:10px 16px;border:0;border-radius:8px;background:#0f172a;color:white">Fechar</button></div><div style="background:white;padding:18px;border-radius:12px;margin-top:18px;box-shadow:0 1px 4px #cbd5e1"><label>Mês <select id="pluv-month" style="padding:8px;margin-right:20px">${MONTHS.map((m,i)=>`<option value="${i+1}" ${i+1===7?'selected':''}>${m}</option>`).join('')}</select></label><label>Anos (Ctrl+clique para vários) <select id="pluv-years" multiple size="5" style="vertical-align:middle;padding:5px">${years.map(y=>`<option value="${y}" selected>${y}</option>`).join('')}</select></label><label style="margin-left:20px">Amostragem <select id="pluv-limit" style="padding:8px"><option>10</option><option>25</option><option>50</option><option>100</option><option>500</option><option value="999999">Todos</option></select></label></div><div id="pluv-summary" style="margin-top:18px"></div><div id="pluv-chart" style="background:white;border-radius:12px;padding:18px;margin-top:18px"></div><div id="pluv-table" style="background:white;border-radius:12px;padding:18px;margin-top:18px"></div></div>`;
    document.body.appendChild(panel);
    const update=()=>{
      selectedMonth=Number(document.getElementById('pluv-month').value); selectedYears=[...document.getElementById('pluv-years').selectedOptions].map(o=>Number(o.value)); const limit=Number(document.getElementById('pluv-limit').value);
      const filtered=entries.filter(e=>month(e)===selectedMonth && (selectedYears.length===0 || selectedYears.includes(year(e))));
      const totals=new Map(selectedYears.map(y=>[y,0])); filtered.forEach(e=>totals.set(year(e),(totals.get(year(e))||0)+rain(e)));
      document.getElementById('pluv-summary').innerHTML=`<div style="font-size:18px;font-weight:700">${filtered.length} registros encontrados — mostrando ${Math.min(filtered.length,limit)}</div>`;
      const max=Math.max(1,...totals.values()); document.getElementById('pluv-chart').innerHTML=`<h2 style="margin-top:0">Comparação — ${MONTHS[selectedMonth-1]}</h2><div style="display:flex;gap:20px;align-items:end;height:300px;border-bottom:2px solid #334155;padding:20px">${[...totals].map(([y,v])=>`<div style="flex:1;text-align:center"><div style="font-weight:700;margin-bottom:6px">${v.toFixed(1)} mm</div><div style="height:${Math.max(3,v/max*220)}px;background:#2563eb;border-radius:6px 6px 0 0"></div><div style="margin-top:8px">${y}</div></div>`).join('')}</div>`;
      const rows=filtered.slice(0,limit).map(e=>`<tr><td style="padding:7px">${e.date||e.data||''}</td><td style="padding:7px">${year(e)}</td><td style="padding:7px;text-align:right">${rain(e).toFixed(1)} mm</td></tr>`).join(''); document.getElementById('pluv-table').innerHTML=`<h2>Registros filtrados</h2><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left">Data</th><th style="text-align:left">Ano</th><th style="text-align:right">Chuva</th></tr></thead><tbody>${rows||'<tr><td colspan="3">Nenhum registro para os filtros selecionados.</td></tr>'}</tbody></table>`;
    };
    panel.querySelector('#pluv-close').onclick=()=>panel.remove(); panel.querySelectorAll('select').forEach(x=>x.onchange=update); update();
  }
  // Não cria mais botão flutuante global — expõe a função para o app React
  // chamar a partir de um botão fixo dentro da aba Ferramentas.
  window.PluvAnalysis = { open: render };
})();
