# Translation options

## Profiles

| Profile | Use for |
| --- | --- |
| `general` | Any content without a clear specialized style |
| `film_tv` | Scripted dialogue, films, television, sitcoms, and streaming shows |
| `youtube_explainer` | Creator explainers, reviews, tutorials, and product walkthroughs |
| `technical_course` | Coding, APIs, academic talks, and terminology-heavy courses |
| `interview_podcast` | Interviews, panels, podcasts, and conversational long-form audio |
| `news_documentary` | News, factual narration, and documentaries |
| `business_training` | Corporate, sales, compliance, and onboarding material |
| `gaming_stream` | Game streams, esports, memes, and live reactions |
| `kids_content` | Children's content needing simple, friendly wording |

## Context options

Pass only information that helps preserve meaning and consistency:

```bash
--domain "AI developer tools" \
--audience "software developers" \
--style-notes "Natural, accurate subtitles; preserve product names." \
--glossary-json '[{"source":"tool calling","target":"工具调用"}]' \
--video-context-json '{"title":"Building an AI agent","speaker_notes":"One casual instructor"}'
```

The translation command preserves cue times and indexes. It may reattempt invalid provider responses with smaller batches. Do not edit the checkpoint while a translation command is running. Rerunning the same command resumes valid cue translations from `translation.<target-code>.json`.

## Quality checks

Before delivery, confirm that the translated SRT has the same number of cues as the source, that no cue is empty, and that names, numbers, terms, and glossary entries are consistent. If the user requests strict Chinese subtitle limits, use `--cjk-line-length 16` before producing ASS or video output.
