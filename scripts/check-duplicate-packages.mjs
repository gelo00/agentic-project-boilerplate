/**
 * @file scripts/check-duplicate-packages.mjs
 * @description Pre-commit and CI verification gate preventing duplicate packages
 * between the root node_modules tree and workspace node_modules trees.
 */
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
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
const rootNodeModules = join(ROOT_DIR, 'node_modules');

function readPackage(packageDirectory) {
  const packageJsonPath = join(packageDirectory, 'package.json');
  if (!existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return pkg.name ? { name: pkg.name, version: pkg.version ?? 'unknown' } : null;
  } catch {
    return null;
  }
}

function getTopLevelPackages(nodeModulesDirectory) {
  const packages = new Map();
  if (!existsSync(nodeModulesDirectory)) {
    return packages;
  }

  for (const entry of readdirSync(nodeModulesDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.name.startsWith('@')) {
      const scopeDirectory = join(nodeModulesDirectory, entry.name);
      for (const scopedEntry of readdirSync(scopeDirectory, { withFileTypes: true })) {
        if (!scopedEntry.isDirectory()) {
          continue;
        }
        const pkg = readPackage(join(scopeDirectory, scopedEntry.name));
        if (pkg) {
          packages.set(pkg.name, pkg);
        }
      }
    } else {
      const pkg = readPackage(join(nodeModulesDirectory, entry.name));
      if (pkg) {
        packages.set(pkg.name, pkg);
      }
    }
  }

  return packages;
}

const rootPackages = getTopLevelPackages(rootNodeModules);

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
      const nestedPackages = getTopLevelPackages(target);
      const duplicates = [];

      for (const [packageName, nestedPackage] of nestedPackages) {
        const rootPackage = rootPackages.get(packageName);
        if (rootPackage) {
          duplicates.push({
            name: packageName,
            rootVersion: rootPackage.version,
            nestedVersion: nestedPackage.version,
          });
        }
      }

      violations.push({
        workspace: ws,
        duplicates,
      });
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ [INVARIANT VIOLATION] Duplicate dependency trees detected in sub-workspaces:');
  for (const item of violations) {
    if (typeof item === 'string') {
      console.error(`   - ${item}`);
    } else if (item.duplicates.length > 0) {
      console.error(`   - ${item.workspace}/node_modules`);
      for (const duplicate of item.duplicates) {
        console.error(
          `     duplicate package: ${duplicate.name} (root ${duplicate.rootVersion}, nested ${duplicate.nestedVersion})`,
        );
      }
    } else {
      console.error(`   - ${item.workspace}/node_modules (nested dependency tree found)`);
    }
  }
  console.error('\nDependencies must be hoisted exclusively to the monorepo root.');
  console.error('Run: npm run clean && npm install\n');
  process.exit(1);
} else {
  console.log('✅ [CHECK PASSED] Single-root dependency hoisting verified (0 duplicate packages).');
  process.exit(0);
}
