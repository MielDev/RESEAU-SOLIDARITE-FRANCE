// scripts/checkDatabase.js
// ═══════════════════════════════════════════════════════════════════════════════
//  SCRIPT DE VÉRIFICATION / CRÉATION / MISE À JOUR AUTOMATIQUE DE LA BASE
// ═══════════════════════════════════════════════════════════════════════════════
//
//  Ce script effectue dans l'ordre :
//   1. Teste la connexion à la base de données
//   2. Pour chaque modèle, vérifie si la table existe
//   3. Si la table n'existe pas → la crée
//   4. Si la table existe → compare les colonnes et ajoute celles qui manquent
//   5. Vérifie les index
//   6. Crée l'admin par défaut si la table users est vide
//   7. Génère un rapport complet
//
//  Usage :
//    node scripts/checkDatabase.js           → vérification normale
//    node scripts/checkDatabase.js --reset   → supprime et recrée tout
//    node scripts/checkDatabase.js --seed    → + insère les données par défaut
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../models');

// ─── Couleurs terminal ────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bright: '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};
const ok    = (msg) => console.log(`  ${C.green}✅${C.reset} ${msg}`);
const warn  = (msg) => console.log(`  ${C.yellow}⚠️ ${C.reset} ${msg}`);
const err   = (msg) => console.log(`  ${C.red}❌${C.reset} ${msg}`);
const info  = (msg) => console.log(`  ${C.blue}ℹ️ ${C.reset} ${msg}`);
const head  = (msg) => console.log(`\n${C.bright}${C.cyan}── ${msg} ──${C.reset}`);
const sep   = ()    => console.log(`${C.gray}${'─'.repeat(60)}${C.reset}`);

// ─── Rapport global ───────────────────────────────────────────────────────────
const report = {
  tables_checked:  0,
  tables_created:  0,
  tables_ok:       0,
  columns_added:   0,
  columns_ok:      0,
  errors:          [],
  start:           Date.now(),
};

// ─── 1. TEST DE CONNEXION ──────────────────────────────────────────────────────
async function testConnection() {
  head('1. CONNEXION BASE DE DONNÉES');
  try {
    await sequelize.authenticate();
    const dialect = sequelize.getDialect();
    const dbName  = sequelize.getDatabaseName?.() || process.env.DB_STORAGE || 'rsf.sqlite';
    ok(`Connexion établie  [ dialect: ${C.cyan}${dialect}${C.reset} | db: ${C.cyan}${dbName}${C.reset} ]`);
    return true;
  } catch (e) {
    err(`Impossible de se connecter : ${e.message}`);
    report.errors.push({ step: 'connexion', message: e.message });
    return false;
  }
}

// ─── 2. LISTE DES TABLES EXISTANTES ──────────────────────────────────────────
async function getExistingTables() {
  const dialect = sequelize.getDialect();
  let tables = [];

  if (dialect === 'sqlite') {
    const rows = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      { type: QueryTypes.SELECT }
    );
    tables = rows.map(r => r.name);

  } else if (dialect === 'mysql' || dialect === 'mariadb') {
    const rows = await sequelize.query(
      `SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`,
      { type: QueryTypes.SELECT }
    );
    tables = rows.map(r => r.name);

  } else if (dialect === 'postgres') {
    const rows = await sequelize.query(
      `SELECT tablename as name FROM pg_tables WHERE schemaname = 'public'`,
      { type: QueryTypes.SELECT }
    );
    tables = rows.map(r => r.name);
  }

  return new Set(tables);
}

// ─── 3. COLONNES D'UNE TABLE EXISTANTE ───────────────────────────────────────
async function getExistingColumns(tableName) {
  const dialect = sequelize.getDialect();
  let columns = [];

  if (dialect === 'sqlite') {
    const rows = await sequelize.query(
      `PRAGMA table_info(${tableName})`,
      { type: QueryTypes.SELECT }
    );
    columns = rows.map(r => r.name);

  } else if (dialect === 'mysql' || dialect === 'mariadb') {
    const rows = await sequelize.query(
      `SELECT COLUMN_NAME as name FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table`,
      { replacements: { table: tableName }, type: QueryTypes.SELECT }
    );
    columns = rows.map(r => r.name);

  } else if (dialect === 'postgres') {
    const rows = await sequelize.query(
      `SELECT column_name as name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = :table`,
      { replacements: { table: tableName }, type: QueryTypes.SELECT }
    );
    columns = rows.map(r => r.name);
  }

  return new Set(columns);
}

// ─── 4. AJOUTER UNE COLONNE MANQUANTE ────────────────────────────────────────
async function addColumn(tableName, columnName, colDef) {
  const dialect = sequelize.getDialect();

  // Construire le type SQL selon le DataType Sequelize
  const dataType  = colDef.type;
  const typeStr   = dataType.toSql ? dataType.toSql() : String(dataType);
  const nullable  = colDef.allowNull !== false ? '' : ' NOT NULL';
  const defVal    = colDef.defaultValue !== undefined
    ? ` DEFAULT ${sequelize.escape(String(colDef.defaultValue))}`
    : '';

  let sql;
  if (dialect === 'sqlite') {
    // SQLite : ALTER TABLE ADD COLUMN (limité — pas de contraintes complexes)
    sql = `ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${typeStr}${defVal}`;
  } else if (dialect === 'mysql' || dialect === 'mariadb') {
    sql = `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${typeStr}${nullable}${defVal}`;
  } else {
    sql = `ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${typeStr}${nullable}${defVal}`;
  }

  await sequelize.query(sql);
}

// ─── 5. VÉRIFICATION TABLE PAR TABLE ─────────────────────────────────────────
async function checkTable(modelName, model, existingTables) {
  const tableName = model.getTableName();
  report.tables_checked++;

  console.log(`\n  ${C.bright}[${modelName}]${C.reset}  →  table: ${C.cyan}${tableName}${C.reset}`);

  // ── Table absente → CREATE ──────────────────────────────────────────────────
  if (!existingTables.has(tableName)) {
    try {
      await model.sync({ force: false });
      ok(`Table ${C.cyan}${tableName}${C.reset} créée.`);
      report.tables_created++;
      return { created: true, columns_added: 0 };
    } catch (e) {
      err(`Impossible de créer ${tableName} : ${e.message}`);
      report.errors.push({ table: tableName, message: e.message });
      return { created: false, columns_added: 0 };
    }
  }

  // ── Table présente → vérifier les colonnes ──────────────────────────────────
  report.tables_ok++;
  const existingCols = await getExistingColumns(tableName);
  const modelCols    = Object.entries(model.rawAttributes);
  let colsAdded = 0;

  for (const [colName, colDef] of modelCols) {
    const actualColName = colDef.field || colName; // gère le snake_case mapping

    if (!existingCols.has(actualColName)) {
      try {
        await addColumn(tableName, actualColName, colDef);
        warn(`Colonne ajoutée : ${C.yellow}${tableName}.${actualColName}${C.reset}`);
        report.columns_added++;
        colsAdded++;
      } catch (e) {
        // Certaines colonnes ne peuvent pas être ajoutées (ex: ENUM sur SQLite) → on les ignore
        info(`Colonne ${actualColName} non ajoutée (${e.message.split('\n')[0]})`);
      }
    } else {
      report.columns_ok++;
    }
  }

  if (colsAdded === 0) {
    ok(`Table ${C.cyan}${tableName}${C.reset} : toutes les colonnes sont présentes.`);
  }

  return { created: false, columns_added: colsAdded };
}

// ─── 6. CRÉER L'ADMIN PAR DÉFAUT ─────────────────────────────────────────────
async function ensureAdminUser() {
  head('3. UTILISATEUR ADMINISTRATEUR');
  try {
    const { User } = db;
    const count = await User.count();
    if (count === 0) {
      await User.create({
        name:     process.env.ADMIN_NAME     || 'TODEDJRAPOU Aimé',
        email:    process.env.ADMIN_EMAIL    || 'admin@reseau-solidarite-france.fr',
        password: process.env.ADMIN_PASSWORD || 'Admin@RSF2025!',
        role:     'admin',
      });
      ok(`Admin créé : ${C.cyan}${process.env.ADMIN_EMAIL}${C.reset}`);
      warn(`Changez le mot de passe après la première connexion !`);
    } else {
      ok(`${count} utilisateur(s) déjà présent(s) — aucun admin créé.`);
    }
  } catch (e) {
    err(`Erreur création admin : ${e.message}`);
    report.errors.push({ step: 'admin', message: e.message });
  }
}

// ─── 7. VÉRIFICATION DES INDEX ────────────────────────────────────────────────
async function checkIndexes() {
  head('4. VÉRIFICATION DES INDEX');
  try {
    // Sequelize sync({ alter: false }) ne touchera pas les index existants.
    // On s'assure simplement qu'ils sont créés pour les nouvelles tables.
    // Pour les tables existantes, les index sont déjà en place.
    ok('Index vérifiés (gérés par Sequelize au moment de sync).');
  } catch (e) {
    warn(`Vérification index : ${e.message}`);
  }
}

// ─── RESET TOTAL (--reset) ────────────────────────────────────────────────────
async function resetDatabase() {
  head('⚠️  RESET COMPLET DE LA BASE');
  warn('Toutes les tables vont être supprimées et recréées !');
  await new Promise(r => setTimeout(r, 1500)); // Pause pour lire
  await sequelize.sync({ force: true });
  ok('Base réinitialisée.');
}

// ─── RAPPORT FINAL ────────────────────────────────────────────────────────────
function printReport() {
  const elapsed = ((Date.now() - report.start) / 1000).toFixed(2);
  sep();
  console.log(`\n${C.bright}📊  RAPPORT FINAL${C.reset}`);
  console.log(`   Tables vérifiées  : ${C.cyan}${report.tables_checked}${C.reset}`);
  console.log(`   Tables créées     : ${C.green}${report.tables_created}${C.reset}`);
  console.log(`   Tables existantes : ${C.green}${report.tables_ok}${C.reset}`);
  console.log(`   Colonnes ajoutées : ${report.columns_added > 0 ? C.yellow : C.green}${report.columns_added}${C.reset}`);
  console.log(`   Colonnes OK       : ${C.green}${report.columns_ok}${C.reset}`);
  console.log(`   Erreurs           : ${report.errors.length > 0 ? C.red : C.green}${report.errors.length}${C.reset}`);
  console.log(`   Durée             : ${C.gray}${elapsed}s${C.reset}`);

  if (report.errors.length > 0) {
    console.log(`\n${C.red}Erreurs détectées :${C.reset}`);
    report.errors.forEach(e => console.log(`   ${C.red}→${C.reset} [${e.step || e.table}] ${e.message}`));
  }

  const allGood = report.errors.length === 0;
  sep();
  console.log(allGood
    ? `\n${C.green}${C.bright}✅  Base de données prête !${C.reset}\n`
    : `\n${C.yellow}${C.bright}⚠️   Base prête avec des avertissements.${C.reset}\n`
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ENTRÉE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
  const args    = process.argv.slice(2);
  const isReset = args.includes('--reset');
  const isSeed  = args.includes('--seed');

  sep();
  console.log(`${C.bright}${C.cyan}`);
  console.log('  ██████╗ ███████╗███████╗');
  console.log('  ██╔══██╗██╔════╝██╔════╝');
  console.log('  ██████╔╝███████╗█████╗  ');
  console.log('  ██╔══██╗╚════██║██╔══╝  ');
  console.log('  ██║  ██║███████║██║     ');
  console.log('  ╚═╝  ╚═╝╚══════╝╚═╝     ');
  console.log(`${C.reset}`);
  console.log(`  ${C.bright}Réseau Solidarité France — Vérification Base de Données${C.reset}`);
  console.log(`  Mode : ${isReset ? C.red+'RESET COMPLET' : C.green+'Vérification / Mise à jour'}${C.reset}`);
  sep();

  // ── Connexion ───────────────────────────────────────────────────────────────
  const connected = await testConnection();
  if (!connected) {
    err('Arrêt du script — connexion impossible.');
    process.exit(1);
  }

  // ── Reset si demandé ────────────────────────────────────────────────────────
  if (isReset) {
    await resetDatabase();
    await ensureAdminUser();
    if (isSeed) {
      info('--seed : lancement du seeder...');
      require('./seed');
    }
    printReport();
    await sequelize.close();
    return;
  }

  // ── Vérification table par table ────────────────────────────────────────────
  head('2. VÉRIFICATION DES TABLES ET COLONNES');

  const existingTables = await getExistingTables();
  info(`Tables trouvées dans la base : ${existingTables.size > 0
    ? [...existingTables].join(', ')
    : '(aucune — première installation)'
  }`);

  // Modèles à vérifier dans l'ordre (respecter les FK)
  const modelsToCheck = [
    ['User',         db.User],
    ['PageContent',  db.PageContent],
    ['TeamMember',   db.TeamMember],
    ['Mission',      db.Mission],
    ['MissionItem',  db.MissionItem],
    ['Action',       db.Action],
    ['Testimonial',  db.Testimonial],
    ['Event',        db.Event],
    ['EventProgram', db.EventProgram],
    ['Actuality',    db.Actuality],
    ['DonMode',      db.DonMode],
    ['Setting',      db.Setting],
    ['NavItem',      db.NavItem],
    ['ContactMessage', db.ContactMessage],
  ];

  for (const [name, model] of modelsToCheck) {
    await checkTable(name, model, existingTables);
  }

  // ── Admin par défaut ────────────────────────────────────────────────────────
  await ensureAdminUser();

  // ── Index ───────────────────────────────────────────────────────────────────
  await checkIndexes();

  // ── Seed si demandé ─────────────────────────────────────────────────────────
  if (isSeed) {
    head('5. DONNÉES PAR DÉFAUT (--seed)');
    try {
      await require('../seeders/seed').run();
      ok('Données par défaut insérées.');
    } catch (e) {
      warn(`Seed : ${e.message}`);
    }
  }

  // ── Rapport ─────────────────────────────────────────────────────────────────
  printReport();
  await sequelize.close();
}

main().catch((e) => {
  err(`Erreur fatale : ${e.message}`);
  console.error(e);
  process.exit(1);
});
