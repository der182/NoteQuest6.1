// Written notation stays instrument-specific; beginner pools share a concert key.
const majorSteps=[0,2,4,5,7,9,11];
const firstConcertRoot={'flute':70,'oboe':58,'bassoon':46,'clarinet':58,'bass-clarinet':46,'alto-sax':58,'tenor-sax':46,'bari-sax':46,'trumpet':58,'horn':58,'trombone':46,'euphonium':46,'tuba':34};
const spellings={0:['C','D','E','F','G','A','B'],5:['F','G','A','Bb','C','D','E'],7:['G','A','B','C','D','E','F#'],10:['Bb','C','D','Eb','F','G','A']};
export function inPracticeKey(instrument,n,key='Bb'){
 const root=key==='F'?5:10,writtenRoot=((root-instrument.transpose)%12+12)%12;
 const names=spellings[writtenRoot];
 return names?names.includes(n.pitch.replace(/\d+$/,'')):majorSteps.includes(((n.midi+instrument.transpose-root)%12+12)%12);
}
export function noteAllowed(instrument,n,settings){
 if(!settings.chromatic&&!inPracticeKey(instrument,n,settings.key||'Bb'))return false;
 return n.pitch.includes('#')?settings.sharps:n.pitch.includes('b')?settings.flats:settings.naturals;
}
export function defaultPractice(instrument,preset='first',key='Bb'){
 const beginner=['first','building'].includes(preset);
 let pool;
 if(beginner){
  const concertRoot=instrument.id==='horn'&&key==='F'?53:firstConcertRoot[instrument.id];
  const low=concertRoot-instrument.transpose,high=low+(preset==='first'?7:12);
  pool=instrument.notes.filter(n=>n.midi>=low&&n.midi<=high&&inPracticeKey(instrument,n,key));
 }else {
  const low=Math.min(...instrument.notes.map(n=>n.midi)),high=Math.max(...instrument.notes.map(n=>n.midi));
  // Outer perfect fourths for every instrument; saxophones retain the requested C4/D6 boundaries.
  pool=instrument.notes.filter(n=>preset==='chromatic'?n.tier<=3:preset==='extremes'?(instrument.id.includes('sax')?n.midi<=60||n.midi>=86:n.midi<=low+5||n.midi>=high-5):true);
 }
 if(!pool.length)pool=instrument.notes;
 return {preset,key,low:Math.min(...pool.map(n=>n.midi)),high:Math.max(...pool.map(n=>n.midi)),chromatic:!beginner,sharps:true,flats:true,naturals:true,excluded:beginner?[]:instrument.notes.filter(n=>!pool.includes(n)).map(n=>n.id)};
}
export function rangeNotes(instrument,settings){return instrument.notes.filter(n=>n.midi>=settings.low&&n.midi<=settings.high);}
export function practicePool(instrument,settings){return rangeNotes(instrument,settings).filter(n=>!settings.excluded.includes(n.id)&&noteAllowed(instrument,n,settings));}
export function withAlternates(instrument,enabled){return enabled?instrument:{...instrument,notes:instrument.notes.map(n=>({...n,fingerings:n.fingerings.slice(0,1)}))};}
