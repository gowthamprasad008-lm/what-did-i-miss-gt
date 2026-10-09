# What Did I Miss?

A small app for **The Unread Problem**: paste a long, unread group chat and instantly see what matters to you, **without your messages ever leaving your device**.

**Live demo:** _add your published link here_

## The problem
Coming back to hundreds of unread messages, it is easy to miss the one that mentions you, a deadline, or a decision. Cloud summarizers solve this by uploading private conversations.

## What it does
Paste a chat (or upload a `.txt` export), enter your name, and click **Analyze**. You get:

- A short summary with message count, people, High-priority count, and time span
- **Mentions of you**
- **Deadlines**
- **Decisions**
- **Action items**
- A **priority tag with a score** on every item (High, Medium, Low)

## Local-first by design
- All parsing and analysis run in the browser.
- No backend, no database, no accounts, no AI API calls.
- Chat text is not stored (no cookies or browser storage).
- The page is configured with a Content-Security-Policy intended to block outgoing network requests.
- Demo proof: load the page, turn Wi-Fi off, and click Analyze. It still works.

## How it works

```
Chat text -> Parser -> Analyzer (rules + scoring) -> Summary builder -> Results UI
```

| Module | Role |
|---|---|
| `lib/parse-chat.ts` | Turns chat text into `{ sender, time, text }` messages. Supports `[HH:MM] Name: message` and WhatsApp exports (`DD/MM/YYYY, HH:MM - Name: message`). Multi-line messages are merged; system lines are skipped. |
| `lib/rules.ts` | All keyword lists and point values in one place. |
| `lib/analyze-chat.ts` | Scores each message, assigns priority, fills the four sections, and builds the summary text from a template. |
| `lib/sample-chat.ts` | Sample chat for trying the app. |

### Scoring (explainable, no AI model)

| Signal | Points |
|---|---|
| Your name or @name | +3 |
| Deadline word, date, or time (for example "EOD", "Friday", "3pm", "15:00") | +3 |
| Decision word (for example "final decision", "agreed", "postponed") | +3 |
| Question or request ("can you", "please", ...) | +2 |
| In the last 25% of messages | +1 |

**High** = 5 or more, **Medium** = 3 to 4, **Low** = below 3. A message can appear in more than one section.

## Limits
- Keyword rules can miss unusual phrasing or over-match (for example, one notice can appear in several sections).
- Two chat line formats are supported; other export formats are untested.
- A local language model for richer summaries is a natural next step.

## Built with AI
The UI and code were generated with **v0**, with planning and prompt drafting in **Claude**. The full, honest record of prompts, problems found, and fixes is in [`prompt.md`](./prompt.md).
