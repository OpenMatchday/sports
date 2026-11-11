import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { test } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

test("website catalog export marks packages available and planned non-playable", () => {
  const result = spawnSync(process.execPath, ["scripts/export-website-catalog.mjs"], {
    cwd: root,
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  const catalog = JSON.parse(readFileSync(join(root, "dist", "website-catalog.v0.json"), "utf8"))
  assert.ok(catalog.available.length >= 2)
  for (const sport of catalog.available) {
    assert.equal(sport.status, "available")
    assert.ok(sport.variants.length > 0)
  }
  for (const sport of catalog.planned) {
    assert.equal(sport.status, "planned")
    assert.equal(sport.playable, false)
  }
  const ids = new Set(catalog.available.map((s) => s.id))
  assert.ok(ids.has("basketball"))
  assert.ok(ids.has("futsal"))
  const planned = JSON.parse(readFileSync(join(root, "catalog", "planned.json"), "utf8"))
  assert.ok(Array.isArray(planned.planned))
})
