// middleware/logger.js
// ─── Logger des requêtes HTTP (couleurs par méthode) ─────────────────────────
const morgan = require('morgan');

const colors = {
  GET:    '\x1b[32m', // vert
  POST:   '\x1b[34m', // bleu
  PUT:    '\x1b[33m', // jaune
  PATCH:  '\x1b[33m', // jaune
  DELETE: '\x1b[31m', // rouge
  RESET:  '\x1b[0m',
};

morgan.token('colored-method', (req) => {
  const c = colors[req.method] || '';
  return `${c}${req.method}${colors.RESET}`;
});

morgan.token('status-color', (req, res) => {
  const s = res.statusCode;
  const c = s < 300 ? '\x1b[32m' : s < 400 ? '\x1b[36m' : s < 500 ? '\x1b[33m' : '\x1b[31m';
  return `${c}${s}${colors.RESET}`;
});

const logger = morgan(':colored-method :url :status-color :response-time ms - :res[content-length]');

module.exports = logger;
