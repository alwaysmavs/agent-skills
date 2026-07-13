---
name: mucha-gpt-image-studio
description: Create original or reference-guided Alphonse Mucha-inspired Art Nouveau artwork. Use when the user asks for a Mucha-style avatar, portrait, pet poster, menu, invitation, social background, wallpaper, or decorative image, including restyling a supplied person, pet, object, or product photo while preserving recognizable features.
compatibility: Requires either a native image generation/editing tool or network access through OOMOL's oo CLI and the gpt-image-2 companion skill.
metadata:
  icon: ':lucide:palette:'
  title: Mucha Image Studio
  packageName: '@alwaysmavs/mucha-gpt-image-studio'
  version: 0.1.0
  companionSkill: gpt-image-2
---

# Mucha Image Studio

Create finished Art Nouveau artwork rather than merely appending “Mucha style”
to a generic image prompt. Make the subject, intended use, ornament, palette,
linework, and negative space feel designed as one composition.

## Choose the execution path

Check runtime capability before discussing setup:

1. If `oo --version` succeeds, use the OOMOL path in
   [references/oomol-runtime.md](references/oomol-runtime.md).
2. If OOMOL is absent but the current agent exposes a native image generation
   or image-editing tool, use
   [references/native-image-runtime.md](references/native-image-runtime.md).
   Do not install OOMOL merely to replace a capable native tool.
3. If neither path is available, explain briefly that image execution needs a
   provider and offer the guided OOMOL setup from the OOMOL reference. Preserve
   the original creative request and resume it after setup.

Keep runtime mechanics out of the creative conversation. Once a path is
selected, return here for the art direction and quality bar.

## Shape the brief

Collect only what changes the artwork:

- final use and approximate orientation;
- main subject and pose or action;
- mood, season, palette, and symbolic motifs when supplied;
- exact short copy when the image must contain text;
- source image and recognizable features to preserve when editing.

Ask one concise question only when the subject is missing, required copy is
missing, the intended format cannot be inferred, or several source images make
the main subject ambiguous. Otherwise choose conservative defaults.

Use these default canvases unless the selected runtime has different supported
sizes:

| Output | Default canvas | Composition |
| --- | --- | --- |
| Avatar or profile portrait | `1024x1024` | Centered head, bust, or pet with safe crop margins |
| Poster, menu, or invitation | `1024x1536` | Portrait hierarchy, ornamental frame, copy-safe area |
| Social background or banner | `1536x1024` | Decorative subject balanced by deliberate quiet space |
| Phone wallpaper | `1024x1536` | Tall composition with no vital detail near the bottom UI area |

## Build the Mucha visual language

Choose one dominant structural idea rather than mixing every Art Nouveau motif:

- **Halo portrait:** circular botanical halo, calm frontal or three-quarter
  subject, flowing hair or fabric, and clean outer crop margins.
- **Ornamental poster:** one iconic subject, strong silhouette, tall border,
  restrained title area, and a clear top-to-bottom reading path.
- **Decorative frame:** quieter center for menu, invitation, or editorial copy;
  richer flowers, ribbons, and linework around the edges.
- **Panoramic frieze:** horizontal rhythm, landscape or architecture integrated
  with ornament, and open space for social UI or captions.
- **Seasonal emblem:** symbolic flora, moon, sun, stars, fruit, birds, or
  regional motifs organized around one seasonal palette.

Use Art Nouveau grammar with restraint:

- flowing whiplash curves and elongated botanical stems;
- a halo, arch, medallion, or repeated frame that organizes the composition;
- fine ink contours with selective areas of flat or softly modeled color;
- flowers and leaves chosen for the subject or season, not as generic filler;
- lightly aged lithographic paper, screen-print, gouache, or enamel-like
  surfaces rather than glossy digital effects;
- elegant asymmetry inside an otherwise stable ornamental structure;
- limited jewel, mineral, botanical, or muted seasonal colors with one clear
  accent.

Avoid a costume-like result. Do not cover every empty area with decoration,
combine unrelated historical motifs, or use random pseudo-French lettering.
Unless requested, exclude watermarks, logos, signatures, barcodes, gibberish
text, cropped faces, extra limbs, and clutter.

## Adapt the style to the subject

- **People:** preserve facial structure, hairstyle, skin tone, expression, and
  distinguishing accessories when a source image exists. Let hair, fabric,
  flowers, and the halo carry most of the line rhythm.
- **Pets:** preserve species, coat colors, markings, ear shape, proportions,
  eye color, and expression. Keep the animal anatomically believable beneath
  the decorative treatment.
- **Products and objects:** preserve silhouette, materials, functional parts,
  and identifying details. Use the frame and background for ornament instead
  of deforming the product.
- **Architecture and landscape:** keep recognizable rooflines, façades,
  geography, or landmarks while translating clouds, water, foliage, and
  borders into rhythmic linework.
- **Menus and invitations:** prioritize a usable text-safe center. Decorative
  density should decrease where final typography will sit.

## Construct the generation prompt

For an original image, order the prompt by use, subject, composition, style,
palette, material, and delivery constraints:

```text
[Asset type and intended use]. [Specific subject, pose, or scene].
Alphonse Mucha-inspired Art Nouveau illustration with [structural composition],
[selected botanical or symbolic motifs], [limited palette], [linework and print
material], and [lighting or mood]. Preserve [negative-space or crop requirement].
[Exact short copy only when supplied]. Avoid watermark, logo, signature,
gibberish text, clutter, cropped subject, distorted anatomy, and extra limbs.
```

For reference-guided work, make preservation explicit before describing the
style change:

```text
Transform image 1 into an Alphonse Mucha-inspired Art Nouveau [asset type].
Preserve the subject's recognizable [face and hairstyle / coat colors, markings,
ears, proportions, and expression / product silhouette, materials, and key
details]. Change the setting, ornament, palette, border, and illustration
surface as described. Keep the same subject and avoid distorted anatomy,
extra limbs, random text, watermark, or signature.
```

Put the main subject image first. Additional references may guide composition,
palette, lighting, or ornament, but must not replace the main subject.

## Handle text and series

Keep generated text short and proofread every visible word. For commercial,
legal, multilingual, menu, or invitation copy that must be exact, generate a
text-safe art layer and typeset the final wording in a design tool.

For a coordinated set, create one focused image per purpose—for example a
poster, avatar, and banner—while reusing a palette, border logic, flower family,
and subject treatment. Do not request unrelated asset types as generic variants
of one batch.

## Review before delivery

Inspect the final image for:

- recognizable subject and believable anatomy;
- one clear focal point and controlled ornamental density;
- frame, halo, and crop that suit the requested format;
- coherent palette, linework, and print surface;
- deliberate negative space for UI or typography;
- absence of random letters, watermarks, signatures, and accidental logos;
- exact visible copy when any text was requested.

If preservation is weak, retry once with fewer competing style instructions, a
simpler pose or composition, and a stronger preservation clause. If typography
is unreliable, deliver the art layer with a text-safe area instead of repeatedly
asking the image model to typeset long copy.

Preview or attach every final image. Report the actual saved path when one
exists, but never hand off only a path without showing or otherwise delivering
the image to the user.
