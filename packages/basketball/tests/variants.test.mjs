import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const REQUIRED_VARIANTS = ["fiba", "nba", "ncaa", "youth"]

const readJson = (rel) =>
  JSON.parse(readFileSync(join(pkgRoot, rel), "utf8"))

describe("basketball package AC-6.3", () => {
  it("manifest lists FIBA, NBA, NCAA, youth and is non-fiction", () => {
    const manifest = readJson("manifest.json")
    assert.equal(manifest.id, "basketball")
    assert.equal(manifest.fiction, false)
    assert.deepEqual([...manifest.variants].sort(), [...REQUIRED_VARIANTS].sort())
  })

  it("each variant cites official_source and effective_date", () => {
    for (const id of REQUIRED_VARIANTS) {
      const variant = readJson(`variants/${id}.json`)
      assert.equal(variant.id, id)
      assert.equal(variant.fiction, false)
      assert.ok(variant.effective_date)
      assert.ok(variant.official_source.title)
      assert.match(variant.official_source.url, /^https:\/\//)
      assert.ok(variant.official_source.retrieved_on)
      assert.ok(variant.official_source.version_label)
    }
  })

  it("each variant has matching rules with cited clock and scoring shape", () => {
    const expectations = {
      fiba: {
        period_duration_ms: 600000,
        shot_clock_ms: 24000,
        periods: 4,
        label: "quarter",
      },
      nba: {
        period_duration_ms: 720000,
        shot_clock_ms: 24000,
        periods: 4,
        label: "period",
      },
      ncaa: {
        period_duration_ms: 1200000,
        shot_clock_ms: 30000,
        periods: 2,
        label: "half",
      },
      youth: {
        period_duration_ms: 600000,
        shot_clock_ms: null,
        periods: 4,
        label: "quarter",
      },
    }

    for (const id of REQUIRED_VARIANTS) {
      const rules = readJson(`rules/${id}.json`)
      const expected = expectations[id]
      assert.equal(rules.variant_id, id)
      assert.equal(rules.clock.period_duration_ms, expected.period_duration_ms)
      assert.equal(rules.clock.shot_clock_ms, expected.shot_clock_ms)
      assert.equal(rules.periods.count, expected.periods)
      assert.equal(rules.periods.label, expected.label)
      assert.deepEqual(rules.scoring.allowed_point_values, [1, 2, 3])
      assert.ok(rules.invariants.length >= 1)
    }
  })

  it("variant and rules file sets match manifest", () => {
    const manifest = readJson("manifest.json")
    const variantFiles = readdirSync(join(pkgRoot, "variants"))
      .filter((n) => n.endsWith(".json"))
      .map((n) => n.replace(/\.json$/, ""))
      .sort()
    const ruleFiles = readdirSync(join(pkgRoot, "rules"))
      .filter((n) => n.endsWith(".json"))
      .map((n) => n.replace(/\.json$/, ""))
      .sort()
    assert.deepEqual(variantFiles, [...manifest.variants].sort())
    assert.deepEqual(ruleFiles, [...manifest.variants].sort())
  })

  it("fixtures are marked fiction", () => {
    const fixture = readJson("fixtures/sample_event.json")
    assert.equal(fixture.fiction, true)
  })

  it("FIBA field geometry matches Art. 2 court size", () => {
    const field = readJson("field.json")
    assert.equal(field.units, "m")
    assert.equal(field.length, 28)
    assert.equal(field.width, 15)
    assert.equal(field.surface, "court")
  })

  it("roster enforces five on court with FIBA bench ceiling", () => {
    const roster = readJson("roster.json")
    assert.equal(roster.limits.on_field_min, 5)
    assert.equal(roster.limits.on_field_max, 5)
    assert.equal(roster.limits.bench_max, 7)
    assert.equal(roster.positions.length, 5)
  })
})
