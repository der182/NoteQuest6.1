// Independently transcribed from the teacher-supplied charts (October 5).
// Left-to-right order is pedagogical preference. Ranges remain school-band ranges.
export const schoolHorn = {
 C3:[''],Db3:['T23','123'],D3:['T12','13'],Eb3:['T1','23'],E3:['T2','12'],F3:['T','1'],
 Gb3:['2'],G3:[''],Ab3:['23'],A3:['12'],Bb3:['1'],B3:['2'],
 C4:[''],Db4:['12'],D4:['1'],Eb4:['2'],E4:[''],F4:['1'],Gb4:['2'],G4:[''],
 Ab4:['T23','23'],A4:['T12','12'],Bb4:['T1','1'],B4:['T2','2'],C5:['T',''],
 Db5:['T23','12','2'],D5:['T12','1',''],Eb5:['T1','2'],E5:['T2',''],F5:['T','1'],
 Gb5:['T2','T12','2'],G5:['T','T1','']
};
// #/b modify slide position, NOT the note on the staff. Trigger positions use
// the physical numbering printed in trombonechart.pdf, not F-side renumbering.
export const schoolTrombone = {
 B1:['Tb7'],C2:['T7'],Db2:['T6'],D2:['Tb4'],Eb2:['Tb3'],E2:['7','T2'],F2:['6','T1'],
 Gb2:['5'],G2:['4','Tb6'],Ab2:['3','T6'],A2:['2','Tb4'],Bb2:['1','Tb3'],B2:['7','Tb2'],C3:['6','T1'],
 Db3:['5'],D3:['4'],Eb3:['3'],E3:['2','7'],F3:['1','6'],Gb3:['5'],G3:['4'],
 Ab3:['3','7'],A3:['2','6'],Bb3:['1','#5'],B3:['4','b7'],C4:['3','b6'],Db4:['2','b5'],
 D4:['1','b4'],Eb4:['3','#6'],E4:['2','#5'],F4:['1','#4','6'],Gb4:['#3','5','7'],
 G4:['#2','4','6'],Ab4:['3','5','7'],A4:['2','4','6'],Bb4:['1','3','5']
};
const closed='T L1 L2 L3 R1 R2 R3';
export const schoolClarinet = {
 E3:[closed+' LE RF',closed+' LE',closed+' RE'],F3:[closed+' RF',closed+' LF'],
 'F#3':[closed+' LF# RF',closed+' LF#',closed+' RF#'],G3:[closed],Ab3:[closed+' RAb'],
 A3:['T L1 L2 L3 R1 R2'],Bb3:['T L1 L2 L3 R1'],B3:['T L1 L2 L3 R2','T L1 L2 L3 R1 ForkB'],
 C4:['T L1 L2 L3'],'C#4':['T L1 L2 L3 C#'],D4:['T L1 L2'],
 Eb4:['T L1 L2 SideEb','T L1 L2 SliverEb','T L1 R1'],E4:['T L1'],F4:['T'],
 'F#4':['L1','T SideEb Trill2'],G4:[''],Ab4:['Ab'],
 A4:['A','A R1 R2 R3 RF','A L2 L3 R2 R3 RF'],
 Bb4:['Reg A','Reg A L2 L3 R2 R3 RF','A Trill2 Trill3'],
 B4:['Reg '+closed+' LE RF','Reg '+closed+' LE','Reg '+closed+' RE'],
 C5:['Reg '+closed+' RF','Reg '+closed+' LF'],
 'C#5':['Reg '+closed+' LF#','Reg '+closed+' LF# RF','Reg '+closed+' RF#'],
 D5:['Reg '+closed],Eb5:['Reg '+closed+' RAb'],E5:['Reg T L1 L2 L3 R1 R2'],F5:['Reg T L1 L2 L3 R1'],
 'F#5':['Reg T L1 L2 L3 R2','Reg T L1 L2 L3 R1 ForkB'],G5:['Reg T L1 L2 L3'],
 Ab5:['Reg T L1 L2 L3 C#'],A5:['Reg T L1 L2'],
 Bb5:['Reg T L1 L2 SideEb','Reg T L1 L2 SliverEb','Reg T L1 R1'],B5:['Reg T L1'],C6:['Reg T'],
 'C#6':['Reg T L2 L3 R1 R2'],D6:['Reg T L2 L3 R1 RAb'],
 Eb6:['Reg T L2 L3 R1 ForkB RAb','Reg T L2 L3 R3 RAb'],E6:['Reg T L2 L3 RAb'],
 F6:['Reg T L2 L3 C# RAb','Reg '+closed+' C#'],
 'F#6':['Reg T L2 RAb','Reg T L1 L2 R1 R2 R3 RAb'],
 G6:['Reg T L2 R1 R2 RAb','Reg T L1 R1 R2 RAb','Reg T L1 L3 R1 R2 R3 RAb']
};
