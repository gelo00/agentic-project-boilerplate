/**
 * @file scripts/compact-sessions.mjs
 * @description Automatically manages the active window in .ai/sessions/
 * to protect Copilot and Antigravity context limits.
 */
import { readdirSync, renameSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(fileURLToPath(import.meta.url), '../..');
const SESSIONS_DIR = join(ROOT_DIR, '.ai/sessions');
const ARCHIVE_DIR = join(SESSIONS_DIR, 'archive');
const MAX_ACTIVE_SESSIONS = 5;

if (!existsSync(SESSIONS_DIR)) {
  console.log('No .ai/sessions directory found.');
  process.exit(0);
}

if (!existsSync(ARCHIVE_DIR)) {
  mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// 1. Gather all session logs (ignoring TEMPLATE.md and archive folder)
const sessionFiles = readdirSync(SESSIONS_DIR)
  .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
  .map(file => ({
    name: file,
    path: join(SESSIONS_DIR, file),
    mtime: statSync(join(SESSIONS_DIR, file)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime); // Newest first

console.log(`📋 Found ${sessionFiles.length} session logs in .ai/sessions/`);

// 2. Keep only the 5 most recent sessions; archive the rest
if (sessionFiles.length > MAX_ACTIVE_SESSIONS) {
  const toArchive = sessionFiles.slice(MAX_ACTIVE_SESSIONS);
  console.log(`📦 Archiving ${toArchive.length} older sessions to .ai/sessions/archive/...`);

  for (const session of toArchive) {
    const dest = join(ARCHIVE_DIR, session.name);
    renameSync(session.path, dest);
    console.log(`   [Archived] ${session.name}`);
  }
  console.log(`✨ .ai/sessions/ compacted: ${MAX_ACTIVE_SESSIONS} active sessions retained.`);
} else {
  console.log(`✅ Session count (${sessionFiles.length}) is within the active threshold (<= ${MAX_ACTIVE_SESSIONS}).`);
}