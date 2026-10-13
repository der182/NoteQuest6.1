import {signature} from './engine.js';
export const DEFAULT_ALTERNATES=false;
// Partial metadata does not create a new playable valve/position combination.
// Preserve source ordering so the chart's primary fingering always comes first.
export function answerFingerings(note,alternates=false){
 const seen=new Set();return note.fingerings.filter((f,index)=>{
  if(!alternates&&index>0)return false;
  const key=signature(f);if(seen.has(key))return false;seen.add(key);return true;
 });
}
export function nextAnswerIndex(index,step,count){return count?((index+step)%count+count)%count:0;}
