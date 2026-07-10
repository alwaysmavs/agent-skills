# Agent Skills

A growing collection of reusable Agent Skills for practical SaaS workflows—from image generation and video creation to subtitling and automation.

Each skill is a self-contained directory built around the open [`SKILL.md`](https://agentskills.io/specification) format. Copy or symlink the directory you need into an agent-compatible skills location, such as `.agents/skills/` in a repository or `~/.agents/skills/` for personal use.

## Featured skill: Video Subtitle Translator

Turn a local audio or video file into polished, timed subtitles—and deliver it as an SRT/VTT/ASS file, a video with permanent subtitles, or a video with a selectable subtitle track.

![Chinese burned-in subtitle preview](skills/video-subtitle-translator/examples/测试视频.中文字幕预览.gif)

The preview above is taken from the included [**测试视频** demo](skills/video-subtitle-translator/examples/测试视频.中文字幕烧录版.mp4): English speech transcribed, translated to Simplified Chinese, and burned into the video.

| Skill | What it does | Requirements |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | Alibaba Qwen ASR transcription, timed subtitle generation, translation, CJK-aware layout, and hard or soft subtitle export. | Node.js 18+, FFmpeg, OO CLI, Fusion ASR, and OO LLM access |

Read the [video subtitle translator overview and demo](skills/video-subtitle-translator/README.md) for the workflow, formats, languages, and delivery options.

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
