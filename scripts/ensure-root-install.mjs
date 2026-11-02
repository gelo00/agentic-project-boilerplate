/**
 * @file scripts/ensure-root-install.mjs
 * @description Blocks npm installs that would target an app/package instead of the monorepo root.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

const cwd = resolve(process.cwd());
const initCwd = process.env.INIT_CWD ? resolve(process.env.INIT_CWD) : null;

const isWorkspaceInstall =
  Boolean(process.env.npm_config_workspace) ||
  process.env.npm_config_workspaces === 'true';

const invocationDirectory = initCwd ?? cwd;
const invalidRoot =
  isWorkspaceInstall || invocationDirectory === ROOT_DIR ? null : invocationDirectory;

if (invalidRoot) {
  console.error('\n❌ [INSTALL BLOCKED] npm install must run from the monorepo root.');
  console.error(`   Detected location: ${resolve(invalidRoot)}`);
  console.error(`   Required location: ${ROOT_DIR}`);
  console.error('\nUse an npm  root when adding a package to root folder:');
  console.error('   npm install <package> --install-strategy=hoisted --legacy-peer-deps');
  console.error('\nUse an npm workspace when adding a package to api/web folder:');
  console.error('   npm install <package> --install-strategy=hoisted --legacy-peer-deps  --workspace=@workspace/web');
  console.error('   npm install <package> --install-strategy=hoisted --legacy-peer-deps  --workspace=@workspace/api');
  console.error('\nOr run a normal root install:');
  console.error('   cd <monorepo-root>');
  console.error('   npm install\n');
  process.exit(1);
}

console.log('✅ [INSTALL CHECK] npm install is running from the monorepo root.');
