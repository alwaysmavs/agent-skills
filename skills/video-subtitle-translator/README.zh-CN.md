# 视频字幕生成器

**语言：** [English](README.md) | 简体中文

**仓库导航：** [全部 skills（English）](../../README.md) | [全部 skills（中文）](../../README.zh-CN.md)

**让任何视频拥有自然、清晰、便于观看的字幕，并按受众所需格式直接交付。**

`video-subtitle-translator` 是一个由 OO 驱动的 Agent Skill，可将本地音频或视频转为带时间轴的字幕、翻译后的字幕文件、烧录字幕 MP4，或带可选字幕轨的视频。它将阿里 Qwen ASR 转写与确定性的字幕处理结合起来，输出的是可以直接交付的字幕和成片，而不仅是一段没有时间信息的逐字稿。

## 查看效果

![Test Video：英文语音已翻译并烧录为简体中文字幕](examples/test-video-zh-preview.gif)

此预览来自 [**Test Video** — 下载或播放完整烧录字幕 MP4](examples/test-video-zh-burned.mp4)。原始语音为英语；最终视频使用自然、底部居中、黑色描边的简体中文字幕。

## 核心能力

### 1. 使用阿里 Qwen ASR 生成带逐词时间戳的逐字稿

skill 会先通过 OO 工作流上传标准化音频，再经 Fusion API 提交至 **Alibaba Qwen ASR FileTrans**。转写结果包含句级和词级时间戳，而不只是纯文本；正是这些时间戳让字幕能够准确跟随说话节奏。

### 2. 将逐字稿整理成易读的 SRT 字幕

内置转换工具会将带时间戳的词语组合成适合屏幕阅读的字幕条目。它会综合停顿、单条时长、字符数和词数等边界条件，并输出通用 SRT 文件；需要时也可生成 VTT。原始逐字稿和逐词时间轴字幕会一并保留，方便复核。

### 3. 翻译时保留原始时间轴

用户要求翻译时，配置好的 OO LLM 只翻译每一条字幕文本，同时保留所有字幕序号和时间戳。长视频会使用检查点保存已完成的批次，支持中断后继续；还可以传入术语表、领域、受众和风格说明，保证名称和专业术语前后一致。

### 4. 交付观众真正能使用的字幕

- **烧录字幕 MP4：** 字幕永久显示，适合社交媒体、移动端播放和上传后仍需稳定显示字幕的场景。
- **软字幕 MKV：** 不重新编码视频，提供可开关、可编辑的字幕轨。
- **SRT、VTT 与 ASS：** 提供给剪辑软件、播放器和需要独立字幕资产的工作流。
- **CJK 排版优化：** 中文、日文、韩文会按适合两行显示的规则自动换行，不会套用英文字幕的字符长度假设。

## 支持语言

Alibaba Qwen ASR 支持自动识别语言，也可指定源语言。当前工作流支持中文、粤语、英语、日语、韩语、德语、法语、西班牙语、葡萄牙语、意大利语、阿拉伯语、俄语、印地语、印尼语、泰语、土耳其语、越南语，以及更多欧洲与东南亚语言。目标翻译语言由配置的 OO LLM 提供，因此同一套流程可以为多语言受众制作字幕。

## 如何选择输出格式

| 需求 | 推荐输出 |
| --- | --- |
| 希望字幕始终显示 | 烧录字幕 MP4 |
| 希望观众自行开关字幕 | 软字幕 MKV |
| 剪辑软件或平台需要单独字幕文件 | SRT 或 VTT |
| 需要一致的字体、描边和位置 | ASS 外挂字幕或带 ASS 的 MKV |

## 安装

```bash
git clone https://github.com/alwaysmavs/agent-skills.git
mkdir -p .agents/skills
cp -R agent-skills/skills/video-subtitle-translator .agents/skills/
```

面向 Agent 的实现说明、环境要求、具体命令、数据处理和恢复步骤请阅读 [SKILL.md](SKILL.md)。该 skill 需要 Node.js 18+、FFmpeg/FFprobe、已认证的 `oo` CLI、Fusion API 权限和 OO LLM 配置。

## 附带示例

| 资源 | 说明 |
| --- | --- |
| [`test-video-zh-burned.mp4`](examples/test-video-zh-burned.mp4) | 完整 2 分 46 秒示例，已永久烧录简体中文字幕；MP4 标题元数据为 `Test Video`。 |
| [`test-video-zh-preview.gif`](examples/test-video-zh-preview.gif) | 自动播放的短预览，同时用于本页和仓库首页。 |

示例仅用于展示字幕生成效果；仓库不会提交原始逐字稿、API Key、上传媒体地址或中间任务数据。
