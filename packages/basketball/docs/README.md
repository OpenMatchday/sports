# Basketball package

Declarative basketball sport package for Open Matchday (AC-6.1, AC-6.3).

## Variants

| Id | Governing source | Effective |
|---|---|---|
| `fiba` | [FIBA Official Basketball Rules 2026 v1.1](https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2026-v1-1.pdf) | 2026-10-01 |
| `nba` | [Official NBA Playing Rules 2025-26](https://cdn.nba.com/manage/2026/01/Official-2025-26-NBA-Playing-Rules.pdf) | 2025-10-01 |
| `ncaa` | [NCAA Men's Basketball Playing Rules](https://www.ncaa.org/championships/playing-rules/mens-basketball-playing-rules/) (2025-26 book) | 2025-08-01 |
| `youth` | [FIBA-WABC Mini-Basketball Coaches Manual](https://assets.fiba.basketball/image/upload/documents-corporate-mini-basketball-mini-basketball-coaches-manual-eng.pdf) | 2016-01-01 (manual edition) |

See [SOURCES.md](SOURCES.md) for citations and geometry notes.

## Validation

From the `sports` repo root:

```bash
npm run validate
npm test
```

Fixtures under `fixtures/` are fictional only.
