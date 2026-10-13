import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {configuredInstrument} from '../dist/data.js';
import {newClock,elapsedMs,pauseClock,resumeClock} from '../dist/timing.js';
import {answerFingerings} from '../dist/answers.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const section=(from,to)=>source.slice(source.indexOf(from),source.indexOf(to,source.indexOf(from)));

test('Note Library browsing uses its own instrument without mutating the active exercise',()=>{
 const config={instrument:'clarinet',notation:'bass',valves:3,attachment:false,hornType:'double'};
 const ctx={config,referenceInstrument:'horn',referencePitch:'G4',referenceAlternate:0,configuredInstrument,answerFingerings,activePool:()=>configuredInstrument('clarinet').notes.slice(0,5)};
 vm.createContext(ctx);vm.runInContext(section('function referenceSelection(){','function referenceChartContent('),ctx);
 const original=structuredClone(config),r=ctx.referenceSelection();assert.equal(r.i.id,'horn');assert.equal(r.n.pitch,'G4');assert.deepEqual(config,original);
 ctx.referenceInstrument='trombone';ctx.referencePitch='Bb3';const t=ctx.referenceSelection();assert.equal(t.i.id,'trombone');assert.equal(t.n.pitch,'Bb3');assert.deepEqual(config,original);
});

test('mid-round library preserves question/selection and holds the clock and pending advancement until close',()=>{
 let now=5000;const handlers={},elements={'#close-library':{},'.library-content':{}},dialog={setAttribute(){},querySelector:s=>elements[s],addEventListener:(name,fn)=>handlers[name]=fn,showModal(){this.open=true;},close(){this.open=false;handlers.close?.();}};
 const round={index:4,solved:true,queue:Array.from({length:10},()=>({id:'G4'}))},selection={keys:['L1','L2']},config={instrument:'clarinet'};
 const ctx={config,round,selection,screen:'play',settingsDraft:false,modalPause:false,advanceAt:8000,advanceRemaining:null,timer:1,roundClock:newClock(0),referenceInstrument:null,referencePitch:null,referenceAlternate:0,performance:{now:()=>now},pauseClock,resumeClock,clearTimeout(){},updateClock(){},scheduleAdvance:delay=>ctx.scheduledDelay=delay,renderReferences:(root,floating)=>ctx.rendered={root,floating},document:{querySelector:()=>null,createElement:()=>dialog,body:{append(){}}}};
 vm.createContext(ctx);vm.runInContext(section('function openNoteLibrary(){','function setup(){'),ctx);vm.runInContext(section('function pauseForModal(dialog){','function rangeText('),ctx);
 ctx.openNoteLibrary();assert(dialog.open);assert.equal(ctx.modalPause,true);assert.equal(ctx.referencePitch,'G4');assert.equal(ctx.rendered.floating,true);assert.equal(ctx.advanceRemaining,3000);
 now=65000;assert.equal(elapsedMs(ctx.roundClock,now),5000,'library time must not count as play time');
 const nested={addEventListener(){throw Error('nested guide must not resume the library pause');}};ctx.pauseForModal(nested);assert.equal(ctx.modalPause,true);
 dialog.close();assert.equal(ctx.modalPause,false);assert.equal(ctx.scheduledDelay,3000);assert.strictEqual(ctx.round,round);assert.strictEqual(ctx.selection,selection);assert.equal(round.index,4);assert.deepEqual(selection.keys,['L1','L2']);assert.equal(config.instrument,'clarinet');
 now=66000;assert.equal(elapsedMs(ctx.roundClock,now),6000);
});
