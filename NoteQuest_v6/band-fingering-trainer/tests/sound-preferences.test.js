import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {soundDefaults,cleanPreferences,loadPreferences,applyPreferences,restoreSoundDefaults,accentPresets} from '../dist/preferences.js';
import {scheduleNoteTone,playAnswerTone,playNoteTone,createIncorrectPlayer} from '../dist/audio.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');

test('new device preferences migrate old settings, sanitize volume/size, and persist without storage failures',()=>{
 assert.deepEqual(cleanPreferences({accent:'pink',dark:true,wrongSound:false}),{accent:'pink',dark:true,wrongSound:false,correctSound:true,chartSize:'standard',noteVolume:1,wrongVolume:1});
 assert.equal(cleanPreferences({noteVolume:-2,wrongVolume:5}).noteVolume,0);assert.equal(cleanPreferences({wrongVolume:5}).wrongVolume,1);
 assert.equal(cleanPreferences({noteVolume:NaN,wrongVolume:Infinity,chartSize:'giant'}).noteVolume,1);assert.equal(cleanPreferences({chartSize:'giant'}).chartSize,'standard');
 assert.equal(cleanPreferences({noteVolume:.125}).noteVolume,.13);
 const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},root={dataset:{},style:{setProperty(){}}};
 const prefs=applyPreferences({accent:'green',dark:true,chartSize:'large',noteVolume:.42,wrongVolume:.08,correctSound:false,wrongSound:false},root,storage);
 assert.equal(root.dataset.chartSize,'large');assert.deepEqual(loadPreferences(storage),prefs);
 assert.doesNotThrow(()=>applyPreferences(prefs,root,{setItem(){throw Error('Storage unavailable');}}));
});

test('restoring sound defaults preserves accent, dark mode, and chart size',()=>{
 const original={accent:'red',dark:true,chartSize:'large',noteVolume:.1,wrongVolume:0,correctSound:false,wrongSound:false},restored=restoreSoundDefaults(original);
 assert.deepEqual(restored,{accent:'red',dark:true,chartSize:'large',...soundDefaults});assert.equal(original.noteVolume,.1);assert.equal(original.correctSound,false);
});

test('note volume scales the entire envelope without changing concert frequency or one-second duration',()=>{
 const events=[],gain={gain:{setValueAtTime:(v,t)=>events.push(['set',v,t]),linearRampToValueAtTime:(v,t)=>events.push(['linear',v,t]),exponentialRampToValueAtTime:(v,t)=>events.push(['fade',v,t])},connect(){},disconnect(){}},osc={setPeriodicWave(){},frequency:{setValueAtTime:(v,t)=>events.push(['frequency',v,t])},connect(){},start:t=>events.push(['start',t]),stop:t=>events.push(['stop',t]),disconnect(){}},ctx={currentTime:10,createOscillator:()=>osc,createGain:()=>gain,createPeriodicWave:()=>({}),destination:{}};
 scheduleNoteTone(ctx,71,-2,'trumpet',.25);
 assert(events.some(e=>e[0]==='linear'&&e[1]===.04));assert(events.some(e=>e[0]==='set'&&e[1]===.04&&e[2]===10.5));assert(events.some(e=>e[0]==='fade'&&e[1]===.000025));assert(events.some(e=>e[0]==='frequency'&&e[1]===440));assert(events.some(e=>e[0]==='stop'&&e[1]===11));
 assert.equal(scheduleNoteTone({createOscillator(){throw Error('Must stay silent');}},69,0,'flute',0),null);
});

test('muted automatic answers still notify advancement; manual Hear Tone stays audible at note volume',()=>{
 const previous=globalThis.AudioContext;let created=0,peak=0,context,started=0;
 class FakeContext{constructor(){created++;context=this;this.state='running';this.currentTime=0;this.destination={};}createPeriodicWave(){return {};}createOscillator(){return {setPeriodicWave(){},frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime:v=>peak=v,exponentialRampToValueAtTime(){}},connect(){}};}}
 globalThis.AudioContext=FakeContext;
 try{
  playAnswerTone(60,0,'tuba',()=>started++,false,1);playAnswerTone(60,0,'tuba',()=>started++,true,0);assert.equal(started,2);assert.equal(created,0);
  playNoteTone(60,0,'tuba',()=>started++,.4);assert.equal(started,3);assert.equal(created,1);assert(Math.abs(peak-.064)<1e-10);
 }finally{if(context)context.state='closed';globalThis.AudioContext=previous;}
});

test('incorrect-answer volume is independent and zero stops existing playback without starting another sample',()=>{
 const calls=[];let audio;
 class FakeAudio{constructor(){audio=this;}pause(){calls.push('pause');}play(){calls.push(['play',this.volume]);return Promise.resolve();}}
 const play=createIncorrectPlayer(FakeAudio);play(.2);play(.8);play(0);
 assert.deepEqual(calls,['pause',['play',.2],'pause',['play',.8],'pause']);assert.equal(audio.volume,0);
 assert.doesNotThrow(()=>createIncorrectPlayer(class {constructor(){throw Error('Must not initialize muted sound');}})(0));
});

test('Appearance & Sound form has two sections and sound reset updates only sound controls',()=>{
 const controls={'[name="accent"]:checked':{value:'pink'},'#dark-mode':{checked:true},'#preferred-chart-size':{value:'large'},'#note-volume':{value:25},'#wrong-volume':{value:12},'#correct-sound':{checked:false},'#wrong-sound':{checked:false},'#note-volume-value':{},'#wrong-volume-value':{},'#restore-sound-defaults':{},'#sound-settings-status':{}};
 for(const c of Object.values(controls)){c.setAttribute=(name,value)=>c[name]=value;}
 const root={querySelector:s=>controls[s],querySelectorAll:s=>s==='#note-volume,#wrong-volume'?[controls['#note-volume'],controls['#wrong-volume']]:[controls['#dark-mode'],controls['#preferred-chart-size'],controls['#correct-sound'],controls['#wrong-sound']]};
 const ctx={preferences:cleanPreferences(),accentPresets,applyPreferences,restoreSoundDefaults,document:{documentElement:{dataset:{},style:{setProperty(){}}}},preferenceStorage:undefined,app:{querySelector:()=>null}};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function advancedFields(){'),source.indexOf('function openPracticeSettings(){')),ctx);
 const html=ctx.advancedFields();assert.equal((html.match(/class="preference-section"/g)||[]).length,2);assert(html.includes('<h3>Appearance</h3>'));assert(html.includes('<h3>Sound</h3>'));assert(!html.includes('Accessibility'));
 ctx.bindAdvanced(root);controls['#note-volume'].oninput();assert.equal(ctx.preferences.chartSize,'large');assert.equal(ctx.preferences.correctSound,false);assert.equal(ctx.preferences.noteVolume,.25);assert.equal(controls['#note-volume-value'].textContent,'25%');
 controls['#restore-sound-defaults'].onclick();assert.equal(ctx.preferences.accent,'pink');assert.equal(ctx.preferences.dark,true);assert.equal(ctx.preferences.chartSize,'large');assert.equal(ctx.preferences.noteVolume,1);assert.equal(ctx.preferences.wrongVolume,1);assert.equal(controls['#correct-sound'].checked,true);assert.equal(controls['#wrong-sound'].checked,true);assert.equal(controls['#sound-settings-status'].textContent,'Sound defaults restored.');
});
