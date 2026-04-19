// config/database.js
// ─── Configuration Sequelize ─────────────────────────────────────────────────
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelizeOptions = {
  dialect,
  logging: process.env.NODE_ENV === 'development'
    ? (msg) => console.log(`\x1b[36m[SQL]\x1b[0m ${msg}`)
    : false,
  define: {
    underscored: true,       // snake_case pour les colonnes
    timestamps: true,        // createdAt / updatedAt automatiques
    paranoid: false,         // mettre true pour soft-delete
  },
};

let sequelize;

// ─── SQLite ──────────────────────────────────────────────────────────────────
if (dialect === 'sqlite') {
  const storagePath = process.env.DB_STORAGE || './database/rsf.sqlite';
  const dir = path.dirname(storagePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  sequelize = new Sequelize({
    ...sequelizeOptions,
    storage: storagePath,
  });

// ─── MySQL / MariaDB ─────────────────────────────────────────────────────────
} else if (dialect === 'mysql' || dialect === 'mariadb') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      ...sequelizeOptions,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );

// ─── PostgreSQL ───────────────────────────────────────────────────────────────
} else if (dialect === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      ...sequelizeOptions,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );

} else {
  throw new Error(`Dialecte DB non supporté : "${dialect}". Utilisez sqlite, mysql ou postgres.`);
}

module.exports = sequelize;
