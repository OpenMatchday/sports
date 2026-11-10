// Patterns that indicate remote or dynamic code execution (AC-6.2: no remote eval).
export const REMOTE_EVAL_MARKERS = [
  { id: "eval", re: /\beval\s*\(/ },
  { id: "Function", re: /\bFunction\s*\(/ },
  { id: "import_url", re: /\bimport\s*\(\s*['"`]https?:\/\// },
  { id: "vm_run", re: /\bvm\.(?:runInThisContext|runInNewContext|runInContext|compileFunction)\s*\(/ },
  { id: "script_run", re: /\bnew\s+vm\.Script\s*\(/ },
  { id: "fetch_then_eval", re: /\bfetch\s*\([^)]*\)[\s\S]{0,200}\beval\s*\(/ },
  { id: "dynamic_import_var", re: /\bimport\s*\(\s*[A-Za-z_$]/ },
]

export const CODE_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".wasm",
])

export const scanRemoteEval = (text, filePath) => {
  const hits = []
  for (const marker of REMOTE_EVAL_MARKERS) {
    if (marker.re.test(text)) {
      hits.push({ filePath, marker: marker.id })
    }
  }
  return hits
}
