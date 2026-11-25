import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEGACY_STATE_FILE = path.join(ROOT_DIR, 'public', 'catalog-state.json');

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REVISIONS_KEPT = 20;

export interface CatalogSnapshotRecord {
  catalogState: Record<string, unknown> | null;
  version: number;
  updatedAt: number;
  productCount: number;
}

export interface AdminAuthStatus {
  envConfigured: boolean;
  requiresSetup: boolean;
}

let dbInstance: Database.Database | null = null;

function getDbFilePath(): string {
  const configured = process.env.DATABASE_PATH?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(ROOT_DIR, configured);
  }
  return path.join(ROOT_DIR, 'data', 'catalog.db');
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a, 'utf8').digest();
  const hashB = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function hashPasswordScrypt(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPasswordScrypt(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function sanitizePublicCatalogState(
  raw: unknown
): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const cloned = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;
  delete cloned.adminPassword;
  return cloned;
}

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = getDbFilePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS catalog_snapshots (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL DEFAULT 1,
      state_json TEXT,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS catalog_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      state_json TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS catalog_products_index (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      name TEXT NOT NULL,
      technical_code TEXT,
      sort_order INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // One-time migration from legacy public/catalog-state.json into SQLite so zero existing edits are lost
  const existingRow = db
    .prepare('SELECT id FROM catalog_snapshots WHERE id = 1')
    .get();
  if (!existingRow) {
    const now = Date.now();
    let migratedState: Record<string, unknown> | null = null;
    try {
      if (fs.existsSync(LEGACY_STATE_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(LEGACY_STATE_FILE, 'utf-8'));
        migratedState = sanitizePublicCatalogState(parsed);
      }
    } catch {
      migratedState = null;
    }

    const migrateTx = db.transaction(() => {
      db.prepare(
        'INSERT INTO catalog_snapshots (id, version, state_json, updated_at) VALUES (1, 1, ?, ?)'
      ).run(migratedState ? JSON.stringify(migratedState) : null, now);

      if (migratedState) {
        syncProductsIndex(db, migratedState, now);
      }
    });
    migrateTx();
  }

  dbInstance = db;
  return db;
}

function syncProductsIndex(
  db: Database.Database,
  state: Record<string, unknown> | null,
  updatedAt: number
): void {
  db.prepare('DELETE FROM catalog_products_index').run();
  if (!state || !Array.isArray(state.products)) return;

  const insertStmt = db.prepare(
    'INSERT OR REPLACE INTO catalog_products_index (id, group_id, name, technical_code, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (let i = 0; i < state.products.length; i++) {
    const prod = state.products[i] as Record<string, unknown>;
    if (!prod || typeof prod.id !== 'string') continue;
    insertStmt.run(
      prod.id,
      typeof prod.groupId === 'string' ? prod.groupId : 'boxes',
      typeof prod.name === 'string' ? prod.name : '',
      typeof prod.technicalCode === 'string' ? prod.technicalCode : '',
      i,
      updatedAt
    );
  }
}

export function initCatalogDb(): CatalogSnapshotRecord {
  getDb();
  return getCatalogSnapshot();
}

export function getCatalogSnapshot(): CatalogSnapshotRecord {
  const db = getDb();
  const row = db
    .prepare(
      'SELECT version, state_json, updated_at FROM catalog_snapshots WHERE id = 1'
    )
    .get() as
    | { version: number; state_json: string | null; updated_at: number }
    | undefined;

  const countRow = db
    .prepare('SELECT COUNT(*) AS cnt FROM catalog_products_index')
    .get() as { cnt: number } | undefined;

  if (!row) {
    return {
      catalogState: null,
      version: 1,
      updatedAt: Date.now(),
      productCount: 0,
    };
  }

  let parsed: Record<string, unknown> | null = null;
  if (row.state_json) {
    try {
      parsed = sanitizePublicCatalogState(JSON.parse(row.state_json));
    } catch {
      parsed = null;
    }
  }

  return {
    catalogState: parsed,
    version: row.version,
    updatedAt: row.updated_at,
    productCount: countRow?.cnt ?? 0,
  };
}

export function saveCatalogSnapshot(rawState: unknown): CatalogSnapshotRecord {
  const db = getDb();
  const cleanState = sanitizePublicCatalogState(rawState);
  if (!cleanState) {
    throw new Error('Invalid catalog state payload');
  }

  const now = Date.now();
  const serialized = JSON.stringify(cleanState);

  const nextVersion = db.transaction(() => {
    const current = db
      .prepare('SELECT version FROM catalog_snapshots WHERE id = 1')
      .get() as { version: number } | undefined;
    const version = (current?.version ?? 0) + 1;

    db.prepare(
      'INSERT INTO catalog_snapshots (id, version, state_json, updated_at) VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET version = excluded.version, state_json = excluded.state_json, updated_at = excluded.updated_at'
    ).run(version, serialized, now);

    db.prepare(
      'INSERT INTO catalog_revisions (version, state_json, created_at) VALUES (?, ?, ?)'
    ).run(version, serialized, now);

    db.prepare(
      'DELETE FROM catalog_revisions WHERE id NOT IN (SELECT id FROM catalog_revisions ORDER BY id DESC LIMIT ?)'
    ).run(MAX_REVISIONS_KEPT);

    syncProductsIndex(db, cleanState, now);

    return version;
  })();

  const productCount = Array.isArray(cleanState.products)
    ? cleanState.products.length
    : 0;

  return {
    catalogState: cleanState,
    version: nextVersion,
    updatedAt: now,
    productCount,
  };
}

export function resetCatalogSnapshot(): CatalogSnapshotRecord {
  const db = getDb();
  const now = Date.now();

  const nextVersion = db.transaction(() => {
    const current = db
      .prepare('SELECT version FROM catalog_snapshots WHERE id = 1')
      .get() as { version: number } | undefined;
    const version = (current?.version ?? 0) + 1;

    db.prepare(
      'INSERT INTO catalog_snapshots (id, version, state_json, updated_at) VALUES (1, ?, NULL, ?) ON CONFLICT(id) DO UPDATE SET version = excluded.version, state_json = NULL, updated_at = excluded.updated_at'
    ).run(version, now);

    db.prepare('DELETE FROM catalog_products_index').run();
    return version;
  })();

  return {
    catalogState: null,
    version: nextVersion,
    updatedAt: now,
    productCount: 0,
  };
}

// ==================== SERVER-SIDE ADMIN AUTHENTICATION ====================

function getEnvAdminCredentials(): { username: string; password: string } | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  const username = (process.env.ADMIN_USERNAME?.trim() || 'admin').toLowerCase();
  return { username, password };
}

export function getAdminAuthStatus(): AdminAuthStatus {
  const envCreds = getEnvAdminCredentials();
  if (envCreds) {
    return { envConfigured: true, requiresSetup: false };
  }
  const db = getDb();
  const row = db
    .prepare('SELECT id FROM admin_credentials WHERE id = 1')
    .get();
  return {
    envConfigured: false,
    requiresSetup: !row,
  };
}

function createSessionToken(username: string): { token: string; expiresAt: number } {
  const db = getDb();
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = sha256Hex(token);

  db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(now);
  db.prepare(
    'INSERT INTO admin_sessions (token_hash, username, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).run(tokenHash, username, expiresAt, now);

  return { token, expiresAt };
}

export function setupInitialAdmin(
  rawUsername: string,
  rawPassword: string
): { token: string; username: string; expiresAt: number } {
  if (getEnvAdminCredentials()) {
    throw new Error('تنظیم رمز از طریق متغیرهای محیطی سرور انجام شده است.');
  }

  const username = (rawUsername || 'admin').trim().toLowerCase();
  const password = rawPassword || '';
  if (username.length < 3 || username.length > 48) {
    throw new Error('نام کاربری باید بین ۳ تا ۴۸ کاراکتر باشد.');
  }
  if (password.length < 4 || password.length > 128) {
    throw new Error('رمز عبور باید حداقل ۴ کاراکتر باشد.');
  }

  const db = getDb();
  const now = Date.now();
  const passwordHash = hashPasswordScrypt(password);

  // Atomic one-time claim: fails if already claimed
  const claimed = db.transaction(() => {
    const existing = db
      .prepare('SELECT id FROM admin_credentials WHERE id = 1')
      .get();
    if (existing) {
      return false;
    }
    db.prepare(
      'INSERT INTO admin_credentials (id, username, password_hash, updated_at) VALUES (1, ?, ?, ?)'
    ).run(username, passwordHash, now);
    return true;
  })();

  if (!claimed) {
    throw new Error('رمز مدیر قبلاً تنظیم شده است. لطفاً وارد شوید.');
  }

  const session = createSessionToken(username);
  return { ...session, username };
}

export function verifyAdminLogin(
  rawUsername: string,
  rawPassword: string
): { token: string; username: string; expiresAt: number } | null {
  const username = (rawUsername || '').trim().toLowerCase();
  const password = rawPassword || '';
  if (!username || !password) return null;

  const envCreds = getEnvAdminCredentials();
  if (envCreds) {
    if (
      timingSafeStringEqual(username, envCreds.username) &&
      timingSafeStringEqual(password, envCreds.password)
    ) {
      const session = createSessionToken(envCreds.username);
      return { ...session, username: envCreds.username };
    }
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT username, password_hash FROM admin_credentials WHERE id = 1')
    .get() as { username: string; password_hash: string } | undefined;

  if (!row) return null;

  if (
    timingSafeStringEqual(username, row.username.toLowerCase()) &&
    verifyPasswordScrypt(password, row.password_hash)
  ) {
    const session = createSessionToken(row.username);
    return { ...session, username: row.username };
  }

  return null;
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const match = /^Bearer\s+([a-f0-9]{64})$/i.exec(authHeader.trim());
  return match ? match[1] : null;
}

export function validateAdminBearerToken(
  authHeader: string | undefined
): { username: string } | null {
  const token = extractBearerToken(authHeader);
  if (!token) return null;

  const db = getDb();
  const now = Date.now();
  const row = db
    .prepare(
      'SELECT username, expires_at FROM admin_sessions WHERE token_hash = ?'
    )
    .get(sha256Hex(token)) as { username: string; expires_at: number } | undefined;

  if (!row || row.expires_at < now) {
    if (row) {
      db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(
        sha256Hex(token)
      );
    }
    return null;
  }

  return { username: row.username };
}

export function revokeAdminBearerToken(authHeader: string | undefined): void {
  const token = extractBearerToken(authHeader);
  if (!token) return;
  const db = getDb();
  db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(
    sha256Hex(token)
  );
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): void {
  if (getEnvAdminCredentials()) {
    throw new Error(
      'رمز عبور از طریق متغیر محیطی ADMIN_PASSWORD روی سرور تنظیم شده است و باید از همان‌جا تغییر داده شود.'
    );
  }
  if (!newPassword || newPassword.length < 4 || newPassword.length > 128) {
    throw new Error('رمز عبور جدید باید حداقل ۴ کاراکتر باشد.');
  }

  const db = getDb();
  const row = db
    .prepare('SELECT username, password_hash FROM admin_credentials WHERE id = 1')
    .get() as { username: string; password_hash: string } | undefined;

  if (!row || !verifyPasswordScrypt(currentPassword || '', row.password_hash)) {
    throw new Error('رمز عبور فعلی صحیح نیست.');
  }

  const nextHash = hashPasswordScrypt(newPassword);
  db.prepare(
    'UPDATE admin_credentials SET password_hash = ?, updated_at = ? WHERE id = 1'
  ).run(nextHash, Date.now());
}
