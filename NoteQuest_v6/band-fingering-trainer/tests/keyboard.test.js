import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuredInstrument} from '../dist/data.js';
import {valveBindings,keyboardAction} from '../dist/keyboard.js';
const state=(id,mode='challenge',valves=3)=>({instrument:configuredInstrument(id,'bass',valves),mode,screen:'play',enabled:true,solved:false,dialogOpen:false,editingText:false});
const action=(key,s,extra={})=>keyboardAction({key,...extra},s);
test('bracket shortcuts select valves only in Build the Combination',()=>{
 for(const mode of ['interactive'])for(const id of ['trumpet','euphonium','tuba']){
  const s=state(id,mode);
  for(const n of [1,2,3])assert.deepEqual(action(['[',']','\\'][n-1],s),{type:'valve',id:'V'+n});
  assert.equal(action('4',s),null);
  if(id!=='trumpet')assert.deepEqual(action('\\',state(id,mode,4)),{type:'valve',id:'V4'});
 }
});
test('horn uses Q/W/E for valves 3/2/1 and X for the trigger',()=>{
 for(const mode of ['interactive']){
  const s=state('horn',mode);
  for(const [key,id] of [['q','V3'],['w','V2'],['e','V1'],['x','Bb']]){
   assert.deepEqual(action(key,s),{type:'valve',id});assert.deepEqual(action(key.toUpperCase(),s),{type:'valve',id});
  }
  assert.equal(action('1',s),null);
 }
 assert.deepEqual(valveBindings(state('horn').instrument).map(([,id])=>id),['V3','V2','V1','Bb']);
});
test('choice shortcuts stay distinct from valve shortcuts',()=>{
 for(const id of ['trumpet','horn','tuba','euphonium'])for(let j=0;j<4;j++)assert.deepEqual(action('ABCD'[j],state(id)),{type:'choice',index:j});
 for(const id of ['clarinet','trombone'])for(let j=0;j<4;j++)assert.deepEqual(action(String(j+1),state(id)),{type:'choice',index:j});
 assert.equal(action('a',state('trumpet','interactive')),null);
});
test('shortcuts respect opt-out, repeat, modifiers, dialogs, text inputs, and completed questions',()=>{
 const s=state('trumpet');assert.equal(action('[',{...s,enabled:false}),null);
 assert.deepEqual(action('a',{...s,enabled:false}),{type:'choice',index:0});
 for(const extra of [{repeat:true},{ctrlKey:true},{altKey:true},{metaKey:true}])assert.equal(action('[',s,extra),null);
 for(const override of [{dialogOpen:true},{editingText:true},{screen:'results'},{screen:'setup'},{solved:true}])assert.equal(action('[',{...s,...override}),null);
 assert.equal(action('ArrowLeft',s),null);assert.equal(action('Enter',s),null);
});

test('Multiple Choice ignores all configured valve bindings for every valved instrument',()=>{
 for(const id of ['trumpet','horn','euphonium','tuba'])for(const valves of [3,4]){
  const s=state(id,'challenge',valves);
  for(const [key]of valveBindings(s.instrument))assert.equal(action(key,s),null,id+' '+key);
  const mapping=Object.fromEntries(valveBindings(s.instrument).map(([,v],j)=>[v,String(j+1)]));
  for(const key of Object.values(mapping))assert.equal(action(key,{...s,mapping}),null,id+' remapped '+key);
  for(let j=0;j<4;j++)assert.deepEqual(action('abcd'[j],{...s,mapping}),{type:'choice',index:j});
 }
});
