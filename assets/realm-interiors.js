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