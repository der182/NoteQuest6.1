import {pitchName} from './data.js';
import {staff,staffPosition} from './notation.js';
import {woodwindChart} from './woodwinds.js';
import {brassDiagram,slideCaption} from './brass.js';
import {answerFingerings} from './answers.js';
const chartEscape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

export function fingeringCaption(f,i){
 if(i.kind==='slide')return 'Position '+slideCaption(f);
 const labels=f.keys.map(id=>{const key=i.keys.find(k=>k.id===id);if(!key)return id;return i.keys.filter(k=>k.label===key.label).length>1?key.group+' '+key.label:key.label;});
 return labels.length?labels.join(' + '):'Open — no keys pressed';
}
// Combine enharmonic spellings without omitting any supported written note.
// Diagram identity ignores brass partial metadata, just like game answers.
export function fullChartEntries(i){
 const groups=new Map();
 for(const n of i.notes){if(!groups.has(n.midi))groups.set(n.midi,[]);groups.get(n.midi).push(n);}
 return [...groups].sort(([a],[b])=>a-b).map(([midi,records])=>{
  const notes=[...records].sort((a,b)=>staffPosition(b.pitch,i.clef).y-staffPosition(a.pitch,i.clef).y);
  return {midi,notes,octave:+notes[0].pitch.at(-1),fingerings:answerFingerings({fingerings:notes.flatMap(n=>n.fingerings)},true)};
 });
}
export function fullChartSection(i){
 const entries=fullChartEntries(i),low=entries[0]?.notes[0].pitch,high=entries.at(-1)?.notes.at(-1).pitch;
 return `<details class="full-fingering-chart panel"><summary><span>Full fingering chart</span><span class="full-chart-summary">${entries.length} pitches${low?' · '+pitchName(low)+'–'+pitchName(high):''}</span></summary><div class="full-chart-body"></div></details>`;
}
export function fullChartBody(i){
 const entries=fullChartEntries(i),octaves=[...new Set(entries.map(e=>e.octave))];
 const figure=(f,alternate)=>`<figure class="full-chart-fingering">${i.kind==='woodwind'?woodwindChart(i,f):brassDiagram(f,i)}<figcaption>${alternate?'Alternate '+alternate:'Main fingering'}<span class="sr-only">: ${chartEscape(fingeringCaption(f,i))}</span></figcaption></figure>`;
 return `<div class="full-chart-intro"><h2>${chartEscape(i.name)}</h2><p class="setting-help">${chartEscape(i.system)} · Written pitch · ${i.clef} clef</p><p class="setting-help">All notes supported by Note Quest, including notes outside your practice selection. Select a note name to explore it above. Open its alternate fingerings to compare.</p><p class="legend"><span class="legend-dot filled"></span>Pressed / covered <span class="legend-dot"></span>Released</p></div>${octaves.map(o=>`<section class="full-chart-octave" aria-label="Written octave ${o}"><h3>Octave ${o}</h3><div class="full-chart-grid">${entries.filter(e=>e.octave===o).map(e=>`<article class="full-chart-card" data-full-midi="${e.midi}"><div class="full-chart-note-links">${e.notes.map(n=>`<button type="button" data-full-note="${chartEscape(n.id)}" aria-label="Explore ${chartEscape(pitchName(n.pitch))}">${pitchName(n.pitch)}</button>`).join('')}</div><div class="full-chart-staves">${e.notes.map(n=>staff(n.pitch,i.clef)).join('')}</div>${figure(e.fingerings[0],0)}${e.fingerings.length>1?`<details class="full-chart-alternates"><summary>Alternate fingerings (${e.fingerings.length-1})</summary><div class="full-chart-alternate-list">${e.fingerings.slice(1).map((f,j)=>figure(f,j+1)).join('')}</div></details>`:''}</article>`).join('')}</div></section>`).join('')}`;
}
export function updateFullChartSelection(details,i,pitch){
 if(!details)return;const note=i.notes.find(n=>n.id===pitch);
 details.querySelectorAll('[data-full-midi]').forEach(card=>card.classList.toggle('current-note',Number(card.dataset.fullMidi)===note?.midi));
 details.querySelectorAll('[data-full-note]').forEach(b=>{if(b.dataset.fullNote===pitch)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
}
export function bindFullChart(details,i,getPitch,onExplore){
 if(!details)return;let rendered=false;
 details.addEventListener('toggle',()=>{
  if(!details.open||rendered)return;
  details.querySelector('.full-chart-body').innerHTML=fullChartBody(i);rendered=true;updateFullChartSelection(details,i,getPitch());
 });
 details.addEventListener('click',e=>{
  const button=e.target.closest('[data-full-note]');if(!button||!details.contains(button))return;
  onExplore(button.dataset.fullNote);
 });
}
