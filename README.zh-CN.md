# Agent Skills

**语言：** [English](README.md) | 简体中文

一组可复用的 Agent Skills，面向图像生成、视频制作、字幕、自动化等实用 SaaS 工作流。

每个 skill 都是独立目录，并遵循开放的 [`SKILL.md`](https://agentskills.io/specification) 格式。将所需目录复制或软链接到兼容的 skills 目录即可，例如项目内的 `.agents/skills/`，或个人目录 `~/.agents/skills/`。

## 推荐：视频字幕生成器

把本地音频或视频转成带时间轴的字幕，并按观众实际需要导出为 SRT/VTT/ASS、烧录字幕 MP4，或带可选字幕轨的 MKV。

![简体中文字幕烧录预览](skills/video-subtitle-translator/examples/test-video-zh-preview.gif)

上方预览来自仓库中附带的 [**Test Video** 示例视频](skills/video-subtitle-translator/examples/test-video-zh-burned.mp4)：英文讲话先被转写，再翻译为简体中文，最后直接烧录进画面。

| Skill | 能力简介 | 环境要求 |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | 使用阿里 Qwen ASR 转写，生成带时间轴的字幕、翻译、优化中日韩字幕换行，并导出硬字幕或软字幕。 [English](skills/video-subtitle-translator/README.md) · [中文说明](skills/video-subtitle-translator/README.zh-CN.md) | Node.js 18+、FFmpeg、OO CLI、Fusion ASR 与 OO LLM 权限 |

查看 [视频字幕生成器中文说明](skills/video-subtitle-translator/README.zh-CN.md)，或阅读 [English overview](skills/video-subtitle-translator/README.md)，了解完整流程、支持语言、格式和交付方式。

## 在本地安装 skill

```bash
git clone https://github.com/alwaysmavs/agent-skills.git
mkdir -p .agents/skills
cp -R agent-skills/skills/video-subtitle-translator .agents/skills/
```

安装后请重启或重新加载 Agent。面向 Agent 的前置条件、数据处理、具体命令和输出约定请参阅对应 skill 的 `SKILL.md`。

## 参与贡献

请让每个 skill 聚焦于一个明确任务、保持自包含，并确保在执行前可以安全审阅。只有能提升可靠性的场景才加入确定性脚本；同时记录外部依赖和数据流，并为确定性逻辑提供可运行测试。

## 许可证

本仓库以 [MIT License](LICENSE) 发布。
