import {validTimeLimit} from './timing.js';
import {instruments,configuredInstrument} from './data.js';
import {defaultPractice} from './practice.js';
import {valveBindings,validateBindings} from './keyboard.js';

// Versioned, allowlisted practice configuration; no scores or student data.
export function encodeSettings(config){
 const {instrument,mode,count,notation,valves,keyboard,attachment,alternates,custom,roundType='questions',duration=60,customTime=false,hornType='double'}=config;
 const i=configuredInstrument(instrument,notation,valves,attachment,hornType);
 const bindings=Object.fromEntries(valveBindings(i,config.maps?.[instrument+':'+valves]).map(([key,id])=>[id,key]));
 return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify({v:3,instrument,mode,count,notation,valves,keyboard,attachment,alternates,custom,bindings,roundType,duration,customTime,hornType})))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export function decodeSettings(encoded){
 try{
  if(!encoded||encoded.length>20000||!/^[\w-]+$/.test(encoded))return null;
  const p=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(encoded.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0))));
  if(![1,2,3].includes(p.v)||!instruments.some(i=>i.id===p.instrument)||!['challenge','interactive'].includes(p.mode)||![10,20,30].includes(p.count)||!['bass','treble'].includes(p.notation)||![3,4].includes(p.valves))return null;
  if(['keyboard','attachment','alternates'].some(k=>typeof p[k]!=='boolean'))return null;
  const hornType=p.hornType||'double';if(!['single','double'].includes(hornType))return null;
  const i=configuredInstrument(p.instrument,p.notation,p.valves,p.attachment,hornType),c=p.custom||defaultPractice(i);
  if(!['custom','first','building','chromatic','full','extremes'].includes(c.preset)||!i.notes.some(n=>n.midi===c.low)||!i.notes.some(n=>n.midi===c.high)||c.low>c.high)return null;
  if(['chromatic','sharps','flats','naturals'].some(k=>typeof c[k]!=='boolean')||!Array.isArray(c.excluded)||c.excluded.length>500||c.excluded.some(id=>typeof id!=='string'))return null;
  if(c.key!==undefined&&!['Bb','F'].includes(c.key))return null;
  if(p.customTime!==undefined&&typeof p.customTime!=='boolean')return null;
  const roundType=p.roundType||'questions',duration=p.duration??60;if(!['questions','timed'].includes(roundType)||!validTimeLimit(duration))return null;
  const custom={preset:c.preset,key:c.key||'Bb',low:c.low,high:c.high,chromatic:c.chromatic,sharps:c.sharps,flats:c.flats,naturals:c.naturals,excluded:[...new Set(c.excluded.filter(id=>i.notes.some(n=>n.id===id)))]};
  const bindings={};
  for(const [,id] of valveBindings(i)){
   if(typeof p.bindings?.[id]!=='string')return null;
   bindings[id]=p.bindings[id].toLowerCase();
  }
  if(validateBindings(bindings))return null;
  return {instrument:p.instrument,mode:p.mode,count:p.count,notation:p.notation,valves:p.valves,keyboard:p.keyboard,attachment:p.attachment,alternates:p.alternates,hornType,roundType,duration,customTime:!!p.customTime||![30,60,120,180,300].includes(duration),custom,maps:Object.keys(bindings).length?{[p.instrument+':'+p.valves]:bindings}:{}};
 }catch{return null;}
}
export function settingsUrl(address,config){
 const url=new URL(address);url.search='';url.hash='settings='+encodeSettings(config);return url.href;
}
