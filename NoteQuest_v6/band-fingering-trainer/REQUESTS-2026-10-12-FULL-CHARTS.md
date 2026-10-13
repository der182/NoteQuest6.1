# Full fingering charts

- [x] Add a collapsed Full fingering chart beneath the individual note tool on the main Note Library page and in-game library.
- [x] Cover all 13 instruments and every supported note, independently of practice filters.
- [x] Use the selected equipment and written notation, including single/double horn, trigger trombone, 3/4 valves, and euphonium clefs/transposition.
- [x] Group cards by written octave and preserve selectable enharmonic spellings with staff notation.
- [x] Show primary fingerings and expandable alternate diagrams using the existing chart geometry.
- [x] Load chart artwork on first expansion; preserve expansion state while exploring notes.
- [x] Note-name buttons load and focus the individual note tool; the selected chart card is highlighted.
- [x] Rebuild the offline HTML and source archive.

Validation: all 74 automated checks pass. New tests cover complete coverage and render counts for all instrument/equipment variants, equipment key limits, primary/alternate fidelity, source-data immutability, initially collapsed markup, single lazy render, and exact sharp/flat note selection. Embedded JavaScript syntax and ZIP integrity checked. Visual browser verification could not run because the current file:// URL is prohibited by the browser tool's policy; no alternate browser surface was used.
