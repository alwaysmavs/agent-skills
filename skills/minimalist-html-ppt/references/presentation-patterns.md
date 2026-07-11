# Presentation patterns and checks

## Core canvas

Use a 1920×1080 16:9 stage unless the request names another format. Start with a 144px horizontal and 108px vertical safe area. Keep an invisible 12-column reference with 24px gutters for reliable capture, but do not let it turn every page into a visibly regular grid. Use intentional asymmetry and blank space to create a reading path; avoid arbitrary offsets or vertical `margin: auto` used only to fake balance.

Use a restrained initial palette, then adapt it to the project:

```css
--canvas: #f5f3ee;
--paper: #fbfaf7;
--ink: #20211f;
--muted: #6b6d67;
--hairline: #d9d7d1;
--accent: #a94b35;
```

## Slide archetypes

| Archetype | Use for | Composition |
| --- | --- | --- |
| Cover | title and premise | Large title, small context, optional single quiet image or texture |
| Section pause | a new movement | Chapter number, short phrase, abundant blank space |
| Assertion | a key conclusion | One oversized sentence; no supporting clutter |
| Number | one metric | Large number, compact label, minimal supporting context |
| Image + insight | atmosphere or evidence | One carefully cropped image and one concise statement |
| Evidence | proof | One chart/table/quote with an explicit takeaway in the title |
| Comparison | decision | Two aligned columns; one dimension per row; emphasize the decision axis |
| Process | causal sequence | Three to five steps on a single reading path; no ornamental arrows |
| Close | action | Restate the decision, next action, or enduring thought |

## Content editing rules

- Write titles as conclusions when possible, not labels such as “Market analysis.”
- Keep one central assertion per slide. Place secondary detail in speaker notes or an appendix.
- Reduce a list to the few items necessary to make the point; turn a long list into a sequence or comparison.
- Use caption text to tell the viewer why an image or chart matters.
- Use a data visualization only when it reveals a relationship more clearly than a sentence or a number.

## Typography defaults

```css
:root {
  --font-cjk: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-latin: "Noto Sans SC", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  --title-weight: 500;
  --body-weight: 400;
}

html { font-synthesis: none; }
.deck { font-family: var(--font-cjk); }
.eyebrow { letter-spacing: .08em; }
.title { letter-spacing: .005em; line-height: 1.18; }
.body { letter-spacing: 0; line-height: 1.55; }
.metric { font-variant-numeric: tabular-nums lining-nums; }
```

Use only actual 400, 500, and 600 faces. The font list is a fallback stack, not a recommendation to fetch every family from the network. Replace it with local licensed fonts when the project provides them. Put a cover title in columns 1–8, a standard assertion title in columns 1–9, and a metric's explanation in a separate 4-column region rather than stacking it under the number.

## Semantic font roles

| Content role | Family | Notes |
| --- | --- | --- |
| Entry, human utterance, reframe, aftertaste | Serif display | Use for a small number of phrases that need observation or pause. |
| Analysis, evidence, product, metrics, comparison, decision, validation | Sans | Keep working pages rational, scannable, and consistent with interface evidence. |
| Page number, time, category, sample, method metadata | Mono | Keep short; do not use for paragraphs or decorative pseudo-technical copy. |

Use tabular lining figures for metrics and keep them in the sans system. A user quotation may be serif while its research explanation remains sans. Avoid two large serif focal points on the same slide, random per-page family changes, and a fourth font used only to make English look premium.

## Visual quality checklist

Check every slide at the final 16:9 display size:

1. Name the page’s single visual subject in one phrase.
2. Confirm the title makes a claim or creates the intended question.
3. Check that the eye lands on the focal element before supporting material.
4. Check alignments against the shared grid; remove nearly aligned elements.
5. Check contrast, image crop, and caption legibility.
6. Check that Chinese, Latin, punctuation, and digits wrap intentionally.
7. Check that motion preserves meaning rather than being required to understand the page.
8. Check screenshot and PDF renderings after fonts are fully ready.
9. If the page moves internally, name the reading sequence and confirm the recipe differs from adjacent pages when their semantic tasks differ.
10. Confirm every animated element is visible in static-content, reduced-motion, overview, capture, print, and animation-failure states.
11. Confirm serif, sans, and mono roles follow content semantics rather than page-by-page decoration; metrics, interfaces, comparisons, and decisions should remain in the sans system.
