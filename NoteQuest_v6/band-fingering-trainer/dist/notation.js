import {pitchName} from './data.js';
export function staffPosition(pitch,clef){const m=pitch.match(/^([A-G])([b#]?)(\d)$/);const step=+m[3]*7+'CDEFGAB'.indexOf(m[1]);const bottom=clef==='bass'?2*7+4:4*7+2;return {y:140-(step-bottom)*7,accidental:m[2]};}
export function staff(pitch,clef='treble',draggable=false){
 const {y,accidental}=staffPosition(pitch,clef);let lines='';
 for(let i=0;i<5;i++)lines+=`<line x1="40" y1="${84+i*14}" x2="360" y2="${84+i*14}"/>`;
 for(let ly=154;ly<=y;ly+=14)lines+=`<line x1="202" y1="${ly}" x2="246" y2="${ly}"/>`;
 for(let ly=70;ly>=y;ly-=14)lines+=`<line x1="202" y1="${ly}" x2="246" y2="${ly}"/>`;
 // SMuFL: one em is four staff spaces. Bravura clef origins sit on
 // the G line (treble, second from bottom) and F line (bass, second from top).
 const clefY=clef==='bass'?98:126;
 const clefSvg=`<text class="music-glyph clef-glyph" x="61" y="${clefY}" font-size="56">${clef==='bass'?'&#xE062;':'&#xE050;'}</text>`;
 return `<svg class="staff" viewBox="0 0 400 230" role="img" aria-label="${pitchName(pitch)}, ${clef} clef"><g stroke="currentColor" stroke-width="1.3">${lines}</g><g fill="currentColor">${clefSvg}</g>${accidental?`<text class="music-glyph accidental-glyph" fill="currentColor" x="184" y="${y}" font-size="56">${accidental==='b'?'&#xE260;':'&#xE262;'}</text>`:''}${draggable?`<circle class="note-drag-hit" cx="224" cy="${y}" r="20" fill="transparent"/>`:''}<ellipse class="note-head" cx="224" cy="${y}" rx="10" ry="6.7" transform="rotate(-18 224 ${y})" fill="currentColor"/><line x1="${y<112?215:233}" y1="${y}" x2="${y<112?215:233}" y2="${y<112?y+46:y-46}" stroke="currentColor" stroke-width="2"/></svg>`;
}
