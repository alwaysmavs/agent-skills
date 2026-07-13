# OOMOL Runtime

Use this path when `oo --version` succeeds, or when no native image tool is
available and the user accepts guided OOMOL setup. OOMOL supplies the hosted GPT
Image 2 execution, reference-image upload, resumable session, polling, and
artifact download.

## Prepare once

If `oo` is missing, use the official installer for the current platform, then
repeat `oo --version`:

```bash
curl -fsSL https://cli.oomol.com/install.sh | bash
```

```powershell
irm https://cli.oomol.com/install.ps1 | iex
```

```cmd
curl -fsSL https://cli.oomol.com/install.cmd -o install.cmd && install.cmd && del install.cmd
```

If the installer changes `PATH`, start a fresh shell before retrying. Treat the
[official install guide](https://cli.oomol.com/install-guide.md) as the source
of truth.

Check authentication:

```bash
oo auth status --json
```

If the active credential is missing or invalid, run `oo auth login`, let the
user complete the secure login, and repeat the status check. Never request an
OpenAI API key or expose OOMOL credentials in prompts, files, logs, shell
history, or source control.

Ensure the companion skill is installed:

```bash
oo skills install "@zjxuyunshi/gpt-image-2" -s "gpt-image-2"
```

Locate its actual installed directory and confirm that it contains the plain
JavaScript entrypoint `scripts/run_image.js`. No `.mjs` file is required. Check
the runner without submitting a paid image job:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" --help
```

After setup succeeds, resume the original creative request without asking the
user to repeat it.

## Run GPT Image 2

Save outputs to a dated directory outside an unrelated repository unless the
user chooses another destination. Use PNG and high quality for final art.

Text-to-image:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --mode generate --prompt-file "<brief-file>" \
  --out-dir "<output-directory>" --name "<descriptive-name>" \
  --model "gpt-image-2" --output-format "png" --quality "high" \
  --size "<supported-size>" --initial-poll-delay-ms 30000 \
  --poll-interval-ms 10000 --poll-timeout-ms 720000
```

Reference-guided editing:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --mode edit --prompt-file "<brief-file>" \
  --image "<primary-subject-image>" \
  --out-dir "<output-directory>" --name "<descriptive-name>" \
  --model "gpt-image-2" --output-format "png" --quality "high" \
  --size "<supported-size>" --initial-poll-delay-ms 30000 \
  --poll-interval-ms 10000 --poll-timeout-ms 720000
```

Use the same runner with local `node` only if the `oo` JavaScript runtime path
is unavailable. Do not switch models or connectors as an unannounced fallback.

## Poll and resume

Before submitting, tell the user only that generation usually takes a few
minutes and may occasionally take longer; the finished image will be returned
without further action from them. If processing continues beyond about three
minutes, send at most one brief progress update.

The runner submits once, saves `<name>.session.json`, waits 30 seconds, then
polls the same session every 10 seconds for up to 12 minutes. Renewed processing
or a progress restart during that window is still the same job. Do not expose
backend retry details, reset the user-facing expectation, or submit a duplicate
job. Stop only on success, exhausted terminal failure, or the bounded timeout.

Resume an interrupted job instead of resubmitting:

```bash
BUN_BE_BUN=1 oo "<gpt-image-2-skill-dir>/scripts/run_image.js" \
  --session-file "<output-directory>/<name>.session.json" \
  --poll-interval-ms 10000 --poll-timeout-ms 720000
```

On success, require `ok: true`. Read downloaded images from `local_paths`,
corresponding remote results from `remote_urls`, and recovery data from
`session_id` and `session_file`. Preview or attach every result and report the
actual saved path.

## Fail safely

- For auth, billing, permission, upload, schema, or inaccessible-source errors,
  report the exact blocker; do not silently switch providers or resubmit.
- On a local polling interruption or timeout, resume the saved session first.
- On `not_found`, stop and ask before creating a new paid job.
- Do not treat an in-progress status or renewed processing as a failed task.
