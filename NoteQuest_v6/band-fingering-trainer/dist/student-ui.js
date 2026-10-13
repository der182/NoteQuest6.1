import {defaultPractice,practicePool} from './practice.js';
export const studentLevels=[
 {id:'beginner',name:'Beginner',preset:'first',number:'1',description:'Your first five notes. A comfortable place to start.'},
 {id:'intermediate',name:'Intermediate',preset:'chromatic',number:'2',description:'A bigger range, with sharps and flats.'},
 {id:'advanced',name:'Advanced',preset:'full',number:'3',description:'Explore the full verified range of your instrument.'},
 {id:'custom',name:'Custom',preset:'custom',number:'↗',description:'Choose your own notes in Advanced Setup.'}
];
export function studentLevel(instrument,settings){
 const level=studentLevels.find(l=>l.id!=='custom'&&l.preset===settings?.preset);if(!level)return 'custom';
 const expected=defaultPractice(instrument,level.preset,settings.key);
 return JSON.stringify(practicePool(instrument,settings).map(n=>n.id))===JSON.stringify(practicePool(instrument,expected).map(n=>n.id))?level.id:'custom';
}
export function studentPreset(instrument,id,key='Bb'){const level=studentLevels.find(l=>l.id===id);return level&&id!=='custom'?defaultPractice(instrument,level.preset,instrument.id==='horn'?key:'Bb'):null;}
// Render the exact supplied logo, without redrawing its shapes or type.
export const brandSheet='art/note-quest-brand-sheet.png';
export function questLogo(){return `<svg class="brand-art" viewBox="160 86 1045 491" aria-hidden="true"><defs><clipPath id="brand-window"><rect x="160" y="86" width="1045" height="491"/></clipPath></defs><g clip-path="url(#brand-window)"><image href="${brandSheet}" width="1298" height="1664"/></g></svg>`;}
export function uiIcon(name){const paths={book:'M4 5h7c2 0 3 1 3 3v12c0-2-1-3-3-3H4V5Zm20 0h-7c-2 0-3 1-3 3v12c0-2 1-3 3-3h7V5Z',target:'M24 14a10 10 0 1 1-10-10M14 9a5 5 0 1 0 5 5M14 14l11-11m-6 0h6v6',keys:'M4 5h20v18H4ZM9 5v11m5-11v11m5-11v11M9 16h10',choices:'M4 4h8v8H4ZM16 4h8v8h-8ZM4 16h8v8H4ZM16 16h8v8h-8',sliders:'M4 7h20M4 14h20M4 21h20M9 4v6m10 1v6m-8 1v6',arrow:'M5 14h18m-7-7 7 7-7 7'};return `<svg class="ui-icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.arrow}"/></svg>`;}
