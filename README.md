# Open Matchday -- sports

Sport packages: rules, variants, field geometry, formations, animations, scoreboards, fixtures, and tests.

Part of the [OpenMatchday](https://github.com/OpenMatchday) organization.

## Schema (v0.1.0)

Declarative package layout and JSON Schema 2020-12 validation. See [docs/package-schema.md](docs/package-schema.md).

```bash
npm ci
npm run check
npm run validate
npm test
```

Shipped sport content packages live under `packages/` (basketball: OM-021; futsal: OM-022). Schema fixtures live under `fixtures/packages/`.

Basketball variants: `fiba`, `nba`, `ncaa`, `youth`. Citations: `packages/basketball/docs/SOURCES.md`.

Futsal variants: `fifa`, `youth`. Citations: `packages/futsal/docs/SOURCES.md`.

Exceptional executable modules require the static allowlist `exceptional-modules.allowlist.json`. Remote eval is rejected.

## License

MIT. See [LICENSE](LICENSE).
