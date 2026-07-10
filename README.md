# Agent Skills

A growing collection of reusable Agent Skills for popular SaaS APIs—from image generation and video creation to subtitling, automation, and more.

Each skill is a self-contained directory built around the open [`SKILL.md`](https://agentskills.io/specification) format. Copy or symlink the skill directory you need into an agent-compatible skills location, such as `.agents/skills/` in a repository or `~/.agents/skills/` for personal use.

## Skills

| Skill | Description | Requirements |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | Transcribe media, translate timed subtitles, prepare readable CJK subtitles, and export hard or soft subtitles. | Node.js 18+, FFmpeg, OO CLI and enabled Fusion ASR/LLM access |

## Install a skill locally

```bash
git clone https://github.com/alwaysmavs/agent-skills.git
mkdir -p .agents/skills
cp -R agent-skills/skills/video-subtitle-translator .agents/skills/
```

Restart or reload your agent after installing a skill. See the skill's `SKILL.md` for prerequisites, data handling, workflow details, and output conventions.

## Contributing

Keep each skill focused on one job, self-contained, and safe to inspect before execution. Include deterministic scripts only when they improve reliability, document external dependencies and data flow, and add runnable tests for deterministic behavior.

## License

This repository is released under the [MIT License](LICENSE).
