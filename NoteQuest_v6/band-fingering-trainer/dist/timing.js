export function newClock(now,duration=0){return {started:now,paused:null,pausedTotal:0,duration:duration*1000};}
export function elapsedMs(clock,now){return Math.max(0,(clock.paused??now)-clock.started-clock.pausedTotal);}
export function pauseClock(clock,now){if(clock.paused===null)clock.paused=now;}
export function resumeClock(clock,now){if(clock.paused!==null){clock.pausedTotal+=now-clock.paused;clock.paused=null;}}
export function timeExpired(clock,now){return clock.duration>0&&elapsedMs(clock,now)>=clock.duration;}
export function formatTime(ms){const seconds=Math.floor(Math.max(0,ms)/1000);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
export function parseTimeLimit(value){const m=String(value).trim().match(/^(\d{1,2}):([0-5]\d)$/);if(!m)return null;const seconds=Number(m[1])*60+Number(m[2]);return seconds>=1&&seconds<=5999?seconds:null;}
export function validTimeLimit(seconds){return Number.isInteger(seconds)&&seconds>=1&&seconds<=5999;}
