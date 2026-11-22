import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
const base='http://127.0.0.1:8177/';
try{
for(const [width,height] of [[320,700],[390,844],[768,1024],[1440,1000]]){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'#mythical-beasts-legends',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('r-beasts')?.checked,{timeout:15000});
  const room=page.locator('.beasts.realm-route');
  const forge=room.locator('#beasts-story-forge');
  if(!await forge.isVisible())throw Error('Story Forge not visible at '+width);
  if(await forge.locator('[data-story-creature]').count()!==5)throw Error('Missing legendary creature choices');
  if(await forge.locator('[data-story-place]').count()!==3)throw Error('Missing environment choices');
  if(await forge.locator('.story-sources a').count()!==5)throw Error('Missing museum references');
  const select=async (kind,name)=>{
    await forge.locator('[data-story-'+kind+'="'+name+'"]').click();
    if(await forge.locator('.story-choice[aria-pressed="true"]').count()!==2)
      throw Error('Exactly one creature and setting must be selected');
  };
  await select('creature','griffin');
  await select('place','shore');
  if(!/Griffin · Moonlit Shore/.test(await forge.locator('#story-spark-title').innerText()))
    throw Error('Story title not updated');
  if(!/tide carries a map/.test(await forge.locator('#story-spark-text').innerText()))
    throw Error('Story content did not update');
  await select('creature','phoenix');
  await select('place','stars');
  if(!/missing constellation/.test(await forge.locator('#story-spark-text').innerText()))
    throw Error('Story setting text incorrect');
  await forge.locator('.story-sources summary').click();
  if(!await forge.locator('.story-sources').evaluate(x=>x.open))throw Error('Source details not expandable');
  for(const a of await forge.locator('.story-sources a').all()){
    if(await a.getAttribute('rel')!=='noopener noreferrer')throw Error('Missing safe external source attributes');
  }
  await forge.locator('[data-story-creature="pegasus"]').focus();
  await page.keyboard.press('Enter');
  if(!/Pegasus/.test(await forge.locator('#story-spark-title').innerText()))throw Error('Keyboard choice failed');
  await forge.locator('#story-copy').click();
  const state=await forge.locator('#story-copy-status').innerText();
  if(!/copied|unavailable/i.test(state))throw Error('Clipboard status not communicated');
  if(await page.locator('.hub .hub-hit').count()!==6)throw Error('Locked Hub hotspots missing');
  if(await page.locator('#teHubVideo source').getAttribute('src')!=='assets/portal-hub-gemini-softloop.mp4')
    throw Error('Locked Hub animation modified');
  if(await page.locator('#library-living-legends .legend-entry').count()!==9)
    throw Error('Published Living Legends vanished');
  const overflow=await room.locator('.realm').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
  if(overflow.scroll>overflow.client+2)throw Error('Horizontal overflow '+width+' '+JSON.stringify(overflow));
  if(errors.length)throw Error('JS errors '+errors.join(' | '));
  if(width===390||width===1440)await page.screenshot({path:'qa-story-forge-'+width+'.png'});
  console.log('PASS Story Forge '+width+'x'+height+' 5 creatures, 3 settings, keyboard, sources, copy feedback and no regression');
  await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await page.goto(base+'#mythical-beasts-legends',{waitUntil:'domcontentloaded'});
if(!await page.locator('#beasts-story-forge').isVisible())throw Error('Reduced motion hid story room');
console.log('PASS reduced-motion Story Forge');
await page.close();
}finally{await browser.close();}
