import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const skillDir = dirname(testDir);
const script = join(skillDir, "scripts", "subtitle-tools.mjs");
const fixtures = join(testDir, "fixtures");

function run(...args) {
  execFileSync(process.execPath, [script, ...args], { encoding: "utf8" });
}

test("converts Fusion ASR JSON into timed SRT and VTT", () => {
  const outDir = mkdtempSync(join(tmpdir(), "subtitle-fusion-"));
  run("fusion-to-subtitles", "--input", join(fixtures, "fusion-transcript.json"), "--out-dir", outDir, "--formats", "all");

  const srt = readFileSync(join(outDir, "transcript.srt"), "utf8");
  const vtt = readFileSync(join(outDir, "transcript.word-timed.vtt"), "utf8");
  assert.match(srt, /Hello world\./);
  assert.match(srt, /This is a test\./);
  assert.match(vtt, /^WEBVTT/m);
});

test("prepares display subtitles and generates ASS at the requested resolution", () => {
  const outDir = mkdtempSync(join(tmpdir(), "subtitle-render-"));
  const display = join(outDir, "display.srt");
  const ass = join(outDir, "subtitles.ass");
  const input = join(fixtures, "input.srt");

  run("prepare-display-srt", "--input", input, "--output", display, "--cjk-line-length", "8", "--max-lines", "2");
  run("srt-to-burn-ass", "--input", display, "--output", ass, "--video-width", "1280", "--video-height", "720", "--font-name", "Noto Sans CJK SC");

  const displaySrt = readFileSync(display, "utf8");
  const assText = readFileSync(ass, "utf8");
  assert.match(displaySrt, /这是一个用于测试\n字幕显示断行的中/);
  assert.match(displaySrt, /文长句子。/);
  assert.match(assText, /PlayResX: 1280/);
  assert.match(assText, /PlayResY: 720/);
  assert.match(assText, /Dialogue:/);
});
