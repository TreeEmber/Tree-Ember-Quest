import {chromium} from 'playwright';
const base='http://127.0.0.1:8177/';
const browser=await chromium.launch({headless:true});
const viewports=[[320,700],[390,844],[768,1024],[1440,1000]];
const paths=[
  ['library','#living-library','The Living Library'],
  ['moon','#moon-room','The Moon Room'],
  ['photo','#embers-photography','Ember’s Photography'],
  ['beasts','#mythical-beasts-legends','Legends & Beasts'],
  ['music','#heartwood-lounge','Heartwood Lounge & Music Studio']
];
let failures=[];
try{
 for(const [width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#r-hub')?.checked,{timeout:18000});
  if(await page.locator('.hub .hub-hit').count()!==6)throw Error('Hub lost any of six hotspots');
  const source=await page.locator('#teHubVideo source').getAttribute('src');
  if(source!=='assets/portal-hub-gemini-softloop.mp4')throw Error('Approved Hub animation overwritten');
  const href=await page.locator('a.h-market').getAttribute('href');
  if(href!=='oaken-emporium.html')throw Error('Market link overwritten');
  for(const [type,hash,title] of paths){
    await page.goto(base+hash,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(t=>document.querySelector('#r-'+t)?.checked,type,{timeout:18000});
    const realm=page.locator('.realm-route.'+type);
    if(!await realm.isVisible())throw Error('Room not visible: '+type);
    const label=await realm.locator('h1').first().innerText();
    if(label!==title)throw Error('Wrong room label '+type+': '+label);
    const background=await realm.evaluate(el=>getComputedStyle(el).backgroundColor);
    if(background==='rgb(255, 255, 255)')throw Error('Light background in '+type);
    const dim=await realm.locator('.realm').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
    if(dim.scroll>dim.client+2)throw Error('Horizontal overflow in '+type+' '+JSON.stringify(dim));
    await page.screenshot({path:'qa-realm-'+type+'-'+width+'.png',fullPage:false});
  }
  await page.goto(base+'#living-library',{waitUntil:'domcontentloaded'});
  const search=page.locator('#living-archive-search');
  await search.fill('dinosaurs');
  if(await page.locator('#living-archive-results li:visible').count()!==1)throw Error('Archive search not filtering');
  await search.fill('zzzz-no-results');
  if(!await page.locator('#living-archive-empty').isVisible())throw Error('Archive missing empty-state');
  await search.fill('');
  if(await page.locator('#living-archive-results li:visible').count()!==6)throw Error('Archive not restored');
  await page.locator('.library a[href="#library-dew-web"]').click();
  if(!page.url().endsWith('#living-library'))throw Error('Library shelf jump broke the public room route');
  if(await page.evaluate(()=>document.activeElement?.id)!=='library-dew-web')throw Error('Library shelf jump did not move keyboard focus');
  await page.locator('.library .realm-route-link[for="r-beasts"]').first().focus();
  await page.keyboard.press('Enter');
  if(!await page.locator('#r-beasts').isChecked())throw Error('Keyboard book navigation failed');
  await page.locator('.beasts .realm-back').focus();
  await page.keyboard.press('Space');
  if(!await page.locator('#r-library').isChecked())throw Error('Keyboard return failed');
  await page.goto(base+'#wrenwood-nook',{waitUntil:'domcontentloaded'});
  if(!await page.locator('.nook').isVisible())throw Error('Wrenwood Nook removed');
  await page.goto(base+'#homeschool',{waitUntil:'domcontentloaded'});
  const school=page.locator('.owls-enter');
  if(!await school.isVisible())throw Error('Owl school door missing');
  const schoolHref=await school.getAttribute('href');
  if(schoolHref!=='https://homeschool.treeandemberco.com/')throw Error('Private school URL changed');
  await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
  await page.locator('a.h-market').click();
  await page.waitForURL('**/oaken-emporium.html');
  if(!await page.locator('#briarbridge').count()||!await page.locator('#artistic').count())throw Error('Storefront profiles lost');
  if(errors.length)throw Error('Browser errors: '+errors.join('; '));
  console.log('PASS',width+'x'+height,'five designed realms, search, keyboard books, original six Hub doors, school, market');
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(base+'#moon-room',{waitUntil:'domcontentloaded'});
 const animation=await page.locator('.moon.realm-route').evaluate(el=>getComputedStyle(el,'::before').animationName);
 if(animation!=='none')throw Error('Reduced motion scene still animated: '+animation);
 await page.goto(base+'#portal-hub',{waitUntil:'domcontentloaded'});
 const videoStyle=await page.locator('#teHubVideo').evaluate(el=>getComputedStyle(el).display);
 if(videoStyle!=='none')throw Error('Reduced motion Hub video should be hidden');
 console.log('PASS reduced-motion static rooms and Hub poster');
 await page.close();
}finally{await browser.close()}
