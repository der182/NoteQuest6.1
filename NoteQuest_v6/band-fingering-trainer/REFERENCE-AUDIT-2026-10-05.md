# Teacher-chart audit — October 5

References inspected visually: hornchart.pdf, trombonechart.pdf, clarinetchart.pdf (all one-page scans). Facts are encoded in dist/chart-data.js; scans are not bundled in the downloadable project.

## Horn

Left-to-right order is the preferred order. All chart combinations within C3–G5 are accepted. Important corrections include low D3 = T12 before 13; G-sharp4 = T23 before 23; A4 = T12 before 12; C-sharp5 = T23 / 12 / 2; F-sharp5 = T2 / T12 / 2; G5 = T open / T1 / open. Every resulting fingering/partial pair passes the independent harmonic-series check. Existing independently verified alternatives follow the chart combinations. Bass-clef entries below the existing practice range and notes above G5 were not silently added.

## Trombone

The supplied chart uses physical slide numbering, including adjustments. It replaces the former F-side renumbering. Low trigger notes are B1 = T-flat7 (lip down), C2 = T7, D-flat2 = T6, D2 = T-flat4, E-flat2 = T-flat3. E2/F2 retain 7/6 as preferred and T2/T1 as alternatives. The chart also adds trigger alternatives for G2, A-flat2, A2, B-flat2, and B2. B-flat3 is 1 or sharp5; B3 is 4 or flat7; C4 is 3 or flat6. All listed combinations through B-flat4 are transcribed, including upper-register modified positions.

Sharp/flat controls modify physical slide placement, not the staff pitch. Plain 5 is deliberately rejected for the B-flat3 alternative. No-trigger mode excludes all trigger fingerings and trigger-only low notes. Shaded pedal tones and notes above the existing upper range are outside this release. Lowest trigger notes require instrument reach and embouchure adjustment.

## Clarinets

Within B-flat clarinet E3–G6 and bass clarinet E-flat3–C6, chart alternatives are merged with the previously verified data. Additions include E3 and B4 combined left E/B + right F/C, F-sharp3 and C-sharp5 combined pinkies, B3/F-sharp5 fork-key alternatives, E-flat4/B-flat5 sliver and 1+1 alternatives, side-key F-sharp4, throat A/B-flat resonance alternatives, and upper clarinet E-flat6/F6/F-sharp6/G6 variants. Enharmonic spellings receive identical combinations. The first chart entry is primary when alternate acceptance is disabled.

No shape, size, or location changed. The three left-pinkie key IDs were reassigned to the correct existing shapes: top F/C, left E/B, right F-sharp/C-sharp. This corrects what lights up without changing the layout students see.

## Verification

55 automated tests include independent reference fixtures, negative tests for missing slide modifiers, preferred-only checking, four unambiguous choices, transposition, harmonic consistency, extreme-range selection, custom-time parsing/sharing and instrument-tone scheduling. Browser checks additionally exercise controls and timed progression.

October 11 recheck: the combined school-band PDF pages 3–4 confirm inner left E/B and outer F-sharp/C-sharp pinky petals on both clarinets. Tests separately cover B4, C-sharp5/ D-flat5 and documented alternative combinations. Layout geometry is retained. Per teacher clarification, horn and trombone fingering tables are not changed in this revision.
