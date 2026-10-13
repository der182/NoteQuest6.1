// Device-local appearance and sound preferences, independent of exercise scores.
export const accentPresets={blue:{name:'Blue',light:'#245dcc',dark:'#8db6ff'},green:{name:'Green',light:'#166448',dark:'#6fdbac'},black:{name:'Black',light:'#20262e',dark:'#f0f2f5'},red:{name:'Red',light:'#ac2538',dark:'#ffa3ad'},gray:{name:'Gray',light:'#526174',dark:'#bdc9d8'},pink:{name:'Pink',light:'#a32171',dark:'#ff9ed6'}};
export const soundDefaults=Object.freeze({noteVolume:1,wrongVolume:1,correctSound:true,wrongSound:true});
const preferenceVolume=value=>typeof value==='number'&&Number.isFinite(value)?Math.round(Math.max(0,Math.min(1,value))*100)/100:1;
export function cleanPreferences(value={}){return {
 accent:Object.hasOwn(accentPresets,value?.accent)?value.accent:'blue',
 dark:typeof value?.dark==='boolean'?value.dark:false,
 chartSize:value?.chartSize==='large'?'large':'standard',
 noteVolume:preferenceVolume(value?.noteVolume),wrongVolume:preferenceVolume(value?.wrongVolume),
 correctSound:typeof value?.correctSound==='boolean'?value.correctSound:true,
 wrongSound:typeof value?.wrongSound==='boolean'?value.wrongSound:true
};}
export function restoreSoundDefaults(value){return {...cleanPreferences(value),...soundDefaults};}
export function loadPreferences(storage){try{return cleanPreferences(JSON.parse(storage.getItem('note-quest-preferences')||'{}'));}catch{return cleanPreferences();}}
export function applyPreferences(value,root,storage){const prefs=cleanPreferences(value);root.dataset.theme=prefs.dark?'dark':'light';root.dataset.accent=prefs.accent;root.dataset.chartSize=prefs.chartSize;root.style.setProperty('--blue',accentPresets[prefs.accent][prefs.dark?'dark':'light']);try{storage?.setItem('note-quest-preferences',JSON.stringify(prefs));}catch{}return prefs;}
