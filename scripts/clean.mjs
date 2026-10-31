import fs from 'node:fs';
import path from 'node:path';

console.log('🧹 [Clean] Starting deep repository cleanup...\n');

const ROOT_DIR = process.cwd();

// Explicit directories and files to wipe at root and known workspaces
const exactTargets = [
  // --- Root Level ---
  'node_modules',
  'package-lock.json',
  '.turbo',
  'dist',
  'coverage',
  '.nyc_output',

  // --- Apps: Web ---
  'apps/web/node_modules',
  'apps/web/package-lock.json',
  'apps/web/dist',
  'apps/web/.vite',
  'apps/web/.next',
  'apps/web/out',
  'apps/web/next-env.d.ts',

  // --- Apps: API ---
  'apps/api/node_modules',
  'apps/api/package-lock.json',
  'apps/api/dist',

  // --- Packages: Contracts ---
  'packages/contracts/node_modules',
  'packages/contracts/package-lock.json',
  'packages/contracts/dist',
];

let removedCount = 0;

// 1. Remove exact targets
for (const relPath of exactTargets) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.lstatSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`  🗑️  Directory: ${relPath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`  🗑️  File:      ${relPath}`);
      }
      removedCount++;
    } catch (err) {
      console.error(`  ⚠️  Failed to remove ${relPath}:`, err.message);
    }
  }
}

// 2. Recursive sweep for stray OS junk, TS build info, and nested lockfiles
const junkPatterns = [
  '.DS_Store',
  'Thumbs.db',
  'tsbuildinfo',
  'npm-debug.log',
  'yarn-error.log',
];

function sweepDir(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath);

    // Skip git repository metadata
    if (entry.name === '.git') continue;

    // Check if filename matches junk patterns
    const isJunk = junkPatterns.some((pattern) => entry.name.includes(pattern));

    // Catch any rogue child lockfile that escaped exact targets
    const isChildLock = entry.name === 'package-lock.json' && relPath !== 'package-lock.json';

    if (isJunk || isChildLock) {
      try {
        if (entry.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`  🗑️  Junk Dir:  ${relPath}`);
        } else {
          fs.unlinkSync(fullPath);
          console.log(`  🗑️  Junk File: ${relPath}`);
        }
        removedCount++;
      } catch (err) {
        console.error(`  ⚠️  Failed to delete ${relPath}:`, err.message);
      }
    } else if (entry.isDirectory()) {
      sweepDir(fullPath);
    }
  }
}

try {
  sweepDir(ROOT_DIR);
} catch (err) {
  console.error('  ⚠️  Error during recursive sweep:', err.message);
}

console.log(`\n✨ [Clean] Complete. Removed ${removedCount} items.`);
console.log('💡 Run "npm run setup" to reinstall a clean, hoisted environment.\n');