# Note Library and brass display update

- [x] Rename References navigation and page heading to Note Library.
- [x] Rename library guide button Guides & Sources and dialog Guide & Sources.
- [x] Mid-round Note Library opens paused overlay; closing resumes same question, keys, score and pending answer progression. Browsing other instruments does not alter the exercise.
- [x] Woodwind dragging toggles pressed keys off and supports deliberate re-entry after leaving a key, without toggling repeatedly while remaining on the key.
- [x] Horn display order T / 1 / 2 / 3 in play choices, interactive controls and library; retain Q=3/W=2/E=1/X=T keyboard defaults.
- [x] Trigger uses a box on horn/trombone, including static fingering diagrams.
- [x] Recommend collapsible full-chart section; no full charts requested for implementation yet.
- [x] Verify and rebuild offline HTML/project archive.

Validation: all 70 automated tests pass, including horn display/keyboard independence, single-horn trigger hiding, trombone trigger boxes, pointer deselection/re-entry, library instrument isolation, and clock/pending-advance preservation across close. Source and bundled offline JavaScript syntax and archive integrity checked. Browser interaction verification could not run: the in-app browser could not reach the restarted local server (which responds with HTTP 200 to a local check); file previews are prohibited by browser policy. No browser screenshot is available for this update.
