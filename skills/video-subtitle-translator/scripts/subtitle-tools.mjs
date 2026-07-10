#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const DEFAULT_CONTEXT_WINDOW = 8;
const DEFAULT_LATIN_LINE_LENGTH = 37;
const DEFAULT_CJK_LINE_LENGTH = 18;
const DEFAULT_MAX_LINES = 2;
const DEFAULT_CUE_OPTIONS = {
  maxDuration: 4.2,
  targetDuration: 2.8,
  maxChars: 54,
  maxWords: 12,
  pauseThreshold: 0.55,
  minDuration: 0.45,
  startPadding: 0.08,
  endPadding: 0.16,
  nextCueGap: 0.05,
};

async function main() {
  const [command, ...argv] = process.argv.slice(2);
  const args = parseArgs(argv);

  if (!command || command === "--help" || command === "-h" || args.help) {
    printUsage();
    return;
  }

  if (command === "fusion-to-subtitles") {
    runFusionToSubtitles(args);
    return;
  }

  if (command === "translate-srt") {
    await runTranslateSrt(args);
    return;
  }

  if (command === "prepare-display-srt") {
    runPrepareDisplaySrt(args);
    return;
  }

  if (command === "srt-to-burn-ass") {
    runSrtToBurnAss(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function runFusionToSubtitles(args) {
  const input = requireArg(args, "input");
  const outDir = args.outDir ?? dirnameFallback(input);
  const formats = parseFormats(args.formats ?? args.format ?? "srt");
  const lineOptions = parseLineOptions(args);
  mkdirSync(outDir, { recursive: true });

  const raw = readJson(input);
  const transcript = fusionTranscriptToTimedTranscript(raw, { timeUnit: args.timeUnit ?? "auto" });
  const cues = timedWordsToCues(transcript.words, DEFAULT_CUE_OPTIONS);
  if (!transcript.words.length || !cues.length) {
    throw new Error("No timed words were found in the Fusion transcript; cannot build timed subtitles.");
  }

  const transcriptText = transcript.text || wordsToText(transcript.words);
  writeFileSync(join(outDir, "transcript.txt"), `${transcriptText}\n`, "utf8");
  writeFileSync(join(outDir, "transcript.srt"), segmentsToSrt(cues, lineOptions), "utf8");
  writeFileSync(join(outDir, "transcript.word-timed.srt"), segmentsToSrt(cues, lineOptions), "utf8");
  if (formats.includes("vtt")) {
    writeFileSync(join(outDir, "transcript.word-timed.vtt"), segmentsToVtt(cues, lineOptions), "utf8");
  }

  console.log(`Wrote ${cues.length} cues to ${outDir}`);
}

async function runTranslateSrt(args) {
  const input = requireArg(args, "input");
  const outDir = args.outDir ?? dirnameFallback(input);
  const targetLanguage = args.targetLanguage ?? "Simplified Chinese";
  const sourceLanguage = args.sourceLanguage ?? "auto";
  const targetCode = args.targetCode ?? inferTargetCode(targetLanguage);
  const batchSize = positiveInt(args.batchSize, 30);
  const contextWindow = nonNegativeInt(args.contextWindow, DEFAULT_CONTEXT_WINDOW);
  const formats = parseFormats(args.formats ?? args.format ?? "srt");
  const lineOptions = parseLineOptions(args);
  mkdirSync(outDir, { recursive: true });

  const cues = parseSrt(readFileSync(input, "utf8"));
  if (!cues.length) {
    throw new Error(`No subtitle cues found in ${input}`);
  }

  const checkpointPath = args.checkpoint ?? join(outDir, `translation.${targetCode}.json`);
  const existingItems = existsSync(checkpointPath) ? normalizeExistingItems(cues, readJson(checkpointPath).items ?? []) : [];
  const llm = getOoLlmConfig(args);
  const translator = new LlmTranslator(llm);

  const metadata = {
    translation_profile: args.profile ?? args.translationProfile ?? "general",
    domain: args.domain,
    audience: args.audience,
    style_notes: args.styleNotes,
    glossary: parseJsonOption(args.glossaryJson, []),
    video_context: parseJsonOption(args.videoContextJson, undefined),
  };

  const items = await translator.translateCues({
    cues,
    sourceLanguage,
    targetLanguage,
    batchSize,
    contextWindow,
    existingItems,
    metadata,
    onProgress: (partial, progress) => {
      writeJson(checkpointPath, {
        sourceLanguage,
        targetLanguage,
        targetCode,
        completed: progress.completed,
        total: progress.total,
        items: partial,
      });
      console.log(`Translated ${progress.completed}/${progress.total}`);
    },
  });

  const translatedCues = replaceCueText(cues, items);
  writeJson(checkpointPath, {
    sourceLanguage,
    targetLanguage,
    targetCode,
    completed: items.length,
    total: cues.length,
    items,
  });
  writeFileSync(join(outDir, `translation.${targetCode}.srt`), cuesToSrt(translatedCues, lineOptions), "utf8");
  if (formats.includes("vtt")) {
    writeFileSync(join(outDir, `translation.${targetCode}.vtt`), cuesToVtt(translatedCues, lineOptions), "utf8");
  }

  console.log(`Wrote translated subtitles to ${join(outDir, `translation.${targetCode}.srt`)}`);
}

function runSrtToBurnAss(args) {
  const input = requireArg(args, "input");
  const outDir = args.outDir ?? dirnameFallback(input);
  const output = args.output ?? join(outDir, `${basename(input).replace(/\.srt$/i, "")}.burn.ass`);
  const videoWidth = positiveInt(args.videoWidth ?? args.width, 1920);
  const videoHeight = positiveInt(args.videoHeight ?? args.height, 1080);
  const style = {
    fontName: args.fontName ?? "PingFang SC",
    fontSize: positiveInt(args.fontSize, 56),
    marginL: nonNegativeInt(args.marginL, 80),
    marginR: nonNegativeInt(args.marginR, 80),
    marginV: nonNegativeInt(args.marginV, Math.max(28, Math.round(videoHeight * 0.035))),
    outline: nonNegativeNumber(args.outline, 5),
    shadow: nonNegativeNumber(args.shadow, 0),
    alignment: positiveInt(args.alignment, 2),
  };
  const lineOptions = parseLineOptions(args);

  mkdirSync(dirname(output), { recursive: true });
  const cues = parseSrt(readFileSync(input, "utf8"));
  if (!cues.length) {
    throw new Error(`No subtitle cues found in ${input}`);
  }

  writeFileSync(output, cuesToBurnAss(cues, { videoWidth, videoHeight, style, ...lineOptions }), "utf8");
  console.log(`Wrote burn-in ASS subtitles to ${output}`);
}

function runPrepareDisplaySrt(args) {
  const input = requireArg(args, "input");
  const outDir = args.outDir ?? dirnameFallback(input);
  const output = args.output ?? join(outDir, `${basename(input).replace(/\.srt$/i, "")}.display.srt`);
  const lineOptions = parseLineOptions(args);

  mkdirSync(dirname(output), { recursive: true });
  const cues = parseSrt(readFileSync(input, "utf8"));
  if (!cues.length) {
    throw new Error(`No subtitle cues found in ${input}`);
  }

  const displayCues = prepareCuesForDisplay(cues, lineOptions);
  writeFileSync(output, cuesToSrt(displayCues, lineOptions), "utf8");
  console.log(`Wrote display subtitles to ${output}`);
}

class LlmTranslator {
  constructor({ apiKey, baseUrl = "https://api.openai.com/v1", model, temperature = 0.2, thinking, reasoningEffort }) {
    if (!apiKey) {
      throw new Error("OO LLM config did not include apiKey.");
    }
    if (!model) {
      throw new Error("OO LLM config did not include model.");
    }
    this.apiKey = apiKey;
    this.baseUrl = String(baseUrl).replace(/\/$/, "");
    this.model = model;
    this.temperature = Number(temperature);
    this.thinking = normalizeThinking(thinking);
    this.reasoningEffort = reasoningEffort;
  }

  async translateCues({ cues, targetLanguage, sourceLanguage, batchSize, contextWindow, existingItems, metadata, onProgress }) {
    const translatedByIndex = new Map(normalizeExistingItems(cues, existingItems).map((item) => [Number(item.index), item]));

    for (let i = 0; i < cues.length; i += batchSize) {
      const batch = cues.slice(i, i + batchSize);
      const pendingBatch = batch.filter((cue) => !translatedByIndex.has(Number(cue.index)));
      if (!pendingBatch.length) {
        continue;
      }

      const items = await this.translateBatchResilient({
        batch: pendingBatch,
        contextBefore: cues.slice(Math.max(0, i - contextWindow), i),
        contextAfter: cues.slice(i + batch.length, i + batch.length + contextWindow),
        contextWindow,
        targetLanguage,
        sourceLanguage,
        metadata,
      });

      for (const item of items) {
        translatedByIndex.set(Number(item.index), item);
      }

      if (onProgress) {
        onProgress(orderedTranslationItems(cues, translatedByIndex), {
          completed: translatedByIndex.size,
          total: cues.length,
        });
      }
    }

    return orderedTranslationItems(cues, translatedByIndex);
  }

  async translateBatchResilient({ batch, contextBefore = [], contextAfter = [], contextWindow, targetLanguage, sourceLanguage, metadata }) {
    try {
      return await this.translateBatch({ batch, contextBefore, contextAfter, targetLanguage, sourceLanguage, metadata });
    } catch (error) {
      if (batch.length <= 1) {
        throw error;
      }
      const midpoint = Math.ceil(batch.length / 2);
      const firstBatch = batch.slice(0, midpoint);
      const secondBatch = batch.slice(midpoint);
      const first = await this.translateBatchResilient({
        batch: firstBatch,
        contextBefore,
        contextAfter: [...secondBatch, ...contextAfter].slice(0, contextWindow),
        contextWindow,
        targetLanguage,
        sourceLanguage,
        metadata,
      });
      const second = await this.translateBatchResilient({
        batch: secondBatch,
        contextBefore: [...contextBefore, ...firstBatch].slice(-contextWindow),
        contextAfter,
        contextWindow,
        targetLanguage,
        sourceLanguage,
        metadata,
      });
      return [...first, ...second];
    }
  }

  async translateBatch({ batch, contextBefore, contextAfter, targetLanguage, sourceLanguage, metadata }) {
    const body = withOptionalThinking({
      model: this.model,
      temperature: this.temperature,
      messages: [
        { role: "system", content: buildSubtitleTranslationPrompt() },
        {
          role: "user",
          content: JSON.stringify({
            source_language: sourceLanguage,
            target_language: targetLanguage,
            translation_profile: metadata.translation_profile,
            domain: metadata.domain,
            audience: metadata.audience,
            style_notes: metadata.style_notes,
            glossary: metadata.glossary,
            video_context: metadata.video_context,
            context_before: serializeCues(contextBefore),
            subtitles: serializeCues(batch),
            context_after: serializeCues(contextAfter),
          }),
        },
      ],
    }, { thinking: this.thinking, reasoningEffort: this.reasoningEffort });

    const response = await fetchWithRetry(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`LLM API error ${response.status} ${response.statusText}: ${text}`);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    const parsed = parseJsonObject(content);
    if (!Array.isArray(parsed.items)) {
      throw new Error(`LLM response did not include an items array: ${content}`);
    }

    const wanted = new Set(batch.map((cue) => Number(cue.index)));
    const translatedByIndex = new Map();
    for (const item of parsed.items
      .filter((item) => wanted.has(Number(item.index)))
      .map((item) => ({ index: Number(item.index), text: cleanSubtitleText(item.text) }))
      .filter((item) => item.text)) {
      translatedByIndex.set(item.index, item);
    }

    const missing = batch.map((cue) => Number(cue.index)).filter((index) => !translatedByIndex.has(index));
    if (missing.length) {
      throw new Error(`LLM response omitted translations for subtitle cue indexes: ${missing.join(", ")}`);
    }

    return batch.map((cue) => translatedByIndex.get(Number(cue.index))).filter(Boolean);
  }
}

function buildSubtitleTranslationPrompt() {
  return [
    "You are a professional subtitle localization translator.",
    "Return valid JSON only, with shape {\"items\":[{\"index\":number,\"text\":\"translated subtitle\"}]}",
    "Keep the same indexes. Do not add, remove, split, merge, renumber, or reorder subtitle cues.",
    "The user message may include context_before and context_after; use them only to understand references, pronouns, speaker intent, short fragmented lines, and terminology continuity.",
    "Return translations only for subtitles, never for context_before or context_after.",
    "Translate into natural, idiomatic spoken subtitles in the target language, not literal word-by-word text.",
    "Use the source_language and target_language values from the user message; they may be language names or normalized descriptions inferred from language codes.",
    "Prioritize how real native speakers would say it in conversation, especially for casual speech, slang, idioms, teasing, emotional reactions, interruptions, fillers, and fragmented lines.",
    "Localize slang, idioms, wordplay, innuendo, sarcasm, and culturally marked phrases into target-language equivalents that carry the same force, flavor, and social meaning; do not flatten them into plain definitions.",
    "Preserve the speaker's intent, tone, intensity, humor, intimacy, rhythm, atmosphere, and register, but make the result fluent and watchable.",
    "Match the style to the scene: lyrical, period, dramatic, poetic, vulgar, witty, or intimate lines should keep an equivalent mood in the target language without becoming ornate when the original is plain.",
    "Use concise subtitle phrasing. Avoid stiff written-language constructions, awkward calques, bland neutral wording, over-explaining, or adding information that is not present.",
    "For Simplified Chinese, prefer natural Mainland Chinese subtitles that sound native, cinematic, and context-aware; use colloquial phrasing for everyday speech, and tasteful literary phrasing when the original is elevated or atmospheric.",
    "For other target languages, follow native subtitle conventions, punctuation, spacing, honorifics, and register for that language.",
    "Honor translation_profile, domain, audience, style_notes, glossary, and video_context when supplied, but never add explanations or extra JSON fields.",
    "Keep names, numbers, product names, and technical terms accurate.",
    "Escape JSON strings correctly. Use \\n for line breaks inside text strings, never raw line breaks or dangling backslashes.",
    "Do not include timestamps. Do not include explanations.",
  ].join(" ");
}

function fusionTranscriptToTimedTranscript(raw, { timeUnit = "auto" } = {}) {
  const data = raw?.data ?? raw;
  const transcription = data?.transcription ?? data;
  const transcripts = Array.isArray(transcription?.transcripts)
    ? transcription.transcripts
    : Array.isArray(data?.transcripts)
      ? data.transcripts
      : [];
  const words = [];
  const texts = [];

  for (const transcript of transcripts) {
    if (typeof transcript?.text === "string" && transcript.text.trim()) {
      texts.push(transcript.text.trim());
    }
    for (const sentence of transcript?.sentences ?? []) {
      const sentenceWords = Array.isArray(sentence?.words) ? sentence.words : [];
      if (!sentenceWords.length && sentence?.text) {
        const start = numericTime(sentence.beginTime ?? sentence.startTime ?? sentence.start);
        const end = numericTime(sentence.endTime ?? sentence.end);
        if (Number.isFinite(start) && Number.isFinite(end)) {
          words.push({ text: sentence.text, start, end, delimiterBefore: words.length ? " " : "", eos: true });
        }
        continue;
      }
      for (const word of sentenceWords) {
        const text = String(word.text ?? word.word ?? word.content ?? "").trim();
        const start = numericTime(word.beginTime ?? word.startTime ?? word.start);
        const end = numericTime(word.endTime ?? word.end);
        if (!text || !Number.isFinite(start) || !Number.isFinite(end)) {
          continue;
        }
        const punctuation = String(word.punctuation ?? "");
        words.push({
          text: text + punctuation,
          start,
          end,
          delimiterBefore: words.length ? " " : "",
          eos: Boolean(punctuation && /[.!?。！？]/.test(punctuation)),
        });
      }
    }
  }

  const normalizedWords = normalizeTimedWords(words, timeUnit);
  return {
    provider: "fusion-api",
    text: texts.join("\n").trim(),
    words: normalizedWords,
    raw,
  };
}

function normalizeTimedWords(words, timeUnit) {
  if (timeUnit === "s") {
    return words;
  }

  const durations = words.map((word) => word.end - word.start).filter((duration) => Number.isFinite(duration) && duration > 0);
  const maxEnd = Math.max(0, ...words.map((word) => word.end).filter(Number.isFinite));
  const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / Math.max(1, durations.length);
  const shouldUseMs = timeUnit === "ms" || (timeUnit === "auto" && (maxEnd > 10000 || averageDuration > 3));
  if (!shouldUseMs) {
    return words;
  }

  return words.map((word) => ({
    ...word,
    start: word.start / 1000,
    end: word.end / 1000,
  }));
}

function timedWordsToCues(words, options = DEFAULT_CUE_OPTIONS) {
  const cues = [];
  let current = [];
  let previousCueLastEnd;
  const pushCue = (cueWords, nextWordStart) => {
    const cue = wordsToCue(cueWords, cues.length + 1, {
      minDuration: options.minDuration,
      startPadding: options.startPadding,
      endPadding: options.endPadding,
      nextCueGap: options.nextCueGap,
      previousCueLastEnd,
      nextWordStart,
    });
    cues.push(cue);
    previousCueLastEnd = cueWords.at(-1)?.end;
  };

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (!word?.text || !Number.isFinite(word.start) || !Number.isFinite(word.end)) {
      continue;
    }
    if (current.length && shouldBreakBeforeWord(current, word, options)) {
      pushCue(current, word.start);
      current = [];
    }
    current.push(word);
    if (shouldBreakAfterWord(current, word, words[i + 1], options)) {
      pushCue(current, words[i + 1]?.start);
      current = [];
    }
  }

  if (current.length) {
    pushCue(current, undefined);
  }
  return cues.filter((cue) => cue.content);
}

function shouldBreakBeforeWord(current, nextWord, options) {
  const last = current.at(-1);
  const first = current[0];
  const nextDuration = nextWord.end - first.start;
  const nextChars = wordsToText([...current, nextWord]).length;
  const gap = nextWord.start - last.end;
  const speakerChanged = Boolean(last.speaker && nextWord.speaker && last.speaker !== nextWord.speaker);
  return speakerChanged || gap >= options.pauseThreshold || nextDuration > options.maxDuration || nextChars > options.maxChars || current.length >= options.maxWords;
}

function shouldBreakAfterWord(current, word, nextWord, options) {
  if (!nextWord) {
    return true;
  }
  const first = current[0];
  const duration = word.end - first.start;
  const chars = wordsToText(current).length;
  const gap = nextWord.start - word.end;
  if (gap >= options.pauseThreshold) {
    return true;
  }
  if (word.eos && duration >= 0.7) {
    return true;
  }
  if (/[,:;，、；：]$/.test(word.text) && duration >= options.targetDuration) {
    return true;
  }
  return duration >= options.maxDuration || chars >= options.maxChars || current.length >= options.maxWords;
}

function wordsToCue(words, index, options) {
  const first = words[0];
  const last = words.at(-1);
  const availableLead = Number.isFinite(options.previousCueLastEnd)
    ? Math.max(0, first.start - options.previousCueLastEnd - options.nextCueGap)
    : first.start;
  const cueLead = Math.min(options.startPadding, availableLead);
  const startTime = Math.max(0, first.start - cueLead);
  let endTime = Math.max(last.end + options.endPadding, startTime + options.minDuration);

  if (Number.isFinite(options.nextWordStart)) {
    const nextAvailableLead = Math.max(0, options.nextWordStart - last.end - options.nextCueGap);
    const nextCueLead = Math.min(options.startPadding, nextAvailableLead);
    const nextCueStart = Math.max(0, options.nextWordStart - nextCueLead);
    const latestEnd = nextCueStart - options.nextCueGap;
    endTime = latestEnd > last.end
      ? Math.min(endTime, latestEnd)
      : Math.min(endTime, Math.max(last.end, options.nextWordStart - options.nextCueGap));
  }

  return {
    index,
    start_time: startTime,
    end_time: endTime,
    content: wordsToText(words),
    speaker: first.speaker,
  };
}

function parseSrt(body) {
  return String(body ?? "")
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseSrtBlock)
    .filter(Boolean);
}

function parseSrtBlock(block) {
  const lines = block.split("\n");
  const index = Number(lines[0]?.trim());
  const match = (lines[1] ?? "").trim().match(/^(.+?)\s+-->\s+(.+?)(?:\s+.*)?$/);
  if (!Number.isFinite(index) || !match?.[1] || !match[2]) {
    return null;
  }
  return {
    index,
    start: match[1].trim(),
    end: match[2].trim(),
    text: cleanSubtitleText(lines.slice(2).join("\n")),
  };
}

function segmentsToSrt(segments, options = {}) {
  return segments
    .filter((segment) => segment?.content && Number.isFinite(segment.start_time) && Number.isFinite(segment.end_time))
    .map((segment, index) => [
      String(index + 1),
      `${formatSrtTimestamp(segment.start_time)} --> ${formatSrtTimestamp(segment.end_time)}`,
      wrapSubtitleText(segment.content, options),
    ].join("\n"))
    .join("\n\n") + "\n";
}

function segmentsToVtt(segments, options = {}) {
  const body = segments
    .filter((segment) => segment?.content && Number.isFinite(segment.start_time) && Number.isFinite(segment.end_time))
    .map((segment) => [
      `${formatVttTimestamp(segment.start_time)} --> ${formatVttTimestamp(segment.end_time)}`,
      wrapSubtitleText(segment.content, options),
    ].join("\n"))
    .join("\n\n");
  return `WEBVTT\n\n${body}${body ? "\n" : ""}`;
}

function cuesToSrt(cues, options = {}) {
  return cues
    .filter((cue) => cue?.start && cue.end && cue.text)
    .map((cue) => [
      String(cue.index),
      `${cue.start} --> ${cue.end}`,
      wrapSubtitleText(cue.text, options),
    ].join("\n"))
    .join("\n\n") + "\n";
}

function cuesToVtt(cues, options = {}) {
  const body = cues
    .filter((cue) => cue?.start && cue.end && cue.text)
    .map((cue) => [
      `${cue.start.replace(",", ".")} --> ${cue.end.replace(",", ".")}`,
      wrapSubtitleText(cue.text, options),
    ].join("\n"))
    .join("\n\n");
  return `WEBVTT\n\n${body}${body ? "\n" : ""}`;
}

function cuesToBurnAss(cues, { videoWidth, videoHeight, style, ...lineOptions }) {
  const header = [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${videoWidth}`,
    `PlayResY: ${videoHeight}`,
    "ScaledBorderAndShadow: yes",
    "WrapStyle: 0",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: Default,${style.fontName},${style.fontSize},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,${style.outline},${style.shadow},${style.alignment},${style.marginL},${style.marginR},${style.marginV},1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
  ];
  const events = cues
    .filter((cue) => cue?.start && cue.end && cue.text)
    .map((cue) => `Dialogue: 0,${srtTimestampToAssTimestamp(cue.start)},${srtTimestampToAssTimestamp(cue.end)},Default,,0,0,0,,${escapeAssText(wrapSubtitleText(cue.text, lineOptions))}`);
  return `${[...header, ...events].join("\n")}\n`;
}

function prepareCuesForDisplay(cues, options = {}) {
  const displayCues = [];
  for (const cue of cues) {
    const parts = splitSubtitleTextForDisplay(cue.text, options);
    if (parts.length <= 1) {
      displayCues.push({ ...cue, index: displayCues.length + 1, text: parts[0] ?? cue.text });
      continue;
    }

    const start = parseSrtTimestamp(cue.start);
    const end = parseSrtTimestamp(cue.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      for (const part of parts) {
        displayCues.push({ ...cue, index: displayCues.length + 1, text: part });
      }
      continue;
    }

    let cursor = start;
    const totalWeight = parts.reduce((sum, part) => sum + Math.max(1, displayLength(part)), 0);
    const duration = end - start;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const partDuration = isLast ? end - cursor : duration * (Math.max(1, displayLength(part)) / totalWeight);
      const partEnd = isLast ? end : Math.min(end, cursor + partDuration);
      displayCues.push({
        ...cue,
        index: displayCues.length + 1,
        start: formatSrtTimestamp(cursor),
        end: formatSrtTimestamp(partEnd),
        text: part,
      });
      cursor = partEnd;
    }
  }
  return displayCues;
}

function splitSubtitleTextForDisplay(text, options = {}) {
  const normalized = cleanSubtitleText(text);
  if (!normalized) {
    return [];
  }

  const maxChars = maxCueCharacters(normalized, options);
  const parts = [];
  let remaining = normalized;
  while (displayLength(remaining) > maxChars) {
    const breakIndex = chooseChunkBreakIndex(remaining, maxChars);
    parts.push(remaining.slice(0, breakIndex).trim());
    remaining = remaining.slice(breakIndex).trim();
  }
  if (remaining) {
    parts.push(remaining);
  }
  return parts.filter(Boolean);
}

function replaceCueText(cues, translatedItems) {
  const byIndex = new Map(translatedItems.map((item) => [Number(item.index), cleanSubtitleText(item.text)]));
  return cues.map((cue) => ({ ...cue, text: byIndex.get(Number(cue.index)) || cleanSubtitleText(cue.text) }));
}

function wrapSubtitleText(text, options = {}) {
  const normalized = cleanSubtitleText(text).replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  const lineOptions = normalizeLineOptions(options);
  if (containsCjk(normalized)) {
    return wrapCjkSubtitleText(normalized, lineOptions.cjkLineLength, lineOptions.maxLines);
  }
  const lines = [];
  let current = "";
  for (const word of normalized.split(" ")) {
    if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= lineOptions.maxLineLength) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }
  return limitLines(lines, lineOptions.maxLines);
}

function wrapCjkSubtitleText(text, lineLength, maxLines) {
  if (displayLength(text) <= lineLength) {
    return text;
  }
  const lines = [];
  let remaining = text;
  while (remaining && lines.length < maxLines - 1) {
    const breakIndex = chooseLineBreakIndex(remaining, lineLength);
    lines.push(remaining.slice(0, breakIndex).trim());
    remaining = remaining.slice(breakIndex).trim();
  }
  if (remaining) {
    lines.push(remaining);
  }
  return limitLines(lines, maxLines);
}

function cleanSubtitleText(text) {
  return String(text ?? "")
    .replace(/(?<!\d)0{3,}(?!\d)/g, "")
    .replace(/\s+([，。！？、；：,.!?;:])/g, "$1")
    .replace(/([，。！？、；：,.!?;:]){2,}/g, collapseRepeatedPunctuation)
    .replace(/\s+/g, " ")
    .replace(/^[，。！？、；：,.!?;:\s]+/, "")
    .replace(/[，、；：,;:\s]+$/, "")
    .trim();
}

function wordsToText(words) {
  return words
    .map((word, index) => `${index === 0 ? "" : word.delimiterBefore ?? " "}${word.text}`)
    .join("")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

function parseLineOptions(args = {}) {
  return {
    maxLineLength: positiveInt(args.maxLineLength ?? args.latinLineLength, DEFAULT_LATIN_LINE_LENGTH),
    cjkLineLength: positiveInt(args.cjkLineLength, DEFAULT_CJK_LINE_LENGTH),
    maxLines: positiveInt(args.maxLines, DEFAULT_MAX_LINES),
  };
}

function normalizeLineOptions(options = {}) {
  return {
    maxLineLength: positiveInt(options.maxLineLength, DEFAULT_LATIN_LINE_LENGTH),
    cjkLineLength: positiveInt(options.cjkLineLength, DEFAULT_CJK_LINE_LENGTH),
    maxLines: positiveInt(options.maxLines, DEFAULT_MAX_LINES),
  };
}

function maxCueCharacters(text, options = {}) {
  const lineOptions = normalizeLineOptions(options);
  const lineLength = containsCjk(text) ? lineOptions.cjkLineLength : lineOptions.maxLineLength;
  return lineLength * lineOptions.maxLines;
}

function chooseLineBreakIndex(text, maxLineLength) {
  const textLength = displayLength(text);
  return chooseBreakIndex(text, {
    maxChars: maxLineLength,
    minChars: Math.max(4, textLength - maxLineLength),
    targetChars: Math.floor(textLength * 0.48),
  });
}

function chooseChunkBreakIndex(text, maxChars) {
  return chooseBreakIndex(text, {
    maxChars,
    minChars: Math.max(6, Math.floor(maxChars * 0.55)),
    targetChars: Math.floor(maxChars * 0.9),
  });
}

function chooseBreakIndex(text, { maxChars, minChars, targetChars }) {
  const chars = [...text];
  const maxIndex = indexAtDisplayLength(chars, maxChars);
  const minIndex = indexAtDisplayLength(chars, minChars);
  const targetIndex = indexAtDisplayLength(chars, targetChars);
  const candidates = [];
  for (let index = minIndex; index <= maxIndex; index += 1) {
    if (isStrongBreakAfter(chars[index - 1])) {
      candidates.push({ index, priority: 0 });
    } else if (isWeakBreakAfter(chars[index - 1]) || isSafeBreakBefore(chars[index])) {
      candidates.push({ index, priority: 1 });
    } else if (isAsciiBoundary(chars[index - 1], chars[index])) {
      candidates.push({ index, priority: 2 });
    }
  }
  if (!candidates.length) {
    return Math.max(1, maxIndex);
  }
  candidates.sort((left, right) => left.priority - right.priority || Math.abs(left.index - targetIndex) - Math.abs(right.index - targetIndex));
  return candidates[0].index;
}

function indexAtDisplayLength(chars, length) {
  let width = 0;
  for (let index = 0; index < chars.length; index += 1) {
    width += chars[index] === " " ? 0 : 1;
    if (width >= length) {
      return index + 1;
    }
  }
  return chars.length;
}

function displayLength(text) {
  return [...String(text ?? "")].filter((char) => char !== " " && char !== "\n").length;
}

function containsCjk(text) {
  for (const char of String(text ?? "")) {
    const code = char.codePointAt(0);
    if ((code >= 0x3400 && code <= 0x9fff) || (code >= 0x3040 && code <= 0x30ff) || (code >= 0xac00 && code <= 0xd7af)) {
      return true;
    }
  }
  return false;
}

function isStrongBreakAfter(char) {
  return "。！？!?；;".includes(char ?? "");
}

function isWeakBreakAfter(char) {
  return "，、：:,，".includes(char ?? "");
}

function isSafeBreakBefore(char) {
  return "（([《“‘".includes(char ?? "");
}

function isAsciiBoundary(before, after) {
  if (!before || !after) {
    return false;
  }
  return before === " " || after === " " || (isAscii(before) !== isAscii(after));
}

function isAscii(char) {
  return Boolean(char) && char.codePointAt(0) <= 0x7f;
}

function formatSrtTimestamp(seconds) {
  const totalMs = Math.max(0, Math.round((Number.isFinite(seconds) ? seconds : 0) * 1000));
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function formatVttTimestamp(seconds) {
  return formatSrtTimestamp(seconds).replace(",", ".");
}

function parseSrtTimestamp(value) {
  const normalized = String(value).trim().replace(",", ".");
  const [hoursText = "0", minutesText = "0", secondsText = "0"] = normalized.split(":");
  const [wholeSecondsText = "0", fractionText = "0"] = secondsText.split(".");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const wholeSeconds = Number(wholeSecondsText);
  const milliseconds = Number(fractionText.padEnd(3, "0").slice(0, 3));
  const seconds = (hours * 60 + minutes) * 60 + wholeSeconds + milliseconds / 1000;
  return Number.isFinite(seconds) ? seconds : undefined;
}

function srtTimestampToAssTimestamp(value) {
  const normalized = String(value).trim().replace(",", ".");
  const [hoursText = "0", minutesText = "0", secondsText = "0"] = normalized.split(":");
  const [wholeSecondsText = "0", fractionText = "0"] = secondsText.split(".");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const wholeSeconds = Number(wholeSecondsText);
  const milliseconds = Number(fractionText.padEnd(3, "0").slice(0, 3));
  const totalCentiseconds = Math.round((((hours * 60 + minutes) * 60 + wholeSeconds) * 100) + (milliseconds / 10));
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutesOut = totalMinutes % 60;
  const hoursOut = Math.floor(totalMinutes / 60);
  return `${hoursOut}:${String(minutesOut).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function escapeAssText(text) {
  return String(text ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("\n", "\\N");
}

async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(750 * attempt);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function parseJsonObject(content) {
  if (!content) {
    throw new Error("LLM response content was empty.");
  }
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const repaired = repairCommonJsonIssues(trimmed);
    if (repaired !== trimmed) {
      try {
        return JSON.parse(repaired);
      } catch {
        // Try object extraction next.
      }
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const extracted = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(extracted);
      } catch {
        return JSON.parse(repairCommonJsonIssues(extracted));
      }
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse LLM JSON response: ${message}: ${content}`);
  }
}

function repairCommonJsonIssues(content) {
  return content
    .replace(/\\[ \t]*\n[ \t]*/g, "\\n")
    .replace(/([{,]\s*)(items|index|text)\s*:/g, '$1"$2":')
    .replace(/,\s*([}\]])/g, "$1");
}

function getOoLlmConfig(args) {
  const config = JSON.parse(execFileSync("oo", ["llm", "config", "--json"], { encoding: "utf8" }));
  return {
    apiKey: config.apiKey,
    baseUrl: args.baseUrl ?? config.baseUrl,
    model: args.model ?? config.model,
    temperature: args.temperature ?? 0.2,
    thinking: args.thinking ?? config.thinking,
    reasoningEffort: args.reasoningEffort ?? config.reasoningEffort,
  };
}

function withOptionalThinking(body, { thinking, reasoningEffort }) {
  if (thinking) {
    body.thinking = { type: thinking };
  }
  if (reasoningEffort) {
    body.reasoning_effort = reasoningEffort;
  }
  return body;
}

function normalizeExistingItems(cues, existingItems) {
  const wanted = new Set(cues.map((cue) => Number(cue.index)));
  const byIndex = new Map();
  for (const item of existingItems ?? []) {
    const index = Number(item.index);
    const text = cleanSubtitleText(item.text);
    if (wanted.has(index) && text) {
      byIndex.set(index, { index, text });
    }
  }
  return [...byIndex.values()];
}

function orderedTranslationItems(cues, translatedByIndex) {
  return cues.map((cue) => translatedByIndex.get(Number(cue.index))).filter(Boolean);
}

function serializeCues(cues) {
  return cues.map((cue) => ({ index: cue.index, text: cue.text }));
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      continue;
    }
    const key = toCamel(arg.slice(2));
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function parseFormats(value) {
  const raw = String(value ?? "srt").trim().toLowerCase();
  if (raw === "all") {
    return ["srt", "vtt"];
  }
  const formats = raw.split(",").map((format) => format.trim() === "webvtt" ? "vtt" : format.trim()).filter(Boolean);
  for (const format of formats) {
    if (!["srt", "vtt"].includes(format)) {
      throw new Error(`Unsupported subtitle format: ${format}`);
    }
  }
  return [...new Set(formats.length ? formats : ["srt"])];
}

function parseJsonOption(value, fallback) {
  if (!value) {
    return fallback;
  }
  return JSON.parse(value);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function requireArg(args, name) {
  if (!args[name]) {
    throw new Error(`Missing required --${name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`);
  }
  return args[name];
}

function numericTime(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function positiveInt(value, fallback) {
  const number = Math.floor(Number(value ?? fallback));
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function nonNegativeInt(value, fallback) {
  const number = Math.floor(Number(value ?? fallback));
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function nonNegativeNumber(value, fallback) {
  const number = Number(value ?? fallback);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeThinking(value) {
  if (value === true || value === "true" || value === "enabled") {
    return "enabled";
  }
  if (value === false || value === "false" || value === "disabled") {
    return "disabled";
  }
  return undefined;
}

function inferTargetCode(targetLanguage) {
  const normalized = String(targetLanguage).toLowerCase();
  if (normalized.includes("chinese") || normalized.includes("mandarin") || normalized.includes("中文")) {
    return "zh";
  }
  if (normalized.includes("english")) {
    return "en";
  }
  if (normalized.includes("spanish")) {
    return "es";
  }
  if (normalized.includes("japanese")) {
    return "ja";
  }
  return "translated";
}

function collapseRepeatedPunctuation(match) {
  const chars = [...match];
  return chars.find((char) => /[！？!?]/.test(char)) ?? chars.at(-1) ?? "";
}

function limitLines(lines, maxLines = 2) {
  if (lines.length <= maxLines) {
    return lines.join("\n");
  }
  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1]} ${lines.slice(maxLines).join(" ")}`.trim();
  return visible.join("\n");
}

function splitEvery(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

function dirnameFallback(path) {
  return path.includes("/") ? path.slice(0, path.lastIndexOf("/")) || "." : ".";
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printUsage() {
  console.log(`Usage:
  node scripts/subtitle-tools.mjs fusion-to-subtitles --input transcript.json --out-dir outputs/subtitles --formats srt,vtt
  node scripts/subtitle-tools.mjs translate-srt --input transcript.srt --out-dir outputs/subtitles --target-language "Simplified Chinese" --target-code zh
  node scripts/subtitle-tools.mjs prepare-display-srt --input translation.zh.srt --out-dir outputs/subtitles --cjk-line-length 18
  node scripts/subtitle-tools.mjs srt-to-burn-ass --input translation.zh.srt --out-dir outputs/subtitles --video-width 1920 --video-height 1080

Commands:
  fusion-to-subtitles  Convert Fusion API ASR JSON into transcript.txt, transcript.srt, and word-timed SRT/VTT.
  translate-srt        Translate SRT cue text with oo llm config while preserving cue indexes and timestamps.
  prepare-display-srt  Reflow SRT cues for display, using CJK-aware line length and two-line limits.
  srt-to-burn-ass      Convert display SRT into bottom-centered ASS for soft ASS or burned-in subtitles.

Common options:
  --formats srt|vtt|all
  --max-line-length 37
  --cjk-line-length 18
  --max-lines 2

Burn-in ASS options:
  --video-width 1920
  --video-height 1080
  --font-name "PingFang SC"
  --font-size 56
  --margin-v 38
  --margin-l 80
  --margin-r 80
  --outline 5

Translation options:
  --source-language auto
  --target-language "Simplified Chinese"
  --target-code zh
  --batch-size 30
  --context-window 8
  --profile film_tv
  --domain "scripted dialogue"
  --audience "adult streaming viewers"
  --style-notes "Natural spoken Chinese subtitles"
  --glossary-json '[{"source":"agent","target":"智能体"}]'
  --video-context-json '{"title":"Episode 1"}'
`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
