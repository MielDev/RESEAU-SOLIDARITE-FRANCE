# 🔵 RSF Backend — API Réseau Solidarité France

Backend Express.js avec Sequelize ORM pour la gestion du site RSF.

---

## 📁 Structure du projet

```
rsf-backend/
├── config/
│   └── database.js          ← Configuration Sequelize (SQLite / MySQL / PostgreSQL)
│
├── models/
│   ├── index.js             ← Registre + associations entre modèles
│   ├── User.js              ← Utilisateurs admin (bcrypt, JWT)
│   ├── PageContent.js       ← Contenu éditable par page (clé/valeur)
│   ├── TeamMember.js        ← Membres de l'équipe
│   ├── Mission.js           ← Missions de l'association
│   ├── MissionItem.js       ← Points de liste liés à une mission
│   ├── Action.js            ← Actions solidaires
│   ├── Testimonial.js       ← Témoignages
│   ├── Event.js             ← Événements
│   ├── EventProgram.js      ← Programme d'un événement
│   ├── Actuality.js         ← Actualités
│   ├── DonMode.js           ← Modes de don
│   ├── Setting.js           ← Paramètres globaux (clé/valeur)
│   └── NavItem.js           ← Éléments de navigation
│
├── controllers/
│   ├── authController.js    ← Login, /me, changement mot de passe
│   ├── pageController.js    ← CRUD contenu des pages
│   ├── teamController.js    ← CRUD équipe + réordonnancement
│   ├── missionController.js ← CRUD missions + items
│   ├── settingsController.js← Lecture/écriture paramètres globaux
│   └── crudFactory.js       ← Fabrique générique CRUD réutilisable
│
├── routes/
│   ├── index.js             ← Routeur principal (monte tous les sous-routeurs)
│   ├── auth.js              ← POST /login, GET /me
│   ├── public.js            ← API publique (sans auth, pour le site front)
│   ├── pages.js             ← /api/pages/:pageKey
│   ├── team.js              ← /api/team
│   ├── missions.js          ← /api/missions
│   ├── actions.js           ← /api/actions
│   ├── testimonials.js      ← /api/testimonials
│   ├── events.js            ← /api/events
│   ├── actualities.js       ← /api/actualities
│   ├── don.js               ← /api/don
│   ├── nav.js               ← /api/nav
│   └── settings.js          ← /api/settings
│
├── middleware/
│   ├── auth.js              ← Vérification JWT + rôles
│   ├── validate.js          ← Validation express-validator
│   ├── errorHandler.js      ← Gestionnaire d'erreurs global
│   ├── logger.js            ← Logger HTTP coloré (morgan)
│   └── rateLimiter.js       ← Rate limiting (global + auth)
│
├── scripts/
│   └── checkDatabase.js     ← ⭐ SCRIPT PRINCIPAL : vérifie/crée/met à jour la BDD
│
├── seeders/
│   └── seed.js              ← Données par défaut RSF
│
├── .env.example             ← Variables d'environnement (à copier en .env)
├── package.json
└── server.js                ← Point d'entrée
```

---

## 🚀 Installation et démarrage

### 1. Prérequis
- Node.js ≥ 18
- npm ≥ 9

### 2. Installation
```bash
cd rsf-backend
npm install
```

### 3. Configuration
```bash
cp .env.example .env
# Éditez .env selon votre configuration
```

### 4. Vérification / création de la base de données
```bash
# ⭐ Commande principale — à lancer à chaque mise à jour du backend
npm run db:check

# Avec insertion des données par défaut
npm run db:check -- --seed

# Reset complet (⚠️ supprime toutes les données)
npm run db:reset
```

### 5. Lancer le serveur
```bash
# Développement (redémarrage automatique)
npm run dev

# Production
npm start
```

---

## 🗄️ Script de vérification de la base de données

Le script `scripts/checkDatabase.js` est **la pièce centrale** du backend.

### Ce qu'il fait :

| Étape | Action |
|-------|--------|
| 1 | Teste la connexion à la base de données |
| 2 | Liste toutes les tables existantes |
| 3 | Pour chaque modèle : vérifie si la table existe |
| 4 | Table absente → **la crée automatiquement** |
| 5 | Table présente → **compare les colonnes** |
| 6 | Colonne manquante → **l'ajoute avec ALTER TABLE** |
| 7 | Crée l'admin par défaut si la table users est vide |
| 8 | Affiche un rapport complet coloré |

### Options :
```bash
node scripts/checkDatabase.js            # Vérification normale
node scripts/checkDatabase.js --seed     # + données par défaut
node scripts/checkDatabase.js --reset    # Reset complet + recréation
```

### Cas d'usage :
- **Premier lancement** : crée toutes les tables
- **Après ajout d'un modèle** : crée la nouvelle table
- **Après ajout d'un champ** : ajoute la colonne manquante
- **En production** : vérifie sans risque (ne supprime rien)

---

## 🔌 Endpoints API

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Connexion (retourne JWT) |
| GET  | `/api/auth/me` | Profil utilisateur connecté |
| POST | `/api/auth/change-password` | Changer le mot de passe |

### API Publique (sans authentification)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/public/pages/:pageKey` | Contenu d'une page |
| GET | `/api/public/team` | Membres de l'équipe |
| GET | `/api/public/missions` | Missions + items |
| GET | `/api/public/testimonials` | Témoignages publiés |
| GET | `/api/public/events` | Événements + programme |
| GET | `/api/public/actualities` | Actualités publiées |
| GET | `/api/public/settings` | Paramètres globaux |
| GET | `/api/public/nav` | Navigation |

### API Admin (JWT requis)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET/PUT | `/api/pages/:pageKey` | Contenu de page |
| GET/POST/PUT/DELETE | `/api/team` | Équipe |
| PUT | `/api/team/reorder` | Réordonner |
| GET/POST/PUT/DELETE | `/api/missions` | Missions |
| GET/POST/PUT/DELETE | `/api/testimonials` | Témoignages |
| GET/POST/PUT/DELETE | `/api/events` | Événements |
| GET/POST/PUT/DELETE | `/api/actualities` | Actualités |
| GET/POST/PUT/DELETE | `/api/don` | Modes de don |
| GET/PUT | `/api/settings` | Paramètres globaux |
| GET/PUT | `/api/nav` | Navigation |

### Santé
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Statut du serveur |

---

## 🗃️ Bases de données supportées

| Base | Configuration |
|------|--------------|
| **SQLite** | `DB_DIALECT=sqlite` (défaut, aucune installation) |
| **MySQL** | `DB_DIALECT=mysql` + DB_HOST, DB_NAME, DB_USER, DB_PASS |
| **PostgreSQL** | `DB_DIALECT=postgres` + DB_HOST, DB_NAME, DB_USER, DB_PASS |

---

## 🔐 Sécurité

- **JWT** (7 jours par défaut, configurable)
- **Bcrypt** pour les mots de passe (12 rounds)
- **Helmet** pour les en-têtes HTTP
- **CORS** configurable par origine
- **Rate limiting** : 200 req/15min globalement, 10 req/15min sur /login
- **Validation** des entrées avec express-validator
