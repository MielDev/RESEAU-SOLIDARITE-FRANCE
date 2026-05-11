const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../models');

const pageModelsToCheck = Object.entries(db.PageTableModels || {});

const modelsToCheck = [
  ['User', db.User],
  ['TeamMember', db.TeamMember],
  ['Mission', db.Mission],
  ['MissionItem', db.MissionItem],
  ['Action', db.Action],
  ['Testimonial', db.Testimonial],
  ['Event', db.Event],
  ['EventProgram', db.EventProgram],
  ['EventPhoto', db.EventPhoto],
  ['Actuality', db.Actuality],
  ['DonMode', db.DonMode],
  ['Setting', db.Setting],
  ['NavItem', db.NavItem],
  ['ContactMessage', db.ContactMessage],
  ['JoinRequest', db.JoinRequest],
  ['HelpUser', db.HelpUser],
  ['HelpPasswordReset', db.HelpPasswordReset],
  ['AppointmentSlot', db.AppointmentSlot],
  ['AppointmentBooking', db.AppointmentBooking],
  ['Accueil', db.Accueil],
  ...pageModelsToCheck,
];

const quoteIdentifier = (dialect, value) => {
  const escaped = String(value).replace(/"/g, '""').replace(/`/g, '``');
  return dialect === 'mysql' || dialect === 'mariadb' ? `\`${escaped}\`` : `"${escaped}"`;
};

const getTableName = (model) => {
  const tableName = model.getTableName();
  return typeof tableName === 'string' ? tableName : tableName.tableName;
};

const getExistingTables = async () => {
  const dialect = sequelize.getDialect();

  if (dialect === 'sqlite') {
    const rows = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      { type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  if (dialect === 'mysql' || dialect === 'mariadb') {
    const rows = await sequelize.query(
      'SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()',
      { type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  if (dialect === 'postgres') {
    const rows = await sequelize.query(
      "SELECT tablename as name FROM pg_tables WHERE schemaname = 'public'",
      { type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  return new Set();
};

const getExistingColumns = async (tableName) => {
  const dialect = sequelize.getDialect();

  if (dialect === 'sqlite') {
    const rows = await sequelize.query(
      `PRAGMA table_info(${quoteIdentifier(dialect, tableName)})`,
      { type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  if (dialect === 'mysql' || dialect === 'mariadb') {
    const rows = await sequelize.query(
      `SELECT COLUMN_NAME as name FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :tableName`,
      { replacements: { tableName }, type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  if (dialect === 'postgres') {
    const rows = await sequelize.query(
      `SELECT column_name as name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = :tableName`,
      { replacements: { tableName }, type: QueryTypes.SELECT }
    );
    return new Set(rows.map((row) => row.name));
  }

  return new Set();
};

const getDefaultSql = (value) => {
  if (value === undefined || typeof value === 'function') {
    return '';
  }

  if (value && typeof value === 'object') {
    return '';
  }

  return ` DEFAULT ${sequelize.escape(value)}`;
};

const addColumn = async (tableName, columnName, columnDefinition) => {
  const dialect = sequelize.getDialect();
  const type = columnDefinition.type;
  const typeSql = type.toSql ? type.toSql() : String(type);
  const nullable = dialect === 'sqlite' || columnDefinition.allowNull !== false ? '' : ' NOT NULL';
  const defaultSql = getDefaultSql(columnDefinition.defaultValue);
  const quotedTable = quoteIdentifier(dialect, tableName);
  const quotedColumn = quoteIdentifier(dialect, columnName);

  await sequelize.query(
    `ALTER TABLE ${quotedTable} ADD COLUMN ${quotedColumn} ${typeSql}${nullable}${defaultSql}`
  );
};

const ensureAdminUser = async (report) => {
  const count = await db.User.count();

  if (count > 0) {
    report.adminCreated = false;
    return;
  }

  await db.User.create({
    name: process.env.ADMIN_NAME || 'TODEDJRAPOU Aime',
    email: process.env.ADMIN_EMAIL || 'admin@reseau-solidarite-france.fr',
    password: process.env.ADMIN_PASSWORD || 'Admin@RSF2025!',
    role: 'admin',
  });

  report.adminCreated = true;
};

const ensureDatabase = async ({ createAdmin = true } = {}) => {
  const report = {
    tablesChecked: 0,
    tablesCreated: 0,
    tablesExisting: 0,
    columnsAdded: 0,
    columnsSkipped: [],
    adminCreated: false,
  };

  const existingTables = await getExistingTables();

  for (const [, model] of modelsToCheck) {
    const tableName = getTableName(model);
    report.tablesChecked += 1;

    if (!existingTables.has(tableName)) {
      await model.sync({ force: false });
      existingTables.add(tableName);
      report.tablesCreated += 1;
      continue;
    }

    report.tablesExisting += 1;
    const existingColumns = await getExistingColumns(tableName);

    for (const [attributeName, columnDefinition] of Object.entries(model.rawAttributes)) {
      const columnName = columnDefinition.field || attributeName;

      if (existingColumns.has(columnName)) {
        continue;
      }

      try {
        await addColumn(tableName, columnName, columnDefinition);
        existingColumns.add(columnName);
        report.columnsAdded += 1;
      } catch (error) {
        report.columnsSkipped.push({
          table: tableName,
          column: columnName,
          reason: error.message,
        });
      }
    }
  }

  if (createAdmin) {
    await ensureAdminUser(report);
  }

  return report;
};

module.exports = { ensureDatabase };
