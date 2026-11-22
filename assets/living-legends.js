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
  // The three existing Library shelf titles now deep-link to the atlas.
  window.addEventListener('hashchange',()=>{
    const requested=location.hash.slice(1);
    if(requested.startsWith('legend-')){
      const group=groups.find(element=>element.id===requested || element.querySelector('#'+CSS.escape(requested)));
      if(group) selectCollection(group.dataset.legendCollection);
    }
  });
  selectCollection('all');
})();
