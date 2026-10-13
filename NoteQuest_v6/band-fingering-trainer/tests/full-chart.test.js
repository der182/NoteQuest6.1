import test from 'node:test';
import assert from 'node:assert/strict';
import {instruments,configuredInstrument} from '../dist/data.js';
import {signature} from '../dist/engine.js';
import {fullChartEntries,fullChartSection,fullChartBody,bindFullChart,updateFullChartSelection} from '../dist/full-chart.js';
const variants=()=>instruments.flatMap(i=>i.id==='horn'?['single','double'].map(h=>configuredInstrument(i.id,'bass',3,false,h)):i.id==='trombone'?[false,true].map(t=>configuredInstrument(i.id,'bass',3,t)):i.id==='euphonium'?['bass','treble'].flatMap(c=>[3,4].map(v=>configuredInstrument(i.id,c,v))):i.id==='tuba'?[3,4].map(v=>configuredInstrument(i.id,'bass',v)):[configuredInstrument(i.id)]);

test('full charts cover every supported spelling/pitch and unique fingering for all equipment variants',()=>{
 for(const i of variants()){
  const before=JSON.stringify(i),entries=fullChartEntries(i),midi=[...new Set(i.notes.map(n=>n.midi))].sort((a,b)=>a-b);
  assert.deepEqual(entries.map(e=>e.midi),midi,i.system);
  assert.deepEqual(entries.flatMap(e=>e.notes.map(n=>n.id)).sort(),i.notes.map(n=>n.id).sort(),i.system);
  for(const e of entries){
   assert.equal(signature(e.fingerings[0]),signature(e.notes[0].fingerings[0]),i.system+' primary');
   assert.deepEqual(new Set(e.fingerings.map(f=>signature(f))),new Set(e.notes.flatMap(n=>n.fingerings.map(f=>signature(f)))),i.system+' alternates');
   assert.equal(new Set(e.fingerings.map(f=>signature(f))).size,e.fingerings.length);
   for(const f of e.fingerings)for(const key of f.keys)assert(i.keys.some(k=>k.id===key),i.system+' unavailable key '+key);
  }
  assert.equal(JSON.stringify(i),before,'chart construction must not mutate exercise/source data');
 }
});

test('full chart bodies render every note in its written clef with primary/alternate diagrams and accessible descriptions',()=>{
 for(const i of variants()){
  const entries=fullChartEntries(i),html=fullChartBody(i);
  assert.equal((html.match(/data-full-midi=/g)||[]).length,entries.length);
  for(const n of i.notes){assert(html.includes(`data-full-note="${n.id}"`),i.system+' '+n.id);assert(html.includes(`, ${i.clef} clef"`));}
  assert.equal((html.match(/<figure class="full-chart-fingering">/g)||[]).length,entries.reduce((count,e)=>count+e.fingerings.length,0));
  assert.equal((html.match(/>Main fingering<span/g)||[]).length,entries.length);
  assert.equal((html.match(/class="full-chart-alternates"/g)||[]).length,entries.filter(e=>e.fingerings.length>1).length);
  assert(!html.includes('undefined'));assert(html.includes('including notes outside your practice selection'));
  if(i.id==='horn'&&i.hornType==='single')assert(!html.includes('data-diagram-key="Bb"'));
  if(['euphonium','tuba'].includes(i.id)&&i.valveCount===3)assert(!html.includes('data-diagram-key="V4"'));
  if(i.id==='trombone'&&!i.attachment)assert(!html.includes('data-diagram-key="Trigger"'));
 }
});

test('full chart sections begin collapsed with no eagerly generated chart artwork',()=>{
 for(const i of variants()){
  const html=fullChartSection(i);assert.match(html,/^<details class="full-fingering-chart panel">/);
  assert(!html.includes(' open'));assert(!html.includes('<svg'));assert(html.includes('Full fingering chart'));assert(html.includes('<div class="full-chart-body"></div>'));
 }
});

test('expansion renders once, preserving chart state; note links keep exact enharmonic spellings',()=>{
 const i=configuredInstrument('clarinet'),entries=fullChartEntries(i),listeners={},body={writes:0,set innerHTML(html){this.html=html;this.writes++;}};
 const cards=entries.map(e=>({dataset:{fullMidi:String(e.midi)},classList:{toggle(name,on){this.active=on;}}}));
 const buttons=i.notes.map(n=>({dataset:{fullNote:n.id},setAttribute(name,value){this[name]=value;},removeAttribute(name){delete this[name];},closest(){return this;}}));
 const details={open:false,querySelector:()=>body,querySelectorAll:s=>s==='[data-full-midi]'?cards:buttons,addEventListener:(name,fn)=>listeners[name]=fn,contains:b=>buttons.includes(b)};
 let pitch='C#4';bindFullChart(details,i,()=>pitch,id=>{pitch=id;updateFullChartSelection(details,i,pitch);});
 listeners.toggle();assert.equal(body.writes,0);details.open=true;listeners.toggle();assert.equal(body.writes,1);
 assert.equal(buttons.find(b=>b.dataset.fullNote==='C#4')['aria-current'],'true');
 details.open=false;listeners.toggle();details.open=true;listeners.toggle();assert.equal(body.writes,1,'reopening must keep the same chart and alternate expanders');
 listeners.click({target:buttons.find(b=>b.dataset.fullNote==='Db4')});assert.equal(pitch,'Db4');assert.equal(buttons.find(b=>b.dataset.fullNote==='Db4')['aria-current'],'true');assert(!buttons.find(b=>b.dataset.fullNote==='C#4')['aria-current']);assert.equal(cards.filter(c=>c.classList.active).length,1);
});
