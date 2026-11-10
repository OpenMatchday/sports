import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const REQUIRED_VARIANTS = ["fifa", "youth"]

const readJson = (rel) =>
  JSON.parse(readFileSync(join(pkgRoot, rel), "utf8"))

describe("futsal package AC-6.4", () => {
  it("manifest lists FIFA Laws and youth and is non-fiction", () => {
    const manifest = readJson("manifest.json")
    assert.equal(manifest.id, "futsal")
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
      assert.match(variant.official_source.title, /FIFA/i)
      assert.match(variant.official_source.title, /Futsal Laws of the Game/i)
    }
  })

  it("each variant has matching rules with cited clock and scoring shape", () => {
    const expectations = {
      fifa: {
        period_duration_ms: 1200000,
        shot_clock_ms: null,
        periods: 2,
        label: "half",
        overtime_allowed: true,
      },
      youth: {
        period_duration_ms: 1200000,
        shot_clock_ms: null,
        periods: 2,
        label: "half",
        overtime_allowed: true,
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
      assert.equal(rules.periods.overtime_allowed, expected.overtime_allowed)
      assert.equal(rules.scoring.unit, "goals")
      assert.deepEqual(rules.scoring.allowed_point_values, [1])
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

  it("FIFA field geometry uses Law 1 international minimum pitch", () => {
    const field = readJson("field.json")
    assert.equal(field.units, "m")
    assert.equal(field.surface, "pitch")
    assert.equal(field.length, 38)
    assert.equal(field.width, 20)
    const center = field.markings.find((m) => m.id === "center_circle")
    assert.equal(center.geometry.radius, 3)
    const homeGoal = field.markings.find((m) => m.id === "home_goal")
    assert.deepEqual(homeGoal.geometry.points, [
      [0, 8.5],
      [0, 11.5],
    ])
  })

  it("roster enforces Law 3 player limits", () => {
    const roster = readJson("roster.json")
    assert.equal(roster.limits.on_field_min, 3)
    assert.equal(roster.limits.on_field_max, 5)
    assert.equal(roster.limits.bench_max, 9)
    assert.ok(roster.positions.some((p) => p.id === "goalkeeper"))
    assert.equal(roster.positions.length, 5)
  })

  it("youth invariants cite organisational modification Notes", () => {
    const rules = readJson("rules/youth.json")
    const text = rules.invariants.map((i) => i.description).join(" ")
    assert.match(text, /youth/i)
    assert.match(text, /modif/i)
  })
})
