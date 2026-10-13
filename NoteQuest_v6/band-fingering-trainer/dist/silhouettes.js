// Display windows into the original user-supplied sheet. The artwork is unchanged.
export const silhouetteSheet='art/instrument-silhouettes.png';
export const silhouetteViews={
 flute:[40,222,327,42],oboe:[488,52,46,291],bassoon:[730,12,126,333],
 clarinet:[1003,50,51,296],'bass-clarinet':[1268,28,150,316],
 'alto-sax':[325,390,130,274],'tenor-sax':[660,383,168,282],
 'bari-sax':[1026,378,184,296],trumpet:[22,795,301,116],
 horn:[334,742,270,184],trombone:[638,778,370,129],
 euphonium:[1039,706,162,247],tuba:[1290,648,225,307]
};
export function silhouetteDefinitions(){return `<svg width="0" height="0" aria-hidden="true" class="silhouette-defs"><defs><image id="silhouette-sheet" href="${silhouetteSheet}" x="0" y="0" width="1536" height="1024"/>${Object.entries(silhouetteViews).map(([id,rect])=>`<clipPath id="silhouette-clip-${id}"><rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}"/></clipPath>`).join('')}</defs></svg>`;}
export function silhouetteImage(instrument,cls=''){return `<svg class="instrument-photo instrument-silhouette ${cls}" viewBox="${silhouetteViews[instrument.id].join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><g clip-path="url(#silhouette-clip-${instrument.id})"><use href="#silhouette-sheet"/></g></svg>`;}
