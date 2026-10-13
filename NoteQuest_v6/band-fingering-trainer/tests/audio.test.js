import {test} from 'node:test';
import assert from 'node:assert/strict';
import {soundingFrequency,scheduleNoteTone,toneProfiles} from '../dist/audio.js';
import {configuredInstrument} from '../dist/data.js';
test('audio uses concert pitch for transposing instruments and euphonium notation',()=>{
 const cases=[['flute','bass',69,440],['trumpet','bass',71,440],['clarinet','bass',71,440],['bass-clarinet','bass',71,220],['horn','bass',76,440],['alto-sax','bass',78,440],['tenor-sax','bass',71,220],['bari-sax','bass',78,220],['euphonium','treble',71,220],['euphonium','bass',57,220]];
 for(const[id,notation,midi,hz]of cases){const i=configuredInstrument(id,notation,3,false);assert(Math.abs(soundingFrequency(midi,i.transpose)-hz)<1e-8,id);}
});
test('instrument tone lasts one second with a final half-second decay and releases its nodes',()=>{
 const events=[];
 const param=name=>({setValueAtTime:(v,t)=>events.push([name,'set',v,t]),linearRampToValueAtTime:(v,t)=>events.push([name,'linear',v,t]),exponentialRampToValueAtTime:(v,t)=>events.push([name,'exponential',v,t])});
 const oscillator={setPeriodicWave:wave=>events.push(['wave',wave]),frequency:param('frequency'),connect:node=>events.push(['connect-osc',node]),start:t=>events.push(['start',t]),stop:t=>events.push(['stop',t]),disconnect:()=>events.push(['disconnect-osc'])};
 const gain={gain:param('gain'),connect:node=>events.push(['connect-gain',node]),disconnect:()=>events.push(['disconnect-gain'])};
 const context={currentTime:10,createPeriodicWave:(real,imag)=>({real,imag}),destination:{},createOscillator:()=>oscillator,createGain:()=>gain};
 scheduleNoteTone(context,71,-2);
 assert(events.some(e=>e[0]==='wave'&&e[1].imag.length>2));
 assert.deepEqual(events.filter(x=>x[0]==='frequency'),[['frequency','set',440,10]]);
 assert.deepEqual(events.filter(x=>x[0]==='gain'),[['gain','set',0,10],['gain','linear',.16,10.02],['gain','set',.16,10.5],['gain','exponential',.0001,11]]);
 assert.deepEqual(events.filter(x=>['start','stop'].includes(x[0])),[['start',10],['stop',11]]);
 oscillator.onended();assert.deepEqual(events.slice(-2),[['disconnect-osc'],['disconnect-gain']]);
});

test('all instrument profiles have upper harmonics and tuba emphasizes audible overtones',()=>{assert.equal(Object.keys(toneProfiles).length,13);for(const values of Object.values(toneProfiles)){assert(values.every(v=>Number.isFinite(v)&&v>=0));assert(values.slice(1).some(v=>v>0));}assert(toneProfiles.tuba[1]>toneProfiles.tuba[0]);assert(toneProfiles.tuba[2]>toneProfiles.tuba[0]);});

test('incorrect answers use the supplied MP3 and repeated playback restarts without overlap',async()=>{
 const {createIncorrectPlayer,incorrectSoundUrl}=await import('../dist/audio.js');
 const calls=[];let audio;
 class FakeAudio{constructor(url){this.src=url;this.currentTime=5;audio=this;calls.push(['source',url]);}pause(){calls.push(['pause']);}play(){calls.push(['play',this.currentTime]);return Promise.resolve();}}
 const play=createIncorrectPlayer(FakeAudio);play();play();
 assert.equal(audio.src,incorrectSoundUrl);assert.equal(audio.preload,'auto');
 assert.deepEqual(calls,[['source','audio/incorrect-buzz.mp3'],['pause'],['play',0],['pause'],['play',0]]);
 assert.doesNotThrow(createIncorrectPlayer(undefined));
});
test('an unavailable or blocked incorrect-answer MP3 never interrupts practice',async()=>{
 const {createIncorrectPlayer}=await import('../dist/audio.js');
 class BlockedAudio{pause(){}play(){return Promise.reject(Error('Playback blocked'));}}
 assert.doesNotThrow(createIncorrectPlayer(BlockedAudio));
 class BrokenAudio{constructor(){throw Error('Audio unavailable');}}
 assert.doesNotThrow(createIncorrectPlayer(BrokenAudio));
 await Promise.resolve();
});
