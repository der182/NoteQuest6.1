import {cycleHole} from './woodwinds.js';
// Explicit selection helper also preserves fractional/linked-thumb exclusivity.
export function paintKey(keys,id,pressed,instrument){
 let next=keys.filter(k=>id==='L1'?k!=='L1'&&!k.startsWith('L1:'):k!==id);
 if(!pressed)return next;
 if(instrument.id==='flute'&&['T','BbT'].includes(id))next=next.filter(k=>!['T','BbT'].includes(k));
 return [...next,id];
}
export function bindChartDrag(chart,{instrument,getKeys,setKeys,locked}){
 if(!chart)return;
 let gesture=null,suppressClick=false;
 const apply=id=>{
  if(!gesture)return;
  const eligible=id&&(!gesture.mainOnly||/^[LR][123]$/.test(id));
  const next=eligible?id:null;if(next===gesture.over)return;gesture.over=next;if(!next)return;
  const keys=getKeys(),selected=keys.includes(id)||(id==='L1'&&keys.some(k=>k.startsWith('L1:')));
  setKeys(paintKey(keys,id,!selected,instrument));
 };
 chart.addEventListener('pointerdown',e=>{
  const button=e.target.closest('[data-key]');if(!button||button.disabled||locked()||!e.isPrimary||e.button!==0)return;
  const id=button.dataset.key;
  gesture={pointerId:e.pointerId,start:id,mainOnly:/^[LR][123]$/.test(id),x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false,over:null};chart.setPointerCapture(e.pointerId);
  // A fractional first hole must keep its tap-to-cycle behavior.
  if(id!=='L1'||!instrument.keys.some(k=>k.id.startsWith('L1:')))apply(id);
  button.focus({preventScroll:true});e.preventDefault();
 });
 chart.addEventListener('pointermove',e=>{
  if(!gesture||e.pointerId!==gesture.pointerId||locked())return;
  if(!gesture.moved&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>4){gesture.moved=true;if(gesture.start==='L1'&&instrument.keys.some(k=>k.id.startsWith('L1:')))apply(gesture.start);}
  if(!gesture.moved)return;
  // Sample the swept path so a quick/coalesced pointer move cannot skip holes.
  const dx=e.clientX-gesture.lastX,dy=e.clientY-gesture.lastY,steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));
  for(let j=1;j<=steps;j++){const target=document.elementFromPoint(gesture.lastX+dx*j/steps,gesture.lastY+dy*j/steps)?.closest('[data-key]');apply(target&&chart.contains(target)&&!target.disabled?target.dataset.key:null);}
  gesture.lastX=e.clientX;gesture.lastY=e.clientY;
 });
 const finish=e=>{if(!gesture||e.pointerId!==gesture.pointerId)return;const fractional=gesture.start==='L1'&&instrument.keys.some(k=>k.id.startsWith('L1:'));if(e.type==='pointerup'&&fractional&&!gesture.moved&&!locked())setKeys(cycleHole(instrument,getKeys()));suppressClick=true;gesture=null;if(chart.hasPointerCapture(e.pointerId))chart.releasePointerCapture(e.pointerId);};
 chart.addEventListener('pointerup',finish);chart.addEventListener('pointercancel',finish);chart.addEventListener('lostpointercapture',()=>{gesture=null;});
 chart.addEventListener('click',e=>{if(e.detail&&suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
}
