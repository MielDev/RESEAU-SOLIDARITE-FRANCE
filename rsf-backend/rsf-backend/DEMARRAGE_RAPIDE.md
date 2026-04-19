# 🚀 Démarrage rapide — RSF Backend

## Prérequis
- **Node.js** version 18 ou supérieure → https://nodejs.org
- Un terminal (cmd, PowerShell, Terminal macOS/Linux)

---

## Étape 1 — Installer les dépendances

```bash
cd rsf-backend
npm install
```

---

## Étape 2 — Configurer l'environnement

```bash
# Copier le fichier de configuration
cp .env.example .env
```

Le fichier `.env` contient :
- `PORT=3001` — port du serveur
- `DB_DIALECT=sqlite` — base de données SQLite (aucune installation requise)
- `JWT_SECRET` — **changez cette valeur en production !**
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — identifiants du premier admin

---

## Étape 3 — Créer la base de données

```bash
# Vérifier / créer toutes les tables + insérer les données par défaut
npm run db:seed
```

Ce que fait cette commande :
1. ✅ Teste la connexion
2. ✅ Crée toutes les tables manquantes
3. ✅ Ajoute les colonnes manquantes si une table existe déjà
4. ✅ Crée le compte administrateur
5. ✅ Insère toutes les données par défaut (équipe, missions, témoignages…)

---

## Étape 4 — Lancer le serveur

```bash
# Mode développement (redémarrage automatique à chaque modification)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur : **http://localhost:3001**

Vérifiez que tout fonctionne :
```
http://localhost:3001/health
```

---

## Étape 5 — Se connecter à l'API

```bash
# Connexion (remplacez par vos identifiants du .env)
POST http://localhost:3001/api/auth/login
{
  "email": "admin@reseau-solidarite-france.fr",
  "password": "Admin@RSF2025!"
}
```

Utilisez le fichier `api-tests.http` avec l'extension **REST Client** de VSCode pour tester tous les endpoints.

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer en mode développement |
| `npm start` | Démarrer en production |
| `npm run db:check` | Vérifier la base (tables + colonnes) |
| `npm run db:seed` | Vérifier + insérer données par défaut |
| `npm run db:reset` | ⚠️ Tout supprimer et recréer |
| `npm run migrate` | Exécuter les nouvelles migrations |
| `npm run migrate:list` | Voir l'état des migrations |
| `npm run migrate:undo` | Annuler la dernière migration |

---

## Structure de la base de données

| Table | Description |
|-------|-------------|
| `users` | Administrateurs du back-office |
| `page_contents` | Contenus éditables par page |
| `team_members` | Membres de l'équipe |
| `missions` | Missions de l'association |
| `mission_items` | Points de liste liés aux missions |
| `actions` | Actions solidaires |
| `testimonials` | Témoignages |
| `events` | Événements |
| `event_programs` | Programme des événements |
| `actualities` | Actualités |
| `don_modes` | Modes de don |
| `settings` | Paramètres globaux |
| `nav_items` | Navigation |
| `contact_messages` | Messages du formulaire de contact |
| `_migrations` | Suivi des migrations |

---

## En cas de problème

**Erreur de port déjà utilisé :**
```bash
# Changer le port dans .env
PORT=3002
```

**Réinitialiser complètement :**
```bash
npm run db:reset
```

**Ajouter un nouveau champ à un modèle :**
1. Modifier le fichier dans `models/`
2. Ajouter une migration dans `scripts/migrate.js`
3. Relancer `npm run migrate`

---

## Connexion du back-office HTML

Dans vos fichiers admin HTML, configurez l'URL de l'API :
```javascript
const API_URL = 'http://localhost:3001/api';

// Exemple : charger les membres de l'équipe
const res = await fetch(`${API_URL}/public/team`);
const { data } = await res.json();
```
