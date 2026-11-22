'use strict';
(() => {
  const room=document.getElementById('library-living-legends');
  if(!room)return;
  const buttons=[...room.querySelectorAll('[data-legend-filter]')];
  const groups=[...room.querySelectorAll('[data-legend-collection]')];
  const status=room.querySelector('#legend-count');
  const valid=new Set(['all','waters','earth','birds']);
  function selectCollection(next) {
    const category=valid.has(next)?next:'all';
    for (const button of buttons) {
      button.setAttribute('aria-pressed',String(button.dataset.legendFilter===category));
    }
    let visible=0,notes=0;
    for(const group of groups){
      const show=category==='all'||group.dataset.legendCollection===category;
      group.hidden=!show;
      if(show){visible++;notes+=group.querySelectorAll('.legend-entry').length;}
    }
    status.textContent='Showing '+notes+' field note'+(notes===1?'':'s')+' in '+visible+' collection'+(visible===1?'':'s')+'.';
  }
  buttons.forEach(button=>button.addEventListener('click',()=>selectCollection(button.dataset.legendFilter)));
  // Keep Archive jumps inside the currently selected Library room.
  // The main Portal Hub owns route hashes; these should not replace them.
  room.closest('.library')?.querySelectorAll('#living-archive-results a[href^="#legend-"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const id=link.getAttribute('href').slice(1);
      const group=groups.find(section=>section.id===id);
      if(!group)return;
      event.preventDefault();
      selectCollection(group.dataset.legendCollection);
      group.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      group.setAttribute('tabindex','-1');
      group.focus({preventScroll:true});
    });
  });
  selectCollection('all');
})();
