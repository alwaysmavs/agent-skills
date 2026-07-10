# Agent Skills

**言語：** [English](README.md) | [简体中文](README.zh-CN.md) | 日本語

画像生成、動画制作、字幕、オートメーションなど、実用的な SaaS ワークフローのための再利用可能な Agent Skill 集です。

各 skill は、オープンな [`SKILL.md`](https://agentskills.io/specification) 形式に基づく自己完結型のディレクトリです。必要なディレクトリを、プロジェクト内の `.agents/skills/` や個人用の `~/.agents/skills/` など、対応する skills ディレクトリへコピーまたはシンボリックリンクしてください。

## 注目のスキル：Video Subtitle Translator

ローカルの音声・動画からタイミング付き字幕を作成し、SRT/VTT/ASS、字幕を焼き込んだ MP4、または選択可能な字幕トラック付き動画として出力します。

![日本語字幕焼き込みプレビュー](skills/video-subtitle-translator/examples/test-video-ja-preview.gif)

上のプレビューは、同梱の [**Test Video 日本語字幕版**](skills/video-subtitle-translator/examples/test-video-ja-burned.mp4) です。英語音声を文字起こしして日本語へ翻訳し、その日本語字幕を専用の動画ファイルに焼き込んでいます。skill のページでは、[英語・簡体字中国語・日本語の字幕デモ](skills/video-subtitle-translator/README.ja.md#多言語デモを見る)をそれぞれ確認できます。

| Skill | 機能 | 必要な環境 |
| --- | --- | --- |
| [`video-subtitle-translator`](skills/video-subtitle-translator/) | [oo CLI ベース](https://oomol.com)で、Alibaba Qwen ASR による文字起こし、タイミング付き字幕の生成、翻訳、CJK 向けレイアウト、ハード／ソフト字幕の出力を提供します。[English](skills/video-subtitle-translator/README.md) · [简体中文](skills/video-subtitle-translator/README.zh-CN.md) · [日本語](skills/video-subtitle-translator/README.ja.md) | Node.js 18+、FFmpeg、[oo CLI](https://oomol.com)、Fusion ASR、OO LLM アクセス |

ワークフロー、対応形式、言語、出力方法については、[English](skills/video-subtitle-translator/README.md)、[简体中文](skills/video-subtitle-translator/README.zh-CN.md)、または[日本語の説明](skills/video-subtitle-translator/README.ja.md)を参照してください。

## Agent にこの skill を追加する

ターミナルコマンドを覚える必要はありません。次の依頼をそのまま Agent にコピーしてください。

```text
https://github.com/alwaysmavs/agent-skills の video-subtitle-translator skill を、現在使用している Agent の skills ディレクトリにインストールしてください。SKILL.md の指示に従い、Node.js 18+、FFmpeg/FFprobe、Fusion ASR と OO LLM を利用できる認証済みの oo CLI が使用可能か確認してください。不足があれば必要な設定を具体的に案内し、準備ができていればこの skill を利用できることを確認してください。
```

この skill は [oo CLI ベース](https://oomol.com)です。Agent 向けの前提条件、データ処理、ワークフロー、出力規約は `SKILL.md` に記載されています。

## コントリビュート

各 skill は 1 つの明確な仕事に焦点を当て、自己完結型で、実行前に安全に確認できる状態にしてください。信頼性を高める場合にのみ決定的なスクリプトを追加し、外部依存関係とデータフローを文書化し、決定的なロジックには実行可能なテストを含めてください。

## ライセンス

このリポジトリは [MIT License](LICENSE) のもとで公開されています。
