#!/usr/bin/env node
/**
 * Generates web/src/build-info.ts with build metadata.
 * Safe to run locally or in CI.
 */
import { execSync } from 'node:child_process'
import { writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const webSrc = resolve(repoRoot, 'web', 'src')
if (!existsSync(webSrc)) {
  console.error('web/src directory not found – aborting metadata generation.')
  process.exit(0)
}
function safe(cmd) {
  try { return execSync(cmd, { cwd: repoRoot, stdio: ['ignore','pipe','ignore'] }).toString().trim() } catch { return '' }
}

const env = process.env
const fullSha = env.GITHUB_SHA || safe('git rev-parse HEAD')
const shortSha = fullSha ? fullSha.substring(0, 7) : ''
const branch = env.GITHUB_REF_NAME || safe('git symbolic-ref --short HEAD')
const tag = safe('git describe --tags --abbrev=0')
const timestamp = new Date().toISOString()
const runId = env.GITHUB_RUN_ID || ''
const repository = env.GITHUB_REPOSITORY || safe('git remote get-url origin').replace(/.*github.com[/:]/,'').replace(/\.git$/,'')
const commitUrl = (repository && fullSha) ? `https://github.com/${repository}/commit/${fullSha}` : ''
const buildNumber = runId

const content = `// AUTO-GENERATED FILE. DO NOT COMMIT MANUALLY.\n// Regenerado por scripts/write-build-metadata.mjs\nexport const BUILD_INFO = {\n  commit: '${fullSha}',\n  short: '${shortSha}',\n  branch: '${branch}',\n  tag: '${tag}',\n  timestamp: '${timestamp}',\n  buildNumber: '${buildNumber}',\n  repository: '${repository}',\n  commitUrl: '${commitUrl}'\n} as const;\n\nexport type BuildInfo = typeof BUILD_INFO;\n`;

writeFileSync(resolve(webSrc, 'build-info.ts'), content, 'utf8')
console.log('[build-metadata] Generated web/src/build-info.ts:')
console.log(content)