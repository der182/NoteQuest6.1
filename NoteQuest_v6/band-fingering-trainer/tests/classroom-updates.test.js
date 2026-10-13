import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument} from '../dist/data.js';
import {accepts,choicesFor,missedPracticeQueue,distinctMissed} from '../dist/engine.js';
import {woodwindLayout,woodwindChart} from '../dist/woodwinds.js';
import {paintKey} from '../dist/drag.js';
import {valveBindings,keyboardAction} from '../dist/keyboard.js';
import {defaultPractice,withAlternates} from '../dist/practice.js';
import {encodeSettings,decodeSettings} from '../dist/share.js';
import {cleanPreferences,loadPreferences,applyPreferences,accentPresets} from '../dist/preferences.js';
import {playNoteTone,NOTE_TONE_MS} from '../dist/audio.js';
const n=(i,p)=>i.notes.find(n=>n.pitch===p);
test('all saxophones accept low C-sharp using the OUTER left pinky key',()=>{
 for(const id of ['alto-sax','tenor-sax','bari-sax']){
  const i=configuredInstrument(id),l=woodwindLayout(i),sharp=l.keys.find(k=>k.id==='LowC#'),b=l.keys.find(k=>k.id==='LowB');
  assert(sharp.x>b.x);assert.equal(sharp.y,b.y);
  for(const p of ['C#4','Db4']){const note=n(i,p);assert(accepts(note,{keys:['L1','L2','L3','R1','R2','R3','C','LowC#']}));assert(!accepts(note,{keys:['L1','L2','L3','R1','R2','R3','C','LowB']}));}
  assert(woodwindChart(i,n(i,'C#4').fingerings[0]).includes('data-chart-key="LowC#" transform="translate(265 271)"'));
 }
});
test('both clarinets B4 use inner E/B petal, while C-sharp5 uses the outer F-sharp petal',()=>{
 for(const id of ['clarinet','bass-clarinet']){
  const i=configuredInstrument(id),layout=woodwindLayout(i),find=id=>layout.keys.find(k=>k.id===id);
  assert.equal(find('LE').shape,'petalLeft');assert.equal(find('LF#').shape,'petalRight');assert.equal(find('LF').shape,'petalTop');assert(find('LE').x<find('LF#').x);
  const all=['Reg','T','L1','L2','L3','R1','R2','R3'];
  for(const extra of [['LE','RF'],['LE'],['RE']])assert(accepts(n(i,'B4'),{keys:[...all,...extra]}));
  assert(!accepts(n(i,'B4'),{keys:[...all,'LF#']}));
  for(const extra of [['LF#'],['LF#','RF'],['RF#']])for(const p of ['C#5','Db5'])assert(accepts(n(i,p),{keys:[...all,...extra]}));
  assert(!accepts(n(withAlternates(i,false),'B4'),{keys:[...all,'RE']}));
 }
});
test('F single horn filters trigger from keys, answers, diagrams, shortcuts and choices without mutating double horn',()=>{
 const double=configuredInstrument('horn'),single=configuredInstrument('horn','bass',3,false,'single');
 assert.equal(single.transpose,-7);assert(!single.keys.some(k=>k.id==='Bb'));assert(double.keys.some(k=>k.id==='Bb'));
 assert.equal(single.notes.length,double.notes.length);
 for(const note of single.notes){assert(note.fingerings.length);assert(note.fingerings.every(f=>!f.keys.includes('Bb')));assert(choicesFor(note,single).every(f=>!f.keys.includes('Bb')));}
 assert(accepts(n(double,'G5'),{keys:['Bb','V1']}));assert(!accepts(n(single,'G5'),{keys:['Bb','V1']}));assert(accepts(n(single,'G5'),{keys:[]}));
 assert(!valveBindings(single).some(([,id])=>id==='Bb'));assert.equal(keyboardAction({key:'x'},{screen:'play',mode:'interactive',enabled:true,instrument:single}),null);
 assert(double.notes.some(note=>note.fingerings.some(f=>f.keys.includes('Bb'))));
});
test('single horn share links preserve configuration; old links default to double horn',()=>{
 const i=configuredInstrument('horn','bass',3,false,'single'),config={instrument:'horn',mode:'interactive',count:10,notation:'bass',valves:3,keyboard:true,attachment:false,alternates:true,hornType:'single',custom:defaultPractice(i),maps:{},roundType:'questions',duration:60,customTime:false};
 const token=encodeSettings(config),restored=decodeSettings(token);assert.equal(restored.hornType,'single');assert(!('Bb' in restored.maps['horn:3']));
 const p=JSON.parse(atob(token.replaceAll('-','+').replaceAll('_','/')));p.v=2;delete p.hornType;p.bindings.Bb='x';const legacy=decodeSettings(btoa(JSON.stringify(p)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''));assert.equal(legacy.hornType,'double');
});
test('missed-note rounds use three per distinct pitch, capped at ten, including enharmonic deduplication',()=>{
 const i=configuredInstrument('clarinet');
 for(const [pitches,count]of [[['E4'],3],[['E4','F4'],6],[['E4','F4','G4'],9],[['E4','F4','G4','A4'],10],[['E4','F4','G4','A4','B4'],10],[['C#4','Db4'],3]]){
  const missed=pitches.map(p=>n(i,p)),q=missedPracticeQueue(missed,()=>.3);assert.equal(q.length,count);assert(q.every(note=>missed.some(m=>m.midi===note.midi)));
  if(distinctMissed(missed).length<=3)for(const pitch of distinctMissed(missed))assert.equal(q.filter(note=>note.midi===pitch.midi).length,3);
  else assert.equal(new Set(q.map(note=>note.midi)).size,distinctMissed(missed).length);
 }
 assert.deepEqual(missedPracticeQueue([]),[]);
});
test('drag painting selects/releases, stays idempotent, and preserves fractional/linked-thumb rules',()=>{
 const cl=configuredInstrument('clarinet'),all=['L1','L2','L3','R1','R2','R3'];let keys=[];
 for(const id of all)keys=paintKey(keys,id,true,cl);assert.deepEqual(keys,all);assert.deepEqual(paintKey(keys,'L1',true,cl),all.slice(1).concat('L1'));
 for(const id of all)keys=paintKey(keys,id,false,cl);assert.deepEqual(keys,[]);
 assert.deepEqual(paintKey(['L1:½','R3'],'L1',true,configuredInstrument('oboe')),['R3','L1']);
 assert.deepEqual(paintKey(['L1:¼','R3'],'L1',false,configuredInstrument('bassoon')),['R3']);
 assert.deepEqual(paintKey(['BbT','L1'],'T',true,configuredInstrument('flute')),['L1','T']);
});
test('appearance preferences validate values and survive unavailable or corrupted storage',()=>{
 assert.deepEqual(cleanPreferences(),{accent:'blue',dark:false,chartSize:'standard',noteVolume:1,wrongVolume:1,correctSound:true,wrongSound:true});assert.equal(Object.keys(accentPresets).length,6);
 const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},root={dataset:{},style:{setProperty:(k,v)=>root[k]=v}};
 const prefs=applyPreferences({accent:'pink',dark:true,wrongSound:false},root,storage);assert.equal(root.dataset.theme,'dark');assert.equal(root['--blue'],accentPresets.pink.dark);assert.deepEqual(loadPreferences(storage),prefs);
 assert.deepEqual(loadPreferences({getItem:()=>'{bad'}),cleanPreferences());assert.deepEqual(loadPreferences({getItem:()=>{throw Error();}}),cleanPreferences());
 assert.deepEqual(cleanPreferences({accent:'__proto__',dark:'yes',wrongSound:null}),cleanPreferences());
});
test('silent answer audio still schedules progression',()=>{
 let started=0;playNoteTone(60,0,'tuba',()=>started++);assert.equal(started,1);assert.equal(NOTE_TONE_MS,1000);
});
