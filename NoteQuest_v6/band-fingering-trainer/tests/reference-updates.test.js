import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument,instruments} from '../dist/data.js';
import {accepts,choicesFor} from '../dist/engine.js';
import {withAlternates,defaultPractice,practicePool} from '../dist/practice.js';
import {parseTimeLimit,validTimeLimit} from '../dist/timing.js';
import {encodeSettings,decodeSettings} from '../dist/share.js';
const note=(i,pitch)=>i.notes.find(n=>n.pitch===pitch);
const keys=text=>({keys:text.split(' ').filter(Boolean)});
test('horn PDF preferred order and added trigger alternatives work with alternates on/off',()=>{
 const i=configuredInstrument('horn');
 for(const [pitch,primary,alternate] of [['D3','Bb V1 V2','V1 V3'],['Ab4','Bb V2 V3','V2 V3'],['A4','Bb V1 V2','V1 V2'],['Db5','Bb V2 V3','V1 V2'],['Gb5','Bb V2','Bb V1 V2'],['G5','Bb','Bb V1']]){
  assert.deepEqual(new Set(note(i,pitch).fingerings[0].keys),new Set(keys(primary).keys));
  assert(accepts(note(i,pitch),keys(alternate)),pitch);
  assert(!accepts(note(withAlternates(i,false),pitch),keys(alternate)),pitch+' primary only');
 }
 assert(accepts(note(i,'G#4'),keys('Bb V2 V3')));
});
test('slide adjustments are answer-bearing and do not transpose the note',()=>{
 const i=configuredInstrument('trombone','bass',3,true);
 for(const [pitch,good,bad]of [['Bb3','P5 Sharp','P5'],['D2','P4 Flat Trigger','P4 Trigger'],['B3','P7 Flat','P7'],['F4','P4 Sharp','P4']]){
  const n=note(i,pitch);assert(accepts(n,keys(good)),pitch);assert(!accepts(n,keys(bad)),pitch+' missing adjustment');assert(!accepts(n,keys(good+' Flat Sharp')),pitch+' contradictory');
 }
 assert.deepEqual(note(i,'C2').fingerings[0].keys,['P7','Trigger']);
 assert.deepEqual(note(i,'Gb4').fingerings[0].keys,['P3','Sharp']);
 for(const alternates of [true,false])for(const n of withAlternates(i,alternates).notes){const options=choicesFor(n,withAlternates(i,alternates));assert.equal(options.filter(f=>accepts(n,f)).length,1);}
});
test('clarinet PDF combined pinkies, fork/sliver and throat alternatives work on both clarinets',()=>{
 for(const id of ['clarinet','bass-clarinet']){
  const i=configuredInstrument(id);
  for(const [pitch,answer] of [['E3','T L1 L2 L3 R1 R2 R3 LE RF'],['F#3','T L1 L2 L3 R1 R2 R3 LF# RF'],['B3','T L1 L2 L3 R1 ForkB'],['Eb4','T L1 L2 SliverEb'],['Eb4','T L1 R1'],['F#4','T SideEb Trill2'],['A4','A L2 L3 R2 R3 RF'],['Bb4','A Trill2 Trill3'],['Bb5','Reg T L1 R1']])assert(accepts(note(i,pitch),keys(answer)),id+' '+pitch);
  assert(!accepts(note(withAlternates(i,false),'Bb4'),keys('A Trill2 Trill3')));
 }
 const i=configuredInstrument('clarinet');for(const [pitch,answer]of [['Eb6','Reg T L2 L3 R1 ForkB RAb'],['F6','Reg T L1 L2 L3 R1 R2 R3 C#'],['G6','Reg T L1 L3 R1 R2 R3 RAb']])assert(accepts(note(i,pitch),keys(answer)),pitch);
});
test('full range includes every note while every extremes preset excludes the middle',()=>{
 for(const source of instruments)for(const attachment of source.id==='trombone'?[false,true]:[false]){
  const i=configuredInstrument(source.id,'bass',3,attachment),full=practicePool(i,defaultPractice(i,'full')),extreme=practicePool(i,defaultPractice(i,'extremes'));
  assert.equal(full.length,i.notes.length,i.id);assert(extreme.length>0&&extreme.length<full.length,i.id);
  const midis=full.map(n=>n.midi),lo=Math.min(...midis),hi=Math.max(...midis);assert(extreme.some(n=>n.midi===lo)&&extreme.some(n=>n.midi===hi),i.id);
  assert(extreme.every(n=>i.id.includes('sax')?n.midi<=60||n.midi>=86:n.midi<=lo+5||n.midi>=hi-5),i.id);
 }
});
test('custom time validates minutes/seconds and survives settings sharing',()=>{
 assert.equal(parseTimeLimit('01:30'),90);assert.equal(parseTimeLimit('1:30'),90);assert.equal(parseTimeLimit('99:59'),5999);
 for(const s of ['00:00','01:60','-1:00','1.5','100:00','1:3','abc'])assert.equal(parseTimeLimit(s),null,s);
 for(const v of [0,-1,6000,1.5,NaN,Infinity])assert(!validTimeLimit(v));
 const i=configuredInstrument('trombone','bass',3,true),config={hornType:'double',instrument:'trombone',mode:'interactive',count:10,notation:'bass',valves:3,keyboard:true,attachment:true,alternates:true,custom:defaultPractice(i),maps:{},roundType:'timed',duration:90,customTime:true};
 assert.deepEqual(decodeSettings(encodeSettings(config)),config);
});
