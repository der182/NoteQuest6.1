# Architecture

A dependency-free static application. Serve `dist/` from any HTTP server. All computation stays in the browser. No account, microphone, external script, analytics, or student data submission is used.

- `dist/chart-data.js`: independently transcribed teacher-chart preferred/alternate tables.
- `dist/data.js`: source registry, instrument configurations, key definitions, written pitches, MIDI values, tier membership, and accepted fingering–partial pairs. This is the correction/expansion layer.
- `dist/engine.js`: pure functions for round creation, answer equivalence, unique distractors, first-attempt scoring, streaks, and missed-note queues.
- `dist/woodwinds.js`: instrument-specific chart geometry, shaped key controls, and fractional first-hole interaction.
- `dist/notation.js`: single-note staff renderer with Bravura SMuFL clefs and accidentals. Diatonic staff position is independent of chromatic pitch. Includes clefs, accidentals, stems, and ledger lines.
- `dist/keyboard.js`: instrument-aware valve shortcuts, non-conflicting diagram shortcuts, and input guards.
- `dist/practice.js`: written-range presets, pitch/accidental filters, and the alternate-fingering policy.
- `dist/audio.js`: lazy Web Audio context, concert-pitch conversion, one-second instrument-style harmonic synthesis with 0.5-second decay, and node cleanup. Sound is started from answer/reveal gestures and does not affect scoring if unavailable.
- `dist/timing.js`: pure elapsed-time, deadline, pause/resume, and mm:ss formatting functions.
- `dist/app.js`: setup, challenge, interactive instrument, feedback, results, guide, and shared settings sheets. An isolated settings draft pauses the clock; Cancel restores the prior configuration, while Apply starts over only when settings change.
- `dist/style.css`: responsive layout, touch targets, and keyboard focus states.
- `tests/`: musical invariants, scoring behavior, dataset integrity, and rendering bounds.

## Data contract

Each instrument specifies `id`, `name`, `system`, `kind` (woodwind/valves/slide), `clef`, `transpose` (semitones added to written MIDI to obtain sounding MIDI), `keys`, and `notes`.

Equipment configuration filters fourth-valve controls and accepted fingerings before creating the question pool. F-attachment configuration adds a separate trigger control and supported F-side positions.

Each note stores `id`, `pitch` (scientific written pitch, e.g. Bb4), `midi`, `tier` (first tier introducing it), `sources` (registry IDs), optional `tip`, and `fingerings`. Each fingering stores an unordered `keys` array plus a paired `partial` for brass. The first fingering is the pedagogical default; all entries are accepted when the alternate toggle is enabled; otherwise only the first is accepted. The game compares keys/positions only. Paired harmonic metadata is retained for acoustic data tests, not student input.

Half/quarter holes use mutually exclusive L1 state IDs. A selected fractional state replaces full L1. Tier metadata supports the introductory presets; the UI uses custom written-pitch boundaries, accidental switches, and excluded note IDs. Enharmonic note records can share fingerings and MIDI while retaining distinct staff positions and IDs.

The challenge builder deduplicates diagrams by actual answer equivalence and excludes every accepted alternative from distractors. Four options must contain exactly one accepted answer. Randomized blocks avoid immediate repeats except when practicing a single missed note.

## Verification sequence

Clarinet and trumpet established the first complete implementation. Core tests passed before expansion. Browser checks then exercised clarinet choices, wrong-answer retries, correct advancement, missed-note report and practice, interactive clarinet, and wrong/correct trumpet partials. Remaining instruments reuse the same tested engine, not separate scoring implementations.

## Classroom revision

`keyBounds` defines shape-specific native button hit boxes and pointer input targets the SVG key faces, so close side/pinkie keys remain independently clickable even where the printed lever outlines meet. Interactive and static charts share geometry. The alternate policy is applied to a copied instrument view, never mutating source data. Small custom note pools use full-library distractors as needed to retain four unique choices.

Keyboard mappings are keyed by instrument and valve count in localStorage. Mappings are validated for unique single characters and reserved A–D. Runtime shortcuts are suspended for any open dialog or text input. Chart enlargement and answer revelation do not change the current question or scoring policy.

`dist/share.js` allowlists and validates version-3 URL-fragment settings (with version-1/2 compatibility), including instrument-specific written ranges and active key bindings. Shared links do not contain student results or unrelated local mappings. Setup restores links at load and on fragment navigation; clipboard failure exposes a manual-copy field. The shortcut form is rendered in the Advanced Setup keyboard topic and in the mid-round gear dialog.

Question rounds are the initial default. Timed rounds append shuffled question batches until the deadline and count each correctly solved question once; revealed questions do not score. Deadline checks also run on submissions, independent of timer tick frequency. First-attempt accuracy remains a separate measure. Beginner presets derive written notes from concert major scales and each instrument transposition; disabling chromatics retains those scale tones rather than filtering all written accidentals.

## October 5 data and timing

Trombone answers encode the numbered position plus optional `Trigger`, `Sharp`, or `Flat` keys. Adjustments do not change the target note MIDI. They are part of answer equivalence and distractor deduplication. Trigger positions use the supplied physical-position chart; the old F-side numbering is replaced. Stored harmonic partials remain data checks, never student controls.

PDF horn/clarinet alternatives are applied by MIDI so enharmonic spellings stay consistent. Chart-listed horn combinations lead the preferred order; previously verified extra horn alternatives remain available with alternates on. Clarinet symbols retain their geometry, with corrected left-pinkie input bindings.

Custom time is validated as mm:ss (1–5999 seconds); shared settings include duration and the Custom Time selector state. Timed feedback scheduling tracks remaining delay across settings pause/cancel, and deadlines still end the round before a delayed next question can run.


## October 11 interaction and configuration

`configuredInstrument` additionally accepts `hornType` (`double` default, or `single`). It returns a copied F-only view for single horn before alternate filtering, so T cannot appear in accepted answers, controls, shortcuts or distractors. The original double-horn table is unchanged. Version-3 shared settings validate and preserve horn type; older links default to double.

`dist/drag.js` handles Pointer Events, capture, per-key-entry toggling, and click suppression. Main-hole strokes restrict painting to main holes to avoid incidentally closing sliver/bis keys. Fractional first-hole taps still cycle coverage; painted L1 means full coverage. Cancelled gestures do not cycle a fractional hole. Touch scrolling is disabled only on the interactive chart while direct manipulation is available elsewhere.

`dist/preferences.js` allowlists device-local appearance and optional wrong-answer sound settings. Semantic CSS colors cover the staff, key artwork, SVG valve choices, input fields, feedback, and settings sheets in dark/light themes. These preferences are separate from the practice configuration draft, scores and shared teacher links; changing appearance does not restart a round.

The engine deduplicates missed records by MIDI and builds a balanced shuffled queue of `min(10, 3 * uniquePitches)` questions. Such practice always uses a finite question round. Start/Share commit valid shortcut form values, and valid edits persist as entered. Question replacement restores page scroll and chart enlargement after DOM replacement.

Audio scheduling notifies the UI when playback starts, including graceful silent fallback. The next-question delay equals the one-second envelope. A round identity/index guard prevents delayed audio resume from advancing a later question/round. Settings pause the pending delay; cancellation resumes it. Incorrect-answer playback uses the user-supplied MP3 and can be disabled without affecting score or feedback.

## October 12 student interface

`dist/student-ui.js` maps Beginner/Intermediate/Advanced to the existing first/chromatic/full presets; it recognizes modified imported pools as Custom without mutating them. Horn-only concert F is not carried over when selecting another instrument. The core data, scoring, note notation, input, audio, clock, and shared-config formats are unchanged.

`dist/app.js` now renders Home, Practice, Note Library, and Advanced Setup through a small page router. Equipment appears alongside Home instrument selection. Advanced Setup uses the same settings field generator and handlers as the paused mid-round sheets; no settings controls have a second independent implementation. Cancel/apply draft isolation remains specific to mid-round settings. Appearance and guide modals additionally pause the clock and pending question advancement.

`dist/photos.js` records local real-photograph paths and attribution/source/license metadata. `dist/photos/` stores the downloaded assets. These are historical, unused assets with licenses documented in PHOTO-CREDITS.md. The current packaging script omits the photo module. The header logo now displays supplied artwork; interface icons remain code-native SVG.

Note Library uses the configured instrument data before alternate filtering so all documented alternatives can be studied, even when an exercise accepts only primary fingerings. Shared links still restore the same versioned configuration and land on Practice, bypassing the instrument-selection step without overwriting filters.


## October 12 silhouette/audio/alternate-answer update

`dist/silhouettes.js` defines cropped display windows and SVG clips into a single unchanged user-supplied sheet. All instrument screens now use these symbols. The sprite image is stored in dist/art and embedded once as a data URL by the offline packaging script. Each symbol references that shared definition, avoiding thirteen full-image duplicates.

`dist/audio.js` plays the supplied MP3 through a reusable HTML Audio player. Repeated wrong attempts pause and restart it; unavailable/blocked playback is caught. Correct note synthesis and the device-local wrong-sound preference remain unchanged. The MP3 is also embedded offline.

`dist/answers.js` sets the default alternate policy to false and exposes stable primary-first, unique accepted combinations. Duplicate combinations with differing brass partial metadata are not shown twice. An answer-view index changes only the displayed chart, never the graded submission or round score. Multiple Choice replaces the correct disabled answer button with a non-button card so navigation buttons are not nested. Build the Combination updates its existing locked controls. Reveals and correct responses with alternatives show a manual Next in question rounds; timed rounds preserve automatic progression. New questions clear answer-view state.


## October 12 References and settings update

`dist/reference-input.js` maps pointer movement to supported written staff positions and exposes diatonic keyboard stepping. The Reference staff wrapper retains pointer capture while its SVG content and chart update live. A transform captured at gesture start prevents chart-height changes from feeding back into pointer coordinates. Pitch limits clamp safely; available matching accidentals are preserved, with a natural fallback. Keyboard Up/Down/Home/End complement the dropdown. Reference arrows use the same deduplicated, primary-first answer list as play without restricting study to the exercise alternate policy.

Practice shows Questions and Timed choices with native dropdowns directly below the mode cards. Selecting either dropdown activates its round type; Custom Time shares the existing parser and disables Start for invalid input. The Advanced Setup sidebar and in-game sheets expose Appearance & Sound. The independent header gear is removed. Device preferences remain separate from exercise settings and share links.

All instrument displays now use the supplied silhouette symbols. Historical photos and PHOTO-CREDITS.md remain unused source assets, and the offline packager omits photos.js. The header uses a clipped window into the unchanged supplied brand sheet, embedded once in offline output. Accidentals explicitly use currentColor, and music glyph CSS matches the staff theme.


## October 12 Note Library and brass display update

`dist/brass.js` separates displayed key order from input mappings: horn T/1/2/3 (F single horn 1/2/3) versus the retained Q/W/E/X defaults. Static horn/trombone trigger glyphs use rectangles; interactive trigger buttons use matching box shapes. Source fingerings, partial metadata, and acceptance rules are untouched.

The router opens Note Library in a dialog during play using the same root-parameterized renderer as the full page. Library instrument selection is independent of config.instrument, and the dialog starts at the current question pitch. The existing modal pause logic holds elapsed time and pending advancement until close; the exercise DOM, input selection, round object and score remain mounted. The Guides & Sources button opens the separate Guide & Sources dialog.

Pointer drag input tracks the key currently under the swept path rather than a once-per-stroke visited set. Each key entry toggles its own existing coverage; remaining inside a key does not repeat-toggle it. Deliberate leave/re-entry toggles again. Main-hole strokes retain the guard against incidental sliver/side-key hits; fractional-hole taps still cycle coverage, and flute linked thumb states remain exclusive.


## October 12 full fingering charts

`dist/full-chart.js` builds a complete library view directly from configured instrument data. Entries group by MIDI while preserving every written spelling and unique accepted key combination. It reuses the staff, woodwind, and brass renderers. The shared fingering-caption helper supplies accessible descriptions and existing exercise captions. Brass partial metadata does not create duplicate diagrams.

A native details element beneath the individual note tool is closed by default. Its body renders once upon expansion, keeping initial library load small and retaining nested alternate expansion state across note changes. Instrument changes rebuild the section for the new equipment-filtered data. Delegated note-name actions update the existing note tool; current note/card highlighting is independent of grading. All notes and alternates remain available for study even when excluded from the practice pool or primary-only acceptance is active.

The module is bundled into both offline game filenames and source archives. Full-chart tests cover all 13 instruments and equipment/notation variants, all note spellings, primary ordering, alternate deduplication, equipment limits, lazy expansion, and exact enharmonic navigation.


## October 13 Appearance & Sound sections

The shared advancedFields renderer has two on-page preference sections, Appearance and Sound, in both Advanced Setup and the paused settings sheet. Device preferences now validate/persist chartSize (standard/large), noteVolume and wrongVolume (0–1), correctSound and wrongSound alongside existing accent/dark fields. Legacy preferences migrate with Standard sizing, full-volume sound, and automatic correct tones enabled; existing wrong-sound choices are preserved. restoreSoundDefaults resets only sound fields.

applyPreferences sets the root chart-size attribute for choice diagrams, brass controls, and library charts. Starting a woodwind combination round respects the preferred size; changing size during a paused round updates the mounted workbench without resetting input. Per-round Compact/Enlarge controls retain their existing behavior.

scheduleNoteTone scales the entire envelope by the note volume, preserving frequency, instrument profile, duration, decay, and node cleanup. playAnswerTone bypasses automatic playback when disabled but still invokes the normal advancement callback. Manual Hear Tone uses playNoteTone with the same volume, independently of the correct-sound toggle. The MP3 player applies its own volume, restarts on repeated errors, and does not play at zero volume. Sound preferences do not enter scores or exercise/share configuration.

All 80 automated checks pass, including migration, clamping/storage failures, isolated sound reset, scaled synthesis, muted advancement, manual playback, MP3 volume/muting, and form-section/save/reset behavior. Live browser testing remains unavailable because the user-opened file URL is prohibited by the browser tool.


## October 13 shared banner

`dist/banner.js` provides original decorative SVG wave/music-note artwork inspired by the supplied Notequest banner.png and a context-aware instrument label helper. The existing supplied logo remains unchanged. Header navigation and the pill are HTML elements, independent of the artwork; the pill is a non-interactive span with polite updates only when its text changes. No instrument dropdown, dropdown arrow, or additional settings gear is introduced.

One shared header in index.html serves every screen. The banner’s light background, navy navigation, blue active underline, and white instrument pill retain their contrast independently of the body’s dark mode/accent choices. CSS keeps a common header height across setup/play/results, with a separate navigation row at tablet/phone widths.

The instrument label follows exercise selection on Home/Practice/Advanced Setup/play/results and independent library selection on the full Note Library page. Browsing a paused in-game library cannot change the active round label/configuration. All 81 automated checks pass, including header routing/selection and unchanged-label announcement suppression. Offline JavaScript and archive integrity verified. Visual browser checks remain unavailable because the current file:// preview is blocked by browser policy.


## October 13 Multiple Choice layout (superseded below)

Multiple Choice uses instrument-specific workspace classes. Vertical woodwinds have a compact four-card row beneath the notation. Flute and brass use a full-width two-column answer grid beneath the note row, preserving DOM and shortcut order (1/3 or A/C in the left column; 2/4 or B/D in the right). Both Standard and Large preferences retain these layouts. Very narrow vertical-woodwind rows scroll horizontally within the choice component instead of overflowing the page or stacking all four cards.

woodwindChoiceViewBox computes an SVG frame from existing key bounds plus thumb-guide bounds and ten units of padding. woodwindChart accepts an optional compactChoice flag for static Multiple Choice diagrams only. Key shapes, positions, and fingerings are unchanged; reference diagrams and interactive hit regions keep their original frame. Revealed answers use the same choice frame, with alternate arrows below compact vertical artwork so they do not cover keys.

All 83 tests pass, including complete key/guide bounds and preservation of paper-chart geometry in the compact frame. Offline JavaScript syntax and archive integrity verified. Visual browser verification remains unavailable due to file-preview policy.


## October 13 centered choice-layout restoration

The previous four-across vertical choice row and compact SVG-framing experiment were reverted after user feedback. woodwindChart again uses the original reference frame for all diagrams; key geometry remains unchanged. The two tests specific to the retired framing helper were archived outside the project, and all 81 active tests pass.

A single multiple-choice-layout class now centers the note prompt above a consistent two-by-two answer grid for every instrument at both sizes. Large increases diagram size moderately; it does not force one column, four-across rows, or scrolling. Multiple Choice’s feedback dock is static beneath the choices to avoid covering the bottom row. Build the Combination, library charts, branding, keyboard mappings, sound settings, fingerings and grading are retained.

Offline module syntax and source archive integrity checked. Visual browser verification is unavailable due to file-preview policy.
