export const signature=(f,partials=false)=>[...f.keys].sort().join(',')+(partials?'|'+f.partial:'');
export const accepts=(note,f,partials=false)=>note.fingerings.some(a=>signature(a,partials)===signature(f,partials));
export function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function poolFor(instrument,tier){return instrument.notes.filter(n=>n.tier<=tier);}
export function makeQueue(pool,count,rng=Math.random){if(!pool.length)throw Error('Empty note pool');const result=[];while(result.length<count){let batch=shuffle(pool,rng);if(batch.length>1&&result.at(-1)?.id===batch[0].id)[batch[0],batch[1]]=[batch[1],batch[0]];result.push(...batch);}return result.slice(0,count);}
export function distinctMissed(notes){return [...new Map(notes.map(n=>[n.midi,n])).values()];}
export function missedPracticeQueue(notes,rng=Math.random){const pool=distinctMissed(notes);return pool.length?makeQueue(pool,Math.min(10,pool.length*3),rng):[];}
export function choicesFor(note,instrument,partials=false,rng=Math.random){
 const correct=note.fingerings[0];
 const seen=new Set(note.fingerings.map(f=>signature(f,partials)));
 const wrong=[];
 const collect=notes=>{for(const n of shuffle(notes,rng))for(const f of n.fingerings){const s=signature(f,partials);if(!seen.has(s)){seen.add(s);wrong.push(f);}}};
 collect(instrument.choicePool||instrument.notes);
 // A small tier may have too few distinct answers after accepted alternatives
 // are excluded (e.g. first-tier trombone F). Borrow only the missing distractors.
 if(wrong.length<3){const preferred=wrong.length;collect(instrument.notes);const fallback=shuffle(wrong.slice(preferred),rng);wrong.splice(preferred,wrong.length-preferred,...fallback.slice(0,3-preferred));}
 if(wrong.length<3)throw Error('Insufficient distinct distractors');
 return shuffle([correct,...shuffle(wrong,rng).slice(0,3)],rng);
}
export function newRound(queue){return {queue,index:0,firstCorrect:0,correct:0,streak:0,best:0,missed:[],attempted:false,solved:false};}
export function submit(round,f,partials=false){if(round.solved||round.index>=round.queue.length)return false;const n=round.queue[round.index],ok=accepts(n,f,partials);if(ok){round.correct++;if(!round.attempted){round.firstCorrect++;round.streak++;round.best=Math.max(round.best,round.streak);}round.solved=true;}else {round.streak=0;if(!round.missed.some(m=>m.id===n.id))round.missed.push(n);}round.attempted=true;return ok;}
export function reveal(round){round.streak=0;round.attempted=true;round.solved=true;const n=round.queue[round.index];if(!round.missed.some(m=>m.id===n.id))round.missed.push(n);}
export function advance(round){if(!round.solved)return;round.index++;round.attempted=false;round.solved=false;}
export function accuracy(round){const answered=round.index+(round.attempted?1:0);return answered?Math.round(100*round.firstCorrect/answered):null;}
