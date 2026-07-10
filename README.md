# Agent Skills

**Languages:** English | [简体中文](README.zh-CN.md)

A growing collection of reusable Agent Skills for practical SaaS workflows—from image generation and video creation to subtitling and automation.

Each skill is a self-contained directory built around the open [`SKILL.md`](https://agentskills.io/specification) format. Copy or symlink the directory you need into an agent-compatible skills location, such as `.agents/skills/` in a repository or `~/.agents/skills/` for personal use.

## Featured skill: Video Subtitle Translator

Turn a local audio or video file into polished, timed subtitles—and deliver it as an SRT/VTT/ASS file, a video with permanent subtitles, or a video with a selectable subtitle track.

![Chinese burned-in subtitle preview](skills/video-subtitle-translator/examples/test-video-zh-preview.gif)

The preview above is taken from the included [**Test Video** demo](skills/video-subtitle-translator/examples/test-video-zh-burned.mp4): English speech transcribed, translated to Simplified Chinese, and burned into the video.

| Skill | What it does | Requirements |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | Alibaba Qwen ASR transcription, timed subtitle generation, translation, CJK-aware layout, and hard or soft subtitle export. [English overview](skills/video-subtitle-translator/README.md) · [中文说明](skills/video-subtitle-translator/README.zh-CN.md) | Node.js 18+, FFmpeg, OO CLI, Fusion ASR, and OO LLM access |

Read the [English video subtitle translator overview](skills/video-subtitle-translator/README.md) or the [简体中文说明](skills/video-subtitle-translator/README.zh-CN.md) for the workflow, formats, languages, and delivery options.

## Install a skill locally

```bash
git clone https://github.com/alwaysmavs/agent-skills.git
mkdir -p .agents/skills
cp -R agent-skills/skills/video-subtitle-translator .agents/skills/
```

Restart or reload your agent after installing a skill. See the skill's `SKILL.md` for the agent-facing prerequisites, data handling, workflow details, and output conventions.

## Contributing

Keep each skill focused on one job, self-contained, and safe to inspect before execution. Include deterministic scripts only when they improve reliability, document external dependencies and data flow, and add runnable tests for deterministic behavior.

## License

This repository is released under the [MIT License](LICENSE).
