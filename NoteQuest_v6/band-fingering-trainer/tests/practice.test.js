import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument,pitchMidi} from '../dist/data.js';
import {defaultPractice,practicePool,withAlternates} from '../dist/practice.js';
import {accepts,makeQueue,choicesFor,signature} from '../dist/engine.js';
import {keyboardAction,validateBindings,valveBindings} from '../dist/keyboard.js';
import {woodwindLayout} from '../dist/woodwinds.js';
test('custom bounds, accidental switches, individual filters and empty pools compose',()=>{
 const i=configuredInstrument('clarinet');let c={...defaultPractice(i,'custom'),low:pitchMidi('C4'),high:pitchMidi('G4')};
 assert(practicePool(i,c).every(n=>n.midi>=60&&n.midi<=67));
 c.chromatic=false;assert.deepEqual(practicePool(i,c).map(n=>n.pitch),['C4','D4','E4','F4','G4']);
 c.excluded=['E4'];assert(!practicePool(i,c).some(n=>n.pitch==='E4'));
 c.chromatic=true;c.sharps=false;assert(!practicePool(i,c).some(n=>n.pitch.includes('#')));
 c.naturals=false;c.flats=false;assert.equal(practicePool(i,c).length,0);
});
test('sax range-extremes preset excludes middle beginner notes in every round',()=>{
 for(const id of ['alto-sax','tenor-sax']){const i=configuredInstrument(id),pool=practicePool(i,defaultPractice(i,'extremes'));
 assert(pool.some(n=>n.pitch==='Bb3'));assert(pool.some(n=>n.pitch==='F6'));
 for(const n of makeQueue(pool,30))assert(n.midi<=60||n.midi>=86);
 }
});
test('alternate toggle changes checking without mutating the source',()=>{
 const base=configuredInstrument('trumpet'),n=base.notes.find(n=>n.pitch==='E4'),i=withAlternates(base,false),primary=i.notes.find(n=>n.id===n.pitch&&n.pitch==='E4');
 assert(accepts(n,{keys:['V3']}));assert(!accepts(primary,{keys:['V3']}));assert(accepts(primary,{keys:['V1','V2']}));assert(n.fingerings.length>1);
});
test('F attachment uses teacher-chart physical positions and remains separate from straight slide',()=>{
 const straight=configuredInstrument('trombone'),trigger=configuredInstrument('trombone','bass',3,true);
 assert(!straight.keys.some(k=>k.id==='Trigger'));assert(!straight.notes.some(n=>n.pitch==='C2'));
 for(const [pitch,keys] of [['B1',['Trigger','Flat','P7']],['C2',['Trigger','P7']],['Db2',['Trigger','P6']],['D2',['Trigger','Flat','P4']],['Eb2',['Trigger','Flat','P3']],['E2',['Trigger','P2']],['F2',['Trigger','P1']],['B2',['Trigger','Flat','P2']],['C3',['Trigger','P1']]])assert(accepts(trigger.notes.find(n=>n.pitch===pitch),{keys}),pitch);
 for(const n of trigger.notes){const options=choicesFor(n,trigger);assert.equal(options.filter(f=>accepts(n,f)).length,1);assert.equal(new Set(options.map(f=>signature(f))).size,4);}
});
test('baritone low A and corrected flute thumb position are playable',()=>{
 const bari=configuredInstrument('bari-sax');assert(accepts(bari.notes.find(n=>n.pitch==='A3'),{keys:['L1','L2','L3','R1','R2','R3','C','LowA']}));assert(woodwindLayout(bari).keys.some(k=>k.id==='LowA'));
 const fl=configuredInstrument('flute'),layout=woodwindLayout(fl);assert(layout.keys.find(k=>k.id==='T').x>layout.keys.find(k=>k.id==='BbT').x);
 assert(accepts(fl.notes.find(n=>n.pitch==='G4'),{keys:['BbT','L1','L2','L3','Eb']}));assert(!accepts(fl.notes.find(n=>n.pitch==='B4'),{keys:['BbT','L1','Eb']}));
});
test('remapping validates keys, preserves four-valve defaults and maps presses',()=>{
 const i=configuredInstrument('tuba','bass',4);assert.deepEqual(valveBindings(i).map(([k])=>k),['p','[',']','\\']);
 assert(validateBindings({V1:'a',V2:'x'}));assert(validateBindings({V1:'1',V2:'1'}));assert.equal(validateBindings({V1:'1',V2:'2',V3:'3',V4:'4'}),'');
 const state={screen:'play',enabled:true,instrument:i,mode:'interactive',mapping:{V1:'1',V2:'2',V3:'3',V4:'4'}};
 assert.deepEqual(keyboardAction({key:'4'},state),{type:'valve',id:'V4'});assert.equal(keyboardAction({key:'p'},state),null);
});
test('one-note custom rounds still have four unambiguous challenge choices',()=>{
 const i=configuredInstrument('alto-sax'),pool=i.notes.filter(n=>n.pitch==='D6');const queue=makeQueue(pool,10);assert(queue.every(n=>n.pitch==='D6'));
 assert.equal(choicesFor(pool[0],{...i,choicePool:pool}).filter(f=>accepts(pool[0],f)).length,1);
});

test('bass clarinet has a separate five-key pinkie cluster and low E-flat',()=>{
 const i=configuredInstrument('bass-clarinet'),layout=woodwindLayout(i),ext=layout.keys.find(k=>k.id==='LowEb'),above=layout.keys.find(k=>k.id==='RE');
 assert.equal(ext.x,above.x);assert.equal(ext.y-above.y,33);assert.equal(ext.shape,above.shape);
 assert(!woodwindLayout(configuredInstrument('clarinet')).keys.some(k=>k.id==='LowEb'));
 assert(accepts(i.notes.find(n=>n.pitch==='Eb3'),{keys:['T','L1','L2','L3','R1','R2','R3','LowEb']}));
});

test('every instrument starts with five concert B-flat scale notes and builds to an octave',()=>{
 const ids=['flute','oboe','bassoon','clarinet','bass-clarinet','alto-sax','tenor-sax','bari-sax','trumpet','horn','trombone','euphonium','tuba'];
 for(const id of ids)for(const notation of id==='euphonium'?['bass','treble']:['bass']){
  const i=configuredInstrument(id,notation,3);
  const first=defaultPractice(i),building=defaultPractice(i,'building');
  assert.equal(first.chromatic,false);assert.equal(building.chromatic,false);
  assert.deepEqual(practicePool(i,first).map(n=>(n.midi+i.transpose)%12),[10,0,2,3,5],id+notation);
  assert.deepEqual(practicePool(i,building).map(n=>(n.midi+i.transpose)%12),[10,0,2,3,5,7,9,10],id+notation);
 }
 const h=configuredInstrument('horn'),f=defaultPractice(h,'first','F');assert.deepEqual(practicePool(h,f).map(n=>n.pitch),['C4','D4','E4','F4','G4']);
 const t=configuredInstrument('trombone');assert(practicePool(t,defaultPractice(t)).some(n=>n.pitch==='Eb3'));
});
