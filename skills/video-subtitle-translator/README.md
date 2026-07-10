# Video Subtitle Translator

**Languages:** English | [简体中文](README.zh-CN.md)

**Repository:** [All skills](../../README.md) | [全部技能（中文）](../../README.zh-CN.md)

**Give any video readable, natural subtitles—then export exactly the format your audience needs.**

`video-subtitle-translator` is an Agent Skill [built with oo CLI](https://oomol.com) for turning local audio and video into timed captions, translated subtitle files, hard-subtitled MP4s, or videos with selectable subtitle tracks. It combines Alibaba Qwen ASR transcription with deterministic subtitle processing, so the output is ready for sharing rather than a loose block of transcript text.

## See the result

![Test Video: English speech translated and burned in as Simplified Chinese subtitles](examples/test-video-zh-preview.gif)

This preview comes from [**Test Video** — download or play the complete burned-in MP4](examples/test-video-zh-burned.mp4). The source is English; the finished video has natural, bottom-centered Simplified Chinese subtitles with a high-contrast outline.

## What it does

### 1. Produce a word-timed transcript with Alibaba Qwen ASR

The skill uploads normalized audio through the OO workflow and submits it to **Alibaba Qwen ASR FileTrans** through the Fusion API. The transcript includes sentence and word timestamps, not just plain text. Those timestamps are what make subtitles accurately follow the speaker.

### 2. Turn the transcript into clean SRT subtitles

Its bundled conversion tool groups timed words into screen-friendly cues. It uses sensible boundaries for pauses, cue duration, character count, and words per cue, then writes portable SRT files (and VTT when requested). The original transcript and word-timed subtitle files are retained for review.

### 3. Translate without losing timing

When a translation is requested, the configured OO LLM translates cue text while preserving every subtitle index and timestamp. Translation checkpoints make longer jobs resumable, and optional glossary, domain, audience, and style settings help keep names and terminology consistent.

### 4. Deliver subtitles your viewers can actually use

- **Burned-in MP4:** permanent subtitles that show everywhere—ideal for social media, mobile playback, and uploads.
- **Soft-subtitle MKV:** a selectable, editable subtitle track without re-encoding the video.
- **SRT, VTT, and ASS:** sidecar files for editors, players, and workflows that need a separate subtitle asset.
- **CJK-aware layout:** Chinese, Japanese, and Korean subtitles are reflowed for readable two-line delivery instead of using English character-count assumptions.

## Languages

Alibaba Qwen ASR supports automatic detection or an explicit source language. The current workflow supports Chinese, Cantonese, English, Japanese, Korean, German, French, Spanish, Portuguese, Italian, Arabic, Russian, Hindi, Indonesian, Thai, Turkish, Vietnamese, and many additional European and Southeast Asian languages. Translation targets are supplied by the configured OO LLM, so the same workflow can deliver subtitles for a multilingual audience.

## Choose the output

| Need | Recommended result |
| --- | --- |
| Subtitles must always appear | Burned-in MP4 |
| Viewers need to toggle subtitles | Soft-subtitle MKV |
| A video editor or platform needs a subtitle file | SRT or VTT |
| Matching typography and placement matter | ASS sidecar or styled MKV |

## Add it to your agent

Copy this request to your agent—no terminal commands required:

```text
Install the video-subtitle-translator skill from https://github.com/alwaysmavs/agent-skills into my current agent's skills directory. Follow its SKILL.md instructions. Check that Node.js 18+, FFmpeg/FFprobe, and an authenticated oo CLI with Fusion ASR and OO LLM access are available. If something is missing, tell me exactly what I need to set up; otherwise confirm that the skill is ready to use.
```

The implementation guide for agents, including setup, commands, data handling, and recovery steps, is in [SKILL.md](SKILL.md). It uses [oo CLI](https://oomol.com) and requires Node.js 18+, FFmpeg/FFprobe, Fusion API access, and an OO LLM configuration.

## Included demo

| Asset | Details |
| --- | --- |
| [`test-video-zh-burned.mp4`](examples/test-video-zh-burned.mp4) | Complete 2:46 demo video with Simplified Chinese subtitles permanently burned in; MP4 title metadata: `Test Video`. |
| [`test-video-zh-preview.gif`](examples/test-video-zh-preview.gif) | Short, autoplaying preview used in this page and the repository home page. |

The demo is included solely to show the generated subtitle result. No raw transcript, API key, uploaded-media URL, or intermediate job data is committed.
