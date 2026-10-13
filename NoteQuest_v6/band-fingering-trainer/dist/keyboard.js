// Bindings are per instrument and valve configuration. Players may remap
// the printed characters to suit their keyboard layout.
export function valveBindings(instrument,mapping){
 if(instrument.kind!=='valves')return [];
 const four=instrument.keys.some(k=>k.id==='V4');
 const bindings=instrument.id==='horn'?[['q','V3'],['w','V2'],['e','V1'],['x','Bb']]:four?[['p','V1'],['[','V2'],[']','V3'],['\\','V4']]:[['[','V1'],[']','V2'],['\\','V3']];
 return bindings.filter(([,id])=>instrument.keys.some(k=>k.id===id)).map(([key,id])=>[mapping?.[id]||key,id]);
}
export const shortcutForValve=(instrument,id,mapping)=>valveBindings(instrument,mapping).find(([,valve])=>valve===id)?.[0].toUpperCase()||'';
export function validateBindings(values){
 const keys=Object.values(values).map(k=>k.toLowerCase());
 if(keys.some(k=>k.length!==1||/\s/.test(k)))return 'Use one printable key for each valve.';
 if(keys.some(k=>'abcd'.includes(k)))return 'A–D are reserved for the four answer choices.';
 if(new Set(keys).size!==keys.length)return 'Give each valve a different key.';
 return '';
}
export function keyboardAction(event,state){
 if(state.screen!=='play'||state.solved||state.dialogOpen||state.editingText||event.repeat||event.altKey||event.ctrlKey||event.metaKey)return null;
 const key=event.key.toLowerCase();
 const valve=state.enabled&&state.mode==='interactive'?valveBindings(state.instrument,state.mapping).find(([shortcut])=>shortcut.toLowerCase()===key):null;
 if(valve)return {type:'valve',id:valve[1]};
 if(state.mode==='challenge'){
  const index=(state.instrument.kind==='valves'?'abcd':'1234').indexOf(key);
  if(key.length===1&&index>=0)return {type:'choice',index};
 }
 return null;
}
