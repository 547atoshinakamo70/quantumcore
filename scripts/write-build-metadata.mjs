#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

try {
  // Get git information
  const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const shortCommit = commitHash.substring(0, 7);
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  const timestamp = new Date().toISOString();
  
  // Try to get tag, may not exist
  let tag = '';
  try {
    tag = execSync('git describe --tags --exact-match HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    // No tag on current commit, that's fine
  }

  // Create commit URL (assuming GitHub)
  const commitUrl = `https://github.com/547atoshinakamo70/quantumcore/commit/${commitHash}`;

  const buildInfo = {
    commitHash,
    shortCommit,
    branch,
    timestamp,
    tag,
    commitUrl
  };

  // Write to web/src/build-info.ts
  const outputPath = join(process.cwd(), 'web', 'src', 'build-info.ts');
  
  // Check if we're already in the web directory
  const isInWebDir = process.cwd().endsWith('/web');
  const actualOutputPath = isInWebDir 
    ? join(process.cwd(), 'src', 'build-info.ts')
    : outputPath;
  const content = `// Auto-generated build information
export const BUILD_INFO = ${JSON.stringify(buildInfo, null, 2)} as const;

declare global {
  const BUILD_INFO: typeof import('./build-info').BUILD_INFO;
}

// Make BUILD_INFO available globally
(globalThis as any).BUILD_INFO = BUILD_INFO;
`;

  writeFileSync(actualOutputPath, content);
  console.log(`Build metadata written to ${actualOutputPath}`);
  console.log(`Build info:`, buildInfo);
} catch (error) {
  console.error('Failed to generate build metadata:', error);
  process.exit(1);
}