import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument} from '../dist/data.js';
import {brassDisplayKeys,brassDiagram} from '../dist/brass.js';
import {keyboardAction} from '../dist/keyboard.js';
import {bindChartDrag} from '../dist/drag.js';

test('horn visual T/1/2/3 order is independent of unchanged left-hand keyboard bindings',()=>{
 const i=configuredInstrument('horn');assert.deepEqual(brassDisplayKeys(i).map(k=>k.id),['Bb','V1','V2','V3']);
 assert.deepEqual(brassDisplayKeys(configuredInstrument('horn','bass',3,false,'single')).map(k=>k.id),['V1','V2','V3']);
 for(const [key,id]of [['e','V1'],['w','V2'],['q','V3'],['x','Bb']])assert.deepEqual(keyboardAction({key},{screen:'play',mode:'interactive',enabled:true,instrument:i}),{type:'valve',id});
 const html=brassDiagram({keys:['V3','Bb']},i);assert.deepEqual([...html.matchAll(/data-diagram-key="([^"]+)"/g)].map(m=>m[1]),['Bb','V1','V2','V3']);
 assert.match(html,/<rect data-diagram-key="Bb" class="pressed-mark"/);assert.match(html,/>T \+ 3<\/text>/);
 assert(!brassDiagram({keys:[]},configuredInstrument('horn','bass',3,false,'single')).includes('data-diagram-key="Bb"'));
});

test('trombone trigger diagrams use a distinct box only on attachment-equipped instruments',()=>{
 const on=configuredInstrument('trombone','bass',3,true),off=configuredInstrument('trombone','bass',3,false);
 assert.match(brassDiagram({keys:['P5','Sharp','Trigger']},on),/<rect data-diagram-key="Trigger" class="pressed-mark"/);
 assert.match(brassDiagram({keys:['P5','Sharp','Trigger']},on),/>Position T · ♯5<\/text>/);
 assert.match(brassDiagram({keys:['P1']},on),/<rect data-diagram-key="Trigger" class=""/);
 assert(!brassDiagram({keys:['P1']},off).includes('data-diagram-key="Trigger"'));
});

test('pointer strokes toggle each entered key, release existing selections, and toggle on deliberate re-entry',()=>{
 const listeners={},buttons=['L1','L2','L3'].map(id=>({dataset:{key:id},focus(){},closest(){return this;}}));
 const chart={addEventListener:(name,fn)=>listeners[name]=fn,setPointerCapture(){},hasPointerCapture:()=>true,releasePointerCapture(){},contains:b=>buttons.includes(b)};
 const previous=globalThis.document;globalThis.document={elementFromPoint:x=>x<0?null:buttons[Math.floor(x/30)]||null};
 let keys=['L2'];let changes=0;
 try{
  bindChartDrag(chart,{instrument:configuredInstrument('clarinet'),getKeys:()=>keys,setKeys:next=>{keys=next;changes++;},locked:()=>false});
  const event=(x,target=buttons[Math.min(2,Math.floor(x/30))])=>({target,clientX:x,clientY:0,isPrimary:true,button:0,pointerId:1,preventDefault(){},type:'pointerup'});
  listeners.pointerdown(event(10));assert.deepEqual(keys,['L2','L1']);
  listeners.pointermove(event(15));assert.equal(changes,1,'remaining inside L1 must not repeat-toggle');
  listeners.pointermove(event(45));assert.deepEqual(keys,['L1'],'entering selected L2 releases it');
  listeners.pointermove(event(75));assert.deepEqual(keys,['L1','L3']);
  listeners.pointermove(event(45));assert.deepEqual(keys,['L1','L3','L2'],'re-entering L2 presses it again');
  listeners.pointermove(event(10));assert.deepEqual(keys,['L3','L2'],'re-entering L1 releases it');
  listeners.pointerup(event(10));listeners.pointerdown(event(75));assert.deepEqual(keys,['L2'],'a new stroke over L3 deselects it');listeners.pointerup(event(75));
 }finally{globalThis.document=previous;}
});
