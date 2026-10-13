import test from 'node:test';
import assert from 'node:assert/strict';
import {instruments,configuredInstrument} from '../dist/data.js';
import {staffPosition} from '../dist/notation.js';
import {noteAtStaffY,referenceStep} from '../dist/reference-input.js';
test('reference dragging selects the closest supported staff position in either clef and clamps at the limits',()=>{
 for(const source of instruments){const i=configuredInstrument(source.id,'bass',4,true);
  for(const n of i.notes){const p=staffPosition(n.pitch,i.clef);const target=noteAtStaffY(i.notes,i.clef,p.y,p.accidental);assert.equal(staffPosition(target.pitch,i.clef).y,p.y);}
  const positions=i.notes.map(n=>staffPosition(n.pitch,i.clef).y);
  assert.equal(staffPosition(noteAtStaffY(i.notes,i.clef,-999).pitch,i.clef).y,Math.min(...positions));
  assert.equal(staffPosition(noteAtStaffY(i.notes,i.clef,999).pitch,i.clef).y,Math.max(...positions));
 }
 assert.equal(noteAtStaffY([],'treble',100),null);
});
test('staff dragging preserves the accidental style when available and otherwise prefers a natural',()=>{
 const i=configuredInstrument('clarinet');const y=staffPosition('F4','treble').y;
 assert.equal(noteAtStaffY(i.notes,'treble',y,'#').pitch,'F#4');
 assert.equal(noteAtStaffY(i.notes,'treble',y,'').pitch,'F4');
 assert.equal(noteAtStaffY(i.notes,'treble',y,'b').pitch,'F4');
});
test('reference keyboard steps follow written staff letters rather than chromatic MIDI steps',()=>{
 const i=configuredInstrument('clarinet');assert.equal(referenceStep(i.notes,'treble','C4',1).pitch,'D4');
 assert.equal(referenceStep(i.notes,'treble','C4',-1).pitch,'B3');
 assert.equal(referenceStep(i.notes,'treble','F#4',1).pitch,'G#4');
});
