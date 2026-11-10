# Futsal package

Declarative futsal sport package for Open Matchday (AC-6.1, AC-6.4).

## Variants

| Id | Governing source | Effective |
|---|---|---|
| `fifa` | [FIFA Futsal Laws of the Game 2025-26](https://assets.the-afc.com/downloads/referees/Futsal---Laws-of-the-Game-2025-2026---Sep-12-update.pdf) | 2025-09-05 |
| `youth` | Same Laws PDF Notes (youth organisational modifications) | 2025-09-05 |

See [SOURCES.md](SOURCES.md) for citations and geometry notes.

## Validation

From the `sports` repo root:

```bash
npm run validate
npm test
```

Fixtures under `fixtures/` are fictional only.
