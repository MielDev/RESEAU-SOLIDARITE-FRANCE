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

  // ── Nouvelle migration pour actions_solidaires ──────────────────────────────
  {
    name: '002_create_actions_solidaires_table',
    description: 'Création de la table actions_solidaires',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
        sql = `
          CREATE TABLE IF NOT EXISTS actions_solidaires (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            icon        TEXT NOT NULL,
            iconColor   TEXT NOT NULL,
            tag         TEXT NOT NULL,
            tagBg       TEXT NOT NULL,
            tagColor    TEXT NOT NULL,
            title       TEXT NOT NULL,
            description TEXT NOT NULL,
            gradient    TEXT NOT NULL,
            createdAt   TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt   TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `
          CREATE TABLE IF NOT EXISTS actions_solidaires (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            icon        VARCHAR(255) NOT NULL,
            iconColor   VARCHAR(255) NOT NULL,
            tag         VARCHAR(255) NOT NULL,
            tagBg       VARCHAR(255) NOT NULL,
            tagColor    VARCHAR(255) NOT NULL,
            title       VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            gradient    VARCHAR(255) NOT NULL,
            createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      await q(sql);
    },
    down: async (q) => {
      await q(`DROP TABLE IF EXISTS actions_solidaires`);
    },
  },

  // ── Nouvelle migration pour ajouter les colonnes de style à la table actions ──────────────────────────────
  {
    name: '003_add_action_style_columns',
    description: 'Ajoute les colonnes icon_color, tag_bg, tag_color et gradient à la table actions',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sqls = [];
      if (dialect === 'sqlite') {
        sqls.push(`ALTER TABLE actions ADD COLUMN icon_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_bg VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN gradient VARCHAR(255) NULL`);
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sqls.push(`ALTER TABLE actions ADD COLUMN icon_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_bg VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN gradient VARCHAR(255) NULL`);
      } else if (dialect === 'postgres') {
        sqls.push(`ALTER TABLE actions ADD COLUMN icon_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_bg VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN tag_color VARCHAR(50) NULL`);
        sqls.push(`ALTER TABLE actions ADD COLUMN gradient VARCHAR(255) NULL`);
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      for (const sql of sqls) {
        await q(sql);
      }
    },
    down: async (q) => {
      warn('Suppression de colonne non supportée sur SQLite < 3.35. Pour les autres DBs, cette migration ne sera pas annulée automatiquement.');
      // For MySQL/Postgres, you would typically do:
      // await q(`ALTER TABLE actions DROP COLUMN icon_color`);
      // await q(`ALTER TABLE actions DROP COLUMN tag_bg`);
      // await q(`ALTER TABLE actions DROP COLUMN tag_color`);
      // await q(`ALTER TABLE actions DROP COLUMN gradient`);
    },
  },

  {
    name: '004_increase_icon_length',
    description: 'Augmente la longueur du champ icon à 50 caractères dans la table actions',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
        sql = `ALTER TABLE actions ADD COLUMN icon_new VARCHAR(50);
               UPDATE actions SET icon_new = icon;
               ALTER TABLE actions DROP COLUMN icon;
               ALTER TABLE actions RENAME COLUMN icon_new TO icon;`;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `ALTER TABLE actions MODIFY COLUMN icon VARCHAR(50);`;
      } else if (dialect === 'postgres') {
        sql = `ALTER TABLE actions ALTER COLUMN icon TYPE VARCHAR(50);`;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      await q(sql);
    },
    down: async (q) => {
      warn('L\'annulation de cette migration peut entraîner une perte de données si les icônes sont plus longues que 10 caractères.');
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
         sql = `ALTER TABLE actions ADD COLUMN icon_old VARCHAR(10);
                UPDATE actions SET icon_old = SUBSTR(icon, 1, 10);
                ALTER TABLE actions DROP COLUMN icon;
                ALTER TABLE actions RENAME COLUMN icon_old TO icon;`;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `ALTER TABLE actions MODIFY COLUMN icon VARCHAR(10);`;
      } else if (dialect === 'postgres') {
        sql = `ALTER TABLE actions ALTER COLUMN icon TYPE VARCHAR(10);`;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      await q(sql);
    },
  },

  {
    name: '005_add_image_to_actions',
    description: 'Ajoute la colonne image à la table actions',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
        sql = `ALTER TABLE actions ADD COLUMN image VARCHAR(255) NULL;`;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `ALTER TABLE actions ADD COLUMN image VARCHAR(255) NULL;`;
      } else if (dialect === 'postgres') {
        sql = `ALTER TABLE actions ADD COLUMN image VARCHAR(255) NULL;`;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      await q(sql);
    },
    down: async (q) => {
      warn('L\'annulation de cette migration peut entraîner une perte de données.');
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
        warn('La suppression de colonne n\'est pas entièrement supportée par SQLite sans recréer la table.');
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `ALTER TABLE actions DROP COLUMN image;`;
      } else if (dialect === 'postgres') {
        sql = `ALTER TABLE actions DROP COLUMN image;`;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }
      if (sql) {
        await q(sql);
      }
    },
  },

  {
    name: '006_create_join_requests_table',
    description: 'Creation de la table des demandes Nous rejoindre',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sql;
      if (dialect === 'sqlite') {
        sql = `
          CREATE TABLE IF NOT EXISTS join_requests (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name        VARCHAR(100) NOT NULL,
            last_name         VARCHAR(100) NOT NULL,
            email             VARCHAR(255) NOT NULL,
            phone             VARCHAR(50) NULL,
            city              VARCHAR(150) NULL,
            status            VARCHAR(100) NULL,
            intent            VARCHAR(150) NOT NULL,
            interests         TEXT NULL,
            message           TEXT NOT NULL,
            processing_status VARCHAR(40) NOT NULL DEFAULT 'new',
            admin_notes       TEXT NULL,
            is_read           TINYINT(1) DEFAULT 0,
            processed_at      DATETIME NULL,
            created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `
          CREATE TABLE IF NOT EXISTS join_requests (
            id                INT AUTO_INCREMENT PRIMARY KEY,
            first_name        VARCHAR(100) NOT NULL,
            last_name         VARCHAR(100) NOT NULL,
            email             VARCHAR(255) NOT NULL,
            phone             VARCHAR(50) NULL,
            city              VARCHAR(150) NULL,
            status            VARCHAR(100) NULL,
            intent            VARCHAR(150) NOT NULL,
            interests         JSON NULL,
            message           TEXT NOT NULL,
            processing_status VARCHAR(40) NOT NULL DEFAULT 'new',
            admin_notes       TEXT NULL,
            is_read           TINYINT(1) DEFAULT 0,
            processed_at      DATETIME NULL,
            created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_join_requests_processing_status (processing_status),
            INDEX idx_join_requests_is_read (is_read),
            INDEX idx_join_requests_created_at (created_at)
          )
        `;
      } else if (dialect === 'postgres') {
        sql = `
          CREATE TABLE IF NOT EXISTS join_requests (
            id                SERIAL PRIMARY KEY,
            first_name        VARCHAR(100) NOT NULL,
            last_name         VARCHAR(100) NOT NULL,
            email             VARCHAR(255) NOT NULL,
            phone             VARCHAR(50) NULL,
            city              VARCHAR(150) NULL,
            status            VARCHAR(100) NULL,
            intent            VARCHAR(150) NOT NULL,
            interests         JSONB NULL,
            message           TEXT NOT NULL,
            processing_status VARCHAR(40) NOT NULL DEFAULT 'new',
            admin_notes       TEXT NULL,
            is_read           BOOLEAN DEFAULT FALSE,
            processed_at      TIMESTAMP NULL,
            created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }

      await q(sql);

      if (dialect === 'sqlite' || dialect === 'postgres') {
        await q(`CREATE INDEX IF NOT EXISTS idx_join_requests_processing_status ON join_requests (processing_status)`);
        await q(`CREATE INDEX IF NOT EXISTS idx_join_requests_is_read ON join_requests (is_read)`);
        await q(`CREATE INDEX IF NOT EXISTS idx_join_requests_created_at ON join_requests (created_at)`);
      }
    },
    down: async (q) => {
      await q(`DROP TABLE IF EXISTS join_requests`);
    },
  },

  {
    name: '007_fix_nav_icon_length',
    description: 'Augmente la longueur des icones de navigation et repare les valeurs tronquees',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      const sqls = [];

      if (dialect === 'sqlite') {
        sqls.push(`ALTER TABLE nav_items ADD COLUMN icon_full VARCHAR(100) NULL`);
        sqls.push(`UPDATE nav_items SET icon_full = icon`);
        sqls.push(`ALTER TABLE nav_items DROP COLUMN icon`);
        sqls.push(`ALTER TABLE nav_items RENAME COLUMN icon_full TO icon`);
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sqls.push(`ALTER TABLE nav_items MODIFY COLUMN icon VARCHAR(100) NULL`);
      } else if (dialect === 'postgres') {
        sqls.push(`ALTER TABLE nav_items ALTER COLUMN icon TYPE VARCHAR(100)`);
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }

      for (const sql of sqls) {
        await q(sql);
      }

      const defaults = [
        { href: '/', icon: 'fas fa-home', invalid: ['fas fa-hom', 'fas fa-hou'] },
        { href: '/qui-sommes-nous', icon: 'fas fa-book-open', invalid: ['fas fa-boo'] },
        { href: '/organisation', icon: 'fas fa-users', invalid: ['fas fa-use'] },
        { href: '/nos-missions', icon: 'fas fa-bullseye', invalid: ['fas fa-bul'] },
        { href: '/actions-solidaires', icon: 'fas fa-handshake-angle', invalid: ['fas fa-han'] },
        { href: '/soutien-aux-membres', icon: 'fas fa-heart', invalid: ['fas fa-hea'] },
        { href: '/actions-internationales', icon: 'fas fa-globe', invalid: ['fas fa-glo'] },
        { href: '/evenements', icon: 'fas fa-calendar-alt', invalid: ['fas fa-cal'] },
        { href: '/temoignages', icon: 'fas fa-comments', invalid: ['fas fa-com'] },
        { href: '/nous-rejoindre', icon: 'fas fa-hands-holding', invalid: ['fas fa-han'] },
        { href: '/actualites', icon: 'fas fa-newspaper', invalid: ['fas fa-new'] },
        { href: '/contact', icon: 'fas fa-envelope', invalid: ['fas fa-env'] },
        { href: '/don', icon: 'fas fa-heart', invalid: ['fas fa-hea'] },
      ];

      for (const item of defaults) {
        const invalidList = item.invalid.map((value) => `'${value.replace(/'/g, "''")}'`).join(', ');
        await q(`
          UPDATE nav_items
          SET icon = '${item.icon.replace(/'/g, "''")}'
          WHERE href = '${item.href.replace(/'/g, "''")}'
            AND (icon IS NULL OR icon = '' OR icon IN (${invalidList}))
        `);
      }
    },
    down: async () => {
      warn('La reduction de nav_items.icon a 10 caracteres est volontairement ignoree pour eviter de recouper les icones.');
    },
  },

  {
    name: '008_create_event_photos_table',
    description: 'Creation de la table des photos liees aux evenements',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      let sql;

      if (dialect === 'sqlite') {
        sql = `
          CREATE TABLE IF NOT EXISTS event_photos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id    INTEGER NOT NULL,
            image_url   VARCHAR(500) NOT NULL,
            alt_text    VARCHAR(255) NULL,
            caption     VARCHAR(255) NULL,
            sort_order  INTEGER DEFAULT 0,
            created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `;
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sql = `
          CREATE TABLE IF NOT EXISTS event_photos (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            event_id    INT NOT NULL,
            image_url   VARCHAR(500) NOT NULL,
            alt_text    VARCHAR(255) NULL,
            caption     VARCHAR(255) NULL,
            sort_order  INT DEFAULT 0,
            created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_event_photos_event_id (event_id),
            INDEX idx_event_photos_sort_order (sort_order)
          )
        `;
      } else if (dialect === 'postgres') {
        sql = `
          CREATE TABLE IF NOT EXISTS event_photos (
            id          SERIAL PRIMARY KEY,
            event_id    INTEGER NOT NULL,
            image_url   VARCHAR(500) NOT NULL,
            alt_text    VARCHAR(255) NULL,
            caption     VARCHAR(255) NULL,
            sort_order  INTEGER DEFAULT 0,
            created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `;
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }

      await q(sql);

      if (dialect === 'sqlite' || dialect === 'postgres') {
        await q(`CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON event_photos (event_id)`);
        await q(`CREATE INDEX IF NOT EXISTS idx_event_photos_sort_order ON event_photos (sort_order)`);
      }
    },
    down: async (q) => {
      await q(`DROP TABLE IF EXISTS event_photos`);
    },
  },

  {
    name: '009_fix_event_program_icon_length',
    description: 'Augmente la longueur des icones de programme evenementiel et repare les valeurs tronquees',
    up: async (q) => {
      const dialect = sequelize.getDialect();
      const sqls = [];

      if (dialect === 'sqlite') {
        sqls.push(`ALTER TABLE event_programs ADD COLUMN icon_full VARCHAR(100) NULL`);
        sqls.push(`UPDATE event_programs SET icon_full = icon`);
        sqls.push(`ALTER TABLE event_programs DROP COLUMN icon`);
        sqls.push(`ALTER TABLE event_programs RENAME COLUMN icon_full TO icon`);
      } else if (dialect === 'mysql' || dialect === 'mariadb') {
        sqls.push(`ALTER TABLE event_programs MODIFY COLUMN icon VARCHAR(100) NULL`);
      } else if (dialect === 'postgres') {
        sqls.push(`ALTER TABLE event_programs ALTER COLUMN icon TYPE VARCHAR(100)`);
      } else {
        throw new Error(`Unsupported dialect: ${dialect}`);
      }

      for (const sql of sqls) {
        await q(sql);
      }

      const defaults = [
        { invalid: 'fas fa-cof', icon: 'fas fa-mug-saucer' },
        { invalid: 'fas fa-fut', icon: 'fas fa-futbol' },
        { invalid: 'fas fa-bul', icon: 'fas fa-bullseye' },
        { invalid: 'fas fa-dic', icon: 'fas fa-dice' },
        { invalid: 'fas fa-ute', icon: 'fas fa-utensils' },
        { invalid: 'fas fa-mic', icon: 'fas fa-microphone-lines' },
      ];

      for (const item of defaults) {
        await q(`
          UPDATE event_programs
          SET icon = '${item.icon}'
          WHERE icon = '${item.invalid}'
        `);
      }
    },
    down: async () => {
      warn('La reduction de event_programs.icon a 10 caracteres est ignoree pour eviter de recouper les icones.');
    },
  },

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
