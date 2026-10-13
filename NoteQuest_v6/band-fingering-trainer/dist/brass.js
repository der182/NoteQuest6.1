// Visual order is independent of shortcut order and fingering data order.
export const isTriggerKey=id=>id==='Bb'||id==='Trigger';
export function brassDisplayKeys(instrument){
 if(instrument.kind!=='valves')return instrument.keys;
 const order=instrument.id==='horn'?['Bb','V1','V2','V3']:['V1','V2','V3','V4'];
 return order.map(id=>instrument.keys.find(k=>k.id===id)).filter(Boolean);
}
export const brassSymbol=id=>isTriggerKey(id)?'T':id.replace('V','');
export function slideCaption(f){return (f.keys.includes('Trigger')?'T · ':'')+(f.keys.includes('Sharp')?'♯':f.keys.includes('Flat')?'♭':'')+(f.keys.find(k=>/^P[1-7]$/.test(k))?.slice(1)||'—');}
export function brassDiagram(f,i){
 const box=(id,x,y,pressed)=>`<rect data-diagram-key="${id}" class="${pressed?'pressed-mark':''}" x="${x-19}" y="${y-19}" width="38" height="38" rx="4" stroke="#172c43" stroke-width="2" fill="${pressed?'#172c43':'white'}"/>`;
 if(i.kind==='valves'){
  const ordered=brassDisplayKeys(i);
  return `<svg class="mini-diagram" viewBox="0 0 200 112" aria-hidden="true">${ordered.map((k,j)=>{const x=(j+1)*200/(ordered.length+1),pressed=f.keys.includes(k.id);return (isTriggerKey(k.id)?box(k.id,x,47,pressed):`<circle data-diagram-key="${k.id}" class="${pressed?'pressed-mark':''}" cx="${x}" cy="47" r="19" stroke="#172c43" stroke-width="2" fill="${pressed?'#172c43':'white'}"/>`)+`<text x="${x}" y="53" text-anchor="middle" fill="${pressed?'white':'#172c43'}" font-size="16">${brassSymbol(k.id)}</text>`;}).join('')}<text x="100" y="94" text-anchor="middle" fill="#56677c" font-size="14">${f.keys.length?ordered.filter(k=>f.keys.includes(k.id)).map(k=>brassSymbol(k.id)).join(' + '):'Open'}</text></svg>`;
 }
 const trigger=i.keys.some(k=>k.id==='Trigger'),pressed=f.keys.includes('Trigger');
 return `<svg class="mini-diagram" viewBox="0 0 200 112" aria-hidden="true"><path d="M18 28 H182 M18 45 H182" stroke="#c7d2df" stroke-width="3"/>${[1,2,3,4,5,6,7].map(n=>`<circle class="${f.keys.includes('P'+n)?'pressed-mark':''}" cx="${18+(n-1)*27}" cy="36" r="${f.keys.includes('P'+n)?9:3}" fill="${f.keys.includes('P'+n)?'#245dcc':'#8798aa'}"/><text x="${18+(n-1)*27}" y="69" text-anchor="middle" font-size="13" fill="#172c43">${n}</text>`).join('')}${trigger?`<rect data-diagram-key="Trigger" class="${pressed?'pressed-mark':''}" x="18" y="82" width="24" height="24" rx="3" stroke="#172c43" stroke-width="2" fill="${pressed?'#172c43':'white'}"/><text x="30" y="99" text-anchor="middle" font-size="14" fill="${pressed?'white':'#172c43'}">T</text>`:''}<text x="${trigger?119:100}" y="98" text-anchor="middle" font-size="14" fill="#56677c">Position ${slideCaption(f)}</text></svg>`;
}
