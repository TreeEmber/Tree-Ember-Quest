'use strict';
(() => {
  const room=document.getElementById('library-living-legends');
  if(!room)return;
  const buttons=[...room.querySelectorAll('[data-legend-filter]')];
  const groups=[...room.querySelectorAll('[data-legend-collection]')];
  const status=room.querySelector('#legend-count');
  const search=room.querySelector('#legend-search');
  const empty=room.querySelector('#legend-empty');
  const valid=new Set(['all','waters','earth','birds']);
  const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
  // All searching is local and ephemeral; no network calls, accounts or storage.
  const indexed=groups.map(group=>({
    group,
    entries:[...group.querySelectorAll('.legend-entry')].map(entry=>({
      entry,
      searchable:normalize(entry.textContent)
    }))
  }));
  let category='all';
  function updateView() {
    const query=normalize(search.value);
    for(const button of buttons){
      button.setAttribute('aria-pressed',String(button.dataset.legendFilter===category));
    }
    let visible=0,notes=0;
    for(const {group,entries} of indexed){
      const chosen=category==='all'||group.dataset.legendCollection===category;
      let groupMatches=0;
      for(const {entry,searchable} of entries){
        const show=chosen&&(!query||searchable.includes(query));
        entry.hidden=!show;
        if(show)groupMatches++;
      }
      group.hidden=groupMatches===0;
      if(groupMatches){visible++;notes+=groupMatches;}
    }
    status.textContent='Showing '+notes+' field note'+(notes===1?'':'s')+' in '+visible+' collection'+(visible===1?'':'s')+'.';
    empty.hidden=notes!==0;
  }
  function selectCollection(next) {
    category=valid.has(next)?next:'all';
    updateView();
  }
  buttons.forEach(button=>button.addEventListener('click',()=>selectCollection(button.dataset.legendFilter)));
  search.addEventListener('input',updateView);
  search.addEventListener('search',updateView);
  // Keep Archive jumps inside the currently selected Library room.
  // The main Portal Hub owns route hashes; these should not replace them.
  room.closest('.library')?.querySelectorAll('#living-archive-results a[href^="#legend-"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const id=link.getAttribute('href').slice(1);
      const group=groups.find(section=>section.id===id);
      if(!group)return;
      event.preventDefault();
      // Archive navigation should always reveal the requested group,
      // even if a prior atlas search filtered it out.
      search.value='';
      selectCollection(group.dataset.legendCollection);
      group.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      group.setAttribute('tabindex','-1');
      group.focus({preventScroll:true});
    });
  });
  selectCollection('all');
})();
