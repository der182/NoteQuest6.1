// Correct-note instrument-style synthesis; no plugins or network needed.
// Harmonics help low brass remain audible on small laptop/phone speakers.
export const soundingFrequency=(writtenMidi,transpose=0)=>440*2**((writtenMidi+transpose-69)/12);
export const NOTE_TONE_MS=1000;
export const toneProfiles={
 flute:[1,.12,.07,.025],oboe:[1,.7,.52,.35,.2,.12,.06],bassoon:[1,.5,.7,.3,.36,.18,.12],
 clarinet:[1,.04,.62,.025,.3,.015,.14],'bass-clarinet':[1,.07,.8,.04,.45,.02,.22],
 'alto-sax':[1,.72,.52,.35,.22,.14,.08],'tenor-sax':[1,.8,.6,.4,.3,.18,.1],
 'bari-sax':[.8,1,.8,.55,.35,.24,.16],trumpet:[1,.85,.68,.5,.36,.23,.13,.07],
 horn:[1,.55,.3,.16,.09,.045],trombone:[1,.8,.55,.34,.2,.12],
 euphonium:[1,.72,.48,.28,.16,.09],tuba:[.55,1,.85,.55,.35,.22,.12]
};
export const soundVolume=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(1,value)):1;
export function scheduleNoteTone(context,writtenMidi,transpose=0,instrument='flute',volume=1){
 const level=soundVolume(volume);if(level===0)return null;
 const start=context.currentTime,osc=context.createOscillator(),gain=context.createGain();
 const harmonics=toneProfiles[instrument]||toneProfiles.flute;
 const real=new Float32Array(harmonics.length+1),imag=Float32Array.from([0,...harmonics]);
 osc.setPeriodicWave(context.createPeriodicWave(real,imag));
 osc.frequency.setValueAtTime(soundingFrequency(writtenMidi,transpose),start);
 gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.16*level,start+.02);
 gain.gain.setValueAtTime(.16*level,start+.5);gain.gain.exponentialRampToValueAtTime(.0001*level,start+1);
 osc.connect(gain);gain.connect(context.destination);
 osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start(start);osc.stop(start+1);return osc;
}
let noteAudioContext;
function runAudio(schedule,onStart=()=>{}){
 let notified=false;const notify=()=>{if(!notified){notified=true;onStart();}};
 try{
  const AudioContextClass=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AudioContextClass){notify();return;}
  if(!noteAudioContext||noteAudioContext.state==='closed')noteAudioContext=new AudioContextClass();
  const context=noteAudioContext;
  const start=()=>{try{schedule(context);}finally{notify();}};
  if(context.state==='suspended')context.resume().then(start).catch(notify);
  else start();
 }catch{notify();/* Sound availability must never interrupt practice. */}
}
export function playNoteTone(writtenMidi,transpose=0,instrument='flute',onStart,volume=1){const level=soundVolume(volume);if(level===0){onStart?.();return;}runAudio(context=>scheduleNoteTone(context,writtenMidi,transpose,instrument,level),onStart);}
// Muted automatic feedback must still start the UI's normal advancement delay.
export function playAnswerTone(writtenMidi,transpose=0,instrument='flute',onStart,enabled=true,volume=1){if(!enabled){onStart?.();return;}playNoteTone(writtenMidi,transpose,instrument,onStart,volume);}
// Original MP3 supplied by the user; repeated mistakes restart rather than layer.
export const incorrectSoundUrl='audio/incorrect-buzz.mp3';
export function createIncorrectPlayer(AudioClass=globalThis.Audio){
 let audio;
 return (volume=1)=>{
  try{
   const level=soundVolume(volume);if(level===0&&!audio)return;
   if(!AudioClass)return;
   if(!audio){audio=new AudioClass(incorrectSoundUrl);audio.preload='auto';}
   audio.pause();audio.currentTime=0;audio.volume=level;if(level===0)return;
   const playback=audio.play();if(playback?.catch)playback.catch(()=>{});
  }catch{/* Unsupported audio must never interrupt the exercise. */}
 };
}
let incorrectPlayer;
export function playIncorrectTone(volume=1){incorrectPlayer??=createIncorrectPlayer();incorrectPlayer(volume);}
