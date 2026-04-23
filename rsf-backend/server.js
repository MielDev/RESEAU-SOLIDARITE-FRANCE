// server.js
// ═══════════════════════════════════════════════════════════════════════════════
//  RÉSEAU SOLIDARITÉ FRANCE — Serveur API Express
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const express  = require('express');
const helmet   = require('helmet');
const cors     = require('cors');
const path     = require('path');

const logger   = require('./middleware/logger');
const { globalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const db        = require('./models');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARES GLOBAUX ──────────────────────────────────────────────────────
// app.use(helmet());                          // En-têtes sécurité HTTP
app.use(cors());
app.use(express.json({ limit: '2mb' }));    // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(logger);                            // Log des requêtes
app.use(globalLimiter);                     // Rate limiting

// ─── SERVE FICHIERS STATIQUES (IMAGES) ──────────────────────────────────────────
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ─── ROUTES API ───────────────────────────────────────────────────────────────
app.use('/api', require('./routes'));

// ─── ROUTE DE SANTÉ ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'RSF API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    db:        sequelize.getDialect(),
  });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.method} ${req.path}` });
});

// ─── GESTIONNAIRE D'ERREURS GLOBAL ───────────────────────────────────────────
app.use(errorHandler);

// ─── DÉMARRAGE ────────────────────────────────────────────────────────────────
async function start() {
  try {
    // 1. Connexion DB
    await sequelize.authenticate();
    console.log('\x1b[32m✅ Base de données connectée.\x1b[0m');

    // 2. Vérification automatique des tables au démarrage
    //    alter:true = ajoute les colonnes manquantes SANS supprimer les données
    // await sequelize.sync({ alter: true });
    console.log('\x1b[32m✅ Schéma base de données synchronisé.\x1b[0m');

    // 3. Démarrage du serveur
    app.listen(PORT, () => {
      console.log('\x1b[36m');
      console.log('  ╔══════════════════════════════════════╗');
      console.log('  ║   RÉSEAU SOLIDARITÉ FRANCE — API    ║');
      console.log(`  ║   http://localhost:${PORT}             ║`);
      console.log(`  ║   Env : ${(process.env.NODE_ENV || 'development').padEnd(28)}║`);
      console.log('  ╚══════════════════════════════════════╝');
      console.log('\x1b[0m');
    });

  } catch (err) {
    console.error('\x1b[31m❌ Erreur de démarrage :\x1b[0m', err.message);
    process.exit(1);
  }
}

start();
