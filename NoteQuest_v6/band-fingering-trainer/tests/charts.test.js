import {test} from 'node:test';
import assert from 'node:assert/strict';
import {instruments} from '../dist/data.js';
import {woodwindLayout,woodwindChart,cycleHole,holeStates,keyBounds} from '../dist/woodwinds.js';
import {staff} from '../dist/notation.js';
test('every playable woodwind key has a chart control or a first-hole coverage state',()=>{
 for(const i of instruments.filter(i=>i.kind==='woodwind')){
  const layout=woodwindLayout(i),ids=layout.keys.map(k=>k.id);
  assert.equal(new Set(ids).size,ids.length,i.id);
  for(const k of i.keys)assert(ids.includes(k.id)||holeStates(i).includes(k.id),`${i.id}: ${k.id}`);
  for(const k of layout.keys){assert(i.keys.some(x=>x.id===k.id));const[x,y,w,h]=keyBounds(k.shape);assert(k.x+x>=0&&k.x+x+w<=layout.width&&k.y+y>=0&&k.y+y+h<=layout.height,`${i.id} ${k.id} bounds`);}
  for(const note of i.notes)for(const f of note.fingerings){const html=woodwindChart(i,f);assert(!html.includes('undefined'));assert(!html.includes('key-mark'));assert(!html.includes('<title>'));assert.equal((html.match(/data-chart-key=/g)||[]).length,ids.length);}
 }
});
test('cycling half-hole and bassoon quarter-hole coverage keeps other selected keys',()=>{
 for(const id of ['oboe','bassoon']){
  const i=instruments.find(i=>i.id===id);let keys=['L2','R3'];
  for(const state of holeStates(i)){keys=cycleHole(i,keys);assert.deepEqual(new Set(keys),new Set(['L2','R3',state]));}
  assert.deepEqual(cycleHole(i,keys),['L2','R3']);
 }
});
test('standard Bravura glyphs anchor clefs to the G and F lines',()=>{
 assert.match(staff('G4','treble'),/class="music-glyph clef-glyph" x="61" y="126" font-size="56">&#xE050;/);
 assert.match(staff('F3','bass'),/class="music-glyph clef-glyph" x="61" y="98" font-size="56">&#xE062;/);
 assert.match(staff('F#4'),/class="music-glyph accidental-glyph" fill="currentColor" x="184" y="133" font-size="56">&#xE262;/);
});

test('main-hole hit areas stay separate in the paper-chart layouts',()=>{for(const i of instruments.filter(i=>i.kind==='woodwind')){const boxes=woodwindLayout(i).keys.filter(k=>/^[LR][123]$/.test(k.id)).map(k=>{const[x,y,w,h]=keyBounds(k.shape);return {id:k.id,x:k.x+x,y:k.y+y,w,h};});for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){const p=boxes[a],q=boxes[b];assert(!(Math.min(p.x+p.w,q.x+q.w)>Math.max(p.x,q.x)&&Math.min(p.y+p.h,q.y+q.h)>Math.max(p.y,q.y)),`${i.id}: ${p.id}/${q.id}`);}}});
