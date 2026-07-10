# Mucha Image Studio

**Languages:** English | [简体中文](README.zh-CN.md)

**Repository:** [All skills](../../README.md) | [全部技能（中文）](../../README.zh-CN.md)

**Turn an idea—or a beloved photo—into a graceful Art Nouveau artwork inspired by Alphonse Mucha.**

`mucha-gpt-image-studio` is an Agent Skill for creating polished GPT Image 2
artwork: floral profile portraits, pet posters, invitation art, menu frames,
social backgrounds, wallpapers, and other decorative visuals. It keeps the
art-direction decisions in one focused skill while delegating generation,
editing, upload, recovery, and artifact download to the companion
`gpt-image-2` skill.

## What it does

### 1. Creates original Art Nouveau images from a written brief

Describe a subject, use case, mood, and palette. The skill chooses a suitable
canvas and applies a Mucha-inspired visual language: flowing linework,
botanical halos, decorative frames, textured print paper, and balanced
editorial composition.

### 2. Turns a supplied photo into a Mucha-inspired artwork

Provide a person, pet, object, or product photo and the skill switches to
reference-guided editing. The source image is placed first and the prompt makes
the preservation requirements explicit—for example a dog's coat markings,
ears, proportions, and expression—while changing the setting, palette,
ornament, and illustration style.

This is an artistic transformation, not a promise of exact identity,
measurement, fit, or print reproduction.

### 3. Adapts composition to the final use

| Need | Default delivery |
| --- | --- |
| Avatar or profile portrait | `1024x1024`, clean crop margins and a floral halo |
| Poster, menu, or invitation | `1024x1536`, ornamental frame and a text-safe zone |
| Moments/WeChat background or social banner | `1536x1024`, intentional quiet space for UI or copy |
| Phone wallpaper | `1024x1536`, tall composition with safe lower margins |

The skill uses named creative directions such as `mucha-pet-poster`,
`mucha-profile-portrait`, `mucha-menu-frame`, `mucha-event-poster`,
`mucha-social-background`, and `mucha-seasonal-card` so each output is composed
for its job rather than using one generic “Mucha style” prompt.

### 4. Produces deliverable images instead of only a prompt

The companion runner stores a resumable session file, waits and polls the same
generation task, downloads its result, and returns local output paths and
remote URLs. If interrupted, it resumes the saved session instead of creating a
duplicate paid generation task.

## Requirements

- An authenticated [oo CLI](https://oomol.com) with Fusion API access.
- The `gpt-image-2` companion skill installed in the active agent's skills
  directory. It supplies the deterministic runner used by this art-direction
  skill for GPT Image 2 generation and editing.
- Network access for image generation and artifact download.

No API key should be copied into the skill or committed to a repository.

## Add it to your agent

Copy this request to your agent:

```text
Install the mucha-gpt-image-studio skill from https://github.com/alwaysmavs/agent-skills into my active skills directory. Also confirm that the gpt-image-2 companion skill is installed and that an authenticated oo CLI can access Fusion API image generation. Follow SKILL.md, preserve a supplied person or pet photo when I provide one, save generated artifacts outside unrelated repositories, and show me the final image rather than only a local path.
```

The agent-facing runtime instructions, source-image handling, session recovery,
delivery checks, and failure guidance are in [SKILL.md](SKILL.md).

## Design and delivery notes

- Keep generated poster or menu text short. Proofread every rendered word.
  For commercial, legal, multilingual, or exact copy, create a text-safe art
  layer first and typeset final text in a design tool.
- For a multi-asset collection, create a focused job per purpose—such as a
  poster, background, and avatar—not one batch of near-identical variations.
- Generated images are saved with deterministic descriptive names, then
  previewed or attached for the user. Transparent outputs should be verified as
  PNGs with alpha when transparency was requested.
