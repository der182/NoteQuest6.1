import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {instruments} from '../dist/data.js';
import {bannerInstrumentName} from '../dist/banner.js';

test('shared header follows the selected instrument and page while paused-library browsing preserves the round instrument',()=>{
 const items=['home','practice','references','advanced'].map(page=>({dataset:{page},classList:{toggle(name,on){this.active=on;}},setAttribute(name,value){this[name]=value;},removeAttribute(name){delete this[name];}}));
 const pill={writes:0,set textContent(text){this.text=text;this.writes++;},get textContent(){return this.text;}};
 let selected=instruments.find(i=>i.id==='clarinet');
 const ctx={screen:'setup',page:'home',instrumentChosen:false,referenceInstrument:null,instruments,inst:()=>selected,bannerInstrumentName,document:{querySelectorAll:()=>items,querySelector:()=>pill}};
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function updateNavigation(){'),source.indexOf('function navigate(')),ctx);
 ctx.updateNavigation();assert.equal(pill.textContent,'Choose your instrument');
 ctx.instrumentChosen=true;
 for(const i of instruments){selected=i;for(const page of ['home','practice','advanced']){ctx.page=page;ctx.updateNavigation();assert.equal(pill.textContent,i.name);assert.equal(items.find(b=>b.classList.active).dataset.page,page);}}
 selected=instruments.find(i=>i.id==='clarinet');ctx.page='references';ctx.referenceInstrument='tuba';ctx.updateNavigation();assert.equal(pill.textContent,'Tuba');
 ctx.screen='play';ctx.updateNavigation();assert.equal(pill.textContent,'B♭ Clarinet');assert.equal(items.find(b=>b.classList.active).dataset.page,'practice');
 const count=pill.writes;ctx.updateNavigation();assert.equal(pill.writes,count,'unchanged instrument must not be repeatedly announced');
 ctx.screen='results';ctx.updateNavigation();assert.equal(pill.textContent,'B♭ Clarinet');assert.equal(selected.id,'clarinet');
});
