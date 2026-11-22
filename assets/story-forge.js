'use strict';
(() => {
  const root=document.getElementById('beasts-story-forge');
  if(!root)return;
  const creatures={
    dragon:{name:'Dragon',begin:'A dragon keeps watch over a promise older than the path.'},
    phoenix:{name:'Phoenix',begin:'A phoenix returns carrying a message no one thought could survive.'},
    pegasus:{name:'Pegasus',begin:'Pegasus refuses to fly until someone solves a forgotten riddle.'},
    unicorn:{name:'Unicorn',begin:'A unicorn appears only where a lost truth is about to be found.'},
    griffin:{name:'Griffin',begin:'A griffin guards a doorway that opens for questions instead of keys.'}
  };
  const places={
    forest:{name:'Lantern Forest',part:'Beneath the Lantern Forest, an old tree begins to glow from within. What does its light reveal, and who is watching?'},
    shore:{name:'Moonlit Shore',part:'Along the Moonlit Shore, the tide carries a map written in reflected stars. Who left it, and where does it lead?'},
    stars:{name:'Starlit Ridge',part:'High on Starlit Ridge, a missing constellation returns for just one night. What warning is hidden in its shape?'}
  };
  const title=root.querySelector('#story-spark-title');
  const result=root.querySelector('#story-spark-text');
  const status=root.querySelector('#story-copy-status');
  let creature='dragon',place='forest';
  const buttons=[...root.querySelectorAll('.story-choice')];
  function render(){
    for(const button of buttons){
      const selected=button.dataset.storyCreature===creature||button.dataset.storyPlace===place;
      button.setAttribute('aria-pressed',String(selected));
    }
    title.textContent=creatures[creature].name+' · '+places[place].name;
    result.textContent=creatures[creature].begin+' '+places[place].part;
    status.textContent='Original writing prompt. No writing is collected or saved.';
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.storyCreature)creature=button.dataset.storyCreature;
    if(button.dataset.storyPlace)place=button.dataset.storyPlace;
    render();
  }));
  root.querySelector('#story-copy').addEventListener('click',async()=>{
    const prompt=title.textContent+'\n\n'+result.textContent;
    try{
      if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prompt);
      status.textContent='Story spark copied to your clipboard.';
    }catch{
      status.textContent='Clipboard unavailable here. You can select and copy the prompt above instead.';
    }
  });
  render();
})();