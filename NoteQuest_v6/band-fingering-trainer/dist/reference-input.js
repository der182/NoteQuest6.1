import {staffPosition} from './notation.js';
export function noteAtStaffY(notes,clef,y,preferredAccidental=''){
 if(!notes.length)return null;
 const distance=Math.min(...notes.map(n=>Math.abs(staffPosition(n.pitch,clef).y-y)));
 const candidates=notes.filter(n=>Math.abs(staffPosition(n.pitch,clef).y-y)===distance);
 const accidental=n=>staffPosition(n.pitch,clef).accidental;
 return candidates.find(n=>accidental(n)===preferredAccidental)||candidates.find(n=>!accidental(n))||candidates[0];
}
export function referenceStep(notes,clef,pitch,direction){
 const current=staffPosition(pitch,clef);return noteAtStaffY(notes,clef,current.y-direction*7,current.accidental);
}
export function bindReferenceDrag(root,instrument,getPitch,onChange){
 let gesture=null;
 const pointY=(e,inverse)=>{const svg=root.querySelector('.staff'),point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;return point.matrixTransform(inverse||svg.getScreenCTM().inverse()).y;};
 root.onpointerdown=e=>{
  if(e.button!==0||!e.target.closest('.note-head,.note-drag-hit'))return;
  e.preventDefault();const position=staffPosition(getPitch(),instrument.clef);
  gesture={id:e.pointerId,start:pointY(e),position,inverse:root.querySelector('.staff').getScreenCTM().inverse()};root.setPointerCapture(e.pointerId);root.classList.add('dragging');root.focus({preventScroll:true});
 };
 root.onpointermove=e=>{
  if(!gesture||e.pointerId!==gesture.id)return;
  e.preventDefault();const note=noteAtStaffY(instrument.notes,instrument.clef,gesture.position.y+pointY(e,gesture.inverse)-gesture.start,gesture.position.accidental);
  if(note&&note.pitch!==getPitch())onChange(note.id);
 };
 const finish=e=>{if(gesture&&e.pointerId===gesture.id){if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);gesture=null;root.classList.remove('dragging');}};
 root.onpointerup=finish;root.onpointercancel=finish;root.onlostpointercapture=()=>{gesture=null;root.classList.remove('dragging');};
 root.onkeydown=e=>{
  if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
  e.preventDefault();const note=e.key==='Home'?instrument.notes[0]:e.key==='End'?instrument.notes.at(-1):referenceStep(instrument.notes,instrument.clef,getPitch(),e.key==='ArrowUp'?1:-1);
  if(note)onChange(note.id);
 };
}
