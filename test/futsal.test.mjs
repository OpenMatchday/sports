import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { rootDir } from "../scripts/lib/load-ajv.mjs"

const pkgDir = join(rootDir, "packages", "futsal")

describe("shipped futsal package", () => {
  it("package directory exists", () => {
    assert.equal(existsSync(join(pkgDir, "manifest.json")), true)
  })

  it("package-local variant tests pass", () => {
    const result = spawnSync(
      process.execPath,
      ["--test", join(pkgDir, "tests", "variants.test.mjs")],
      { cwd: rootDir, encoding: "utf8" }
    )
    assert.equal(result.status, 0, result.stderr || result.stdout)
  })

  it("manifest fiction is false for real governing-body package", () => {
    const manifest = JSON.parse(
      readFileSync(join(pkgDir, "manifest.json"), "utf8")
    )
    assert.equal(manifest.fiction, false)
    assert.equal(manifest.id, "futsal")
    assert.deepEqual([...manifest.variants].sort(), ["fifa", "youth"].sort())
  })
})
