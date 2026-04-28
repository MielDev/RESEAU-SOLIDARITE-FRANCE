require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const db = require('./models');
const { ensureDatabase } = require('./scripts/ensureDatabase');
const { run } = require('./seeders/seed');

const getDatabaseLabel = () => {
  const dialect = process.env.DB_DIALECT || 'sqlite';

  if (dialect === 'mysql' || dialect === 'mariadb') {
    return `${dialect}://${process.env.DB_USER || '?'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || '?'}`;
  }

  return dialect;
};

const main = async () => {
  try {
    console.log(`Base cible : ${getDatabaseLabel()}`);
    await db.sequelize.authenticate();
    await ensureDatabase();
    await run();
    console.log('Seed execute avec succes.');
  } catch (error) {
    console.error('Erreur pendant le seed :', error.message);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close().catch(() => {});
  }
};

main();
