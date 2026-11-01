/**
 * @file scripts/check-nested-modules.mjs
 * @description Pre-commit and CI verification gate ensuring zero nested node_modules exist.
 */
import { existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

const WORKSPACES = [
  'apps/web',
  'apps/api',
  'packages/contracts',
  'packages/ai-hub',
];

const shouldAutoFix = process.argv.includes('--fix');
const violations = [];

for (const ws of WORKSPACES) {
  const target = join(ROOT_DIR, ws, 'node_modules');
  if (existsSync(target)) {
    if (shouldAutoFix) {
      try {
        rmSync(target, { recursive: true, force: true });
        console.log(`[Auto-Fixed] Purged nested node_modules in ${ws}`);
      } catch (err) {
        violations.push(`${ws}/node_modules (failed to remove: ${err.message})`);
      }
    } else {
      violations.push(`${ws}/node_modules`);
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ [INVARIANT VIOLATION] Nested node_modules detected in sub-workspaces:');
  for (const item of violations) {
    console.error(`   - ${item}`);
  }
  console.error('\nDependencies must be hoisted exclusively to the monorepo root.');
  console.error('Run: npm run clean && npm install\n');
  process.exit(1);
} else {
  console.log('✅ [CHECK PASSED] Single-root dependency hoisting verified (0 nested node_modules).');
  process.exit(0);
}
