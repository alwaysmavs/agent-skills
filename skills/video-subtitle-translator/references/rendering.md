# Rendering and delivery

## Display SRT and ASS

Always make the display SRT before external, soft, or burned-in delivery. Convert it to ASS using the actual video dimensions:

```bash
node scripts/subtitle-tools.mjs srt-to-burn-ass \
  --input "$SUBTITLE_SRT" \
  --output "$WORK_DIR/subtitles.burn.ass" \
  --video-width "$VIDEO_WIDTH" \
  --video-height "$VIDEO_HEIGHT" \
  --font-name "PingFang SC" \
  --font-size 56 \
  --margin-v 38 \
  --margin-l 80 \
  --margin-r 80 \
  --outline 5
```

For 1080p Chinese subtitles, use bottom center, white text, a black outline, and `MarginV=38`. On systems without `PingFang SC`, select an installed CJK-capable font, such as `Noto Sans CJK SC` or `Source Han Sans SC`. Use `ffprobe` to obtain the source dimensions rather than assuming 1920×1080.

## Soft subtitles

Use compatibility-first SRT in MKV:

```bash
ffmpeg -y -i "$INPUT_VIDEO" -i "$SUBTITLE_SRT" \
  -map 0:v? -map 0:a? -map 1:0 \
  -c copy -c:s srt \
  -disposition:s:0 default \
  -metadata:s:s:0 language="$LANG_CODE" \
  -metadata:s:s:0 title="Translated subtitles" \
  "$OUTPUT_VIDEO.mkv"
```

Use ASS in MKV when exact typography matters. Soft MP4 uses `mov_text` and cannot preserve ASS outline, font, or position.

## Burned-in MP4

```bash
ffmpeg -y -i "$INPUT_VIDEO" \
  -vf "ass=$WORK_DIR/subtitles.burn.ass" \
  -c:v libx264 -crf 18 -preset medium -c:a copy -sn \
  "$OUTPUT_VIDEO.burned.mp4"
```

Use burned-in MP4 when subtitles must always display across players and upload platforms. If the output appears vertically misplaced, confirm the ASS `PlayResX` and `PlayResY` match the source video, then adjust only `MarginV`.
