// seeders/seed.js
// ─── Données par défaut RSF ───────────────────────────────────────────────────
require('dotenv').config();
const db = require('../models');

const run = async () => {
  // ── Paramètres généraux ─────────────────────────────────────────────────────
  const settings = [
    { key: 'assoc_name',    value: 'Réseau Solidarité France', group: 'general', label: 'Nom de l\'association' },
    { key: 'assoc_short',   value: 'RSF',                      group: 'general', label: 'Sigle' },
    { key: 'assoc_slogan',  value: 'Unis pour aider, ensemble pour avancer', group: 'general', label: 'Slogan' },
    { key: 'contact_phone', value: '+33 6 51 91 07 73',         group: 'contact', label: 'Téléphone' },
    { key: 'contact_email', value: 'contact@reseau-solidarite-france.fr', group: 'contact', label: 'Email' },
    { key: 'contact_hours', value: 'Du lundi au samedi, de 8h à 18h', group: 'contact', label: 'Horaires' },
    { key: 'contact_delay', value: 'Réponse sous 48h',          group: 'contact', label: 'Délai de réponse' },
    { key: 'addr_street',   value: '7 Rue Maréchal Lyautey',    group: 'contact', label: 'Adresse' },
    { key: 'addr_city',     value: '35000 Rennes',              group: 'contact', label: 'Ville' },
    { key: 'addr_country',  value: 'France',                    group: 'contact', label: 'Pays' },
    { key: 'contact_web',   value: 'www.reseau-solidarite-france.fr', group: 'contact', label: 'Site web' },
    { key: 'footer_copy',   value: '© 2025 – 2026 Réseau Solidarité France · Tous droits réservés', group: 'footer', label: 'Copyright' },
    { key: 'color_primary', value: '#2F5DFF', group: 'appearance', label: 'Couleur primaire', type: 'color' },
    { key: 'color_accent',  value: '#FF8C00', group: 'appearance', label: 'Couleur accent', type: 'color' },
    { key: 'color_support', value: '#22C55E', group: 'appearance', label: 'Couleur support', type: 'color' },
  ];
  for (const s of settings) await db.Setting.upsert(s);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navItems = [
    { label: 'Accueil',        href: 'index.html',              icon: '🏠', sort_order: 0 },
    { label: 'À propos',       href: 'qui-sommes-nous.html',    icon: '📖', sort_order: 1 },
    { label: 'Nos missions',   href: 'nos-missions.html',       icon: '🎯', sort_order: 2 },
    { label: 'Événements',     href: 'evenements.html',         icon: '📅', sort_order: 3 },
    { label: 'Témoignages',    href: 'temoignages.html',        icon: '💬', sort_order: 4 },
    { label: 'Nous rejoindre', href: 'nous-rejoindre.html',     icon: '🙌', sort_order: 5 },
    { label: 'Actualités',     href: 'actualites.html',         icon: '📰', sort_order: 6 },
    { label: 'Contact',        href: 'contact.html',            icon: '✉️', sort_order: 7 },
    { label: 'Faire un don',   href: 'don.html',                icon: '❤️', sort_order: 8, is_cta: true },
  ];
  for (const n of navItems) await db.NavItem.upsert({ ...n, is_visible: true });

  // ── Équipe ──────────────────────────────────────────────────────────────────
  const members = [
    { name: 'TODEDJRAPOU Aimé', initials: 'AT', role: 'Président fondateur', is_president: true,
      color1: '#2F5DFF', color2: '#7C3AED', sort_order: 0,
      bio: 'Titulaire de plusieurs diplômes en communication, relations internationales et management.',
      diplomas: JSON.stringify(['Licence Communication & Relations Internationales','Licence Chargé d\'affaires','Master Communication & Marketing International','Master Management des Affaires','MBA Expert en Stratégie Digitale']) },
    { name: 'AGBOCOU Belkis',     initials: 'AB', role: 'Comptable',                          color1: '#2F5DFF', color2: '#1E3A8A', sort_order: 1 },
    { name: 'NOUAZE Alexandre',   initials: 'NA', role: 'Responsable Appui Événements',       color1: '#7C3AED', color2: '#6366F1', sort_order: 2 },
    { name: 'DOSSOU Oluwakèmi',   initials: 'DO', role: 'Secrétaire Générale',                color1: '#FF8C00', color2: '#e07000', sort_order: 3 },
    { name: 'AGONDANOU Constant', initials: 'AC', role: 'Coordinateur',                       color1: '#22C55E', color2: '#16A34A', sort_order: 4 },
    { name: 'NOUAZE Helticia',    initials: 'NH', role: 'Responsable Événements',             color1: '#4F7CFF', color2: '#7C3AED', sort_order: 5 },
    { name: 'SEHLIN Samson',      initials: 'SS', role: 'Responsable Partenariats',           color1: '#1E3A8A', color2: '#2F5DFF', sort_order: 6 },
    { name: 'BASSALE Abiyé',      initials: 'BA', role: 'Responsable Accompagnement Administratif', color1: '#FF8C00', color2: '#7C3AED', sort_order: 7 },
    { name: 'KOSSOKO Herwick',    initials: 'KH', role: 'Responsable Solidarité',            color1: '#22C55E', color2: '#2F5DFF', sort_order: 8 },
  ];
  for (const m of members) await db.TeamMember.upsert(m);

  // ── Missions ────────────────────────────────────────────────────────────────
  const missions = [
    { icon: '📋', title: 'Aide aux démarches administratives', color_name: 'primary', sort_order: 0,
      items: ['Dossiers CAF, APL et autres aides sociales','Demandes de titre de séjour, changement de statut','Inscription scolaire, universitaire ou en formation','Dossiers de logement (CROUS, bailleurs sociaux)','Carte vitale, mutuelle, banque et formalités'] },
    { icon: '💼', title: 'Accompagnement formation & emploi', color_name: 'secondary', sort_order: 1,
      items: ['Recherche de stage, alternance ou emploi','Aide à la rédaction de CV et lettres de motivation','Préparation aux entretiens d\'embauche','Orientation vers des formations certifiantes','Mise en relation avec nos partenaires professionnels'] },
    { icon: '🏠', title: 'Soutien aux personnes sans-abri', color_name: 'accent', sort_order: 2,
      items: ['Distribution de repas chauds, vêtements, couvertures','Écoute et accompagnement humain bienveillant','Aide à la réinsertion administrative et sociale','Partenariats avec centres d\'accueil et associations'] },
    { icon: '🤝', title: 'Entraide communautaire', color_name: 'support', sort_order: 3,
      items: ['Groupes d\'entraide entre anciens et nouveaux arrivants','Partage d\'expériences et d\'adresses utiles','Groupes de parole pour briser l\'isolement'] },
    { icon: '🇫🇷', title: 'Sensibilisation citoyenne', color_name: 'gray', sort_order: 4,
      items: ['Connaître, respecter et appliquer les droits et devoirs','S\'insérer avec dignité dans la vie citoyenne','Participer à des projets solidaires collectifs'] },
    { icon: '🎭', title: 'Cohésion & convivialité', color_name: 'gray', sort_order: 5,
      items: ['Journées de rencontre (Parc des Gayeulles…)','Jeux, pique-niques, karaoké, sorties culturelles','Groupes de parole et soutien moral'] },
  ];
  for (const { items, ...mData } of missions) {
    const [m] = await db.Mission.upsert(mData);
    const mission = await db.Mission.findOne({ where: { title: mData.title } });
    if (mission) {
      const existing = await db.MissionItem.count({ where: { mission_id: mission.id } });
      if (existing === 0) {
        await db.MissionItem.bulkCreate(items.map((text, i) => ({ mission_id: mission.id, text, sort_order: i })));
      }
    }
  }

  // ── Témoignages ─────────────────────────────────────────────────────────────
  const testimonials = [
    { first_name: 'Sarah',   initials: 'S', profile: 'étudiant(e)', color1: '#2F5DFF', color2: '#1E3A8A', sort_order: 0,
      quote: 'À mon arrivée à Rennes, j\'étais perdue. L\'association m\'a aidée pour le logement, les papiers CAF, et même pour mon inscription à l\'université. Aujourd\'hui, je suis en licence et je me sens entourée. Merci du fond du cœur.' },
    { first_name: 'Franck',  initials: 'F', profile: 'salarié(e)',  color1: '#7C3AED', color2: '#6366F1', sort_order: 1,
      quote: 'J\'ai été orienté par le Réseau vers une formation en alternance, j\'ai reçu de l\'aide pour mon CV et mes entretiens. Grâce à eux, j\'ai décroché un contrat dans une grande entreprise.' },
    { first_name: 'Lucie',   initials: 'L', profile: 'bénévole',   color1: '#FF8C00', color2: '#e07000', sort_order: 2,
      quote: 'Rejoindre l\'association a été l\'une de mes meilleures décisions. Donner un peu de son temps pour aider quelqu\'un, c\'est précieux. J\'ai rencontré des personnes formidables.' },
    { first_name: 'Judith',  initials: 'J', profile: 'étudiant(e)', color1: '#22C55E', color2: '#16A34A', sort_order: 3,
      quote: 'Grâce à RÉSEAU SOLIDARITÉ FRANCE, j\'ai pu renouveler mon titre de séjour sans stress. J\'étais vraiment perdue au début, mais j\'ai été accompagnée étape par étape. Aujourd\'hui tout est en règle.' },
    { first_name: 'Hélène',  initials: 'H', profile: 'étudiant(e)', color1: '#4F7CFF', color2: '#7C3AED', sort_order: 4,
      quote: 'Je traversais une période très difficile. L\'association m\'a apporté une aide financière qui m\'a vraiment soulagé. Mais au-delà de ça, j\'ai surtout trouvé du soutien et de l\'écoute.' },
    { first_name: 'Capello', initials: 'C', profile: 'étudiant(e)', color1: '#1E3A8A', color2: '#2F5DFF', sort_order: 5,
      quote: 'J\'ai pu améliorer mon CV et me préparer aux entretiens grâce aux conseils du réseau. Quelques semaines après, j\'ai trouvé un travail. Je recommande vraiment cette association.' },
    { first_name: 'Parfait', initials: 'P', profile: 'étudiant(e)', color1: '#22C55E', color2: '#16A34A', sort_order: 6,
      quote: 'Intégrer le groupe m\'a permis de rencontrer des personnes formidables. C\'est plus qu\'une association, c\'est une vraie famille.' },
  ];
  for (const t of testimonials) await db.Testimonial.upsert(t);

  // ── Événement annuel ────────────────────────────────────────────────────────
  const [event] = await db.Event.upsert({
    title: 'Rencontre Annuelle — Journée de Cohésion',
    edition: '2ᵉ Édition', event_date: '2025-07-26',
    time_start: '10:00', time_end: '22:00',
    location: 'Parc des Gayeulles, Rennes',
    description: 'Une journée placée sous le signe de la solidarité, de la convivialité et du partage.',
    badge_label: '⭐ ÉVÉNEMENT PHARE 2025',
    contact_email: 'contact@reseau-solidarite-france.fr',
    contact_website: 'www.reseau-solidarite-france.fr',
    is_featured: true, is_published: true, sort_order: 0,
  });
  const ev = await db.Event.findOne({ where: { title: 'Rencontre Annuelle — Journée de Cohésion' } });
  if (ev) {
    const existProg = await db.EventProgram.count({ where: { event_id: ev.id } });
    if (existProg === 0) {
      await db.EventProgram.bulkCreate([
        { event_id: ev.id, icon: '🥐', title: 'Petit déjeuner convivial', subtitle: 'Dès 10h00', sort_order: 0 },
        { event_id: ev.id, icon: '⚽', title: 'Football & sports collectifs', subtitle: 'Activités sportives', sort_order: 1 },
        { event_id: ev.id, icon: '🎯', title: 'Tir à l\'arc, laser game, Action Games', subtitle: 'Animations et jeux', sort_order: 2 },
        { event_id: ev.id, icon: '🎲', title: 'Puissance 4 géant, jeux de stratégie', subtitle: 'Concours et défis', sort_order: 3 },
        { event_id: ev.id, icon: '🍗', title: 'Pique-nique, barbecue & spécialités maison', subtitle: 'Déjeuner et après-midi', sort_order: 4 },
        { event_id: ev.id, icon: '🎤', title: 'Karaoké, musique et soirée festive', subtitle: 'À partir de 18h', sort_order: 5 },
      ]);
    }
  }

  // ── Actualités ──────────────────────────────────────────────────────────────
  const actualities = [
    { icon: '🎉', title: '2ᵉ Édition — Journée annuelle au Parc des Gayeulles', category: 'Événement',
      summary: 'Notre journée annuelle de cohésion revient le 26 juillet 2025 pour une 2ᵉ édition encore plus festive.',
      link_href: 'rencontre-annuelle.html', published_at: '2025-06-01', sort_order: 0 },
    { icon: '🌍', title: 'Distribution de nourriture à l\'international', category: 'International',
      summary: 'Nos actions solidaires dépassent les frontières — distribution de nourriture aux populations vulnérables.',
      link_href: 'actions-internationales.html', published_at: '2025-05-01', sort_order: 1 },
    { icon: '👕', title: 'Distribution de vêtements au Parc de la Touche', category: 'Action solidaire',
      summary: 'Distribution de vêtements aux personnes sans abri : un geste concret et humain au cœur de Rennes.',
      link_href: 'actions-solidaires.html', published_at: '2025-04-01', sort_order: 2 },
  ];
  for (const a of actualities) await db.Actuality.upsert(a);

  // ── Modes de don ────────────────────────────────────────────────────────────
  const donModes = [
    { icon: '💳', title: 'Don financier ponctuel', border_color: '#2F5DFF', sort_order: 0, btn_text: 'Je fais un don ponctuel →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don ponctuel RSF',
      description: 'Un geste unique qui finance directement nos actions : repas solidaires, vêtements, ateliers d\'orientation.' },
    { icon: '🔄', title: 'Don mensuel régulier',   border_color: '#7C3AED', sort_order: 1, btn_text: 'Je m\'engage chaque mois →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don mensuel RSF',
      description: 'Un soutien régulier qui nous permet de planifier nos programmes sur le long terme.' },
    { icon: '📦', title: 'Don matériel',           border_color: '#22C55E', sort_order: 2, btn_text: 'Nous contacter →',
      link_href: 'contact.html',
      description: 'Vêtements, nourriture, fournitures scolaires, produits d\'hygiène — tout est utile.' },
    { icon: '🏢', title: 'Devenir partenaire',     border_color: '#FF8C00', sort_order: 3, btn_text: 'Proposer un partenariat →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Partenariat RSF',
      description: 'Entreprises ou particuliers, vous pouvez collaborer avec nous pour soutenir nos projets.' },
  ];
  for (const d of donModes) await db.DonMode.upsert(d);

  console.log('  ✅ Seed terminé — toutes les données par défaut insérées.');
};

// Exécution directe
if (require.main === module) {
  require('../config/database');
  const db2 = require('../models');
  db2.sequelize.sync({ force: false }).then(() => run()).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

module.exports = { run };
