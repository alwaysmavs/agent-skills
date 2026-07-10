# Agent Skills

**Languages:** English | [简体中文](README.zh-CN.md)

A growing collection of reusable Agent Skills for practical SaaS workflows—from image generation and video creation to subtitling and automation.

Each skill is a self-contained directory built around the open [`SKILL.md`](https://agentskills.io/specification) format. Copy or symlink the directory you need into an agent-compatible skills location, such as `.agents/skills/` in a repository or `~/.agents/skills/` for personal use.

## Featured skills

Turn a local audio or video file into polished, timed subtitles—and deliver it as an SRT/VTT/ASS file, a video with permanent subtitles, or a video with a selectable subtitle track.

![Chinese burned-in subtitle preview](skills/video-subtitle-translator/examples/test-video-zh-preview.gif)

The preview above is the Simplified Chinese version of the included [**Test Video** demo](skills/video-subtitle-translator/examples/test-video-zh-burned.mp4): English speech transcribed, translated to Simplified Chinese, and burned into its own video. Its multilingual subtitle demonstrations live in the [video subtitle translator README](skills/video-subtitle-translator/README.md).

| Skill | What it does | Requirements |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | [Built with oo CLI](https://oomol.com): Alibaba Qwen ASR transcription, timed subtitle generation, translation, CJK-aware layout, and hard or soft subtitle export. [English](skills/video-subtitle-translator/README.md) · [简体中文](skills/video-subtitle-translator/README.zh-CN.md) | Node.js 18+, FFmpeg, [oo CLI](https://oomol.com), Fusion ASR, and OO LLM access |
| [`mucha-gpt-image-studio`](skills/mucha-gpt-image-studio/) | Create original or photo-guided Alphonse Mucha-inspired Art Nouveau avatars, pet portraits, posters, menus, invitations, backgrounds, and wallpapers with GPT Image 2. [English](skills/mucha-gpt-image-studio/README.md) · [简体中文](skills/mucha-gpt-image-studio/README.zh-CN.md) | [oo CLI](https://oomol.com) and the `gpt-image-2` companion skill |

Read the [English](skills/video-subtitle-translator/README.md) or [简体中文](skills/video-subtitle-translator/README.zh-CN.md) overview for the workflow, formats, languages, and delivery options. The skill README contains the full multilingual documentation, including Japanese.

Read the [Mucha Image Studio overview](skills/mucha-gpt-image-studio/README.md) for its two working modes, preservation guidance, supported asset types, and installation requirements.

## Add this skill to your agent

No terminal commands to memorize. Copy this request to your agent:

```text
Install the video-subtitle-translator skill from https://github.com/alwaysmavs/agent-skills into my current agent's skills directory. Follow its SKILL.md instructions. Check that Node.js 18+, FFmpeg/FFprobe, and an authenticated oo CLI with Fusion ASR and OO LLM access are available. If something is missing, tell me exactly what I need to set up; otherwise confirm that the skill is ready to use.
```

The skill is [built with oo CLI](https://oomol.com). Its `SKILL.md` contains the agent-facing prerequisites, data handling, workflow details, and output conventions.

## Contributing

Keep each skill focused on one job, self-contained, and safe to inspect before execution. Include deterministic scripts only when they improve reliability, document external dependencies and data flow, and add runnable tests for deterministic behavior.

## License

This repository is released under the [MIT License](LICENSE).
