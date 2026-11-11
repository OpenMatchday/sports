import { mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const packagesDir = join(root, "packages")
const plannedPath = join(root, "catalog", "planned.json")
const outDir = join(root, "dist")
const outPath = join(outDir, "website-catalog.v0.json")

const available = []
for (const name of readdirSync(packagesDir)) {
  const dir = join(packagesDir, name)
  if (!statSync(dir).isDirectory()) continue
  const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"))
  const variants = []
  for (const variantId of manifest.variants ?? []) {
    const variant = JSON.parse(
      readFileSync(join(dir, "variants", `${variantId}.json`), "utf8"),
    )
    variants.push({
      id: variant.id,
      display_name: variant.display_name,
      effective_date: variant.effective_date,
      official_source: {
        title: variant.official_source.title,
        url: variant.official_source.url,
        version_label: variant.official_source.version_label,
      },
    })
  }
  available.push({
    id: manifest.id,
    display_name: manifest.display_name,
    version: manifest.version,
    status: "available",
    summary: manifest.summary,
    variants,
    source_package: `packages/${manifest.id}`,
  })
}

available.sort((a, b) => a.id.localeCompare(b.id))

const plannedDoc = JSON.parse(readFileSync(plannedPath, "utf8"))
const planned = (plannedDoc.planned ?? []).map((entry) => {
  if (entry.status && entry.status !== "planned") {
    throw new Error(`planned sport ${entry.id} must have status planned`)
  }
  if (entry.playable === true) {
    throw new Error(`planned sport ${entry.id} must not be playable`)
  }
  return {
    id: entry.id,
    display_name: entry.display_name,
    status: "planned",
    summary: entry.summary ?? "Scheduled for a later package; not available to play.",
    playable: false,
  }
})

const catalog = {
  schema_version: "0.1.0",
  generated_for: "website",
  available,
  planned,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`)
console.log(`SPORTS_WEBSITE_CATALOG_OK available=${available.length} planned=${planned.length}`)
