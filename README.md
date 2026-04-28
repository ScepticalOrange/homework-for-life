# Homework for Life

Obsidian plugin for low-friction daily story-capture, inspired by Matthew Dicks' [*Homework for Life*](https://matthewdicks.com/homeworkforlife/) method: every day, write down the moment(s) that made the day what it was. The plugin appends them to a single monthly markdown file — no dashboards, no streaks, no analytics. The method works because of the writing and the later re-reading; the plugin just removes friction from the writing.

## Features

- **One ribbon click / command / URI → modal → done.** Multi-line textarea, one moment per line.
- **Multiple captures per day** are merged into the same day's row/heading; multiple moments at once are split by line.
- **Two output formats**, switchable per vault:
  - **Table** (closest to Dicks' original spreadsheet) — `| [[2026-04-28]] | moment a<br>moment b |`
  - **Headings + bullets** — `## [[2026-04-28]]` followed by `- moment a` etc.
- **Date is always a `[[YYYY-MM-DD]]` wikilink**, so it auto-resolves to the matching daily note if you use one.
- **Format-aware**: existing files keep their format even if you change the global setting; only new files use the current setting.
- **Mobile-friendly** via the URI scheme `obsidian://hfl-capture` — pair with iOS Shortcuts or Android Tasker for a daily reminder that drops you straight into the modal.

## Install

Until this is in the community plugin store:

1. Build the plugin: `npm install && npm run install:prod` (writes to a hard-coded vault path; edit `package.json` to your own path)
2. Or copy `manifest.json`, `main.js`, and `styles.css` from a release into `<vault>/.obsidian/plugins/hfl/`
3. Enable in Obsidian → Settings → Community plugins

## Settings

| Setting | Default | What it does |
|---|---|---|
| Folder | `HfL` | Where the monthly files are stored |
| Filename pattern | `YYYY-MM` | Tokens: `YYYY`, `MM`, `Q` (quarter). Use `YYYY-Q` for quarterly files. |
| Append position | `top` | Whether new days appear at the top or bottom of the file |
| Output format | `table` | `table` or `headings` for *new* files |
| Multi-moment style | `br` | Table-only: `<br>` separator, or `<br>• ` with bullet markers |

## Reminder setup (recommended)

Plugins can't push reliable mobile notifications. Use OS-native reminders:

- **iOS:** Shortcuts app → Automation → Time of Day → Open URL `obsidian://hfl-capture`
- **Android:** Tasker / Automate → daily intent on the same URI
- **Desktop:** cron / systemd / Windows Task Scheduler → open URI

Tap the notification → modal opens → one sentence → done.

## Out of scope

- Pattern recognition / clustering / theme detection — that belongs in a separate reflection tool, not the capture layer
- Streaks, gamification, statistics — counter to Dicks' philosophy
- Daily-note frontmatter integration — keeps the data fragmented and creates overhead when the plugin isn't actively used

## License

MIT
