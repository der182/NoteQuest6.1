import {schoolHorn,schoolTrombone,schoolClarinet} from './chart-data.js';
// Fingering facts are independently encoded; no chart artwork is reproduced.
// Pitch is always WRITTEN. transpose is semitones from written to sounding.
export const sources = {
  cl1:{title:'Woodwind Fingering Guide · Boehm clarinet, chalumeau',url:'https://www.wfg.woodwind.org/clarinet/cl_bas_1.html'},
  cl2:{title:'Woodwind Fingering Guide · Boehm clarinet, clarion',url:'https://www.wfg.woodwind.org/clarinet/cl_bas_2.html'},
  yamCl:{title:'Yamaha · Clarinet chart',url:'https://www.yamaha.com/en/musical_instrument_guide/common/images/clarinet/fingering.pdf'},
  yamTr:{title:'Yamaha · Trumpet chart',url:'https://www.yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf'}
};
export const tiers = [
 {name:'First notes',description:'A small set of comfortable starting notes.'},
 {name:'Build your range',description:'Add common band-key notes and register changes.'},
 {name:'Chromatic fluency',description:'Sharps, flats, and the practical school-band range.'},
 {name:'Extended challenge',description:'Extend the range and read more enharmonic spellings.'}
];
export const pitchMidi = p => {const m=p.match(/^([A-G])([b#]?)(\d)$/);if(!m)throw Error('Invalid pitch '+p);return (+m[3]+1)*12+({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]])+({b:-1,'#':1,'':0}[m[2]]);};
export const pitchName = p => p.replace('b','♭').replace('#','♯');
export function note(pitch,tier,fingerings,refs,extra={}) {return {id:pitch,pitch,midi:pitchMidi(pitch),tier,fingerings:fingerings.map(f=>typeof f==='string'?{keys:f.split(' ').filter(Boolean)}:f),sources:refs,...extra};}
const fingers=['L1','L2','L3','R1','R2','R3'];
export function key(id,label,group){return {id,label,group};}
export const mainKeys=fingers.map(id=>key(id,id, id[0]==='L'?'Left hand':'Right hand'));
const clKeys=[...mainKeys,key('T','Thumb hole','Thumb'),key('Reg','Register','Thumb'),key('A','A','Left extras'),key('Ab','G♯ / A♭','Left extras'),key('C#','C♯ / G♯','Left extras'),key('LE','E / B','Left little finger'),key('LF','F / C','Left little finger'),key('LF#','F♯ / C♯','Left little finger'),key('RE','E / B','Right little finger'),key('RF','F / C','Right little finger'),key('RF#','F♯ / C♯','Right little finger'),key('RAb','G♯ / E♭','Right little finger'),key('SideEb','Side E♭ / B♭','Right extras')];
const all='T L1 L2 L3 R1 R2 R3';
const lower=[
 ['E3',3,[all+' LE',all+' RE']],['F3',2,[all+' RF',all+' LF']],['F#3',3,[all+' LF#',all+' RF#']],['G3',2,[all]],['Ab3',3,[all+' RAb']],['A3',2,['T L1 L2 L3 R1 R2']],['Bb3',2,['T L1 L2 L3 R1']],['B3',3,['T L1 L2 L3 R2']],['C4',1,['T L1 L2 L3']],['C#4',3,['T L1 L2 L3 C#']],['D4',1,['T L1 L2']],['Eb4',2,['T L1 L2 SideEb']],['E4',1,['T L1']],['F4',1,['T']],['F#4',2,['L1']],['G4',1,['']],['Ab4',3,['Ab']],['A4',2,['A']],['Bb4',2,['A Reg']]
];
const clNotes=lower.map(([p,t,f])=>note(p,t,f,['cl1','yamCl']));
// Clarion is a twelfth above the matching chalumeau fingering, with register key.
const upper=['B4','C5','C#5','D5','Eb5','E5','F5','F#5','G5','Ab5','A5','Bb5','B5','C6'];
upper.forEach((p,i)=>clNotes.push(note(p,i<7?3:4,lower[i][2].map(f=>'Reg '+f),['cl2','yamCl'])));
export const instruments = [{id:'clarinet',name:'B♭ Clarinet',family:'Woodwinds',kind:'woodwind',clef:'treble',transpose:-2,system:'Boehm system',range:'E3–C6',keys:clKeys,notes:clNotes,description:'Written treble clef; sounds a major second lower. Left/right pinkie alternatives are accepted. Thumb hole and register key are separate controls.'}];
export const valveKeys=[1,2,3].map(n=>key('V'+n,'Valve '+n,'Valves'));
const trumpetRows=[
 ['F#3',3,'123',2],['G3',3,'13',2],['Ab3',3,'23',2],['A3',2,'12',2],['Bb3',2,'1',2],['B3',3,'2',2],['C4',1,'',2],['C#4',3,'123',3],['D4',1,'13',3],['Eb4',2,'23',3],['E4',1,'12',3],['F4',1,'1',3],['F#4',2,'2',3],['G4',1,'',3],['Ab4',3,'23',4],['A4',2,'12',4],['Bb4',2,'1',4],['B4',3,'2',4],['C5',2,'',4],['C#5',3,'12',5],['D5',3,'1',5],['Eb5',3,'2',5],['E5',3,'',5],['F5',3,'1',6],['F#5',3,'2',6],['G5',4,'',6],['Ab5',4,'23',8],['A5',4,'12',8],['Bb5',4,'1',8],['B5',4,'2',8],['C6',4,'',8]
];
export function brassFingering(v,partial){return {keys:[...v].map(n=>'V'+n),partial};}
export const trNotes=trumpetRows.map(([p,t,v,h])=>note(p,t,[brassFingering(v,h)],['yamTr']));
// 3 substitutes for 1+2; alternative partials remain paired with their valve sets.
for (const n of trNotes){if(n.fingerings[0].keys.join()==='V1,V2')n.fingerings.push(brassFingering('3',n.fingerings[0].partial));}
trNotes.find(n=>n.pitch==='D5').fingerings.push(brassFingering('13',6));
instruments.push({id:'trumpet',name:'B♭ Trumpet',family:'Brass',kind:'valves',clef:'treble',transpose:-2,system:'3-valve B♭ trumpet',range:'F♯3–C6',keys:valveKeys,notes:trNotes,description:'Written treble clef; sounds a major second lower. All tiers check valve combinations. Use lip and air control to select the register.'});

// Expansion follows the complete clarinet/trumpet implementation and browser checks.
for(const [id,v,p] of [['G4','13',4],['C5','23',5],['Eb5','23',6],['E5','12',6],['E5','3',6],['G5','13',8]])trNotes.find(n=>n.pitch===id).fingerings.push(brassFingering(v,p));
const src=(id,title,url)=>sources[id]={title,url};
for(const [prefix,folder,file,name,count] of [['fl','flute','fl','Flute',3],['ob','oboe','ob','Oboe',3],['bs','bassoon','basn','German-system bassoon',2],['sx','sax','sax','Saxophone',2]])for(let j=1;j<=count;j++)src(prefix+j,'Woodwind Fingering Guide · '+name+', register '+j,`https://www.wfg.woodwind.org/${folder}/${file}_bas_${j}.html`);
src('cl3','Woodwind Fingering Guide · Clarinet, lower altissimo','https://www.wfg.woodwind.org/clarinet/cl_bas_3.html');
src('yamFl','Yamaha · Flute chart','https://www.yamaha.com/en/musical_instrument_guide/common/images/flute/fingering.pdf');
src('yamSx','Yamaha · Saxophone interactive chart','https://www.yamaha.com/en/musical_instrument_guide/saxophone/play/play002.html');
src('foxOb','Fox Products · Let’s Play Oboe','https://foxproducts.com/wp-content/uploads/2021/09/LetsPlayOboe.pdf');
src('foxBs','Fox Products · Let’s Play Bassoon','https://foxproducts.com/wp-content/uploads/2021/09/LetsPlayBassoon.pdf');
src('yamHorn','Yamaha · F and B♭ horn chart','https://www.yamaha.com/en/musical_instrument_guide/common/images/horn/fingering.pdf');
src('umEuph','University of Mississippi · Euphonium bass-clef chart','https://www.olemiss.edu/lowbrass/studio/fingeringcharts/euphbcfingering.pdf');
src('umTuba','University of Mississippi · BB♭ tuba chart','https://www.olemiss.edu/lowbrass/studio/fingeringcharts/bbbtubafingering.pdf');
src('umTbn','University of Mississippi · Tenor trombone chart','https://www.olemiss.edu/lowbrass/studio/fingeringcharts/tenortromboneposition.pdf');
src('yamTbn','Yamaha · Trombone chart','https://www.yamaha.com/en/musical_instrument_guide/common/images/trombone/fingering.pdf');
src('umHarm','University of Mississippi · Euphonium harmonic series','https://www.olemiss.edu/lowbrass/studio/overtonecharts/euphbcovertone.pdf');
const bassClNotes=structuredClone(clNotes);
instruments.push({...instruments[0],id:'bass-clarinet',name:'Bass Clarinet',transpose:-14,system:'Boehm B♭ bass clarinet · treble notation',notes:bassClNotes,description:'Written treble clef; sounds a major ninth lower. This set covers E3–C6 and uses the shared Boehm fingerings; low-E♭/low-C extension keys and model-dependent upper-register vents are outside this set.'});
for(const [p,f] of [['C#6','Reg T L2 L3 R1 R2'],['D6','Reg T L2 L3 R1 RAb'],['Eb6','Reg T L2 L3 R3 RAb'],['E6','Reg T L2 L3 RAb'],['F6','Reg T L2 L3 C# RAb'],['F#6','Reg T L2 RAb'],['G6','Reg T L2 R1 R2 RAb']])clNotes.push(note(p,4,[f],['cl3']));
instruments[0].range='E3–G6';

const L='L1 L2 L3',LR=L+' R1 R2 R3';
const flKeys=[...mainKeys,key('T','B thumb','Thumb'),key('BbT','B♭ thumb','Thumb'),key('G#','G♯','Left little finger'),key('Eb','E♭','Right little finger'),key('C#','Low C♯','Right little finger'),key('C','Low C roller','Right little finger')];
const flRows=[['C4',3,['T '+LR+' C# C']],['C#4',3,['T '+LR+' C#']],['D4',2,['T '+LR]],['Eb4',2,['T '+LR+' Eb']],['E4',2,['T '+L+' R1 R2 Eb']],['F4',1,['T '+L+' R1 Eb']],['F#4',2,['T '+L+' R3 Eb']],['G4',1,['T '+L+' Eb']],['Ab4',3,['T '+L+' G# Eb']],['A4',1,['T L1 L2 Eb']],['Bb4',1,['T L1 R1 Eb','BbT L1 Eb']],['B4',2,['T L1 Eb']],['C5',1,['L1 Eb']],['C#5',3,['Eb']]];
const flNotes=flRows.map(([p,t,f])=>note(p,t,f,['fl1','yamFl']));
for(const [p,base] of [['D5','D4'],['Eb5','Eb4']])flNotes.push(note(p,2,flNotes.find(n=>n.pitch===base).fingerings.map(f=>({keys:f.keys.filter(k=>k!=='L1')})),['fl2','yamFl']));
for(const base of flNotes.filter(n=>n.midi>=64&&n.midi<=73)){const p=base.pitch.replace(/\d$/,d=>+d+1);flNotes.push(note(p,base.midi<=69?2:3,structuredClone(base.fingerings),['fl2','yamFl']));}
for(const [p,t,f] of [['D6',3,'T L2 L3 Eb'],['Eb6',4,'T '+LR+' G# Eb'],['E6',3,'T L1 L2 R1 R2 Eb'],['F6',4,'T L1 L3 R1 Eb'],['F#6',4,'T L1 L3 R3 Eb'],['G6',4,L+' Eb'],['Ab6',4,'L2 L3 G# Eb'],['A6',4,'T L2 R1 Eb']])flNotes.push(note(p,t,[f],['fl3','yamFl']));
instruments.push({id:'flute',name:'Flute',family:'Woodwinds',kind:'woodwind',clef:'treble',transpose:0,system:'Concert C flute · closed G♯ · C foot',range:'C4–A6',keys:flKeys,notes:flNotes,description:'Concert pitch in treble clef. B-thumb and B♭-thumb alternatives are separate controls. Low C uses the C♯ key plus the C roller. The E♭ pinkie is included where the chart calls for it.'});

const sxKeys=[...mainKeys,key('Oct','Octave','Thumb'),key('Bis','Bis B♭','Left extras'),key('G#','G♯','Left little finger'),key('LowC#','Low C♯','Left little finger'),key('LowB','Low B','Left little finger'),key('LowBb','Low B♭','Left little finger'),key('C','Low C','Right little finger'),key('Eb','E♭','Right little finger'),key('SideBb','Side B♭','Right extras'),key('SideC','Side C','Right extras'),key('PalmD','Palm D','Palm keys'),key('PalmEb','Palm E♭','Palm keys'),key('PalmF','Palm F','Palm keys'),key('HighE','High E','Right extras')];
const sxRows=[['Bb3',4,[LR+' LowBb C']],['B3',3,[LR+' LowB C']],['C4',2,[LR+' C']],['C#4',3,[LR+' LowC# C']],['D4',2,[LR]],['Eb4',2,[LR+' Eb']],['E4',2,[L+' R1 R2']],['F4',1,[L+' R1']],['F#4',2,[L+' R2']],['G4',1,[L]],['Ab4',3,[L+' G#']],['A4',1,['L1 L2']],['Bb4',1,['L1 L2 SideBb','L1 Bis','L1 R1']],['B4',2,['L1']],['C5',1,['L2','L1 SideC']],['C#5',3,['']]];
const sxNotes=sxRows.map(([p,t,f])=>note(p,t,f,['sx1','yamSx']));
for(const b of sxNotes.filter(n=>n.midi>=62)){const p=b.pitch.replace(/\d$/,d=>+d+1);sxNotes.push(note(p,b.midi<=67?2:3,b.fingerings.map(f=>({keys:['Oct',...f.keys]})),['sx2','yamSx']));}
for(const [p,f] of [['D6','Oct PalmD'],['Eb6','Oct PalmD PalmEb'],['E6','Oct PalmD PalmEb HighE'],['F6','Oct PalmD PalmEb PalmF HighE']])sxNotes.push(note(p,4,[f],['sx2','yamSx']));
for(const [id,name,transpose,interval] of [['alto-sax','Alto Saxophone',-9,'major sixth'],['tenor-sax','Tenor Saxophone',-14,'major ninth'],['bari-sax','Baritone Saxophone',-21,'major thirteenth']])instruments.push({id,name,family:'Woodwinds',kind:'woodwind',clef:'treble',transpose,system:'Standard saxophone · written treble clef',range:'B♭3–F6',keys:sxKeys,notes:structuredClone(sxNotes),description:`Written treble clef; sounds a ${interval} lower. Includes side and bis B♭, octave and palm keys. The set does not require a high-F♯ or baritone low-A key.`});

const obKeys=[...mainKeys,key('L1:½','L1 half-hole','Left hand'),key('Oct1','Octave I','Octave keys'),key('Oct2','Octave II','Octave keys'),key('LowB','Low B','Left little finger'),key('LowBb','Low B♭','Left little finger'),key('LEb','Left E♭','Left little finger'),key('LF','Left F','Left little finger'),key('G#','G♯','Left little finger'),key('C','Low C','Right little finger'),key('C#','C♯','Right little finger'),key('Eb','Right E♭','Right little finger'),key('F','Right F','Right extras')];
const obRows=[['Bb3',4,[LR+' LowBb C']],['B3',3,[LR+' LowB C']],['C4',2,[LR+' C']],['C#4',3,[LR+' C#']],['D4',1,[LR]],['Eb4',2,[LR+' Eb',LR+' LEb']],['E4',1,[L+' R1 R2']],['F4',1,[L+' R1 R2 F',L+' R1 R2 LF',L+' R1 R3',L+' R1 R3 Eb']],['F#4',2,[L+' R1']],['G4',1,[L]],['Ab4',3,[L+' G#']],['A4',1,['L1 L2']],['Bb4',2,['L1 L2 R1']],['B4',2,['L1']],['C5',2,['L1 R1']]];
const obNotes=obRows.map(([p,t,f])=>note(p,t,f,['ob1','foxOb']));
for(const [p,f] of [['C#5','L1:½ L2 L3 R1 R2 R3 C#'],['D5','L1:½ L2 L3 R1 R2 R3'],['Eb5','L1:½ L2 L3 R1 R2 R3 Eb']])obNotes.push(note(p,p==='C#5'?3:2,[f],['ob2','foxOb'],{tip:'Roll L1 to uncover the half-hole; do not lift it fully.'}));
for(const b of obNotes.filter(n=>n.midi>=64&&n.midi<=72)){const p=b.pitch.replace(/\d$/,d=>+d+1),oct=b.midi>=69?'Oct2':'Oct1';obNotes.push(note(p,b.midi<=67?3:4,b.fingerings.map(f=>({keys:[oct,...f.keys]})),['ob2','foxOb']));}
for(const [p,f] of [['C#6','L2 L3 R1 C'],['D6','L1:½ L2 L3 C'],['Eb6','L1:½ L2 L3 R2 R3 Eb'],['E6','Oct1 L1:½ L2 L3 G# R2 R3 Eb'],['F6','Oct1 L1:½ L2 G# R2 R3 Eb']])obNotes.push(note(p,4,[f],['ob3']));
instruments.push({id:'oboe',name:'Oboe',family:'Woodwinds',kind:'woodwind',clef:'treble',transpose:0,system:'Conservatory oboe · semiautomatic octave keys',range:'B♭3–F6',keys:obKeys,notes:obNotes,description:'Concert pitch in treble clef. Half-hole, octave I and octave II are separate controls. Right F, left F, and forked F alternatives are accepted; left F requires that key on your instrument.'});

const bsKeys=[...mainKeys,key('L1:¼','L1 ¼ covered','Left hand'),key('L1:½','L1 ½ covered','Left hand'),key('L1:¾','L1 ¾ covered','Left hand'),key('W','Whisper','Left thumb'),key('D','Low D','Left thumb'),key('C','Low C','Left thumb'),key('B','Low B','Left thumb'),key('Bb','Low B♭','Left thumb'),key('C#T','C♯ thumb','Left thumb'),key('C#L','C♯ little','Left little finger'),key('Eb','E♭','Left little finger'),key('E','Low E','Right thumb'),key('F#T','F♯ thumb','Right thumb'),key('BbT','B♭ thumb','Right thumb'),key('G#T','G♯ thumb','Right thumb'),key('F','F','Right little finger'),key('F#R','F♯ little','Right little finger'),key('G#R','G♯ little','Right little finger')];
const bsRows=[['Bb1',4,['Bb B C D '+LR+' E F']],['B1',4,['B C D '+LR+' E F']],['C2',3,['C D '+LR+' E F']],['C#2',4,['C D '+LR+' C#L E F']],['D2',2,['D '+LR+' E F']],['Eb2',3,['D '+LR+' Eb E F']],['E2',2,['W '+LR+' E F']],['F2',2,['W '+LR+' F']],['F#2',3,['W '+LR+' F F#T','W '+LR+' F F#R']],['G2',1,['W '+LR]],['Ab2',3,['W '+LR+' G#R','W '+LR+' G#T']],['A2',1,['W '+L+' R1 R2']],['Bb2',1,['W '+L+' BbT R1 R2']],['B2',2,['W '+L+' R1']],['C3',1,['W '+L]],['C#3',3,['D C#T W '+L]],['D3',1,['W L1 L2']],['Eb3',2,['W L1 L3','W L1 L3 BbT R2']],['E3',2,['W L1']],['F3',2,['W']]];
const bsNotes=bsRows.map(([p,t,f])=>note(p,t,f,['bs1','foxBs']));
for(const [p,t,f] of [['F#3',3,['W L1:¼ L2 L3 R1 R2 R3 F#T F','W L1:¼ L2 L3 R1 R2 R3 F F#R']],['G3',3,['W L1:½ L2 L3 Eb R1 R2 R3']],['Ab3',3,['W L1:¾ L2 L3 R1 R2 R3 G#R','W L1:¾ L2 L3 R1 R2 R3 G#T']],['A3',3,[L+' R1 R2']],['Bb3',3,[L+' BbT R1 R2']],['B3',4,[L+' R1']],['C4',3,[L]],['C#4',4,['D C#T '+L]],['D4',4,['L1 L2']],['Eb4',4,['L1 L2 R1 R2 R3']],['E4',4,['L1 L3 Eb R1 R2 R3']],['F4',4,['L1 L3 Eb R1 R2']]])bsNotes.push(note(p,t,f,['bs2','foxBs'],{tip:p==='F#3'?'Cover about one quarter of L1.':p==='G3'?'Cover about half of L1.':p==='Ab3'?'Cover about three quarters of L1.':'Upper-register attacks may need a momentary flick key. The diagram shows the sustained basic fingering.'}));
instruments.push({id:'bassoon',name:'Bassoon',family:'Woodwinds',kind:'woodwind',clef:'bass',transpose:0,system:'Heckel / German-system bassoon',range:'B♭1–F4',keys:bsKeys,notes:bsNotes,description:'Concert pitch in bass clef. Fractional L1 controls model venting. Low-note thumb-key combinations are shown explicitly. Flick-key timing, reed-dependent intonation, and tenor clef are not tested.'});

export const midiPitch=m=>['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'][((m%12)+12)%12]+(Math.floor(m/12)-1);
const fourValve=[...valveKeys,key('V4','Valve 4','Valves')];
function lowBrassNotes(shift,source){return trNotes.map(n=>{const fs=structuredClone(n.fingerings);for(const f of [...fs]){if(f.keys.join()==='V1,V3')fs.push(brassFingering('4',f.partial));if(f.keys.join()==='V1,V2,V3')fs.push(brassFingering('24',f.partial));}return note(midiPitch(n.midi+shift),n.tier,fs,[source,'umHarm']);});}
const euphNotes=lowBrassNotes(-14,'umEuph');
instruments.push({id:'euphonium',name:'Euphonium / Baritone',family:'Brass',kind:'valves',clef:'bass',transpose:0,system:'B♭ euphonium / baritone · 3 or 4 valves',range:'E2–B♭4',keys:fourValve,notes:euphNotes,description:'Bass clef uses concert pitch. B♭ treble-clef parts sound a major ninth lower. Both 3-valve combinations and the usual fourth-valve substitutes are accepted. On a 3-valve instrument, leave valve 4 released.'});
instruments.push({id:'tuba',name:'Tuba',family:'Brass',kind:'valves',clef:'bass',transpose:0,system:'BB♭ tuba · 3 or 4 valves',range:'E1–B♭3',keys:fourValve,notes:lowBrassNotes(-26,'umTuba'),description:'Concert pitch in bass clef for a BB♭ school tuba. Both 3-valve combinations and fourth-valve substitutes are accepted. CC, E♭, and F tuba fingerings are different and are not used here.'});
const pos={'':1,'V2':2,'V1':3,'V1,V2':4,'V3':4,'V2,V3':5,'V1,V3':6,'V1,V2,V3':7};
const tbNotes=trNotes.map(n=>{const seen=new Set();const fs=n.fingerings.map(f=>({keys:['P'+pos[f.keys.join()]],partial:f.partial})).filter(f=>{const k=f.keys+'|'+f.partial;if(seen.has(k))return false;seen.add(k);return true;});return note(midiPitch(n.midi-14),n.tier,fs,['umTbn','yamTbn'],{tip:'Positions are nominal. Tune small slide adjustments by ear.'});});
instruments.push({id:'trombone',name:'Trombone',family:'Brass',kind:'slide',clef:'bass',transpose:0,system:'B♭ tenor trombone · straight slide',range:'E2–B♭4',keys:[1,2,3,4,5,6,7].map(n=>key('P'+n,String(n),'Slide position')),notes:tbNotes,description:'Concert pitch in bass clef. Select one of seven nominal positions; accepted alternate positions are included. F-attachment fingerings are outside this set. Tune small position adjustments by ear.'});
const hornRows=[['C3',4,'',2],['Db3',4,'123',3],['D3',3,'13',3],['Eb3',3,'23',3],['E3',2,'12',3],['F3',2,'1',3],['Gb3',3,'2',3],['G3',2,'',3],['Ab3',3,'23',4],['A3',2,'12',4],['Bb3',2,'1',4],['B3',3,'2',4],['C4',1,'',4],['Db4',3,'12',5],['D4',1,'1',5],['Eb4',2,'2',5],['E4',1,'',5],['F4',1,'1',6],['Gb4',2,'2',6],['G4',1,'',6],['Ab4',3,'23',8],['A4',3,'12',8],['Bb4',3,'1',8],['B4',3,'2',8],['C5',3,'',8],['Db5',4,'2',9],['D5',4,'',9],['Eb5',4,'2',10],['E5',4,'',10],['F5',4,'1',12],['Gb5',4,'2',12],['G5',4,'',12]];
const hornNotes=hornRows.map(([p,t,v,h])=>note(p,t,[brassFingering(v,h)],['yamHorn']));
// B♭ side has a different harmonic series, while the music remains written in F.
for(const n of hornNotes){const b=trNotes.find(t=>t.midi-7===n.midi);if(b)for(const f of b.fingerings)n.fingerings.push({keys:['Bb',...f.keys],partial:f.partial});}
instruments.push({id:'horn',name:'French Horn',family:'Brass',kind:'valves',clef:'treble',transpose:-7,system:'Horn in F · F single or F/B♭ double',range:'C3–G5',keys:[...valveKeys,key('Bb','Trigger / thumb','Valves')],notes:hornNotes,description:'Music is written in F and sounds a perfect fifth lower, even on the B♭ side. Leave the B♭ trigger released for F-side fingerings. On a double horn, trigger-down alternatives are accepted. Assumes the usual F-at-rest trigger setup.'});
// Enharmonic spellings are introduced in tier 4, with exactly the same fingering facts.
const enharmonic={Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#','C#':'Db','F#':'Gb'};
for(const i of instruments){for(const n of [...i.notes]){const pc=n.pitch.slice(0,-1),other=enharmonic[pc];if(other&&!i.notes.some(x=>x.pitch===other+n.pitch.at(-1)))i.notes.push({...structuredClone(n),id:other+n.pitch.at(-1),pitch:other+n.pitch.at(-1),tier:4});}i.notes.sort((a,b)=>a.midi-b.midi||a.pitch.localeCompare(b.pitch));}
const order=['flute','oboe','bassoon','clarinet','bass-clarinet','alto-sax','tenor-sax','bari-sax','trumpet','horn','trombone','euphonium','tuba'];
instruments.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
export function transposeSpelling(pitch,semitones,steps){const letters='CDEFGAB';const step=Number(pitch.at(-1))*7+letters.indexOf(pitch[0])+steps;const natural=letters[(step%7+7)%7]+Math.floor(step/7);const alter=pitchMidi(pitch)+semitones-pitchMidi(natural);if(Math.abs(alter)>1)throw Error('Unsupported double accidental');return natural[0]+(alter===1?'#':alter===-1?'b':'')+natural.slice(1);}
export function configuredInstrument(id,notation='bass',valveCount=4,attachment=false,hornType='double'){
 let base=instruments.find(i=>i.id===id);
 if(['euphonium','tuba'].includes(id)){
  const count=Number(valveCount)===3?3:4;
  base={...base,valveCount:count,system:(id==='tuba'?'BB♭ tuba':'B♭ euphonium / baritone')+' · '+count+' valves',
   keys:base.keys.filter(k=>count===4||k.id!=='V4'),
   notes:base.notes.map(n=>({...n,fingerings:n.fingerings.filter(f=>count===4||!f.keys.includes('V4'))})),
   description:(id==='tuba'?'Concert pitch in bass clef for a BB♭ school tuba. CC, E♭, and F tuba use different fingerings. ':'Bass clef uses concert pitch. B♭ treble-clef parts sound a major ninth lower. ')+(count===3?'Only three-valve fingerings are used.':'Both three-valve combinations and fourth-valve substitutes are accepted.')};
 }
 if(id==='trombone')base=schoolSlideInstrument(base,attachment);
 if(id==='horn'&&hornType==='single')base={...base,hornType,keys:base.keys.filter(k=>k.id!=='Bb'),notes:base.notes.map(n=>({...n,fingerings:n.fingerings.filter(f=>!f.keys.includes('Bb'))})).filter(n=>n.fingerings.length),system:'F single horn',description:'Written in F; sounds a perfect fifth lower. Only F-side fingerings are used. The thumb trigger is hidden.'};
 if(id!=='euphonium'||notation!=='treble')return base;
 return {...base,clef:'treble',transpose:-14,notes:base.notes.map(n=>{const pitch=transposeSpelling(n.pitch,14,8);return {...n,id:pitch,pitch,midi:n.midi+14};}),range:'F♯3–C6'};
}
// Additional physical keys shown in complete instrument-shaped charts. These
// are playable controls; specialized trill fingerings remain outside the note set.
for(const i of instruments){
 const extras=i.id.includes('clarinet')?[['Trill2','Second side trill','Right extras'],['Trill3','Third side trill','Right extras'],['Trill4','Top side trill','Right extras'],['SliverEb','E♭ sliver','Left extras'],['ForkB','Fork B / F♯','Right extras']]:i.id.includes('sax')?[['FrontF','Front F','Left extras']]:i.id==='flute'?[['TrillD','D trill','Right extras'],['TrillD#','D♯ trill','Right extras']]:[];
 if(extras.length)i.keys=[...i.keys,...extras.map(args=>key(...args))];
}

// Low-A baritone saxophones: all six fingers + low C + the separate thumb low A.
const bari=instruments.find(i=>i.id==='bari-sax');
bari.keys=[...bari.keys,key('LowA','Low A','Thumb')];
bari.notes.unshift(note('A3',4,['L1 L2 L3 R1 R2 R3 C LowA'],['sx1']));
bari.range='A3–F6';
bari.description='Written treble clef; sounds a major thirteenth lower. Includes a thumb low-A key. For a low-B♭ model, set the custom range to B♭3 or higher. High-F♯ and altissimo keys are outside this set.';
// B♭ thumb may substitute for B thumb when L2 or R1 closes the linked key.
// WFG flute fingering scheme explicitly documents this equivalence.
sources.flThumb={title:'Woodwind Fingering Guide · Flute thumb-key scheme',url:'https://www.wfg.woodwind.org/flute/fl_fing.html'};
for(const n of flNotes)for(const f of [...n.fingerings])if(f.keys.includes('T')&&(f.keys.includes('L2')||f.keys.includes('R1'))){
 const alternate={keys:f.keys.map(k=>k==='T'?'BbT':k)};
 if(!n.fingerings.some(a=>[...a.keys].sort().join() === [...alternate.keys].sort().join()))n.fingerings.push(alternate);
 if(!n.sources.includes('flThumb'))n.sources.push('flThumb');
}

const bassClarinetData=instruments.find(i=>i.id==='bass-clarinet');
bassClarinetData.keys=[...bassClarinetData.keys,key('LowEb','Low E♭','Right little finger')];
bassClarinetData.notes.unshift(note('Eb3',3,['T L1 L2 L3 R1 R2 R3 LowEb'],['schoolBassCl'],{tip:'Uses the low-E♭ pinkie extension on a bass clarinet.'}));
bassClarinetData.range='E♭3–C6';
bassClarinetData.description='Written treble clef; sounds a major ninth lower. The five-key right-pinkie cluster includes the low-E♭ extension. Low-C extensions and model-dependent upper-register vents are outside this set.';
sources.schoolBassCl={title:'School-band woodwind charts · Bass Clarinet, page 4',document:'Fingering-charts-woodwinds.PDF.pdf',page:4};

// The teacher's preferred order applies to every enharmonic spelling of a note.
for(const [id,document] of [['teacherHorn','hornchart.pdf'],['teacherTrombone','trombonechart.pdf'],['teacherClarinet','clarinetchart.pdf']])sources[id]={title:'Teacher-supplied '+document,document,page:1};
const keySignature=f=>[...f.keys].sort().join('|');
function uniqueFingerings(list){const seen=new Set();return list.filter(f=>{const k=keySignature(f);if(seen.has(k))return false;seen.add(k);return true;});}
const hornData=instruments.find(i=>i.id==='horn');
for(const [pitch,codes] of Object.entries(schoolHorn))for(const n of hornData.notes.filter(n=>n.midi===pitchMidi(pitch))){
 const preferred=codes.map(code=>{const keys=[...(code.includes('T')?['Bb']:[]),...[...code.replace('T','')].map(v=>'V'+v)];const root=keys.includes('Bb')?41:36;const lowering=keys.reduce((sum,k)=>sum+({V1:2,V2:1,V3:3}[k]||0),0);const partial=Array.from({length:23},(_,j)=>j+2).find(p=>root+Math.round(12*Math.log2(p))-lowering===n.midi);if(!partial)throw Error('Horn reference mismatch '+pitch+' '+code);return {keys,partial};});
 n.fingerings=uniqueFingerings([...preferred,...n.fingerings]);n.sources=[...new Set([...n.sources,'teacherHorn'])];
}
for(const i of instruments.filter(i=>i.id.includes('clarinet')))for(const [pitch,rows] of Object.entries(schoolClarinet))for(const n of i.notes.filter(n=>n.midi===pitchMidi(pitch))){
 n.fingerings=uniqueFingerings([...rows.map(row=>({keys:row.split(' ').filter(Boolean)})),...n.fingerings]);n.sources=[...new Set([...n.sources,'teacherClarinet'])];
}
export function slideChartFingering(code,midi){
 const position=Number(code.at(-1)),trigger=code.includes('T');
 const keys=['P'+position,...(trigger?['Trigger']:[]),...(code.includes('#')?['Sharp']:code.includes('b')?['Flat']:[])];
 const partial=trigger?(midi<=41?2:3):Array.from({length:15},(_,j)=>j+2).find(p=>34+Math.round(12*Math.log2(p))-(position-1)===midi);
 if(!partial)throw Error('Trombone reference mismatch '+code+' '+midi);
 return {keys,partial};
}
function schoolSlideInstrument(base,attachment){
 const notes=[];
 for(const [pitch,allCodes] of Object.entries(schoolTrombone)){
  const codes=allCodes.filter(c=>attachment||!c.includes('T'));if(!codes.length)continue;
  const midi=pitchMidi(pitch),matches=base.notes.filter(n=>n.midi===midi);
  if(!matches.length&&!attachment)continue;
  const originals=matches.length?matches:[note(pitch,4,[],['teacherTrombone'])];
  if(!matches.length&&pitch.includes('b'))originals.push({...originals[0],pitch:enharmonic[pitch.slice(0,-1)]+pitch.at(-1),id:enharmonic[pitch.slice(0,-1)]+pitch.at(-1)});
  for(const n of originals)notes.push({...n,fingerings:codes.map(c=>slideChartFingering(c,midi)),sources:[...new Set([...n.sources,'teacherTrombone'])],tip:pitch==='B1'?'Trigger, flat seventh position and lip down; this may be beyond some instruments or players.':'♯ means a slightly shorter slide; ♭ means a slightly longer slide. T means trigger. Tune by ear.'});
 }
 notes.sort((a,b)=>a.midi-b.midi||a.pitch.localeCompare(b.pitch));
 return {...base,attachment,keys:[...[1,2,3,4,5,6,7].map(n=>key('P'+n,String(n),'Slide position')),key('Flat','♭','Slide adjustment'),key('Sharp','♯','Slide adjustment'),...(attachment?[key('Trigger','Trigger','Attachment')]:[])],notes,range:(attachment?'B1':'E2')+'–B♭4',system:attachment?'B♭/F tenor trombone':'B♭ tenor trombone · straight slide',description:'Concert pitch in bass clef. Preferred and alternate positions follow the supplied chart. ♯ shortens the numbered slide position; ♭ lengthens it.'+(attachment?' T operates the trigger. Trigger positions use the chart’s physical slide numbering.':' Enable the trigger option for F-attachment positions.')};
}
const tromboneIndex=instruments.findIndex(i=>i.id==='trombone');
instruments[tromboneIndex]=schoolSlideInstrument(instruments[tromboneIndex],false);
