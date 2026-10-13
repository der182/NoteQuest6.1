import test from 'node:test';
import assert from 'node:assert/strict';
import {answerFingerings,nextAnswerIndex,DEFAULT_ALTERNATES} from '../dist/answers.js';
import {configuredInstrument,instruments} from '../dist/data.js';
import {withAlternates} from '../dist/practice.js';
import {accepts,signature} from '../dist/engine.js';
test('alternate answers start disabled and reveal only the chart primary by default',()=>{
 assert.equal(DEFAULT_ALTERNATES,false);
 const source=configuredInstrument('trumpet'),note=source.notes.find(n=>n.pitch==='E4');
 assert(note.fingerings.length>1);assert.deepEqual(answerFingerings(note),[note.fingerings[0]]);
 const exercise=withAlternates(source,DEFAULT_ALTERNATES).notes.find(n=>n.pitch==='E4');
 assert(!accepts(exercise,note.fingerings[1]));assert(accepts(exercise,note.fingerings[0]));
});
test('answer browsing shows each accepted combination once, primary first, without changing the data',()=>{
 for(const source of instruments){
  const i=configuredInstrument(source.id,'bass',4,true,'double');const before=JSON.stringify(i.notes);
  for(const note of i.notes){const views=answerFingerings(note,true);
   assert.equal(views[0],note.fingerings[0]);assert.equal(new Set(views.map(f=>signature(f))).size,views.length);
   assert(views.every(f=>accepts(note,f)));assert.deepEqual(answerFingerings(note,false),[note.fingerings[0]]);
  }
  assert.equal(JSON.stringify(i.notes),before);
 }
 const duplicate={fingerings:[{keys:['V1','V2'],partial:2},{keys:['V2','V1'],partial:3},{keys:['V3'],partial:2}]};
 assert.equal(answerFingerings(duplicate,true).length,2);
});
test('previous/next accepted-fingering arrows wrap and remain in bounds',()=>{
 assert.equal(nextAnswerIndex(0,-1,3),2);assert.equal(nextAnswerIndex(2,1,3),0);
 assert.equal(nextAnswerIndex(0,1,1),0);assert.equal(nextAnswerIndex(0,1,0),0);
});
