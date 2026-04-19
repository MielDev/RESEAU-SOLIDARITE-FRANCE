// scripts/migrate.js
// ═══════════════════════════════════════════════════════════════════════════════
//  SYSTÈME DE MIGRATIONS MANUELLES — RSF Backend
// ═══════════════════════════════════════════════════════════════════════════════
//
//  Permet d'écrire des migrations précises qui s'exécutent UNE SEULE FOIS
//  et sont tracées dans une table `_migrations`.
//
//  Usage :
//    node scripts/migrate.js          → exécute les nouvelles migrations
//    node scripts/migrate.js --list   → liste toutes les migrations (appliquées / en attente)
//    node scripts/migrate.js --undo   → annule la dernière migration
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// ─── Couleurs ────────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bright: '\x1b[1m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const ok   = (m) => console.log(`  ${C.green}✅${C.reset} ${m}`);
const warn = (m) => console.log(`  ${C.yellow}⚠️ ${C.reset} ${m}`);
const info = (m) => console.log(`  ${C.blue}ℹ️ ${C.reset} ${m}`);
const sep  = ()  => console.log(`${C.gray}${'─'.repeat(60)}${C.reset}`);

// ═══════════════════════════════════════════════════════════════════════════════
//  DÉCLAREZ VOS MIGRATIONS ICI
//  Chaque migration a un nom unique, une fonction up() et optionnellement down()
// ═══════════════════════════════════════════════════════════════════════════════
const MIGRATIONS = [

  // ── Exemple de migration initiale ───────────────────────────────────────────
  {
    name: '001_initial_schema',
    description: 'Création initiale de toutes les tables RSF',
    up: async (q) => {
      // Cette migration est gérée par checkDatabase.js
      // Elle sert de point de référence dans la table _migrations
      info('Migration initiale — gérée par checkDatabase.js');
    },
    down: async (q) => {
      warn('Impossible d\'annuler la migration initiale.');
    },
  },

  // ── Modèle pour ajouter une colonne ─────────────────────────────────────────
  // {
  //   name: '002_add_photo_to_team_member',
  //   description: 'Ajoute la colonne photo_url à team_members',
  //   up: async (q) => {
  //     const dialect = sequelize.getDialect();
  //     const sql = dialect === 'sqlite'
  //       ? `ALTER TABLE "team_members" ADD COLUMN "photo_url" TEXT`
  //       : `ALTER TABLE team_members ADD COLUMN photo_url VARCHAR(500) NULL`;
  //     await q(sql);
  //   },
  //   down: async (q) => {
  //     // SQLite ne supporte pas DROP COLUMN sur les vieilles versions
  //     warn('Suppression de colonne non supportée sur SQLite < 3.35');
  //   },
  // },

  // ── Modèle pour créer une nouvelle table ────────────────────────────────────
  // {
  //   name: '003_create_contact_messages_table',
  //   description: 'Table pour stocker les messages du formulaire de contact',
  //   up: async (q) => {
  //     await q(`
  //       CREATE TABLE IF NOT EXISTS contact_messages (
  //         id         INTEGER PRIMARY KEY AUTOINCREMENT,
  //         name       TEXT NOT NULL,
  //         email      TEXT NOT NULL,
  //         subject    TEXT,
  //         message    TEXT NOT NULL,
  //         is_read    INTEGER DEFAULT 0,
  //         created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  //         updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  //       )
  //     `);
  //   },
  //   down: async (q) => {
  //     await q(`DROP TABLE IF EXISTS contact_messages`);
  //   },
  // },

];
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Crée la table de suivi des migrations ────────────────────────────────────
async function ensureMigrationsTable() {
  const dialect = sequelize.getDialect();
  let sql;
  if (dialect === 'sqlite') {
    sql = `CREATE TABLE IF NOT EXISTS _migrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL UNIQUE,
      description TEXT,
      applied_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )`;
  } else if (dialect === 'mysql' || dialect === 'mariadb') {
    sql = `CREATE TABLE IF NOT EXISTS _migrations (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(200) NOT NULL UNIQUE,
      description TEXT,
      applied_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
  } else {
    sql = `CREATE TABLE IF NOT EXISTS _migrations (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) NOT NULL UNIQUE,
      description TEXT,
      applied_at  TIMESTAMP DEFAULT NOW()
    )`;
  }
  await sequelize.query(sql);
}

// ─── Récupère les migrations déjà appliquées ──────────────────────────────────
async function getApplied() {
  const rows = await sequelize.query(
    'SELECT name FROM _migrations ORDER BY id ASC',
    { type: QueryTypes.SELECT }
  );
  return new Set(rows.map(r => r.name));
}

// ─── Enregistre une migration comme appliquée ─────────────────────────────────
async function markApplied(name, description) {
  const dialect = sequelize.getDialect();
  if (dialect === 'sqlite') {
    await sequelize.query(
      `INSERT OR IGNORE INTO _migrations (name, description) VALUES (?, ?)`,
      { replacements: [name, description] }
    );
  } else {
    await sequelize.query(
      `INSERT IGNORE INTO _migrations (name, description) VALUES (:name, :desc)`,
      { replacements: { name, desc: description } }
    );
  }
}

// ─── Supprime une migration de la table ───────────────────────────────────────
async function markUnapplied(name) {
  await sequelize.query(
    'DELETE FROM _migrations WHERE name = :name',
    { replacements: { name } }
  );
}

// ─── Exécute une requête SQL brute ────────────────────────────────────────────
const rawQuery = (sql) => sequelize.query(sql, { type: QueryTypes.RAW });

// ─── COMMANDE : lister les migrations ─────────────────────────────────────────
async function listMigrations() {
  const applied = await getApplied();
  sep();
  console.log(`${C.bright}${C.cyan}Migrations RSF${C.reset}\n`);
  console.log(`  ${'Nom'.padEnd(45)} ${'Statut'}`);
  console.log(`  ${'─'.repeat(45)} ${'─'.repeat(10)}`);
  MIGRATIONS.forEach(m => {
    const isApplied = applied.has(m.name);
    const status = isApplied
      ? `${C.green}✅ appliquée${C.reset}`
      : `${C.yellow}⏳ en attente${C.reset}`;
    console.log(`  ${m.name.padEnd(45)} ${status}`);
    if (m.description) {
      console.log(`  ${C.gray}  ${m.description}${C.reset}`);
    }
  });
  sep();
  console.log(`  Total : ${MIGRATIONS.length} | Appliquées : ${applied.size} | En attente : ${MIGRATIONS.length - applied.size}\n`);
}

// ─── COMMANDE : appliquer les nouvelles migrations ────────────────────────────
async function runMigrations() {
  const applied = await getApplied();
  const pending = MIGRATIONS.filter(m => !applied.has(m.name));

  sep();
  console.log(`${C.bright}${C.cyan}Exécution des migrations${C.reset}`);

  if (pending.length === 0) {
    ok('Toutes les migrations sont déjà appliquées. Rien à faire.');
    sep();
    return;
  }

  info(`${pending.length} migration(s) en attente...`);

  for (const migration of pending) {
    console.log(`\n  ${C.bright}→ ${migration.name}${C.reset}`);
    if (migration.description) info(migration.description);
    try {
      await migration.up(rawQuery);
      await markApplied(migration.name, migration.description);
      ok(`Migration "${migration.name}" appliquée avec succès.`);
    } catch (e) {
      console.error(`  ${C.red}❌ Erreur :${C.reset}`, e.message);
      console.error(`  ${C.red}   Migration arrêtée. Corrigez l'erreur avant de relancer.${C.reset}`);
      process.exit(1);
    }
  }

  sep();
  ok(`${pending.length} migration(s) appliquée(s) avec succès.`);
  sep();
}

// ─── COMMANDE : annuler la dernière migration ──────────────────────────────────
async function undoLastMigration() {
  const applied = await getApplied();
  const appliedList = MIGRATIONS.filter(m => applied.has(m.name));

  if (appliedList.length === 0) {
    warn('Aucune migration à annuler.');
    return;
  }

  const last = appliedList[appliedList.length - 1];
  sep();
  console.log(`${C.bright}${C.yellow}Annulation de : ${last.name}${C.reset}`);

  try {
    if (!last.down) {
      warn('Cette migration n\'a pas de fonction down(). Annulation ignorée.');
    } else {
      await last.down(rawQuery);
    }
    await markUnapplied(last.name);
    ok(`Migration "${last.name}" annulée.`);
  } catch (e) {
    console.error(`  ${C.red}❌ Erreur :${C.reset}`, e.message);
  }
  sep();
}

// ─── ENTRÉE PRINCIPALE ────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  try {
    await sequelize.authenticate();
    await ensureMigrationsTable();

    if (args.includes('--list')) {
      await listMigrations();
    } else if (args.includes('--undo')) {
      await undoLastMigration();
    } else {
      await runMigrations();
    }

    await sequelize.close();
  } catch (e) {
    console.error(`${C.red}Erreur fatale :${C.reset}`, e.message);
    process.exit(1);
  }
}

main();
