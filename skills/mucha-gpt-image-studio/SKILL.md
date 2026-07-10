---
name: mucha-gpt-image-studio
description: Create original or reference-guided GPT Image 2 artwork in an Alphonse Mucha-inspired Art Nouveau aesthetic. Use when the user asks for a Mucha-style avatar, pet portrait, menu, poster, invitation, social background, wallpaper, or decorative image, including transforming a supplied person, pet, or object photo while preserving its recognizable features.
compatibility: Requires network access. On first use, install and authenticate the oo CLI, then install the gpt-image-2 companion skill through oo.
metadata:
  icon: ':lucide:palette:'
  title: Mucha Image Studio
  packageName: '@alwaysmavs/mucha-gpt-image-studio'
  version: 0.1.0
  companionSkill: gpt-image-2
---

# Mucha Image Studio

Use this skill for polished Art Nouveau artwork inspired by Alphonse Mucha:
floral avatars, personal or pet portraits, menus, invitations, posters, book
covers, editorial cards, social backgrounds, and wallpapers.

Use original text-to-image generation when the user supplies only a written
brief. Use reference-guided editing when the user supplies a readable person,
pet, object, or product image, or asks to preserve a subject. This is a
stylistic transformation, not a guarantee of exact identity, measurements, fit,
or print reproduction.

## First-run setup

Make the environment ready before collecting a brief or starting a generation.
Run this setup in sequence and, after every successful step, continue the
original image request automatically. Do not make the user choose from a setup
menu or ask them to find a provider, API key, or companion package themselves.

1. Check whether the OO CLI is available:

   ```bash
   oo --version
   ```

   If it prints a version, continue. If the command is missing, install it for
   the current platform, then repeat `oo --version`:

   ```bash
   curl -fsSL https://cli.oomol.com/install.sh | bash    # macOS / Linux
   ```

   ```powershell
   irm https://cli.oomol.com/install.ps1 | iex           # Windows PowerShell
   ```

   ```cmd
   curl -fsSL https://cli.oomol.com/install.cmd -o install.cmd && install.cmd && del install.cmd
   ```

   If installation changes `PATH`, start a fresh shell before retrying. Use the
   [OO CLI install guide](https://cli.oomol.com/install-guide.md) as the source
   of truth for these commands.

2. Ensure OO is authenticated. If the first OO command reports that the user
   is not logged in, run `oo login` and let the user complete its secure login
   flow. Do not put session tokens, API keys, or account credentials in prompts,
   files, command history, or source control.

3. Ensure the `gpt-image-2` companion skill is installed in the active agent
   skills directory. If it is absent, install the published companion directly
   through OO:

   ```bash
   oo skills install "@zjxuyunshi/gpt-image-2" -s "gpt-image-2"
   ```

   Then locate the installed skill directory and use its runner from that real
   path. Never copy a path from another machine. If installation, login, or
   access fails, report the exact blocker and the one required user action;
   otherwise resume the original image request without asking the user to repeat
   it.

## Input policy

Collect only the asset type and purpose, subject, required copy, creative
constraints, and source image when one exists. Ask one concise follow-up only
when there is no usable subject, the intended format is impossible to infer,
required copy is missing, or multiple supplied images make the main subject
ambiguous. Otherwise select safe defaults.

| Output | Default size | Composition default |
| --- | --- | --- |
| Avatar or square personal image | `1024x1024` | Centered head, bust, or pet; clean crop margins |
| Poster, menu, or invitation | `1024x1536` | Portrait hierarchy, ornamental header, and copy-safe zone |
| Moments/WeChat background or social banner | `1536x1024` | Quiet central or side area for UI or overlay copy |
| Phone wallpaper | `1024x1536` | Tall composition with no vital detail at the bottom edge |

Use width and height values that are multiples of 16. GPT Image 2 requires a
largest dimension of at most 3840, a long side no more than three times the
short side, and 655,360–8,294,400 total pixels.

## Art direction

Choose an archetype that matches the output:

- `mucha-pet-poster`: pet as the central character, botanical halo, ornate
  border, and a small title-safe area.
- `mucha-profile-portrait`: a preserved or original subject inside a floral
  halo, with clean social-crop edges.
- `mucha-menu-frame`: a decorated frame with intentionally quiet typesetting
  areas.
- `mucha-event-poster`: one strong subject, clear hierarchy, ornate border,
  and open copy zone.
- `mucha-social-background`: a horizontal decorative scene with deliberate
  negative space for a caption or profile photo.
- `mucha-seasonal-card`: symbolic flora and a seasonal palette.

Use Art Nouveau visual grammar where it serves the brief: flowing curves,
botanical halos, flowers, leaves, ribbons, circular framing, fine ink contours,
textured print paper, a selected jewel or seasonal palette, and refined
editorial balance. Unless explicitly requested, avoid watermarks, logos,
signatures, barcodes, random letters, clutter, and cropped subjects.

For original images, use this prompt order:

```text
[asset type and intended use]. [Specific subject and pose/action].
Alphonse Mucha-inspired Art Nouveau illustration: [composition], [ornamental
motifs], [palette], [materials/linework], [lighting/mood]. [Legibility or
negative-space requirement]. [Exact short copy, only if supplied].
Avoid: watermark, logo, signature, gibberish text, clutter, cropped subject.
```

For reference-guided edits, add a precise preservation clause:

```text
Transform image 1 into an Alphonse Mucha-inspired Art Nouveau [asset type].
Preserve the subject's recognizable [face and hairstyle / coat color, facial
markings, ears, proportions, and expression / product shape and key details].
Change the illustration style, setting, ornaments, palette, and border as
described. Do not add a watermark, random text, distorted anatomy, extra limbs,
or a different subject.
```

For copy-heavy work, keep generated text short and proofread every word. For
commercial, legal, multilingual, or exact typography, create a text-safe art
layer and typeset final copy in a design tool.

## Execution

Delegate image execution to the installed `$gpt-image-2` companion skill. It
owns the selected Fusion API actions, local image upload and conversion, session
persistence, polling, result parsing, and artifact download. Do not use direct
`oo connector run` commands during normal execution.

Use the companion runner from its actual installed directory; do not copy a
hard-coded path from another machine:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" ...
```

If that runtime path is unavailable, use the same runner with local `node`. The
first-run setup installs a missing companion; do not switch models or
connectors as a fallback.

### Original text-to-image

Use `--mode generate` for a text-only brief. Use PNG and high quality for final
artwork. Save to a dated directory outside an unrelated repository unless the
user specifies one.

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --mode generate --prompt-file "<brief-file>" \
  --out-dir "<output-directory>" --name "<descriptive-asset-name>" \
  --model "gpt-image-2" --output-format "png" --quality "high" \
  --size "1024x1536"
```

For a requested collection, create one focused job per distinct purpose and use
deterministic names such as `corgi-poster-01`, `corgi-background-01`, and
`corgi-avatar-01`. Do not use one `n > 1` request for distinct asset types. For
a large collection, use a small concurrency limit of three or four and retry
only a failed asset once after checking its existing session.

### Reference-guided editing

Use `--mode edit` whenever a source image exists or recognizable subject
preservation is requested. Pass the main source first, then optional references
for pose, composition, lighting, mood, or palette. The runner accepts local
paths, supported remote image URLs, inline data images, and `file_id:` values;
it uploads local images, converts unsupported source formats to PNG when needed,
and preserves input order.

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --mode edit --prompt-file "<preservation-brief-file>" \
  --image "<primary-subject-image>" \
  --out-dir "<output-directory>" --name "<descriptive-asset-name>" \
  --model "gpt-image-2" --output-format "png" --quality "high" \
  --size "1024x1536"
```

For a person, pet, or product, name the features to retain. For example,
preserve a corgi's coat colors, white blaze, ear shape, short-legged
proportions, and expression; do not merely ask to keep it “similar.”

## Sessions, results, and delivery

The runner submits a job once, writes `<name>.session.json` in the output
directory before polling, waits 30 seconds before the first poll by default,
and reuses that session ID. Its normal local polling timeout is 30 minutes. If
interrupted, resume the existing task instead of submitting another paid job:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --session-file "<output-directory>/<name>.session.json"
```

On success, parse the runner's final JSON: `ok` must be `true`; `local_paths`
contains downloaded images; `remote_urls` contains corresponding URLs; and
`session_id`, `session_file`, and `poll_count` provide recovery and diagnostics.
Preview or attach every final image, report the actual saved path, and verify
type and dimensions. For transparency, verify a PNG with alpha when practical.

## Failure handling

- Missing prompt, subject, or required event/menu copy: ask only for the
  missing value.
- Ambiguous source images: ask which one is the main subject.
- Missing OO CLI, authentication, or companion skill: follow **First-run
  setup**, then resume the original request.
- Auth, billing, permission, upload, schema, or inaccessible-source failure:
  report the runner's exact blocker; do not silently switch models or resubmit.
- Interrupted or timed-out run: resume with `session_file` or `session_id`.
- `not_found` session: stop and ask whether to submit a new job.
- Weak preservation: retry once with a simpler pose/composition and stronger
  preservation wording, then report the limitation honestly.
