import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { test } from "node:test"

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..")

test("smoke manifest is fiction", () => {
  const manifest = JSON.parse(
    readFileSync(join(pkgRoot, "manifest.json"), "utf8")
  )
  assert.equal(manifest.fiction, true)
  assert.equal(manifest.id, "smoke")
})
