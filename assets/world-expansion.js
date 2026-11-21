/* Tree & Ember world map. Progressive enhancement only: all routes remain
   ordinary hash links/radio destinations and work without this script. */
(function(){
  'use strict';
  function init(){
    var menu=document.getElementById('tree-world-guide');
    if(!menu)return;
    var summary=menu.querySelector('summary');
    var radios=Array.from(document.querySelectorAll('input.state[name="r"]'));
    function activeRoute(){
      var checked=radios.find(function(r){return r.checked});
      return checked?checked.id:'r-gate';
    }
    function sync(){
      var id=activeRoute();
      var isIntro=id==='r-gate'||id==='r-walk';
      menu.hidden=isIntro;
      if(isIntro)menu.open=false;
      menu.querySelectorAll('a[href^="#"]').forEach(function(a){
        var match=a.getAttribute('href')===window.location.hash;
        if(match&&!isIntro)a.setAttribute('aria-current','page');
        else a.removeAttribute('aria-current');
      });
    }
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        menu.open=false;
        // Native hash routing handles radio selection; do not intercept links.
      });
    });
    menu.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&menu.open){
        menu.open=false;
        event.preventDefault();
        summary.focus();
      }
    });
    document.addEventListener('pointerdown',function(event){
      if(menu.open&&!menu.contains(event.target))menu.open=false;
    });
    radios.forEach(function(r){r.addEventListener('change',sync)});
    window.addEventListener('hashchange',sync);
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
