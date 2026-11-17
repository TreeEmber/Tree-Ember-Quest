import {chromium} from 'playwright';
const origin='http://127.0.0.1:8177/';
const browser=await chromium.launch({headless:true});
const sizes=[[320,700],[390,844],[768,1024],[1440,1000]];
try {
  for(const [width,height] of sizes){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(origin+'#portal-hub',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.getElementById('r-hub')?.checked,{timeout:20000});
    const hubs=page.locator('.hub .hub-hit');if(await hubs.count()!==6)throw Error('Not six hotspots');
    const img=page.locator('.hub-approved-art');
    await img.evaluate(el=>el.decode());
    const alt=await img.getAttribute('alt');
    if(!alt.includes('The Oaken Emporium'))throw Error('Wrong hub alt');
    const source=await page.locator('#teHubVideo source').getAttribute('src');
    if(source!=='assets/portal-hub-oaken-emporium-ambient.mp4')throw Error('Video source not updated');
    await page.waitForFunction(()=>document.getElementById('teHubVideo').videoWidth===768,{timeout:20000});
    const coords=await hubs.evaluateAll(nodes=>nodes.map(n=>({name:n.getAttribute('aria-label'),rect:n.getBoundingClientRect().toJSON()})));
    if(coords.some(x=>x.rect.width<10||x.rect.height<10))throw Error('Invalid hotspot rectangle');
    await page.screenshot({path:'qa-oaken-hub-'+width+'.png'});
    await page.locator('a.h-market').click();
    await page.waitForURL('**/oaken-emporium.html');
    await page.locator('.forest-art img').evaluate(el=>el.decode());
    if(!await page.locator('.market-sign').innerText().then(s=>s.includes('The Oaken')))throw Error('Marketplace title absent');
    await page.locator('a[href="#briarbridge"]').first().click();
    if(!await page.locator('#briarbridge').isVisible())throw Error('Founder shop missing');
    await page.locator('#briarbridge .close').click();
    await page.locator('a[href="#artistic"]').first().click();
    if(!await page.locator('#artistic').isVisible())throw Error('Artistic Visions missing');
    if(errors.length)throw Error('Browser errors: '+errors.join('; '));
    console.log('PASS',width,height,'six hotspots, poster, 9s video loaded, public marketplace, both shop profiles');
    await page.close();
  }
  const reduced=await browser.newPage({reducedMotion:'reduce',viewport:{width:390,height:844}});
  await reduced.goto(origin+'#portal-hub',{waitUntil:'domcontentloaded'});
  await reduced.waitForFunction(()=>document.getElementById('r-hub').checked,{timeout:20000});
  const display=await reduced.locator('#teHubVideo').evaluate(el=>getComputedStyle(el).display);
  if(display!=='none')throw Error('Reduced motion should hide the video');
  await reduced.close();
  console.log('PASS reduced motion static fallback');
} finally {await browser.close()}
