# Fusion ASR

Use this reference after the input media has passed preflight checks.

## Source language

Omit `language` for unknown or multilingual media. Supported source codes are `zh`, `yue`, `en`, `ja`, `de`, `ko`, `ru`, `fr`, `pt`, `ar`, `it`, `es`, `hi`, `id`, `th`, `tr`, `uk`, `vi`, `cs`, `da`, `fil`, `fi`, `is`, `ms`, `no`, `pl`, and `sv`.

## Submit

Upload the selected local audio file and use its `downloadUrl` as `fileURL`:

```bash
oo file upload "$AUDIO_PATH" --json
```

Create `submit-asr.json` without `language` when automatic detection is needed:

```json
{
  "fileURL": "https://...",
  "language": "en",
  "enableITN": false,
  "enableWords": true
}
```

Submit and save the full response as `job.created.json`:

```bash
oo connector run "fusion-api" \
  --action "qwen_asr_filetrans_submit" \
  --data @submit-asr.json \
  --json
```

The response contains a `sessionId`. Never include a local file path in `fileURL`.

## Poll and fetch

Poll until the job reports `completed`:

```bash
oo connector run "fusion-api" \
  --action "qwen_asr_filetrans_state" \
  --data "{\"sessionID\":\"$SESSION_ID\"}" \
  --json
```

On completion, fetch and save the result as both `job.done.json` and `transcript.json`:

```bash
oo connector run "fusion-api" \
  --action "qwen_asr_filetrans_result" \
  --data "{\"sessionID\":\"$SESSION_ID\"}" \
  --json
```

When the state is `not_found`, stop and report the missing session. When the state is `processing`, wait briefly and poll again. Keep `enableWords: true`; without word timing, the skill cannot reliably create timed subtitles.
