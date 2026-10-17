'use strict';

const costRows=[...document.querySelectorAll('#cost-table tbody tr')];
const costButtons=[...document.querySelectorAll('[data-cost-mode]')];
const costBars=document.getElementById('cost-bars');
const costTotal=document.getElementById('cost-total');
const costRangeLabel=document.getElementById('cost-range-label');
const formatCost=new Intl.NumberFormat('es-AR',{maximumFractionDigits:0});
const chartMaximum=Math.max(...costRows.map(row=>Number(row.dataset.max)));

function renderCosts(mode){
  costButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.costMode===mode)));
  costBars.replaceChildren();
  let total=0;
  for(const row of costRows){
    const amount=Number(row.dataset[mode]);
    total+=amount;
    const item=document.createElement('div');item.className='cost-bar-item';
    const head=document.createElement('div');head.className='cost-bar-head';
    const label=document.createElement('span');label.textContent=row.querySelector('th').textContent;
    const value=document.createElement('strong');value.textContent='ARS '+formatCost.format(amount);
    head.append(label,value);
    const track=document.createElement('div');track.className='cost-bar-track';
    const fill=document.createElement('span');fill.style.width=(amount/chartMaximum*100)+'%';
    track.append(fill);item.append(head,track);costBars.append(item);
  }
  costTotal.textContent='ARS '+formatCost.format(total);
  costRangeLabel.textContent=`Extremo ${mode==='min'?'mínimo':'máximo'} · ${costRows.length} rubros`;
}

costButtons.forEach(button=>button.addEventListener('click',()=>renderCosts(button.dataset.costMode)));
renderCosts('min');
