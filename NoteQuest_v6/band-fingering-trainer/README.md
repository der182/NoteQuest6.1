# Note Quest

**Master your instrument, one note at a time.**

Open the companion **Note Quest.html** in a modern browser. The game, music font, diagrams, your supplied logo artwork and silhouettes, and the incorrect-answer MP3 are embedded, so it works offline. For development, serve `dist/` with `python3 -m http.server 4173 --directory dist`.

## Student flow

1. **Home:** choose an instrument from matching silhouettes supplied in the instrument sheet. Configure F single/double horn, trombone trigger, three/four valves for euphonium or tuba, and euphonium bass/treble notation here. Then choose a level.
2. **Practice:** Beginner uses the first five concert B-flat scale notes with chromatics off; horn also offers concert F. Intermediate uses a larger chromatic range. Advanced uses the full verified range. Custom opens Advanced Setup. Choose **Multiple Choice** or **Build the Combination**. Directly beneath the mode cards, choose **Questions** (default **10**, with **20/30** available) or **Timed** (30 seconds, 1/2/3/5 minutes, or Custom Time).
3. **Start Practice:** read real written notation and answer. Build the Combination places notation on the left and inputs on the right on desktop. Multiple Choice centers the notation above a simple two-by-two grid for every instrument, with choices 1/3 on the left and 2/4 on the right. Feedback stays below the full grid rather than covering the bottom choices. Phone layouts stack the workspace and keep answer actions available.

The top navigation is **Home / Practice / Note Library / Advanced Setup**. A shared pale-blue wave banner with yellow accents and the supplied Note Quest logo stays consistent on Home, Practice, Note Library, Advanced Setup, gameplay, and results. The instrument pill is plain text, not a dropdown; it follows the current selection. On the full Note Library page it shows the instrument being explored, while an in-game library keeps the round’s instrument in the header. There are no accounts, student dashboards, achievements, or invented progress statistics. Note Library browses any supported written note and its primary/alternate fingerings, with tone playback, instructions, and sources. Drag the note vertically to update its pitch and fingering live; ↑/↓ step through staff positions, while Home/End select the range limits. The dropdown still offers individual chromatic spellings. Side arrows cycle all documented alternate fingerings, independent of the exercise acceptance toggle.

## Full fingering charts

In **Note Library**, expand **Full fingering chart** beneath the individual-note tool. It begins collapsed and loads its diagrams only when opened. Every supported note is included, regardless of the selected practice preset or note filters. The chart uses the selected equipment configuration: F single/double horn, straight/trigger trombone, three/four valves, and euphonium bass/treble notation.

Cards run from low to high, grouped by written octave. Enharmonic spellings share a card with both written notes shown on their staff; all spellings remain selectable. Each card shows its main fingering, with smaller **Alternate fingerings** expanders for the other documented combinations. Select a note name to load it in the tool above. Changing the explored note highlights its chart card without closing the full chart or its alternate expanders. The same section is available in the paused in-game library.

## Advanced Setup and floating settings

The Advanced Setup sidebar separates **Instrument & equipment**, **Notes & range**, **Game mode**, **Round & timing**, **Keyboard shortcuts**, **Appearance & Sound**, and **Share settings**. All existing detailed controls remain available:

- First notes, Build your range, Chromatic fluency, Full verified range, Extended range, and Customized presets.
- Written lowest/highest notes, arrows, dropdowns, and sliders with live staff previews.
- Chromatic, natural, sharp, and flat filters; individual note exclusions; alternate-fingering acceptance (off by default).
- Three/four valves, euphonium notation, horn type, and trombone trigger. The trombone trigger toggle remains beneath the note-range displays in detailed settings.
- Question rounds of 10/20/30, or timed challenges of 30 seconds and 1/2/3/5 minutes. Custom Time accepts 00:01 through 99:59.
- Remappable valve keys, immediate validation, default/number presets, and shortcut opt-out.
- Copyable settings links, including all exercise options and active keyboard mappings.

**Use these settings** returns to Practice without discarding the custom note pool. Shared links open Practice with the imported instrument, level/pool, mode, and question/timing options intact.

During a round, the **Change settings** gear opens the full floating menu. Each topic opens a sliding sheet with Back navigation, including shortcut help for woodwinds. Play and pending advancement pause. Cancel resumes the same question; applying changed exercise settings starts a fresh round. Note Library during a round opens the note tool over the current question and pauses the stopwatch and pending advancement. It starts on the current written note. Closing it resumes the same round with the submitted keys, score, and question intact. Library instrument/note browsing is separate from exercise configuration. Guides & Sources remains a separate button within the library. **Appearance & Sound** is a topic in Advanced Setup and the in-game menu, with two sections on the same page:

- **Appearance:** accent colors, dark mode, and Standard/Large chart size. Large enlarges game diagrams/controls and library charts. Multiple Choice keeps the same two-by-two layout at either size; Large increases diagram size modestly without cropped chart framing or horizontal scrolling. Woodwind Build the Combination starts enlarged when Large is selected; its local Compact/Enlarge control remains available.
- **Sound:** independent Note volume and Incorrect-answer volume sliders, toggles for automatic correct-answer tones and incorrect-answer sounds, and Restore sound defaults. Defaults are 100% on both sliders with both sound toggles enabled. Restoring sound leaves appearance and chart size unchanged.

Preferences are saved on the device immediately. Automatic answer sounds can be disabled while **Hear Tone** remains available at the selected note volume. Zero volume silences playback. Muting does not change scoring or the normal one-second next-question delay. These device preferences are separate from shared exercise settings. There is no separate header gear or Accessibility section.

## Answering and feedback

The modes are exclusive. Multiple Choice only offers four diagram choices; it never includes a second valve-building input. Build the Combination lets players click/tap woodwind keys, valves, or a trombone position and submit. Woodwind keys also support drag-to-toggle: entering an open key closes it, entering a covered key releases it, and leaving/re-entering toggles it again. They retain Tab focus, and Space activation. Fractional-hole states retain their direct selector and tap cycle.

| Instrument | Default valve shortcuts in Build the Combination |
| --- | --- |
| Trumpet; three-valve euphonium/tuba | `[` = 1, `]` = 2, `\` = 3 |
| Four-valve euphonium/tuba | `P` = 1, `[` = 2, `]` = 3, `\` = 4 |
| Horn | `Q` = 3, `W` = 2, `E` = 1, `X` = trigger |

Press again to release. Enter from a valve or the page checks the answer. Other focused buttons retain normal activation. Multiple Choice uses A–D for valved brass and 1–4 for other instruments; A–D cannot be remapped to valves. Held-key repeats, system modifiers, text inputs, open dialogs, and completed questions do not trigger answers.

Incorrect submitted controls turn **red**. Show answer reveals the correct controls **green**. When alternate fingerings are enabled, the chart begins with the **main fingering** and side arrows browse the other accepted combinations. This also appears after a correct answer. Question rounds keep answers with alternatives visible until Next note; timed rounds continue to advance automatically. Browsing does not alter accuracy, streaks, missed notes, or acceptance rules. **Hear Tone** can be replayed throughout play. Correct/revealed answers play an instrument-style synthesized tone at sounding pitch, lasting one second with a final half-second decay. Upper harmonics make low tuba pitches more audible. These note tones are Web Audio instrument-style profiles, not recorded samples or a General MIDI sound bank. Incorrect answers use the user-supplied **incorrect buzz.mp3**, which restarts on repeated wrong attempts and respects the existing sound preference. Timed rounds advance when the answer tone finishes; elapsed time appears in both modes.

Accuracy counts first-attempt answers. Corrected timed answers score once; revealed answers do not score. Results show streaks and missed notes. Practice Missed Notes uses three questions per distinct sounding pitch, capped at ten, and remains a finite question round even after timed play.

## Preserved chart and data layer

All 13 instrument families remain available: flute, oboe, bassoon, B-flat clarinet, bass clarinet, alto/tenor/baritone saxophone, trumpet, horn, trombone, euphonium/baritone, and tuba. Written pitch, clefs, transposition, equipment-specific ranges, selected alternate fingerings, trombone slide adjustments, and brass harmonic-series validation remain unchanged by the UI redesign. Partials remain metadata; students do not select them.

Original vector woodwind diagrams preserve the paper-chart layout and compact clusters, with accessible key names rather than printed labels. Clarinet/bass-clarinet A touches are teardrops; their upper-stack and pinkie shapes retain the corrected geometry. Bass clarinet has a separate five-key pinkie cluster and low E-flat extension. Sax low C-sharp uses the outer left pinkie key. Baritone sax retains low A. The normal flute thumb and B-flat thumb alternatives remain corrected. Enlarge chart provides larger controls when needed.

Clefs/accidentals use Steinberg’s unmodified **Bravura** font under the SIL Open Font License (`dist/fonts/OFL.txt`). Treble is anchored to G4 and bass to F3. Fingering data lives in `dist/data.js` and `dist/chart-data.js`; chart geometry is separate in `dist/woodwinds.js`. See `ARCHITECTURE.md` and the dated reference audits for extension/correction instructions.

Sources include Yamaha, Woodwind Fingering Guide, Fox Products, University of Mississippi, and the user-supplied PDFs. Supported ranges are school-band practice ranges, not every possible instrument extension or altissimo note. Full verified range includes every supported note. Extended range excludes the middle and selects the lowest/highest perfect fourths; saxophone extremes use low C4 and below / high D6 and above.

## Sharing, storage, and artwork

Choose **Advanced Setup → Share settings** or Share settings in the floating menu. Links restore equipment, written-note pools and exclusions, modes, round options, concert key, alternates, and active saved shortcuts. Scores and unrelated keyboard maps are excluded. Host the HTML/project at a stable public address for students to use links; localhost/file links are only usable on the current computer. Clipboard failure exposes a manual-copy field. Invalid links leave the app usable.

Only key maps and appearance/sound preferences persist locally. Other options and round progress last for the visit or come from a shared link. No login, microphone, analytics, or student data transmission is used.

All instrument displays use the unchanged **instrument silhouettes.png** sheet supplied by the user. Individual instruments are isolated with SVG display windows and clipping, without generating or redrawing the artwork. The header displays the main logo directly from the supplied brand sheet, including its pin, note, yellow star, and wordmark. Historical, unused photo assets and their credits remain in the source project; photo credits are no longer shown in References, and the offline HTML does not embed the photographs. Interface icons remain SVG artwork. Horn artwork and controls show T–1–2–3, independently of Q/W/E/X keyboard order. Horn and trombone trigger controls use boxes. Staff accidentals inherit the staff color, including light sharps/flats in dark mode.

## Verify and package

Run `node --test tests/*.test.js` (Node 22+). **81 checks** cover the existing musical/game functions and student-level mappings for every equipment variant, concert-key reset, and preservation of customized shared pools, primary-first answer browsing, supplied-MP3 playback, staff-drag pitch selection, accidental preservation, keyboard reference navigation, library clock/input preservation, horn visual order, boxed triggers, and deliberate pointer re-entry. Browser verification covers desktop and 390/320-pixel phone layouts, equipment choices, custom ranges, sharing, both modes, keyboard/woodwind input, red/green feedback, floating sheets, pausing, and timed playback/expiry.

Rebuild offline HTML and source archives with `python3 scripts/package.py`. Outputs are **Note Quest.html** and **Note Quest Project.zip**, with legacy Band Fingering Trainer filenames retained as matching copies. This is a local classroom test project; no public deployment has been published.
