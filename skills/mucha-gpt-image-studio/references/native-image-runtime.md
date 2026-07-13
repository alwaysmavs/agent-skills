# Native Image Runtime

Use this path when `oo` is unavailable and the current agent already exposes a
native image generation or image-editing tool.

## Execute

- Use generation for a text-only brief.
- Use editing whenever the user supplies an image or asks to preserve a person,
  pet, product, object, place, or composition.
- Include every required source image through the host tool's supported image
  attachment or local-path mechanism. Do not silently drop a reference because
  it is not available as a normal filesystem path.
- Pass the art direction prepared in `SKILL.md` to the native tool. Do not ask
  the user to install OOMOL, find a model, or repeat the brief.

Use the closest supported canvas to the requested format. Prefer a high-quality
final render when the native tool exposes a quality choice.

## Wait and deliver

Before starting, tell the user only that image generation may take a few
minutes and that the final image will be returned when ready. Follow the host
tool's own async or wait behavior; do not invent OOMOL session commands for a
native run.

On success, preview or attach the returned image and apply the review checklist
from `SKILL.md`. If the tool returns a local file, also report its actual path.

If the native tool is unavailable, refuses the required edit mode, or cannot
accept the user's source image, switch to the OOMOL setup only after explaining
the missing capability. Do not silently change the task into prompt-only advice.
