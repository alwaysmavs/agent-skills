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
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | [基于 oo CLI 构建](https://oomol.com)：使用阿里 Qwen ASR 转写，生成带时间轴的字幕、翻译、优化中日韩字幕换行，并导出硬字幕或软字幕。 [English](skills/video-subtitle-translator/README.md) · [中文说明](skills/video-subtitle-translator/README.zh-CN.md) | Node.js 18+、FFmpeg、[oo CLI](https://oomol.com)、Fusion ASR 与 OO LLM 权限 |

查看 [视频字幕生成器中文说明](skills/video-subtitle-translator/README.zh-CN.md)，或阅读 [English overview](skills/video-subtitle-translator/README.md)，了解完整流程、支持语言、格式和交付方式。

## 让你的 Agent 安装 skill

无需记忆终端命令。将以下提示词直接复制给你的 Agent：

```text
请将 https://github.com/alwaysmavs/agent-skills 中的 video-subtitle-translator skill 安装到我当前 Agent 的 skills 目录，并遵循该 skill 的 SKILL.md 说明。请检查 Node.js 18+、FFmpeg/FFprobe，以及已认证且具备 Fusion ASR 和 OO LLM 权限的 oo CLI 是否可用；如有缺失，请明确告诉我需要完成哪些配置；如果环境已就绪，请确认该 skill 可以使用。
```

该 skill [基于 oo CLI 构建](https://oomol.com)。面向 Agent 的前置条件、数据处理、具体命令和输出约定请参阅对应 skill 的 `SKILL.md`。

## 参与贡献

请让每个 skill 聚焦于一个明确任务、保持自包含，并确保在执行前可以安全审阅。只有能提升可靠性的场景才加入确定性脚本；同时记录外部依赖和数据流，并为确定性逻辑提供可运行测试。

## 许可证

本仓库以 [MIT License](LICENSE) 发布。
