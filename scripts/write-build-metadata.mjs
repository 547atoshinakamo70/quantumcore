#!/usr/bin/env node

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Get environment variables
const commitSha = process.env.GITHUB_SHA || process.env.COMMIT_SHA || 'dev'
const buildTime = new Date().toISOString()
const branch = process.env.GITHUB_REF_NAME || process.env.BRANCH || 'main'
const buildNumber = process.env.GITHUB_RUN_NUMBER || '0'

// Create build info object
const buildInfo = {
  commitSha: commitSha.substring(0, 7), // Short SHA
  commitShaFull: commitSha,
  buildTime,
  branch,
  buildNumber,
  version: `${branch}-${buildNumber}`,
  buildDate: new Date().toLocaleDateString(),
  buildTimeFormatted: new Date().toLocaleString()
}

// TypeScript interface and content
const buildInfoContent = `// Auto-generated build metadata - DO NOT EDIT
export interface BuildInfo {
  commitSha: string
  commitShaFull: string
  buildTime: string
  branch: string
  buildNumber: string
  version: string
  buildDate: string
  buildTimeFormatted: string
}

export const buildInfo: BuildInfo = ${JSON.stringify(buildInfo, null, 2)}
`

// Write to web/src/build-info.ts
const outputPath = join(__dirname, '../web/src/build-info.ts')
writeFileSync(outputPath, buildInfoContent, 'utf-8')

console.log('✅ Build metadata generated:', outputPath)
console.log('📦 Build info:', JSON.stringify(buildInfo, null, 2))