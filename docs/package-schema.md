# Sport package schema (v0.1.0)

Sources: PROJECT_SPEC AC-6.1 and AC-6.2; [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema); [SemVer](https://semver.org/).

## Layout

Each sport package (under `packages/<id>/` or validation fixtures) must contain:

| Path | Role |
|---|---|
| `manifest.json` | Package id, SemVer, fiction flag, variant ids, exceptional modules |
| `variants/*.json` | Official source, jurisdiction, effective date per variant |
| `rules/*.json` | Declarative clock/scoring/period rules per variant |
| `roster.json` | Positions and roster limits |
| `field.json` | Court or pitch geometry |
| `formations.json` | Normalized lineup slots |
| `animations.json` | Declarative clips including reduced-motion |
| `scoreboards.json` | Scoreboard field map |
| `assets/manifest.json` | Asset index (may be empty) |
| `locales/*.json` | Locale strings (must include `default_locale`) |
| `docs/` | Human docs |
| `fixtures/` | Event fixtures with `fiction` marker |
| `tests/` | Package tests |

Schemas live in `schemas/v0/` and are listed in `schemas/catalog.json`.

## Exceptional modules (AC-6.2)

- Declarative JSON is schema-validated; no executable logic in schemas.
- Executable modules are allowed only when listed in both:
  1. repo-root `exceptional-modules.allowlist.json` (static reviewed allowlist)
  2. the package `manifest.json` `exceptional_modules` array
- Code under `tests/` does not need allowlist entries.
- Remote or dynamic eval is forbidden everywhere in a package (`eval`, `Function`, URL `import()`, `vm.run*`, fetch-then-eval).

## Commands

```bash
npm ci
npm run check
npm run validate
npm test
```

Basketball and futsal content packages are out of scope for OM-020 (see OM-021, OM-022).
