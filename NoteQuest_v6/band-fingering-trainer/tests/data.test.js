import {test} from 'node:test';
import assert from 'node:assert/strict';
import {instruments,sources,pitchMidi,configuredInstrument,transposeSpelling} from '../dist/data.js';
import {accepts,choicesFor,poolFor,newRound,makeQueue,submit,advance,accuracy,signature} from '../dist/engine.js';
import {staffPosition,staff} from '../dist/notation.js';
const configs=[...instruments,configuredInstrument('euphonium','treble')];
const instrument=id=>instruments.find(i=>i.id===id);
const fingering=(id,pitch,keys,partial)=>assert(accepts(instrument(id).notes.find(n=>n.pitch===pitch),{keys:keys.split(' ').filter(Boolean),partial},partial!==undefined),`${id} ${pitch}`);
test('13 instruments, valid pitches, unique IDs, keys, sources and cumulative tiers',()=>{
 assert.equal(instruments.length,13);
 for(const i of configs){
  assert.equal(new Set(i.notes.map(n=>n.id)).size,i.notes.length,i.id);
  assert.equal(new Set(i.notes.map(n=>n.pitch)).size,i.notes.length,i.id);
  assert.equal(new Set(i.keys.map(k=>k.id)).size,i.keys.length,i.id);
  const ids=new Set(i.keys.map(k=>k.id));
  for(const n of i.notes){
   assert.equal(pitchMidi(n.pitch),n.midi,`${i.id} ${n.pitch}`);
   assert(n.tier>=1&&n.tier<=4);assert(n.sources.length);assert(n.fingerings.length);
   for(const ref of n.sources)assert(sources[ref]?.url?.startsWith('https://')||(sources[ref]?.document&&sources[ref]?.page>0),ref);
   for(const f of n.fingerings){
    assert.equal(new Set(f.keys).size,f.keys.length);
    assert(f.keys.every(k=>ids.has(k)),`${i.id} ${n.pitch}: ${f.keys}`);
    assert(f.keys.filter(k=>k==='L1'||k.startsWith('L1:')).length<=1);
    if(i.kind==='slide'){assert.equal(f.keys.filter(k=>/^P[1-7]$/.test(k)).length,1);assert(f.keys.filter(k=>['Flat','Sharp'].includes(k)).length<=1);}
    if(i.kind!=='woodwind')assert(Number.isInteger(f.partial)&&f.partial>=2);
   }
  }
  for(let t=1;t<=4;t++){assert(poolFor(i,t).length>=5);if(t>1)assert(poolFor(i,t).length>poolFor(i,t-1).length);}
 }
});
test('every brass fingering/partial pair agrees with its instrument harmonic series',()=>{
 const roots={trumpet:48,horn:36,euphonium:34,tuba:22,trombone:34};
 for(const i of configs.filter(i=>i.kind!=='woodwind'))for(const n of i.notes)for(const f of n.fingerings){
  let root=roots[i.id];if(i.id==='horn'&&f.keys.includes('Bb'))root=41;
  if(i.id==='euphonium'&&i.clef==='treble')root+=14;
  const lowering=i.kind==='slide'?Number(f.keys[0].slice(1))-1:f.keys.reduce((s,k)=>s+({V1:2,V2:1,V3:3,V4:5}[k]||0),0);
  const expected=root+Math.round(12*Math.log2(f.partial))-lowering;
  assert.equal(n.midi,expected,`${i.id} ${n.pitch} ${f.keys} partial ${f.partial}`);
 }
});
test('all tier-limited challenge pools produce exactly one correct distinct choice',()=>{
 for(const i of configs)for(let tier=1;tier<=4;tier++){
  const pool=poolFor(i,tier),partials=i.kind!=='woodwind'&&tier===4;
  for(const n of pool)for(let attempt=0;attempt<3;attempt++){
   const choices=choicesFor(n,{...i,choicePool:pool},partials);
   assert.equal(choices.length,4);assert.equal(new Set(choices.map(f=>signature(f,partials))).size,4);
   assert.equal(choices.filter(f=>accepts(n,f,partials)).length,1,`${i.id} ${n.pitch}`);
  }
 }
});
test('10/20/30 answer rounds complete correctly for every configuration',()=>{
 for(const i of configs)for(const count of [10,20,30]){
  const r=newRound(makeQueue(poolFor(i,4),count));
  for(let j=0;j<count;j++){if(j)assert.notEqual(r.queue[j].id,r.queue[j-1].id);assert(submit(r,r.queue[j].fingerings.at(-1),i.kind!=='woodwind'));advance(r);}
  assert.equal(r.index,count);assert.equal(accuracy(r),100);assert.equal(r.best,count);assert.equal(r.missed.length,0);
 }
});
test('register-transition fixtures from the cited woodwind charts',()=>{
 fingering('flute','D5','T L2 L3 R1 R2 R3');fingering('flute','Bb4','BbT L1 Eb');fingering('flute','A6','T L2 R1 Eb');
 fingering('alto-sax','C5','L2');fingering('alto-sax','D5','Oct L1 L2 L3 R1 R2 R3');fingering('alto-sax','F6','Oct PalmD PalmEb PalmF HighE');
 fingering('oboe','D5','L1:½ L2 L3 R1 R2 R3');fingering('oboe','E5','Oct1 L1 L2 L3 R1 R2');fingering('oboe','A5','Oct2 L1 L2');
 fingering('bassoon','G3','W L1:½ L2 L3 Eb R1 R2 R3');fingering('bassoon','Bb1','Bb B C D L1 L2 L3 R1 R2 R3 E F');
 fingering('clarinet','F6','Reg T L2 L3 C# RAb');
 fingering('euphonium','C3','V4',3);fingering('tuba','B1','V2 V4',3);fingering('trombone','C3','P6',3);fingering('horn','C5','Bb',6);
});
test('written transposition and euphonium spelling preserve pitch and distinct notation',()=>{
 const expected={'flute':0,'oboe':0,'bassoon':0,'clarinet':-2,'bass-clarinet':-14,'alto-sax':-9,'tenor-sax':-14,'bari-sax':-21,'trumpet':-2,'horn':-7,'trombone':0,'euphonium':0,'tuba':0};
 for(const i of instruments)assert.equal(i.transpose,expected[i.id]);
 assert.equal(transposeSpelling('Bb2',14,8),'C4');assert.equal(transposeSpelling('B2',14,8),'C#4');assert.equal(transposeSpelling('C#3',14,8),'D#4');
 const bass=instrument('euphonium'),treble=configuredInstrument('euphonium','treble');
 bass.notes.forEach((n,j)=>{assert.equal(n.midi,treble.notes[j].midi+treble.transpose);assert.deepEqual(n.fingerings,treble.notes[j].fingerings);});
});
test('notation uses diatonic positions, clef anchors, ledger lines and bounds',()=>{
 assert.equal(staffPosition('E4','treble').y,140);assert.equal(staffPosition('G4','treble').y,126);assert.equal(staffPosition('F3','bass').y,98);assert.equal(staffPosition('G2','bass').y,140);
 assert.notEqual(staffPosition('C#4','treble').y,staffPosition('Db4','treble').y);
 assert(staff('C4','treble').includes('y1="154"'));assert(staff('A5','treble').includes('y1="70"'));
 for(const i of configs)for(const n of i.notes){const {y}=staffPosition(n.pitch,i.clef);assert(y>=10&&y<=219,`${i.id} ${n.pitch}`);assert(staff(n.pitch,i.clef).includes('role="img"'));}
});

// Equipment selection must change validation and distractors, not just visuals.
test('three/four-valve configurations only accept available valves',()=>{
 for(const id of ['euphonium','tuba'])for(const notation of ['bass','treble']){
  const three=configuredInstrument(id,notation,3),four=configuredInstrument(id,notation,4);
  assert.equal(three.keys.length,3);assert.equal(four.keys.length,4);
  assert(three.notes.every(n=>n.fingerings.every(f=>!f.keys.includes('V4'))));
  const alternate=four.notes.find(n=>n.fingerings.some(f=>f.keys.includes('V4')));
  const fourth=alternate.fingerings.find(f=>f.keys.includes('V4'));
  assert(accepts(alternate,{keys:fourth.keys}));
  assert(!accepts(three.notes.find(n=>n.id===alternate.id),{keys:fourth.keys}));
  for(let tier=1;tier<=4;tier++)for(const n of poolFor(three,tier)){
   const choices=choicesFor(n,{...three,choicePool:poolFor(three,tier)});
   assert(choices.every(f=>!f.keys.includes('V4')));
   assert.equal(choices.filter(f=>accepts(n,f)).length,1);
  }
 }
});
test('all brass can be answered with keys only, including tier four',()=>{
 for(const i of instruments.filter(i=>i.kind!=='woodwind'))for(const n of i.notes){
  assert(accepts(n,{keys:n.fingerings[0].keys}));
  const options=choicesFor(n,i);assert.equal(options.filter(f=>accepts(n,{keys:f.keys})).length,1);
 }
});
