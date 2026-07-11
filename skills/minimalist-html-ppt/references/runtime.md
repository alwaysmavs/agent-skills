# Single-file editorial runtime

## Purpose

Use this runtime for a browser-first deck that should open as one HTML file while retaining stable navigation and a lightweight optional motion layer.

## Preserve these parts

- #deck: horizontal flex strip; its width must equal the number of slides multiplied by 100vw.
- .slide: every page must remain a full viewport-wide section.
- show(index): updates the transform, active page, dot state, hero state, and hash.
- Keyboard, wheel, touch, dot, and ESC overview handlers.
- staticMode, .static-mode, .reduce-motion, .static-field, and the reduced-motion media query.
- The native Web Animations recipe engine: prepareSlide, playSlide, cancellation, replay, and final-state fallback.

When changing slide count, derive the displayed total from slides.length where practical. If a fixed number appears in markup, update every occurrence before delivery.

## Canvas use

Canvas is optional. Keep it only when its low-frequency movement maps to the deck's actual sensory resource. A Canvas deck must include:

- a visible static fallback when .no-motion is active;
- a B toggle;
- a prefers-reduced-motion fallback;
- explicit data-motion-intent on every hero page using the effect.

Do not make navigation, text, evidence, or a product decision dependent on Canvas.

## Element motion

Use `data-animate` on a slide to select one semantic recipe and `data-anim` only on elements whose reveal helps the reading path. Prepare the destination before the deck begins translating, then call `playSlide(index)` about 300ms into the 680ms horizontal transition. Cancel unfinished animations and restore the departing slide before another navigation.

The runtime uses native `Element.animate()` so the deliverable stays one direct-open file. Default HTML and CSS must show all content. JavaScript may hide a destination's marked elements only after the runtime has initialized successfully.

`B` toggles static-content mode: stop ambient backgrounds and element recipes while keeping the horizontal transition. `prefers-reduced-motion`, capture mode, and print mode reveal final states and may remove the horizontal transition. The ESC overview must override marked elements to visible final states.

## Typography and offline delivery

The template uses system fallbacks so it remains readable when opened directly. If a project supplies licensed local WOFF2 files, load only those local assets and wait for document.fonts.ready before capture or print.
