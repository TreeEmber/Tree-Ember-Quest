import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:8177/';
const rooms=[
 ['journeys','#journeys','Journeys'],
 ['herbalist','#herbalist','The Herbalist'],
 ['cards','#portal-keys','Discovery Cards & Portal Keys'],
 ['guides','#guide-buddies','Meet the Guide Buddies'],
 ['story','#our-story','The Story of Tree & Ember']
];
const widths=[[320,700],[390,844],[768,1024],[1440,900]];
const browser=await chromium.launch({headless:true});
try {
 for(const [width,height] of widths){
  const errors=[];
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('r-hub')?.checked);
  assert.equal(await page.locator('.hub .hub-hit').count(),6,'approved Hub must keep exactly six doors');
  assert.equal(await page.locator('#teHubVideo source').getAttribute('src'),'assets/portal-hub-gemini-softloop.mp4','original video retained');
  assert.equal(await page.locator('a.h-market').getAttribute('href'),'oaken-emporium.html','market entry retained');
  assert.equal(await page.locator('.world-guide').isVisible(),true,'world map visible from Hub');
  const summary=page.locator('#tree-world-guide summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#tree-world-guide').getAttribute('open'),'','keyboard should open world map');
  assert.equal(await page.locator('#tree-world-guide nav a').count(),14,'all destinations must be mapped');
  // The site map uses real hash links; opening one must activate its room.
  await page.locator('#tree-world-guide a[href="#journeys"]').click();
  await page.waitForFunction(()=>document.getElementById('r-journeys')?.checked);
  assert.equal(await page.locator('#tree-world-guide').getAttribute('open'),null,'menu closes after routing');
  for(const [id,hash,heading] of rooms){
   await page.goto(base+hash,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(i=>document.getElementById('r-'+i)?.checked,id);
   const route=page.locator('.world-route.'+id);
   assert.equal(await route.isVisible(),true,id+' visible');
   assert.equal((await route.locator('h1').first().innerText()).trim(),heading,'heading for '+id);
   const styles=await route.evaluate(el=>({background:getComputedStyle(el).backgroundColor,scroll:el.scrollWidth,client:el.clientWidth,
    backdrop:getComputedStyle(el,'::before').backgroundImage}));
   assert.notEqual(styles.background,'rgb(255, 255, 255)','no bright white page');
   assert.ok(styles.scroll<=styles.client+3,'horizontal overflow '+id+': '+JSON.stringify(styles));
   assert.ok(styles.backdrop.includes('gradient'),'not a raw blank page '+id);
   assert.ok(await route.locator('a[href="#living-library"],a[href="#portal-hub"]').count()>0,'real exit link from '+id);
   await page.screenshot({path:'qa-basic-'+id+'-'+width+'.png',fullPage:false});
  }
  await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('r-library')?.checked);
  for(const h of ['#herbalist','#journeys','#portal-keys','#guide-buddies'])assert.equal(await page.locator('.library .realm-book[href="'+h+'"]').count(),1,'accessible Library portal '+h);
  const shelf=page.locator('#living-archive-search');
  await shelf.fill('dinosaurs');
  assert.equal(await page.locator('#living-archive-results li:visible').count(),1,'first shelf still filters');
  await shelf.fill('');
  assert.equal(await page.locator('#living-archive-results li:visible').count(),6,'shelf reset');
  await page.goto(base+'#moon-room',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.moon-scene img').isVisible(),true,'approved Moon observatory preserved');
  await page.goto(base+'#wrenwood-nook',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.nook .wrenwood-live-form').count()>0,true,'private Nook form preserved');
  await page.goto(base+'#homeschool',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.owls-enter').getAttribute('href'),'https://homeschool.treeandemberco.com/','private school still separate');
  await page.goto(base+'#embers-photography',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.photo .realm-photo-frame').count(),3,'no invented gallery content');
  // Exercise the actual center of every hotspot with the persistent world-map
  // control present, guarding against mobile overlays blocking locked doors.
  for(const [hotspot,radio] of [['h-nook','r-nook'],['h-moon','r-moon'],['h-library','r-library'],['h-homeschool','r-homeschool'],['h-photo','r-photo']]){
   await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('r-hub')?.checked);
   await page.locator('.hub-hit.'+hotspot).click({timeout:9000});
   await page.waitForFunction(id=>document.getElementById(id)?.checked,radio);
  }
  await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
  await page.locator('a.h-market').click();
  await page.waitForURL('**/oaken-emporium.html');
  assert.equal(await page.locator('#briarbridge').count(),1,'Briarbridge remains independent');
  assert.equal(await page.locator('#artistic').count(),1,'Artistic Visions remains independent');
  assert.deepEqual(errors,[],'browser runtime errors');
  console.log('PASS',width+'x'+height,'all new doors and original six Hub areas');
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#teHubVideo').evaluate(el=>getComputedStyle(el).display),'none','Hub still falls back to poster in reduced motion');
 await page.goto(base+'#guide-buddies',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#tree-world-guide').isVisible(),true);
 assert.equal(await page.locator('.guides').isVisible(),true);
 console.log('PASS reduced motion and accessible world map');
 await page.close();
} finally {
 await browser.close();
}
