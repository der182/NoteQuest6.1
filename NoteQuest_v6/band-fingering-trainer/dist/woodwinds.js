// Original instrument-shaped schematics; geometry is independent of note data.
// Key faces intentionally have no visible names or numbers. Accessible names
// live on native buttons. Hand headings provide orientation only.
const ck=(id,x,y,shape='hole')=>({id,x,y,shape});
const main=(ys,x=180)=>['L1','L2','L3','R1','R2','R3'].map((id,j)=>ck(id,x,ys[j]));
// Compact chart proportions follow the supplied school-band reference sheets.
// Pointer input follows the drawn faces, including connected lever clusters.
// Ratios use the supplied paper charts: a main-hole diameter is 50 units.
// Small throat/trill touches, narrow thumb levers and petal clusters deliberately
// retain their printed relative sizes instead of enlarging every face equally.
const clarinet={width:310,height:632,keys:[
 ck('Reg',102,39,'register'),ck('T',102,91,'thumbHole'),ck('A',180,104,'clarinetTear'),ck('Ab',218,120,'slim'),
 ...main([160,225,299,402,472,546]),
 ck('Trill4',116,315,'trillOval'),ck('Trill3',116,337,'trillOval'),ck('Trill2',116,359,'trillOval'),ck('SideEb',116,381,'trillOval'),
 ck('SliverEb',180,253,'clarinetSliver'),ck('C#',215,317,'clarinetOval'),
 ck('LF',250,335,'petalTop'),ck('LE',236,366,'petalLeft'),ck('LF#',264,366,'petalRight'),
 ck('ForkB',169,506,'clarinetSliver'),
 ck('RF#',129,583,'pinkyOval'),ck('RAb',180,583,'pinkyOval'),ck('RE',129,616,'pinkyOval'),ck('RF',180,616,'pinkyOval')
 ]};
const bassClarinet={...clarinet,height:666,keys:[...clarinet.keys,ck('LowEb',129,649,'pinkyOval')]};
const flute={width:575,height:185,horizontal:true,keys:[
 ...['L1','L2','L3','R1','R2','R3'].map((id,j)=>ck(id,[65,139,210,287,361,432][j],75)),
 ck('G#',237,39,'flutePetal'),ck('BbT',65,136,'thumbRound'),ck('T',111,136,'thumbPoint'),
 ck('TrillD',324,110,'trillDot'),ck('TrillD#',396,110,'trillDot'),
 ck('Eb',477,96,'fluteEb'),ck('C#',521,87,'footBar'),ck('C',521,114,'footSmall')
 ]};
const sax={width:300,height:514,keys:[
 ck('Oct',107,97,'register'),ck('FrontF',180,54,'tiny'),ck('Bis',221,143,'tiny'),
 ...main([100,162,224,302,364,426]),
 ck('PalmD',232,65,'palm'),ck('PalmEb',241,86,'palm'),ck('PalmF',254,107,'palm'),
 ck('G#',251,249,'tableTop'),ck('LowB',237,271,'tableLeft'),ck('LowC#',265,271,'tableLeft'),ck('LowBb',251,293,'tableBottom'),
 ck('HighE',136,299,'sideTouch'),ck('SideC',136,326,'sideTouch'),ck('SideBb',136,353,'sideTouch'),
 ck('Eb',127,464,'discTop'),ck('C',127,487,'discBottom')
 ]};
const oboe={width:300,height:533,keys:[
 ck('Oct1',110,95,'register'),ck('Oct2',221,95,'sideTouch'),...main([110,172,234,314,376,438]),
 ck('G#',244,256,'petalTop'),ck('LowB',230,286,'petalLeft'),ck('LowBb',264,286,'petalRight'),ck('LEb',263,332,'petalRight'),ck('LF',234,332,'petalLeft'),
 ck('F',235,407,'sliver'),ck('C',124,476,'oboeCup'),ck('C#',124,502,'oboeCup'),ck('Eb',125,450,'oboeCup')
 ]};
const bassoon={width:400,height:556,body:[169,94,72,412],keys:[
 ...main([125,187,249,345,407,469],205),
 ck('Bb',49,114,'horizontal'),ck('B',49,140,'horizontal'),ck('C',49,166,'horizontal'),ck('D',49,194,'thumbCup'),ck('W',111,125,'drop'),ck('C#T',111,188,'vertical'),
 ck('Eb',129,249,'diagonal'),ck('C#L',129,296,'vertical'),
 ck('BbT',306,345,'horizontal'),ck('E',306,374,'thumbCup'),ck('F#T',306,413,'horizontal'),ck('G#T',306,439,'horizontal'),
 ck('F#R',130,446,'vertical'),ck('F',130,491,'horizontal'),ck('G#R',205,520,'horizontal')
 ],labels:[[80,72,'THUMB'],[205,69,'LEFT'],[205,309,'RIGHT'],[306,307,'THUMB']]};
// Local SVG bounds include a little breathing room around each actual key shape.
// Native buttons retain keyboard focus and screen-reader names without square
// touch targets covering their tightly grouped neighbours.
export function keyBounds(shape){return ({
 clarinetTear:[-11,-19,22,38],clarinetSliver:[-30,-7,60,18],clarinetOval:[-23,-13,46,26],trillOval:[-11,-6,22,12],register:[-12,-29,24,58],thumbHole:[-23,-23,46,46],tiny:[-11,-11,22,22],slim:[-9,-23,18,46],trillDot:[-7,-7,14,14],sliver:[-24,-9,48,18],sliverUp:[-23,-17,46,34],pinkyOval:[-25,-16,50,32],petalTop:[-19,-16,38,32],petalLeft:[-16,-24,32,60],petalRight:[-16,-24,32,60],flutePetal:[-14,-10,28,20],fluteEb:[-11,-24,22,48],footBar:[-24,-9,48,18],footSmall:[-24,-12,48,24],palm:[-22,-8,44,16],tableTop:[-29,-10,58,20],tableLeft:[-13,-10,26,20],tableBottom:[-29,-10,58,20],sideTouch:[-6,-12,12,24],discTop:[-23,-12,46,24],discBottom:[-23,-10,46,24],oboeCup:[-26,-12,52,24],thumbRound:[-20,-20,40,40],thumbPoint:[-25,-23,96,46],hole:[-26.5,-26.5,53,53],small:[-14,-14,28,28],vertical:[-12,-27,24,54],
 horizontal:[-25,-11,50,22],diagonal:[-25,-17,50,34],drop:[-27,-30,54,61],
 bar:[-29,-12,58,24],rectangle:[-10,-25,20,50],square:[-16,-16,32,32],
 smallSquare:[-10,-10,20,20],halfTop:[-28,-8,56,31],halfBottom:[-28,-23,56,31],
 fluteLever:[-25,-32,40,65],thumbLong:[-30,-16,63,45],thumbCup:[-27,-13,55,40],footCup:[-27,-15,54,41]
 })[shape];}
export function woodwindLayout(instrument){if(instrument.id==='bass-clarinet')return bassClarinet;if(instrument.id==='clarinet')return clarinet;if(instrument.id==='bari-sax')return {...sax,keys:[...sax.keys,ck('LowA',106,168,'pinkyOval')]};if(instrument.id.includes('sax'))return sax;return {flute,oboe,bassoon}[instrument.id];}
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// A physical first-hole control represents each supported coverage state.
export function holeStates(instrument){return ['L1',...instrument.keys.filter(k=>k.id.startsWith('L1:')).map(k=>k.id)];}
export function cycleHole(instrument,selected){const states=[null,...holeStates(instrument)],current=selected.find(k=>k==='L1'||k.startsWith('L1:'))||null;const next=states[(states.indexOf(current)+1)%states.length];return [...selected.filter(k=>k!=='L1'&&!k.startsWith('L1:')),...(next?[next]:[])];}
function outline(shape){const c='class="key-face"';switch(shape){
 case 'clarinetTear':return `<path ${c} d="M0 -16 C-3 -9 -8 1 -8 8 C-8 19 8 19 8 8 C8 1 3 -9 0 -16Z"/>`;
 case 'clarinetSliver':return `<path ${c} d="M-26 -3 Q0 9 26 -3 Q23 11 -26 3Z"/>`;
 case 'clarinetOval':return `<ellipse ${c} rx="20" ry="7" transform="rotate(-22)"/>`;
 case 'trillOval':return `<ellipse ${c} rx="8" ry="3"/>`;
 case 'register':return `<path ${c} d="M0 -25 C-4 -13 -9 -1 -9 12 Q-9 25 0 25 Q9 25 9 12 C9 -1 4 -13 0 -25Z"/>`;
 case 'thumbHole':return `<circle ${c} r="20"/>`;
 case 'tiny':return `<circle ${c} r="8"/>`;
 case 'slim':return `<ellipse ${c} rx="6" ry="20"/>`;
 case 'trillDot':return `<circle ${c} r="4"/>`;
 case 'sliver':return `<path ${c} d="M-21 -5 Q-6 3 21 -5 Q18 12 -21 1Z"/>`;
 case 'sliverUp':return `<ellipse ${c} rx="22" ry="10" transform="rotate(-35)"/>`;
 case 'pinkyOval':return `<ellipse ${c} rx="23" ry="14"/>`;
 case 'petalTop':return `<path ${c} d="M-15 13 Q-21 -13 7 -13 Q24 -10 12 5Z"/>`;
 case 'petalLeft':return `<path ${c} d="M11 34 Q3 11 -10 -6 Q-19 -27 -2 -20 Q14 -15 11 34Z"/>`;
 case 'petalRight':return `<path ${c} d="M-11 34 Q-3 11 10 -6 Q19 -27 2 -20 Q-14 -15 -11 34Z"/>`;
 case 'flutePetal':return `<ellipse ${c} rx="12" ry="7" transform="rotate(15)"/>`;
 case 'fluteEb':return `<path ${c} d="M8 -21 Q-2 -23 -4 -5 L-8 9 Q-9 21 8 20Z"/>`;
 case 'footBar':return `<rect ${c} x="-21" y="-6" width="42" height="12" rx="5"/>`;
 case 'footSmall':return `<path ${c} d="M-21 -9 H21 Q20 11 0 10 Q-20 11 -21 -9Z"/>`;
 case 'palm':return `<path ${c} d="M-18 -5 H13 Q19 -5 19 5 H12 Q12 0 -18 0Z"/>`;
 case 'tableTop':return `<path ${c} d="M-26 7 Q-27 -10 15 -7 Q28 -6 26 7Z"/>`;
 case 'tableLeft':return `<rect ${c} x="-10" y="-7" width="20" height="14" rx="3"/>`;
 case 'tableBottom':return `<path ${c} d="M-26 -7 H26 Q27 10 0 7 Q-27 10 -26 -7Z"/>`;
 case 'sideTouch':return `<rect ${c} x="-3" y="-9" width="6" height="18" rx="2"/>`;
 case 'discTop':return `<path ${c} d="M-20 9 A20 20 0 0 1 20 9Z"/>`;
 case 'discBottom':return `<path ${c} d="M-20 -7 A20 20 0 0 0 20 -7Z"/>`;
 case 'oboeCup':return `<path ${c} d="M23 -6 Q10 0 -7 -9 Q-29 -13 -22 5 Q-12 17 5 4 L23 4Z"/>`;
 case 'thumbRound':return `<circle ${c} r="17"/>`;
 case 'thumbPoint':return `<path ${c} d="M-22 0 Q-22 -26 0 -19 L68 0 L0 19 Q-22 26 -22 0Z"/>`;
 case 'hole':return `<circle ${c} r="25"/>`;
 case 'small':return `<circle ${c} r="11"/>`;
 case 'vertical':return `<ellipse ${c} rx="9" ry="24"/>`;
 case 'horizontal':return `<ellipse ${c} rx="23" ry="8"/>`;
 case 'diagonal':return `<ellipse ${c} rx="23" ry="9" transform="rotate(-20)"/>`;
 case 'drop':return `<path ${c} d="M0 -27 C-9 -17 -25 2 -24 14 C-22 34 23 33 24 14 C26 2 9 -17 0 -27Z"/>`;
 case 'bar':return `<rect ${c} x="-27" y="-10" width="54" height="20" rx="4"/>`;
 case 'rectangle':return `<rect ${c} x="-7" y="-23" width="14" height="46" rx="3"/>`;
 case 'smallSquare':return `<rect ${c} x="-7" y="-7" width="14" height="14" rx="2"/>`;
 case 'square':return `<rect ${c} x="-14" y="-14" width="28" height="28" rx="3"/>`;
 case 'halfTop':return `<path ${c} d="M-25 20 A25 25 0 0 1 25 20Z"/>`;
 case 'halfBottom':return `<path ${c} d="M-25 -20 A25 25 0 0 0 25 -20Z"/>`;
 case 'fluteLever':return `<path ${c} d="M11 -29 H2 C-28 -29 -28 10 2 10 V30 H12Z"/>`;
 case 'thumbLong':return `<path ${c} d="M-25 -13 H26 Q34 -7 26 0 H-3 Q-7 29 -21 25 Q-31 21 -25 -13Z"/>`;
 case 'thumbCup':return `<path ${c} d="M-24 -10 H25 Q26 21 1 24 Q-24 24 -24 -10Z"/>`;
 case 'footCup':return `<path ${c} d="M-24 -12 H24 V-1 A24 24 0 0 1 -24 -1Z"/>`;
 default:throw Error('Unknown key shape '+shape);
}}
function face(key,keys){const fraction=key.id==='L1'?keys.find(k=>k.startsWith('L1:'))?.split(':')[1]:null;
 const pressed=keys.includes(key.id);const fractionPath={'¼':'M0 0 H-25 A25 25 0 0 0 0 25Z','½':'M0 -25 A25 25 0 0 0 0 25Z','¾':'M0 0 V-25 A25 25 0 1 0 25 0Z'}[fraction];
 return `<g class="key-art ${pressed?'covered':''} ${fraction?'fractional':''}">${outline(key.shape)}${fraction?`<path class="fraction-fill" d="${fractionPath}"/>`:''}</g>`;
}
function backing(layout){const left=layout.keys.find(k=>k.id==='L3'),right=layout.keys.find(k=>k.id==='R1');
 const joint=layout.horizontal?`M${(left.x+right.x)/2} ${left.y-23} v46`:`M${left.x-26} ${(left.y+right.y)/2} h52`;
 const thumb=layout.keys.find(k=>['Reg','Oct','Oct1'].includes(k.id));
 const guideHeight=thumb?.id==='Reg'?layout.keys.find(k=>k.id==='T').y+24-(thumb.y-31):65;
 const thumbGuides=thumb?`<path class="thumb-guide" d="M${thumb.x-17} ${thumb.y-31} v${guideHeight} M${thumb.x+17} ${thumb.y-31} v${guideHeight}"/>`:layout.horizontal?'<path class="thumb-guide" d="M42 109 H183 M42 163 H183"/>':'';
 return `<g class="chart-back"><path class="joint" d="${joint}"/>${thumbGuides}</g>`;
}
export function woodwindChart(instrument,fingering={keys:[]},interactive=false){
 const layout=woodwindLayout(instrument);if(!layout)throw Error('Missing woodwind layout: '+instrument.id);
 const viewBox=`0 0 ${layout.width} ${layout.height}`;
 const artwork=`<svg class="chart-background" viewBox="${viewBox}" aria-hidden="true">${backing(layout)}</svg>`;
 if(!interactive)return `<svg class="woodwind-chart chart-static ${layout.horizontal?'chart-horizontal':''}" viewBox="${viewBox}" aria-hidden="true">${backing(layout)}${layout.keys.map(k=>`<g data-chart-key="${k.id}" transform="translate(${k.x} ${k.y})">${face(k,fingering.keys)}</g>`).join('')}</svg>`;
 const buttons=layout.keys.map(k=>{const definition=instrument.keys.find(x=>x.id===k.id);const name=definition.group+' · '+definition.label+(k.id==='L1'&&holeStates(instrument).length>1?' · press repeatedly to change hole coverage':'');const [x,y,w,h]=keyBounds(k.shape);return `<button class="chart-key" data-key="${k.id}" style="left:${(k.x+x)/layout.width*100}%;top:${(k.y+y)/layout.height*100}%;width:${w/layout.width*100}%;height:${h/layout.height*100}%" aria-label="${xml(name)}" aria-pressed="${fingering.keys.includes(k.id)}"><svg viewBox="${x} ${y} ${w} ${h}" aria-hidden="true">${face(k,fingering.keys)}</svg></button>`;}).join('');
 const fractions=holeStates(instrument);
 return `<div class="woodwind-interactive ${layout.horizontal?'woodwind-horizontal':''}"><div class="chart-scroll"><div class="woodwind-chart chart-interactive" style="aspect-ratio:${layout.width}/${layout.height}" role="group" aria-label="${xml(instrument.name)} fingering chart">${artwork}${buttons}</div></div><p class="chart-help">Tap a key, or drag across keys to press or release them.</p><button id="chart-size" class="chart-size" aria-expanded="false">Enlarge chart</button>${fractions.length>1?`<label class="coverage-control">First-hole coverage<select id="hole-coverage"><option value="">Open</option>${fractions.map(k=>`<option value="${k}">${k==='L1'?'Fully covered':k.split(':')[1]+' covered'}</option>`).join('')}</select></label><p class="chart-help">You can also tap the first hole to cycle its coverage.</p>`:''}<p id="selected-keys" class="sr-only" aria-live="polite">No keys pressed</p></div>`;
}
export function updateWoodwindChart(container,instrument,keys){const layout=woodwindLayout(instrument);for(const k of layout.keys){const button=container.querySelector(`[data-key="${k.id}"]`);if(!button)continue;button.querySelector('svg').innerHTML=face(k,keys);button.setAttribute('aria-pressed',String(keys.includes(k.id)||(k.id==='L1'&&keys.some(x=>x.startsWith('L1:')))));}
 const select=container.querySelector('#hole-coverage');if(select)select.value=keys.find(k=>k==='L1'||k.startsWith('L1:'))||'';
 const summary=container.querySelector('#selected-keys');if(summary)summary.textContent=keys.length?keys.map(id=>{const k=instrument.keys.find(k=>k.id===id);return k.group+' '+k.label;}).join(' · '):'No keys pressed';
}
