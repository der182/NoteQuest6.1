import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument,instruments} from '../dist/data.js';
import {defaultPractice,practicePool} from '../dist/practice.js';
import {encodeSettings,decodeSettings,settingsUrl} from '../dist/share.js';
const base={hornType:'double',customTime:false,roundType:'questions',duration:60,instrument:'euphonium',mode:'interactive',count:30,notation:'treble',valves:4,keyboard:true,attachment:false,alternates:false,maps:{'euphonium:4':{V1:'7',V2:'8',V3:'9',V4:'0'}}};
test('shared settings restore the exact written-note pool and active shortcuts',()=>{
 const i=configuredInstrument(base.instrument,base.notation,base.valves,false);
 const custom={...defaultPractice(i,'full'),preset:'custom',chromatic:false,sharps:false,excluded:[i.notes[3].id]};
 const config={...base,custom},restored=decodeSettings(encodeSettings(config));
 assert.deepEqual(restored,config);
 assert.deepEqual(practicePool(i,restored.custom),practicePool(i,custom));
 const url=new URL(settingsUrl('https://school.example/games/band.html?revision=old#unused',config));
 assert.equal(url.pathname,'/games/band.html');assert.equal(url.search,'');
 assert.deepEqual(decodeSettings(new URLSearchParams(url.hash.slice(1)).get('settings')),config);
});
test('all instrument variants and empty filters round-trip without leaking other mappings',()=>{
 for(const source of instruments)for(const valves of [3,4])for(const attachment of [false,true]){
  const i=configuredInstrument(source.id,'bass',valves,attachment);
  const custom={...defaultPractice(i),excluded:i.notes.map(n=>n.id)};
  const restored=decodeSettings(encodeSettings({...base,instrument:source.id,notation:'bass',valves,attachment,custom}));
  assert.ok(restored,source.id);assert.equal(practicePool(i,restored.custom).length,0);
  assert.ok(Object.keys(restored.maps).every(key=>key===source.id+':'+valves));
 }
});
test('malformed, future, out-of-range and unsafe settings fail safely',()=>{
 const custom=defaultPractice(configuredInstrument(base.instrument,base.notation,4));
 const valid=encodeSettings({...base,custom});
 const payload=JSON.parse(atob(valid.replaceAll('-','+').replaceAll('_','/')));
 const pack=p=>btoa(JSON.stringify(p)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 for(const value of ['', 'bad!', 'a'.repeat(20001),pack({...payload,v:99}),pack({...payload,instrument:'unknown'}),pack({...payload,count:999}),pack({...payload,custom:{...custom,low:200}}),pack({...payload,bindings:{V1:'a',V2:'a',V3:'a',V4:'a'}})])assert.equal(decodeSettings(value),null);
});

test('international keyboard characters survive settings links',()=>{
 const config={...base,custom:defaultPractice(configuredInstrument(base.instrument,base.notation,4)),maps:{'euphonium:4':{V1:'π',V2:'ø',V3:'ж',V4:'0'}}};
 assert.deepEqual(decodeSettings(encodeSettings(config)).maps,config.maps);
});

test('timed challenges and horn concert-F settings survive sharing; legacy links default to question rounds',()=>{
 const i=configuredInstrument('horn');const config={...base,instrument:'horn',roundType:'timed',duration:120,custom:defaultPractice(i,'first','F')};
 const encoded=encodeSettings(config),restored=decodeSettings(encoded);assert.equal(restored.duration,120);assert.equal(restored.roundType,'timed');assert.equal(restored.custom.key,'F');
 const old=JSON.parse(atob(encoded.replaceAll('-','+').replaceAll('_','/')));old.v=1;delete old.roundType;delete old.duration;delete old.custom.key;
 const legacy=decodeSettings(btoa(JSON.stringify(old)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''));assert.equal(legacy.roundType,'questions');assert.equal(legacy.duration,60);
});
