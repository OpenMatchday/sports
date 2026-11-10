import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { createAjv, rootDir } from "../scripts/lib/load-ajv.mjs"
import { assertLayout, scanPackageRemoteEval } from "../scripts/lib/package-layout.mjs"
import { scanRemoteEval } from "../scripts/lib/remote-eval.mjs"

const runNode = (script) =>
  spawnSync(process.execPath, [script], {
    cwd: rootDir,
    encoding: "utf8",
  })

describe("sports packages validation", () => {
  it("smoke fixture matches required layout", () => {
    const errors = assertLayout(
      join(rootDir, "fixtures", "packages", "valid", "smoke")
    )
    assert.deepEqual(errors, [])
  })

  it("npm run check and validate succeed", () => {
    const check = runNode(join(rootDir, "scripts", "check-schemas.mjs"))
    assert.equal(check.status, 0, check.stderr || check.stdout)
    assert.match(check.stdout, /SCHEMA_CHECK_OK/)

    const validate = runNode(join(rootDir, "scripts", "validate-packages.mjs"))
    assert.equal(validate.status, 0, validate.stderr || validate.stdout)
    assert.match(validate.stdout, /PACKAGE_VALIDATE_OK/)
  })

  it("rejects remote eval markers", () => {
    const hits = scanRemoteEval('eval("1")', "x.mjs")
    assert.equal(hits.length, 1)
    assert.equal(hits[0].marker, "eval")
  })

  it("remote-eval invalid fixture is detected", () => {
    const hits = scanPackageRemoteEval(
      join(rootDir, "fixtures", "packages", "invalid", "remote-eval")
    )
    assert.ok(hits.some((h) => h.marker === "eval"))
  })

  it("validates smoke manifest against schema", () => {
    const ajv = createAjv()
    const validate = ajv.getSchema("manifest.json")
    const manifest = JSON.parse(
      readFileSync(
        join(rootDir, "fixtures", "packages", "valid", "smoke", "manifest.json"),
        "utf8"
      )
    )
    assert.equal(validate(manifest), true, ajv.errorsText(validate.errors))
  })
})
