import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument,instruments} from '../dist/data.js';
import {practicePool} from '../dist/practice.js';
import {studentPreset,studentLevel} from '../dist/student-ui.js';
import {encodeSettings,decodeSettings} from '../dist/share.js';

const variants=[];
for(const i of instruments){
 for(const valves of ['euphonium','tuba'].includes(i.id)?[3,4]:[3])
 for(const notation of i.id==='euphonium'?['bass','treble']:['bass'])
 for(const attachment of i.id==='trombone'?[false,true]:[false])
 for(const hornType of i.id==='horn'?['single','double']:['double'])
 variants.push(configuredInstrument(i.id,notation,valves,attachment,hornType));
}
test('student levels retain five concert-scale first notes and expand to the full data for every equipment variant',()=>{
 for(const i of variants){
  const beginner=studentPreset(i,'beginner'),intermediate=studentPreset(i,'intermediate'),advanced=studentPreset(i,'advanced');
  const b=practicePool(i,beginner),m=practicePool(i,intermediate),a=practicePool(i,advanced);
  assert.equal(b.length,5,i.id+' beginner');assert.equal(beginner.chromatic,false);
  assert.deepEqual(b.map(n=>(n.midi+i.transpose)%12),[10,0,2,3,5],i.id);
  assert(intermediate.chromatic);assert(m.length>b.length,i.id+' intermediate');
  assert(a.length>m.length,i.id+' advanced');assert.deepEqual(a,i.notes);
  for(const [id,settings]of [['beginner',beginner],['intermediate',intermediate],['advanced',advanced]])assert.equal(studentLevel(i,settings),id,i.id);
 }
 const h=configuredInstrument('horn','bass',3,false,'single');
 assert.deepEqual(practicePool(h,studentPreset(h,'beginner','F')).map(n=>n.pitch),['C4','D4','E4','F4','G4']);
 const other=configuredInstrument('trombone');const switched=studentPreset(other,'beginner','F');
 assert.equal(switched.key,'Bb');assert.equal(practicePool(other,switched).length,5);
});
test('a shared customized pool is recognized as Custom and remains unchanged by level recognition',()=>{
 const i=configuredInstrument('euphonium','treble',4),custom=studentPreset(i,'advanced');custom.excluded=[i.notes[10].id];
 const config={instrument:i.id,mode:'interactive',count:30,notation:'treble',valves:4,keyboard:true,attachment:false,alternates:false,custom,maps:{},roundType:'questions',duration:60,customTime:false,hornType:'double'};
 const restored=decodeSettings(encodeSettings(config));const before=JSON.stringify(restored);
 assert.equal(studentLevel(i,restored.custom),'custom');assert.equal(JSON.stringify(restored),before);
 assert.deepEqual(practicePool(i,restored.custom),practicePool(i,custom));assert.equal(studentPreset(i,'custom'),null);
});
