---
name: video-subtitle-translator
description: Transcribe local audio or video, translate timed subtitles, create SRT/VTT/ASS files, and export burned-in or selectable subtitle videos. Use for video translation, subtitle creation, caption generation, subtitle translation, SRT or VTT generation, hard subtitles, soft subtitle tracks, and CJK subtitle layout.
---

# Video Subtitle Translator

Use this OO-powered workflow to transcribe media with Fusion ASR, translate subtitles with the configured OO LLM, and generate readable subtitle files or subtitled videos.

## Requirements and data handling

- Require Node.js 18+ for `scripts/subtitle-tools.mjs`.
- Require `ffmpeg` and `ffprobe` for local video or audio normalization, muxing, or burn-in.
- Require an authenticated `oo` CLI with the `fusion-api` connector and `oo llm config --json` available.
- Upload source audio to OO before transcription. Translation sends subtitle text and supplied context to the LLM endpoint configured by `oo llm config --json`.
- Never print, save, or commit API keys, uploaded-media URLs, raw user media, or generated transcripts unless the user requests them.
- Use a dedicated local output directory such as `outputs/subtitles-<input-name>/`; do not overwrite the input media.

Run the preflight checks before processing:

```bash
ffmpeg -version
ffprobe -version
node --version
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 18 ? 0 : 1)"
oo llm config --json
```

If the task needs video processing and FFmpeg or FFprobe is unavailable, stop and ask the user to install a complete FFmpeg build. If Node.js is missing or older than 18, stop and ask for Node.js 18 LTS or newer. If `oo` configuration is unavailable, report the failure and do not substitute credentials or another provider.

## Decide the output

- If the user explicitly asks to translate or requests a translated video, translate to the language of the request unless they name another target language. For Chinese, default to Simplified Chinese.
- If the user asks only to add subtitles and does not say whether translation is wanted, ask whether they want same-language captions or translation and, if translating, the target language.
- For audio-only input, return sidecar subtitle files.
- For a video, default to a burned-in MP4. Use soft MKV subtitles when the user requests selectable/editable tracks, multiple languages, MKV, no re-encode, or soft subtitles.
- Infer a translation profile when clear: `film_tv`, `youtube_explainer`, `technical_course`, `interview_podcast`, `news_documentary`, `business_training`, `gaming_stream`, or `kids_content`. Otherwise use `general`.

## Workflow

### 1. Prepare and transcribe

For video or media that needs normalization, extract mono 16 kHz WAV:

```bash
ffmpeg -y -i "$INPUT_MEDIA" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$WORK_DIR/audio.wav"
oo file upload "$WORK_DIR/audio.wav" --json
```

Use the returned `downloadUrl` as `fileURL`. Submit an ASR job, poll it to completion, and save the raw result as `$WORK_DIR/transcript.json`. See [Fusion ASR](references/fusion-asr.md) for exact commands, payload fields, language codes, and recovery rules.

### 2. Build source subtitles

Convert the saved ASR result into timed subtitle files:

```bash
node scripts/subtitle-tools.mjs fusion-to-subtitles \
  --input "$WORK_DIR/transcript.json" \
  --out-dir "$WORK_DIR" \
  --formats srt
```

Use `--formats all` when VTT is requested. This writes `transcript.txt`, `transcript.srt`, and `transcript.word-timed.srt` (plus VTT when requested). The script accepts the Fusion response or its `data` field and normalizes second- or millisecond-based timings.

### 3. Translate only when requested

Use the bundled script so it preserves subtitle indexes and timestamps and checkpoints each completed batch:

```bash
node scripts/subtitle-tools.mjs translate-srt \
  --input "$WORK_DIR/transcript.srt" \
  --out-dir "$WORK_DIR" \
  --source-language auto \
  --target-language "Simplified Chinese" \
  --target-code zh \
  --profile youtube_explainer \
  --formats srt
```

Pass `--domain`, `--audience`, `--style-notes`, `--glossary-json`, and `--video-context-json` when the user supplies useful context. The command reads its model configuration from `oo llm config --json`, retries invalid batches with smaller batches, and writes `translation.<target-code>.json` as a resumable checkpoint. See [Translation options](references/translation.md) for profile guidance and error recovery.

### 4. Prepare display subtitles

Before sidecar, soft-subtitle, or burn-in delivery, create one display-ready SRT. For Chinese and other CJK languages use 18 characters per line by default, or 16 for a strict professional delivery:

```bash
node scripts/subtitle-tools.mjs prepare-display-srt \
  --input "$WORK_DIR/translation.$TARGET_CODE.srt" \
  --output "$WORK_DIR/translation.$TARGET_CODE.display.srt" \
  --cjk-line-length 18 \
  --max-lines 2
```

For same-language captions, use `transcript.srt` as the input instead. See [Rendering and delivery](references/rendering.md) for subtitle styling, fonts, FFmpeg commands, and output rules.

### 5. Deliver results

- Return the source SRT and, when translated, the display SRT.
- For styled output, generate an ASS sidecar from the display SRT.
- For video, generate the chosen burned-in MP4 or soft-subtitle container.
- Report exact local paths. Do not print raw transcript JSON or credentials.

## Script commands

```text
fusion-to-subtitles  Convert Fusion ASR JSON into transcript text and timed SRT/VTT.
translate-srt        Translate SRT while preserving cue indexes and timestamps.
prepare-display-srt  Reflow SRT into readable two-line display subtitles.
srt-to-burn-ass      Convert SRT into bottom-centered styled ASS subtitles.
```

Run `node scripts/subtitle-tools.mjs --help` for CLI options. Use the script for deterministic conversion, translation checkpoints, CJK reflow, and ASS generation instead of recreating these steps inline.

## Failure handling

- Missing word timings: return transcript text if available, but explain that timed subtitles require sentence or word timings.
- ASR job timeout: preserve and report the saved session ID so the job can be resumed by polling.
- Invalid LLM JSON or missing cue indexes: let the script retry smaller batches; if a single cue still fails, report its index and the provider error.
- Burn-in failure: verify that FFmpeg includes `libx264`; if the user needs selectable tracks, offer soft MKV as the fallback.
- Incorrect subtitle vertical position: regenerate ASS with the correct video dimensions and adjust `MarginV`; a smaller margin places subtitles lower.
