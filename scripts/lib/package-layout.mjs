import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, relative, sep } from "node:path"
import { CODE_EXTENSIONS, scanRemoteEval } from "./remote-eval.mjs"

const toPosix = (p) => p.split(sep).join("/")

export const REQUIRED_FILES = [
  "manifest.json",
  "roster.json",
  "field.json",
  "formations.json",
  "animations.json",
  "scoreboards.json",
  "assets/manifest.json",
]

export const REQUIRED_DIRS = [
  "variants",
  "rules",
  "locales",
  "docs",
  "fixtures",
  "tests",
]

export const walkFiles = (dir, out = []) => {
  if (!existsSync(dir)) {
    return out
  }
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      walkFiles(full, out)
    } else {
      out.push(full)
    }
  }
  return out
}

export const assertLayout = (packageDir) => {
  const errors = []
  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(packageDir, file))) {
      errors.push(`missing file ${file}`)
    }
  }
  for (const dir of REQUIRED_DIRS) {
    const full = join(packageDir, dir)
    if (!existsSync(full) || !statSync(full).isDirectory()) {
      errors.push(`missing directory ${dir}/`)
      continue
    }
    const entries = readdirSync(full)
    if (entries.length < 1) {
      errors.push(`empty directory ${dir}/`)
    }
  }
  return errors
}

export const listJsonIn = (packageDir, subdir) => {
  const dir = join(packageDir, subdir)
  if (!existsSync(dir)) {
    return []
  }
  return readdirSync(dir)
    .filter((n) => n.endsWith(".json"))
    .map((n) => join(dir, n))
}

export const collectCodeFiles = (packageDir) =>
  walkFiles(packageDir).filter((f) => CODE_EXTENSIONS.has(extname(f).toLowerCase()))

export const scanPackageRemoteEval = (packageDir) => {
  const hits = []
  for (const file of collectCodeFiles(packageDir)) {
    const text = readFileSync(file, "utf8")
    hits.push(...scanRemoteEval(text, toPosix(relative(packageDir, file))))
  }
  return hits
}

export const packageCodePathsFromRoot = (repoRoot, packageDir) =>
  collectCodeFiles(packageDir).map((f) => toPosix(relative(repoRoot, f)))
