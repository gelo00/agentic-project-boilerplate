// scripts/clean-cache.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const targetEnv = process.argv[2] || '--all';

console.log(`🧹 [Cache Clean] Target: ${targetEnv.replace('--', '').toUpperCase()}\n`);

// Cache paths for both environments
const cacheMap = {
  web: [
    'apps/web/.vite',
    'apps/web/dist',
    'apps/web/.next',
    'apps/web/tsconfig.tsbuildinfo',
  ],
  api: [
    'apps/api/dist',
    'apps/api/tsconfig.tsbuildinfo',
    'apps/api/.turbo',
  ],
  shared: [
    'packages/contracts/dist',
    'packages/contracts/tsconfig.tsbuildinfo',
    '.turbo',
  ],
};

let targetsToPurge = [];

if (targetEnv === '--web') {
  targetsToPurge = [...cacheMap.web];
} else if (targetEnv === '--api') {
  targetsToPurge = [...cacheMap.api];
} else {
  // Default: clear both environments + shared artifacts
  targetsToPurge = [...cacheMap.web, ...cacheMap.api, ...cacheMap.shared];
}

let removedCount = 0;

for (const relPath of targetsToPurge) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.lstatSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`  🗑️  Cleared directory: ${relPath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`  🗑️  Cleared file:      ${relPath}`);
      }
      removedCount++;
    } catch (err) {
      console.error(`  ⚠️  Failed to clear ${relPath}:`, err.message);
    }
  }
}

console.log(`\n✨ [Cache Clean] Complete. Removed ${removedCount} cached items.`);
console.log('⚡ Ready for rapid dev boot!\n');