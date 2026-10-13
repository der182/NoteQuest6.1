import test from 'node:test';
import assert from 'node:assert/strict';
import {newClock,elapsedMs,pauseClock,resumeClock,timeExpired,formatTime} from '../dist/timing.js';
import {newRound,submit,reveal,advance} from '../dist/engine.js';
test('stopwatch pauses for settings and checks the exact deadline independently of tick frequency',()=>{
 const c=newClock(1000,30);assert.equal(formatTime(elapsedMs(c,12500)),'0:11');
 pauseClock(c,13000);pauseClock(c,15000);assert.equal(elapsedMs(c,90000),12000);assert.equal(timeExpired(c,90000),false);
 resumeClock(c,90000);resumeClock(c,95000);assert.equal(timeExpired(c,107999),false);assert.equal(timeExpired(c,108000),true);
 assert.equal(formatTime(125000),'2:05');assert.equal(timeExpired(newClock(0),99999999),false);
});
test('timed score includes corrected answers once but excludes reveals and duplicate submissions',()=>{
 const n={id:'C4',fingerings:[{keys:['V1']}]},r=newRound([n,n,n]);
 submit(r,{keys:[]});submit(r,{keys:['V1']});submit(r,{keys:['V1']});assert.equal(r.correct,1);assert.equal(r.firstCorrect,0);
 advance(r);reveal(r);assert.equal(r.correct,1);advance(r);submit(r,{keys:['V1']});assert.equal(r.correct,2);assert.equal(r.firstCorrect,1);
});
