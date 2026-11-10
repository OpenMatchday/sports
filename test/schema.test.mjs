import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import {
  SCHEMA_VERSION,
  createAjv,
  loadCatalog,
  rootDir,
  SCHEMA_ORDER,
} from "../scripts/lib/load-ajv.mjs"

describe("sports schemas v0", () => {
  it("pins schema version 0.1.0", () => {
    assert.equal(SCHEMA_VERSION, "0.1.0")
    assert.equal(readFileSync(join(rootDir, "VERSION"), "utf8").trim(), "0.1.0")
  })

  it("compiles every non-common schema", () => {
    const ajv = createAjv()
    for (const id of SCHEMA_ORDER) {
      if (id === "common.json") {
        continue
      }
      assert.ok(ajv.getSchema(id), id)
    }
  })

  it("catalog lists the same schema order", () => {
    const catalog = loadCatalog()
    assert.deepEqual(catalog.schemas, SCHEMA_ORDER)
  })

  it("accepts the empty exceptional-modules allowlist", () => {
    const ajv = createAjv()
    const validate = ajv.getSchema("allowlist.json")
    const allowlist = JSON.parse(
      readFileSync(join(rootDir, "exceptional-modules.allowlist.json"), "utf8")
    )
    assert.equal(validate(allowlist), true, ajv.errorsText(validate.errors))
    assert.equal(allowlist.modules.length, 0)
  })
})
