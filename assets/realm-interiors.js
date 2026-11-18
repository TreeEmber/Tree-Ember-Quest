/* Living Tree Hub interiors: progressive enhancement only.
   No private records or third-party APIs. Approved hub video and hotspots untouched. */
(function(){
  function initRealms(){
    document.querySelectorAll('.realm label[for][role="button"]').forEach(function(label){
      label.addEventListener('keydown',function(event){
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          label.click();
        }
      });
    });
    // Keep internal book jumps within the current Living Library route. The
    // Hub's hash router only recognizes room hashes, not shelf anchor hashes.
    document.querySelectorAll('.library a[href^="#library-"]').forEach(function(book){
      book.addEventListener('click',function(event){
        var id=book.getAttribute('href').slice(1);
        var target=document.getElementById(id);
        if(!target)return;
        event.preventDefault();
        target.scrollIntoView({behavior:window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',
          block:'start'});
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
      });
    });
    var search=document.getElementById('living-archive-search');
    var list=document.getElementById('living-archive-results');
    var empty=document.getElementById('living-archive-empty');
    if(search&&list&&empty){
      var entries=Array.from(list.querySelectorAll('[data-realm-query]'));
      function filterShelf(){
        var q=search.value.trim().toLocaleLowerCase();
        var count=0;
        entries.forEach(function(entry){
          var haystack=(entry.textContent+' '+entry.getAttribute('data-realm-query')).toLocaleLowerCase();
          var show=(!q||haystack.includes(q));
          entry.hidden=!show;
          if(show)count++;
        });
        empty.hidden=count!==0;
        list.setAttribute('aria-label',count+' matching archive titles');
      }
      search.addEventListener('input',filterShelf);
      filterShelf();
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initRealms,{once:true});
  }else{
    initRealms();
  }
})();