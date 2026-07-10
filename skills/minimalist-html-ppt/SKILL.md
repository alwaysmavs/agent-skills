---
name: minimalist-html-ppt
description: Create or redesign browser-playable minimalist HTML presentation decks for product reviews, design critiques, strategy narratives, and editorial storytelling. Use when Codex needs a direct-open, single-file HTML PPT with Chinese or mixed Chinese-English typography, deliberate whitespace, semantic motion, and a Kenya Hara-inspired observation-to-reframe method without copying a designer, brand, or existing deck.
---

# Minimalist HTML PPT

Create original browser-native presentations with a quiet, typography-led visual system and a stable single-file runtime.

## Use the fixed runtime

Start from [assets/editorial-web-deck/template.html](assets/editorial-web-deck/template.html). It is the default runtime for this skill:

- one direct-open index.html; no API, oo CLI, build step, or presentation framework;
- horizontal #deck with native keyboard, wheel, touch, dot navigation, page hash, and ESC overview;
- optional Canvas/WebGL only on semantic hero pages;
- B static-mode toggle plus prefers-reduced-motion and a static fallback.

When the user provides an existing deck built on this runtime, edit its content and CSS rather than replacing it with Reveal.js, PPTX, Canvas-only slides, or another framework. Preserve the navigation and fallback behavior unless the user explicitly asks to change the runtime.

## Establish a sensory brief first

Read [references/hara-method.md](references/hara-method.md). Before planning pages, write:

~~~yaml
ordinary_observation: "A familiar object, action, space, or time fragment"
sensory_resource: "A bodily or environmental quality, such as waiting or translucency"
reframe: "One sentence that changes how the familiar thing is read"
material_cue: "Paper, light, surface, trace, shadow, or time behavior"
audience_aftertaste: "What the audience should notice differently"
~~~

Use this as a method, not a visual costume. Do not imitate a named designer, MUJI, a poster, a brand system, or another presentation.

## Write the experience sequence

Use 5–9 pages. Start from an ordinary observation, make one detail visible, state the reframe, then use evidence and a decision or aftertaste.

~~~text
entry → observation → detail → reframe → evidence / proposal → decision → aftertaste
~~~

For product or design reviews, use: user moment → evidence → reframe → proposed state → trade-off → validation. Do not lead with a metric before the audience knows why the metric matters.

Give every slide:

- one central visual subject;
- a conclusion or a focused question, not a generic section label;
- a nonempty data-sensory-task;
- an aria-label.

Give every animated hero a content-specific data-motion-intent. Keep hero pages to one-third or fewer of the deck.

## Compose the visual system

Read [references/presentation-patterns.md](references/presentation-patterns.md) when choosing page archetypes or typography.

- Treat white as paper, light, time, translucency, or a receptive field—not merely a blank hex value.
- Use one semantic accent only. It may signal a trace, changed state, material edge, or decision axis.
- Use serif display type for key statements, a restrained sans face for body copy, and mono type for metadata. Use actual 400/500/600 weights and font-synthesis: none.
- Keep Chinese tracking minimal; use generous line height and avoid forcing paragraphs into narrow ch widths.
- Let text sit inside a stable safe area, but avoid mechanically centered or overly regular compositions. Use deliberate asymmetry only when it improves the reading path.
- Use images only as material evidence of an object, place, surface, or behavior. Do not bake presentation text into images.
- Use motion to express the sensory resource—such as slow light for diffusion or stillness for waiting—not to make pages look premium.

## Adapt the template safely

1. Copy the template into the requested deliverable folder as index.html.
2. Replace sample copy, labels, totals, and CSS tokens while keeping the runtime script coherent.
3. If the slide count changes, update #deck width, visible page totals, and the labels array together.
4. Keep the Canvas only if its motion has a stated semantic role. Otherwise remove the Canvas and static-field pair together.
5. Keep all content meaningful when motion is off.

Use plain HTML and CSS for diagrams, interface states, and evidence when they improve legibility. Keep a normal slide to one focal element and no more than three supporting units.

## Validate before handoff

~~~bash
node scripts/check-editorial-deck.mjs /path/to/index.html
~~~

Treat checker errors as blocking. Then open the actual file and inspect the first, a dense middle, and the final page at 16:9. Verify navigation, overview, static mode, reduced-motion behavior, font fallback, Chinese line breaks, contrast, and clipping.
