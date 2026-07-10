# Video Subtitle Translator

**言語：** [English](README.md) | [简体中文](README.zh-CN.md) | 日本語

**リポジトリ：** [All skills](../../README.md) | [すべてのスキル（簡体中文）](../../README.zh-CN.md)

**どんな動画にも自然で読みやすい字幕を付け、視聴者に合った形式で書き出します。**

`video-subtitle-translator` は、[oo CLI ベース](https://oomol.com) の Agent Skill です。ローカル音声・動画をタイミング付きキャプション、翻訳済み字幕ファイル、字幕焼き込み MP4、または選択可能な字幕トラック付き動画に変換します。Alibaba Qwen ASR による文字起こしと決定的な字幕処理を組み合わせ、単なるテキストの書き起こしではなく、そのまま配信できる字幕・動画を出力します。

## 多言語デモを見る

以下の各バージョンは同じ英語音声の元動画を使用していますが、字幕言語ごとに専用の焼き込み動画を用意しています。各プレビューと完全版 MP4 は、必ず同じ字幕言語に対応しています。

### 英語字幕

![英語字幕付き Test Video](examples/test-video-en-preview.gif)

[英語字幕版の完全な動画をダウンロードまたは再生](examples/test-video-en-burned.mp4)。

### 簡体字中国語字幕

![簡体字中国語字幕付き Test Video](examples/test-video-zh-preview.gif)

[簡体字中国語字幕版の完全な動画をダウンロードまたは再生](examples/test-video-zh-burned.mp4)。

### 日本語字幕

![日本語字幕付き Test Video](examples/test-video-ja-preview.gif)

[日本語字幕版の完全な動画をダウンロードまたは再生](examples/test-video-ja-burned.mp4)。

## 主な機能

### 1. Alibaba Qwen ASR による単語単位のタイムスタンプ付き文字起こし

skill は、正規化した音声を oo CLI 経由でアップロードし、Fusion API から **Alibaba Qwen ASR FileTrans** に送信します。結果にはプレーンテキストだけでなく、文単位・単語単位のタイムスタンプが含まれます。このタイミング情報により、話者の発話に正確に追従する字幕を作成できます。

### 2. 文字起こしから読みやすい SRT 字幕を作成

組み込みの変換ツールが、タイムスタンプ付きの単語を画面で読みやすい字幕キューにまとめます。無音区間、表示時間、文字数、単語数を考慮し、ポータブルな SRT を出力します。必要に応じて VTT も作成でき、元の文字起こしと単語タイミング付き字幕は確認用に保持されます。

### 3. タイミングを維持したまま翻訳

翻訳が必要な場合、設定済みの OO LLM は各字幕のテキストのみを翻訳し、すべての字幕番号とタイムスタンプを維持します。長い動画でも、完了済みバッチをチェックポイントに保存して再開できます。用語集、分野、想定視聴者、スタイルの指定により、名称や専門用語を一貫させられます。

### 4. 視聴者がそのまま使える形式で出力

- **字幕焼き込み MP4：** 字幕を常時表示するため、SNS、モバイル再生、アップロード後も確実に字幕を表示したい場合に適しています。
- **ソフト字幕 MKV：** 動画を再エンコードせず、オン／オフ可能で編集しやすい字幕トラックを提供します。
- **SRT、VTT、ASS：** 編集ソフト、プレーヤー、独立した字幕アセットが必要なワークフロー向けのファイルです。
- **CJK 向けレイアウト：** 中国語、日本語、韓国語は、英語の文字数前提を使わず、読みやすい 2 行表示向けに整形します。

## 対応言語

Alibaba Qwen ASR は自動言語認識と明示的な言語指定に対応しています。現在のワークフローでは、中国語、広東語、英語、日本語、韓国語、ドイツ語、フランス語、スペイン語、ポルトガル語、イタリア語、アラビア語、ロシア語、ヒンディー語、インドネシア語、タイ語、トルコ語、ベトナム語のほか、多くのヨーロッパ言語・東南アジア言語を扱えます。翻訳先の言語は設定済みの OO LLM によって提供されるため、同じワークフローで多言語の視聴者に向けた字幕を作成できます。

## 出力形式の選び方

| ニーズ | 推奨する出力 |
| --- | --- |
| 字幕を常に表示したい | 字幕焼き込み MP4 |
| 視聴者に字幕を切り替えてほしい | ソフト字幕 MKV |
| 編集ソフトやプラットフォームで別字幕ファイルが必要 | SRT または VTT |
| フォント、縁取り、位置を一貫させたい | ASS 外部字幕または ASS 付き MKV |

## Agent に追加する

ターミナルコマンドは不要です。次の依頼を Agent にコピーしてください。

```text
https://github.com/alwaysmavs/agent-skills の video-subtitle-translator skill を、現在使用している Agent の skills ディレクトリにインストールしてください。SKILL.md の指示に従い、Node.js 18+、FFmpeg/FFprobe、Fusion ASR と OO LLM を利用できる認証済みの oo CLI が使用可能か確認してください。不足があれば必要な設定を具体的に案内し、準備ができていればこの skill を利用できることを確認してください。
```

Agent 向けの実装説明、環境要件、コマンド、データ処理、復旧手順は [SKILL.md](SKILL.md) を参照してください。この skill は [oo CLI](https://oomol.com) を使用し、Node.js 18+、FFmpeg/FFprobe、Fusion API アクセス、OO LLM 設定を必要とします。

## 同梱デモアセット

| 字幕言語 | 自動再生プレビュー | 完全な字幕焼き込み動画 |
| --- | --- | --- |
| 英語 | [`test-video-en-preview.gif`](examples/test-video-en-preview.gif) | [`test-video-en-burned.mp4`](examples/test-video-en-burned.mp4) |
| 簡体字中国語 | [`test-video-zh-preview.gif`](examples/test-video-zh-preview.gif) | [`test-video-zh-burned.mp4`](examples/test-video-zh-burned.mp4) |
| 日本語 | [`test-video-ja-preview.gif`](examples/test-video-ja-preview.gif) | [`test-video-ja-burned.mp4`](examples/test-video-ja-burned.mp4) |

すべての動画は 2 分 46 秒で、字幕が恒久的に焼き込まれています。デモは生成結果を紹介する目的のみに使用します。元の文字起こし、API キー、アップロード済みメディア URL、中間ジョブデータはコミットしていません。
