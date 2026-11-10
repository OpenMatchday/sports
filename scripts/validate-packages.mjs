import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { basename, join, relative, sep } from "node:path"
import { createAjv, loadCatalog, rootDir } from "./lib/load-ajv.mjs"
import {
  assertLayout,
  listJsonIn,
  packageCodePathsFromRoot,
  scanPackageRemoteEval,
} from "./lib/package-layout.mjs"

const toPosix = (p) => p.split(sep).join("/")

const ajv = createAjv()
const catalog = loadCatalog()

const allowlist = JSON.parse(
  readFileSync(join(rootDir, "exceptional-modules.allowlist.json"), "utf8")
)
const allowlisted = new Set(allowlist.modules.map((m) => m.path))

const validateData = (schemaId, data, label) => {
  const validate = ajv.getSchema(schemaId)
  if (!validate) {
    throw new Error(`missing schema ${schemaId}`)
  }
  const ok = validate(data)
  if (!ok) {
    throw new Error(`${label}: ${ajv.errorsText(validate.errors)}`)
  }
}

const validatePackageDir = (packageDir, { expectValid }) => {
  const label = toPosix(relative(rootDir, packageDir))
  const layoutErrors = assertLayout(packageDir)
  if (expectValid && layoutErrors.length > 0) {
    throw new Error(`${label} layout: ${layoutErrors.join("; ")}`)
  }
  if (!expectValid && layoutErrors.length > 0) {
    return { label, ok: false, reason: `layout: ${layoutErrors.join("; ")}` }
  }

  try {
    for (const [rel, schemaId] of Object.entries(catalog.package_file_schemas)) {
      const data = JSON.parse(readFileSync(join(packageDir, rel), "utf8"))
      validateData(schemaId, data, `${label}/${rel}`)
    }

    const manifest = JSON.parse(
      readFileSync(join(packageDir, "manifest.json"), "utf8")
    )
    const variantIds = new Set(manifest.variants)

    const variantFiles = listJsonIn(packageDir, "variants")
    if (variantFiles.length < 1) {
      throw new Error(`${label}: no variant files`)
    }
    const seenVariants = new Set()
    for (const file of variantFiles) {
      const data = JSON.parse(readFileSync(file, "utf8"))
      validateData("variant.json", data, `${label}/variants/${basename(file)}`)
      seenVariants.add(data.id)
      if (basename(file) !== `${data.id}.json`) {
        throw new Error(
          `${label}: variant file ${basename(file)} must be named ${data.id}.json`
        )
      }
    }
    for (const id of variantIds) {
      if (!seenVariants.has(id)) {
        throw new Error(`${label}: manifest variant ${id} missing file`)
      }
    }

    const ruleFiles = listJsonIn(packageDir, "rules")
    if (ruleFiles.length < 1) {
      throw new Error(`${label}: no rules files`)
    }
    for (const file of ruleFiles) {
      const data = JSON.parse(readFileSync(file, "utf8"))
      validateData("rules.json", data, `${label}/rules/${basename(file)}`)
      if (!variantIds.has(data.variant_id)) {
        throw new Error(
          `${label}: rules ${basename(file)} variant_id not in manifest`
        )
      }
    }

    const localeFiles = listJsonIn(packageDir, "locales")
    if (localeFiles.length < 1) {
      throw new Error(`${label}: no locale files`)
    }
    let hasDefaultLocale = false
    for (const file of localeFiles) {
      const data = JSON.parse(readFileSync(file, "utf8"))
      validateData("locale.json", data, `${label}/locales/${basename(file)}`)
      if (data.locale === manifest.default_locale) {
        hasDefaultLocale = true
      }
    }
    if (!hasDefaultLocale) {
      throw new Error(
        `${label}: missing locale file for default_locale ${manifest.default_locale}`
      )
    }

    const remoteHits = scanPackageRemoteEval(packageDir)
    if (remoteHits.length > 0) {
      throw new Error(
        `${label}: remote/dynamic eval forbidden: ${remoteHits
          .map((h) => `${h.filePath}:${h.marker}`)
          .join(", ")}`
      )
    }

    const codePaths = packageCodePathsFromRoot(rootDir, packageDir)
    for (const codePath of codePaths) {
      const relToPkg = toPosix(relative(packageDir, join(rootDir, codePath)))
      const underTests =
        relToPkg === "tests" || relToPkg.startsWith("tests/")
      if (underTests) {
        continue
      }
      if (!allowlisted.has(codePath)) {
        throw new Error(
          `${label}: code file ${codePath} not on exceptional-modules.allowlist.json`
        )
      }
      if (!manifest.exceptional_modules.includes(relToPkg)) {
        throw new Error(
          `${label}: code file ${relToPkg} missing from manifest.exceptional_modules`
        )
      }
    }

    for (const mod of manifest.exceptional_modules) {
      const abs = join(packageDir, mod)
      if (!existsSync(abs)) {
        throw new Error(`${label}: listed exceptional module missing: ${mod}`)
      }
      const fromRoot = toPosix(relative(rootDir, abs))
      if (!allowlisted.has(fromRoot)) {
        throw new Error(
          `${label}: manifest module ${mod} not on repo allowlist (${fromRoot})`
        )
      }
    }

    const fixtureFiles = listJsonIn(packageDir, "fixtures")
    for (const file of fixtureFiles) {
      const data = JSON.parse(readFileSync(file, "utf8"))
      if (data.fiction !== true && data.fiction !== false) {
        throw new Error(
          `${label}/fixtures/${basename(file)}: fiction marker required`
        )
      }
      if (manifest.fiction === true && data.fiction !== true) {
        throw new Error(
          `${label}/fixtures/${basename(file)}: fiction package fixtures must set fiction=true`
        )
      }
    }

    return { label, ok: true }
  } catch (err) {
    if (expectValid) {
      throw err
    }
    return { label, ok: false, reason: err.message }
  }
}

const listPackageDirs = (root) => {
  if (!existsSync(root)) {
    return []
  }
  return readdirSync(root)
    .map((name) => join(root, name))
    .filter((p) => statSync(p).isDirectory())
}

const shipped = listPackageDirs(join(rootDir, "packages"))
const validFixtures = listPackageDirs(
  join(rootDir, "fixtures", "packages", "valid")
)
const invalidFixtures = listPackageDirs(
  join(rootDir, "fixtures", "packages", "invalid")
)

if (validFixtures.length < 1) {
  throw new Error("need at least one fixtures/packages/valid package")
}
if (invalidFixtures.length < 1) {
  throw new Error("need at least one fixtures/packages/invalid package")
}

for (const dir of [...shipped, ...validFixtures]) {
  const result = validatePackageDir(dir, { expectValid: true })
  if (!result.ok) {
    throw new Error(`expected valid ${result.label}: ${result.reason}`)
  }
}

for (const dir of invalidFixtures) {
  const result = validatePackageDir(dir, { expectValid: false })
  if (result.ok) {
    throw new Error(`expected invalid package to fail: ${result.label}`)
  }
}

console.log(
  `PACKAGE_VALIDATE_OK shipped=${shipped.length} valid_fixtures=${validFixtures.length} invalid_fixtures=${invalidFixtures.length} allowlisted_modules=${allowlisted.size}`
)
