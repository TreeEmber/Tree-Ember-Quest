/**
 * Tree & Ember: founder-approved moving Portal Hub preservation gate.
 *
 * Baseline: approved November Gemini animated Hub. A future founder-approved
 * improvement MUST update this guard intentionally, together with review of
 * the visual poster, animation, coordinates, and motion/loop behavior.
 *
 * This runs read-only on pull requests and on main. No assets are modified.
 */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const approved = {
  'assets/portal-hub-gemini-softloop.mp4':'c3f31061cbec4a1eadf72e40636cd522f8830463',
  'assets/portal-hub-gemini-poster.jpg':'6f8f21deaad93b79b54e55ab14acbf5a6941f8fb',
  'assets/page1-briarlight-gate.mp4':'5ebe28ca19673716e1fd5087ae0ec4fccbfa27af',
  'assets/page2-forest-journey.mp4':'71c51f6b57a0958ef17a64d5da6f6ef32e6cf7e4',
};
for (const [path,sha] of Object.entries(approved)){
  const actual=execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();
  assert.equal(actual,sha,'Locked approved moving or poster asset changed: '+path+
    '. Do not replace or remove animation. Founder approval and video QA are required.');
}

const html=readFileSync('index.html','utf8');
const start=html.indexOf('<section class="route hub">');
const end=html.indexOf('<section class="route branch library',start);
assert.ok(start>=0&&end>start,'Original animated Hub route is required');
const hub=html.slice(start,end);
const img='<img class="hub-approved-art" src="assets/portal-hub-gemini-poster.jpg"';
assert.ok(hub.includes(img),'Original still poster must remain the motion fallback');
assert.match(hub,/<video id="teHubVideo" class="hub-final-video" autoplay muted loop playsinline preload="auto" poster="assets\/portal-hub-gemini-poster\.jpg" aria-hidden="true">/,'Moving Hub must retain autoplay, muted, loop and inline playback');
assert.match(hub,/<source src="assets\/portal-hub-gemini-softloop\.mp4" type="video\/mp4">/,'Approved animated video source must be present');
const hits=[...hub.matchAll(/<(?:label|a)\b[^>]*class="hub-hit [^"]*"/g)].map(x=>x[0]);
assert.equal(hits.length,6,'The approved Hub has exactly six visible interactive room destinations');
for(const className of ['h-nook','h-moon','h-library','h-market','h-homeschool','h-photo']){
  assert.equal(hits.filter(hit=>hit.includes('hub-hit '+className+'"')).length,1,
    'Expected exactly one unaltered '+className+' portal');
}
const portalCss='.hub .h-photo{left:61%;top:75%;width:38%;height:24%;border-radius:16%}';
assert.ok(html.includes(portalCss),'Photography hotspot must stay aligned with actual original artwork; never move the click target alone');
assert.match(html,/@media\(prefers-reduced-motion:reduce\)\s*\{\s*\.hub-final-video\{display:none!important\}/,'Reduced-motion visitors need the approved still instead of motion');
assert.match(html,/<input class="state" type="radio" name="r" id="r-photo">/,'Photography route must still exist');
console.log('PASS: identical approved animated video, still poster, Gate, Journey, six hotspots, Photography alignment and accessible motion fallback');
