import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const load = (sport, file) =>
  JSON.parse(readFileSync(join(root, "packages", sport, file), "utf8"))

describe("lineup geometry packages AC-7.1 / AC-7.3", () => {
  it("basketball field matches FIBA Art. 2 court used by lineups", () => {
    const field = load("basketball", "field.json")
    assert.equal(field.surface, "court")
    assert.equal(field.units, "m")
    assert.equal(field.length, 28)
    assert.equal(field.width, 15)
    const formations = load("basketball", "formations.json")
    const roster = load("basketball", "roster.json")
    const positionIds = new Set(roster.positions.map((p) => p.id))
    for (const formation of formations.formations) {
      for (const slot of formation.slots) {
        assert.ok(positionIds.has(slot.position_id), slot.position_id)
        assert.ok(slot.x >= 0 && slot.x <= 1)
        assert.ok(slot.y >= 0 && slot.y <= 1)
      }
    }
    const animations = load("basketball", "animations.json")
    const entry = animations.clips.find((c) => c.kind === "entry")
    const exit = animations.clips.find((c) => c.kind === "exit")
    assert.ok(entry?.reduced_motion)
    assert.ok(exit?.reduced_motion)
  })

  it("futsal field matches FIFA Law 1 minimums and GK marker", () => {
    const field = load("futsal", "field.json")
    assert.equal(field.surface, "pitch")
    assert.equal(field.length, 38)
    assert.equal(field.width, 20)
    const roster = load("futsal", "roster.json")
    const gk = roster.positions.find((p) => p.id === "goalkeeper")
    assert.deepEqual(gk.markers, ["goalkeeper"])
    const formations = load("futsal", "formations.json")
    for (const formation of formations.formations) {
      assert.ok(formation.slots.some((s) => s.position_id === "goalkeeper"))
    }
  })
})
