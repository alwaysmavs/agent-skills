import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node check-editorial-deck.mjs /path/to/index.html');
  process.exit(2);
}

const html = readFileSync(file, 'utf8');
const slides = [...html.matchAll(/<section\b[^>]*\bclass=["'][^"']*\bslide\b[^"']*["'][^>]*>/g)].map((match) => match[0]);
const errors = [];
const warnings = [];
const motionRecipes = new Set(['entry', 'cascade', 'quote', 'focus', 'reframe', 'evidence', 'product', 'decision', 'aftertaste', 'pipeline', 'timeline', 'process']);

if (slides.length === 0) errors.push('P0: no <section class="slide"> elements found.');
if (!/prefers-reduced-motion/.test(html)) errors.push('P0: missing prefers-reduced-motion fallback.');
if (/<canvas\b/i.test(html) && !/(no-motion|staticMode|static fallback)/i.test(html)) errors.push('P0: Canvas/WebGL deck has no explicit static fallback.');

let heroCount = 0;
slides.forEach((slide, index) => {
  const page = index + 1;
  if (!/aria-label=/.test(slide)) errors.push(`P0: slide ${page} has no aria-label.`);
  if (!/data-sensory-task=["'][^"']+/.test(slide)) errors.push(`P0: slide ${page} has no data-sensory-task.`);
  const hero = /data-hero=["']true/.test(slide) || /\bslide--hero\b/.test(slide);
  if (hero) {
    heroCount += 1;
    if (!/data-motion-intent=["'][^"']+/.test(slide)) errors.push(`P0: hero slide ${page} has no data-motion-intent.`);
  }
  const recipe = slide.match(/data-animate=["']([^"']+)["']/)?.[1];
  if (recipe && !motionRecipes.has(recipe)) errors.push(`P0: slide ${page} uses unsupported motion recipe "${recipe}".`);
});

const animatedSlideCount = slides.filter((slide) => /data-animate=["'][^"']+/.test(slide)).length;
const animatedElementCount = (html.match(/data-anim(?:=|\s|>)/g) || []).length;
if (animatedSlideCount && !animatedElementCount) errors.push('P0: slides declare data-animate but the deck has no data-anim participants.');
if (animatedSlideCount && !/(Element\.prototype\.animate|\.animate\()/.test(html)) errors.push('P0: semantic motion is declared but no element animation engine was found.');
if (animatedSlideCount && !/(playSlide|__playSlide)/.test(html)) errors.push('P0: semantic motion is declared but no playSlide entry point was found.');
if (animatedSlideCount && !/(cancelMotion|getAnimations\(\)|\.cancel\(\))/.test(html)) errors.push('P0: semantic motion has no cancellation path for rapid navigation.');
if (animatedSlideCount && !/\.overview[^\{]*\[data-anim\][^\{]*\{[^}]*opacity\s*:\s*1\s*!important/s.test(html)) errors.push('P0: overview has no forced final-state reveal for data-anim elements.');
if (animatedSlideCount && !/(static-mode|low-power)/.test(html)) errors.push('P0: semantic motion has no explicit static-content mode.');
if (/\.static-mode\s+#deck\s*\{[^}]*transition\s*:\s*none/is.test(html)) warnings.push('P1: static-content mode disables the horizontal page transition; preserve it unless explicitly requested.');

if (slides.length > 0 && heroCount / slides.length > 1 / 3) warnings.push(`P1: ${heroCount}/${slides.length} slides are heroes; keep hero pages to one-third or fewer.`);
const accentValues = new Set([...html.matchAll(/--(?:accent|acid|warm)\s*:\s*([^;]+)/g)].map((match) => match[1].trim()));
if (accentValues.size > 1) warnings.push('P1: multiple accent colors found; keep one semantic accent per deck unless the brief justifies more.');
if (/<canvas\b/i.test(html) && !/data-motion-intent/.test(html)) errors.push('P0: Canvas/WebGL exists but no semantic motion intent is declared.');

for (const message of errors) console.error(message);
for (const message of warnings) console.warn(message);
if (errors.length) process.exit(1);
console.log(`PASS: ${slides.length} slides checked; ${heroCount} hero slide(s).`);
if (warnings.length) console.log(`PASS WITH ${warnings.length} P1 WARNING(S).`);
