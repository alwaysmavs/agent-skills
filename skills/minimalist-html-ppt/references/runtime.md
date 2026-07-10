# Single-file editorial runtime

## Purpose

Use this runtime for a browser-first deck that should open as one HTML file while retaining stable navigation and a lightweight optional motion layer.

## Preserve these parts

- #deck: horizontal flex strip; its width must equal the number of slides multiplied by 100vw.
- .slide: every page must remain a full viewport-wide section.
- show(index): updates the transform, active page, dot state, hero state, and hash.
- Keyboard, wheel, touch, dot, and ESC overview handlers.
- staticMode, .no-motion, .static-field, and the reduced-motion media query.

When changing slide count, derive the displayed total from slides.length where practical. If a fixed number appears in markup, update every occurrence before delivery.

## Canvas use

Canvas is optional. Keep it only when its low-frequency movement maps to the deck's actual sensory resource. A Canvas deck must include:

- a visible static fallback when .no-motion is active;
- a B toggle;
- a prefers-reduced-motion fallback;
- explicit data-motion-intent on every hero page using the effect.

Do not make navigation, text, evidence, or a product decision dependent on Canvas.

## Typography and offline delivery

The template uses system fallbacks so it remains readable when opened directly. If a project supplies licensed local WOFF2 files, load only those local assets and wait for document.fonts.ready before capture or print.
