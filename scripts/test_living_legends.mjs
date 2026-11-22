import {chromium} from 'playwright';

const base='http://127.0.0.1:8177/';
const browser=await chromium.launch({headless:true});
const widths=[[320,700],[390,844],[768,1024],[1440,1000]];
try{
  for(const [width,height] of widths){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#r-library')?.checked,{timeout:15000});
    const atlas=page.locator('#library-living-legends');
    if(!await atlas.isVisible())throw Error('Living Legends atlas not visible');
    if(await atlas.locator('details.legend-entry').count()!==9)throw Error('Lost any of nine field notes');
    if(await atlas.locator('.legend-source').count()!==9)throw Error('A field note is missing its evidence source');
    if(await page.locator('.hub .hub-hit').count()!==6)throw Error('Approved six-room Hub was modified');
    if(await page.locator('#teHubVideo source').getAttribute('src')!=='assets/portal-hub-gemini-softloop.mp4')
      throw Error('Approved Hub video reference changed');
    if(await page.locator('.library .realm-hero-scene img').getAttribute('src')!=='assets/living-library-room-storyboard.webp')
      throw Error('Approved Library artwork reference changed');
    const choose=async key=>{
      await atlas.locator('[data-legend-filter="'+key+'"]').click();
      const selected=await atlas.locator('[data-legend-filter][aria-pressed="true"]').count();
      if(selected!==1)throw Error('Multiple selected filters for '+key);
    };
    await choose('waters');
    if(await atlas.locator('.legend-collection:visible').count()!==1)throw Error('Waters filter did not hide two collections');
    if(!await atlas.locator('#legend-waters').isVisible())throw Error('Waters collection hidden');
    if(!/3 field notes? in 1 collection/.test(await atlas.locator('#legend-count').innerText()))throw Error('Waters live status inaccurate');
    await choose('earth');
    if(!await atlas.locator('#legend-earth').isVisible())throw Error('Earth collection hidden');
    await choose('birds');
    if(!await atlas.locator('#legend-birds').isVisible())throw Error('Birds collection hidden');
    const first=atlas.locator('#legend-cassowary');
    await first.locator('summary').click();
    if(!await first.evaluate(el=>el.open))throw Error('Native field note accordion failed');
    const link=first.locator('a.legend-source');
    if(await link.getAttribute('rel')!=='noopener noreferrer')throw Error('External source privacy attributes missing');
    await choose('all');
    if(await atlas.locator('.legend-collection:visible').count()!==3)throw Error('All collections not restored');
    const atlasSearch=atlas.locator('#legend-search');
    if(!await atlasSearch.isVisible())throw Error('No atlas search control');
    await atlasSearch.fill('cassowary');
    if(await atlas.locator('.legend-entry:visible').count()!==1 || !await atlas.locator('#legend-cassowary').isVisible())
      throw Error('Species search did not reveal just cassowary');
    if(!/1 field note in 1 collection/.test(await atlas.locator('#legend-count').innerText()))
      throw Error('Species search count is wrong');
    await atlasSearch.fill('tUaTaRa');
    if(await atlas.locator('.legend-entry:visible').count()!==1 || !await atlas.locator('#legend-tuatara').isVisible())
      throw Error('Case-insensitive atlas search failed');
    await atlasSearch.fill('no-such-field-note-999');
    if(await atlas.locator('.legend-entry:visible').count()!==0 || !await atlas.locator('#legend-empty').isVisible())
      throw Error('No-results state is missing');
    if(!/0 field notes in 0 collections/.test(await atlas.locator('#legend-count').innerText()))
      throw Error('No-results count incorrect');
    await atlasSearch.fill('raven');
    if(await atlas.locator('.legend-entry:visible').count()!==1)throw Error('Failed to restore search results');
    await choose('waters');
    if(await atlas.locator('.legend-entry:visible').count()!==0)throw Error('Search ignored selected collection');
    await choose('all');
    if(await atlas.locator('.legend-entry:visible').count()!==1)throw Error('All collection did not restore matching raven');
    const archiveSearch=page.locator('#living-archive-search');
    await archiveSearch.fill('dinosaurs');
    if(await page.locator('#living-archive-results li:visible').count()!==1)throw Error('Existing Library search broke');
    await archiveSearch.fill('');
    // Archive links must clear stale atlas search and reveal the chosen collection.
    await page.locator('#living-archive-results a[href="#legend-earth"]').click();
    if(await atlasSearch.inputValue()!=='')throw Error('Archive jump left stale atlas search');
    if(await atlas.locator('.legend-entry:visible').count()!==3)throw Error('Archive jump did not reveal all three Earth notes');
    if(!page.url().endsWith('#living-library'))throw Error('Atlas link took over approved Hub route');
    if(await page.evaluate(()=>document.activeElement?.id)!=='legend-earth')throw Error('Atlas link did not move keyboard focus');
    if(await atlas.locator('.legend-collection:visible').count()!==1)throw Error('Atlas deep link filter failed');
    await atlas.locator('[data-legend-filter="all"]').focus();
    await page.keyboard.press('Enter');
    if(await atlas.locator('.legend-collection:visible').count()!==3)throw Error('Keyboard filter failed');
    const dim=await atlas.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
    if(dim.scroll>dim.client+2)throw Error('Atlas horizontally overflows at '+width+' '+JSON.stringify(dim));
    // The two existing Archive destinations must be real links, not dead text.
    await page.locator('#living-archive-results a[href="#mythical-beasts-legends"]').click();
    await page.waitForFunction(()=>document.getElementById('r-beasts')?.checked);
    await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.getElementById('r-library')?.checked);
    await page.locator('#living-archive-results a[href="#herbalist"]').click();
    await page.waitForFunction(()=>document.getElementById('r-herbalist')?.checked);
    await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.getElementById('r-library')?.checked);
    if(errors.length)throw Error('JS runtime errors: '+errors.join('; '));
    if(width===390||width===1440)await page.screenshot({path:'qa-legend-atlas-'+width+'.png'});
    console.log('PASS Living Legends '+width+'×'+height+' nine entries, filters, native disclosures, archive jumps, keyboard and source links');
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
  if(await page.locator('#library-living-legends').locator('details').count()!==9)
    throw Error('Reduced motion lost field notes');
  console.log('PASS reduced-motion accessible atlas');
  await page.close();
}finally{await browser.close();}
