// seeders/seed.js
// ─── Données par défaut RSF ───────────────────────────────────────────────────
require('dotenv').config();
const db = require('../models');

const run = async () => {
  console.log('  🗑️ Nettoyage de la base de données...');
  
  // Supprimer les données dans l'ordre inverse des dépendances (clés étrangères)
  await db.MissionItem.destroy({ where: {} });
  await db.Mission.destroy({ where: {} });
  await db.EventProgram.destroy({ where: {} });
  await db.Event.destroy({ where: {} });
  
  // Supprimer les autres tables
  await db.Setting.destroy({ where: {} });
  await db.NavItem.destroy({ where: {} });
  await db.TeamMember.destroy({ where: {} });
  await db.Testimonial.destroy({ where: {} });
  await db.Actuality.destroy({ where: {} });
  await db.Accueil.destroy({ where: {} });
  await db.DonMode.destroy({ where: {} });
  await db.Action.destroy({ where: {} });

  console.log('  🌱 Insertion des données par défaut...');

  // ── Paramètres généraux ─────────────────────────────────────────────────────
  const settings = [
    { key: 'assoc_name',    value: 'Réseau Solidarité France', group: 'general', label: 'Nom de l\'association' },
    { key: 'siteName',      value: 'Réseau Solidarité France', group: 'general', label: 'Nom du site (Front)' },
    { key: 'assoc_short',   value: 'RSF',                      group: 'general', label: 'Sigle' },
    { key: 'assoc_slogan',  value: 'Unis pour aider, ensemble pour avancer', group: 'general', label: 'Slogan' },
    { key: 'footerDescription', value: 'Réseau Solidarité France accompagne les personnes en situation de précarité pour une insertion digne et durable.', group: 'general', label: 'Description footer' },
    { key: 'contact_phone', value: '+33 6 51 91 07 73',         group: 'contact', label: 'Téléphone' },
    { key: 'contact_email', value: 'contact@reseau-solidarite-france.fr', group: 'contact', label: 'Email' },
    { key: 'contact_hours', value: 'Du lundi au samedi, de 8h à 18h', group: 'contact', label: 'Horaires' },
    { key: 'contact_delay', value: 'Réponse sous 48h',          group: 'contact', label: 'Délai de réponse' },
    { key: 'addr_street',   value: '7 Rue Maréchal Lyautey',    group: 'contact', label: 'Adresse' },
    { key: 'addr_city',     value: '35000 Rennes',              group: 'contact', label: 'Ville' },
    { key: 'address',       value: '7 Rue Maréchal Lyautey, 35000 Rennes', group: 'contact', label: 'Adresse complète (Front)' },
    { key: 'addr_country',  value: 'France',                    group: 'contact', label: 'Pays' },
    { key: 'contact_web',   value: 'www.reseau-solidarite-france.fr', group: 'contact', label: 'Site web' },
    { key: 'socialLinks',   value: JSON.stringify({
      facebook: 'https://facebook.com/rsf',
      twitter: 'https://twitter.com/rsf',
      instagram: 'https://instagram.com/rsf',
      linkedin: 'https://linkedin.com/company/rsf'
    }), group: 'social', label: 'Réseaux sociaux' },
    { key: 'footer_copy',   value: '© 2025 – 2026 Réseau Solidarité France · Tous droits réservés', group: 'footer', label: 'Copyright' },
    { key: 'color_primary', value: '#2F5DFF', group: 'appearance', label: 'Couleur primaire', type: 'color' },
    { key: 'color_accent',  value: '#FF8C00', group: 'appearance', label: 'Couleur accent', type: 'color' },
    { key: 'color_support', value: '#22C55E', group: 'appearance', label: 'Couleur support', type: 'color' },
  ];
  for (const s of settings) await db.Setting.create(s);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navItems = [
    { label: 'Accueil',        href: 'index.html',              icon: 'fas fa-home', sort_order: 0 },
    { label: 'À propos',       href: 'qui-sommes-nous.html',    icon: 'fas fa-book-open', sort_order: 1 },
    { label: 'Nos missions',   href: 'nos-missions.html',       icon: 'fas fa-bullseye', sort_order: 2 },
    { label: 'Événements',     href: 'evenements.html',         icon: 'fas fa-calendar-alt', sort_order: 3 },
    { label: 'Témoignages',    href: 'temoignages.html',        icon: 'fas fa-comments', sort_order: 4 },
    { label: 'Nous rejoindre', href: 'nous-rejoindre.html',     icon: 'fas fa-hands-holding', sort_order: 5 },
    { label: 'Actualités',     href: 'actualites.html',         icon: 'fas fa-newspaper', sort_order: 6 },
    { label: 'Contact',        href: 'contact.html',            icon: 'fas fa-envelope', sort_order: 7 },
    { label: 'Faire un don',   href: 'don.html',                icon: 'fas fa-heart', sort_order: 8, is_cta: true },
  ];
  for (const n of navItems) await db.NavItem.create({ ...n, is_visible: true });

  // ── Équipe ──────────────────────────────────────────────────────────────────
  const members = [
    { name: 'TODEDJRAPOU Aimé', initials: 'TA', role: 'Président, fondateur', is_president: true,
      color1: '#2F5DFF', color2: '#7C3AED', sort_order: 0,
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
      bio: 'Titulaire de plusieurs diplômes en communication, relations internationales et management, Fort de ce parcours académique riche et de son expérience professionnelle, il met ses compétences au service de l’accompagnement des étudiants et des salariés. À travers RÉSEAU SOLIDARITÉ FRANCE, il œuvre activement pour faciliter les démarches administratives, l’orientation et l’insertion professionnelle en France. Convaincu que la réussite passe par une bonne compréhension des règles et des valeurs, il accorde une importance particulière au respect des lois de la République française, qu’il considère comme un pilier essentiel d’une intégration durable. À l’initiative du groupe Réseau Solidarité France, il s’engage chaque jour à promouvoir l’entraide, la solidarité et l’accompagnement des personnes en difficulté.',
      diplomas: JSON.stringify(['Licence en communication d’entreprise et relations internationales','Licence en chargé d’affaires','Master en communication et marketing international','Master en management des affaires','MBA Expert en Stratégie digitale']) },
    { name: 'AGBOCOU Belkis',     initials: 'AB', role: 'Comptable',                          color1: '#2F5DFF', color2: '#1E3A8A', sort_order: 1, photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop' },
    { name: 'NOUAZE Alexandre',   initials: 'NA', role: 'Responsable Appui Événements',       color1: '#7C3AED', color2: '#6366F1', sort_order: 2 },
    { name: 'DOSSOU Oluwakèmi',   initials: 'DO', role: 'Secrétaire Générale',                color1: '#FF8C00', color2: '#e07000', sort_order: 3 },
    { name: 'AGONDANOU Constant', initials: 'AC', role: 'Coordinateur',                       color1: '#22C55E', color2: '#16A34A', sort_order: 4 },
    { name: 'NOUAZE Helticia',    initials: 'NH', role: 'Responsable Événements',             color1: '#4F7CFF', color2: '#7C3AED', sort_order: 5 },
    { name: 'SEHLIN Samson',      initials: 'SS', role: 'Responsable Partenariats',           color1: '#1E3A8A', color2: '#2F5DFF', sort_order: 6 },
    { name: 'BASSALE Abiyé',      initials: 'BA', role: 'Responsable Accompagnement Administratif', color1: '#FF8C00', color2: '#7C3AED', sort_order: 7 },
    { name: 'KOSSOKO Herwick',    initials: 'KH', role: 'Responsable Solidarité',            color1: '#22C55E', color2: '#2F5DFF', sort_order: 8 },
  ];
  for (const m of members) await db.TeamMember.create(m);

  // ── Missions ────────────────────────────────────────────────────────────────
  const missions = [
    { icon: 'fas fa-file-invoice', title: 'Aide aux démarches administratives', color_name: 'primary', sort_order: 0,
      description: 'Nous accompagnons les personnes à chaque étape de leurs démarches administratives :',
      items: [
        'Dossiers CAF, APL, et autres aides sociales essentielles',
        'Demandes de titre de séjour, changement de statut légal ou administratif',
        'Inscription dans les établissements scolaires, universitaires ou de formation',
        'Aide et soutien pour les dossiers de logement (CROUS, bailleurs sociaux, etc.)',
        'Suivi personnalisé pour la carte vitale, mutuelle santé, banque et autres formalités'
      ]
    },
    { icon: 'fas fa-briefcase', title: 'Accompagnement à la formation et à l’emploi', color_name: 'secondary', sort_order: 1,
      description: 'Nous aidons nos bénéficiaires à trouver leur voie professionnelle et à s’épanouir sur le marché du travail :',
      items: [
        'Aide à la recherche de stage, d’alternance ou d’emploi stable et adapté',
        'Assistance pour la rédaction de CV et lettres de motivation percutants',
        'Préparation ciblée pour réussir les entretiens d’embauche',
        'Orientation vers des formations certifiantes, professionnalisantes ou diplômantes',
        'Mise en relation avec nos partenaires professionnels et entreprises locales'
      ]
    },
    { icon: 'fas fa-home', title: 'Soutien aux personnes sans-abri', color_name: 'accent', sort_order: 2,
      description: 'Parce que personne ne devrait dormir dehors, nous offrons un soutien indispensable :',
      items: [
        'Distribution de repas chauds, vêtements adaptés, couvertures et autres produits de première nécessité',
        'Ecoute et accompagnement humain, avec une approche bienveillante',
        'Aide à la réinsertion administrative, sociale et professionnelle',
        'Partenariats actifs avec des centres d’accueil, structures d’urgence et associations locales'
      ]
    },
    { icon: 'fas fa-handshake-angle', title: 'Entraide communautaire et réseau de solidarité', color_name: 'support', sort_order: 3,
      description: 'Notre force réside dans la mutualisation des efforts et dans le collectif :',
      items: [
        'Groupes d’entraide solidaires entre anciens et nouveaux arrivants pour un soutien actif',
        'Partage d’expériences enrichissantes, d’adresses utiles et de bons plans pour tous',
        'Orientation vers des structures partenaires pour des solutions adaptées'
      ]
    },
    { icon: 'fas fa-flag', title: 'Sensibilisation au respect des lois et à la citoyenneté', color_name: 'indigo', sort_order: 4,
      description: 'Nous encourageons nos membres et bénéficiaires à adopter un comportement citoyen exemplaire :',
      items: [
        'Connaître, respecter et appliquer les droits et devoirs en France',
        'S’insérer activement et avec dignité dans la vie citoyenne et quotidienne',
        'Participer de manière engagée à des projets solidaires et collectifs pour le bien commun'
      ]
    },
    { icon: 'fas fa-users', title: 'Activités de cohésion et de solidarité', color_name: 'pink', sort_order: 5,
      description: 'Nous croyons fermement que la solidarité passe également par la convivialité et les échanges :',
      items: [
        'Journées de rencontres chaleureuses (comme la journée annuelle au Parc des Gayeulles)',
        'Activités variées : jeux, pique-niques, karaokés, concours, sorties culturelles et bien plus',
        'Groupes de parole pour briser l’isolement et renforcer les liens humains',
        'Soutien moral pour accompagner les personnes en détresse ou en situation de solitude'
      ]
    },
  ];

  for (const { items, ...mData } of missions) {
    const mission = await db.Mission.create(mData);
    if (mission) {
      await db.MissionItem.bulkCreate(items.map((text, i) => ({ mission_id: mission.id, text, sort_order: i })));
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
  for (const t of testimonials) await db.Testimonial.create(t);

  // ── Événement annuel ────────────────────────────────────────────────────────
  const eventData = {
    title: 'Rencontre Annuelle — Journée de Cohésion',
    edition: '2ᵉ Édition', event_date: '2025-07-26',
    time_start: '10:00', time_end: '22:00',
    location: 'Parc des Gayeulles, Rennes',
    description: 'Une journée placée sous le signe de la solidarité, de la convivialité et du partage.',
    badge_label: '⭐ ÉVÉNEMENT PHARE 2025',
    contact_email: 'contact@reseau-solidarite-france.fr',
    contact_website: 'www.reseau-solidarite-france.fr',
    is_featured: true, is_published: true, sort_order: 0,
  };
  const event = await db.Event.create(eventData);
  if (event) {
    await db.EventProgram.bulkCreate([
      { event_id: event.id, icon: 'fas fa-coffee', title: 'Petit déjeuner convivial', subtitle: 'Dès 10h00', sort_order: 0 },
      { event_id: event.id, icon: 'fas fa-futbol', title: 'Football & sports collectifs', subtitle: 'Activités sportives', sort_order: 1 },
      { event_id: event.id, icon: 'fas fa-bullseye', title: 'Tir à l\'arc, laser game, Action Games', subtitle: 'Animations et jeux', sort_order: 2 },
      { event_id: event.id, icon: 'fas fa-dice', title: 'Puissance 4 géant, jeux de stratégie', subtitle: 'Concours et défis', sort_order: 3 },
      { event_id: event.id, icon: 'fas fa-utensils', title: 'Pique-nique, barbecue & spécialités maison', subtitle: 'Déjeuner et après-midi', sort_order: 4 },
      { event_id: event.id, icon: 'fas fa-microphone', title: 'Karaoké, musique et soirée festive', subtitle: 'À partir de 18h', sort_order: 5 },
    ]);
  }

  // ── Actualités ──────────────────────────────────────────────────────────────
  const actualities = [
    { icon: 'fas fa-star', title: '2ᵉ Édition — Journée annuelle au Parc des Gayeulles', category: 'Événement',
      summary: 'Notre journée annuelle de cohésion revient le 26 juillet 2025 pour une 2ᵉ édition encore plus festive.',
      link_href: 'rencontre-annuelle.html', published_at: '2025-06-01', sort_order: 0 },
    { icon: 'fas fa-globe', title: 'Distribution de nourriture à l\'international', category: 'International',
      summary: 'Nos actions solidaires dépassent les frontières — distribution de nourriture aux populations vulnérables.',
      link_href: 'actions-internationales.html', published_at: '2025-05-01', sort_order: 1 },
    { icon: 'fas fa-tshirt', title: 'Distribution de vêtements au Parc de la Touche', category: 'Action solidaire',
      summary: 'Distribution de vêtements aux personnes sans abri : un geste concret et humain au cœur de Rennes.',
      link_href: 'actions-solidaires.html', published_at: '2025-04-01', sort_order: 2 },
  ];
  for (const a of actualities) await db.Actuality.create(a);

  // ── Actions Solidaires ──────────────────────────────────────────────────────
  const actionsSolidaires = [
    {
      id: 1,
      icon: "fas fa-tshirt",
      image: "http://localhost:3001/images/actions/action-1.jpg",
      title: "Distribution au Parc de la Touche",
      category: "Distribution vêtements",
      description: "Distribution de vêtements au profit des personnes sans abri, apportant un soutien concret et un moment d'échange humain précieux.",
      page_type: "solidaire",
      icon_color: "var (--primary)",
      tag_bg: "rgba(47,93,255,.1)",
      tag_color: "var (--primary)",
      gradient: "linear-gradient(135deg, #DBEAFE,#EDE9FE)",
      is_published: true,
      sort_order: 0
    },
    {
      id: 2,
      icon: "fas fa-home",
      image: "http://localhost:3001/images/actions/action-2.jpg",
      title: "Un geste qui change une vie",
      category: "Aide au logement",
      description: "Grâce à notre association, la toiture d'une femme vivant dans des conditions précaires a été refaite. Elle peut enfin dormir à l'abri.",
      page_type: "solidaire",
      icon_color: "var (--accent)",
      tag_bg: "rgba(255,140,0,.1)",
      tag_color: "var(--accent)",
      gradient: "linear-gradient(135deg, #FEF3C7,#FDE8D8)",
      is_published: true,
      sort_order: 0
    },
    {
      id: 3,
      icon: "fas fa-handshake",
      title: "Un petit geste, un grand impact",
      category: "Collecte solidaire",
      description: "Grâce à la générosité du groupe, nous avons collecté les fonds nécessaires pour soutenir l'un de nos membres dans sa période difficile.",
      page_type: "solidaire",
      icon_color: "var (--support)",
      tag_bg: "rgba(34,197,94,.1)",
      tag_color: "var (--support)",
      gradient: "linear-gradient(135deg, #DCFCE7,#BBF7D0)",
      is_published: true,
      sort_order: 0
    },
    {
      id: 4,
      icon: "fas fa-heart",
      title: "Action solidaire individuelle",
      category: "Soutien individuel",
      description: "Au-delà de l'aide matérielle, c'est un message de solidarité, de fraternité et d'espoir que nous souhaitons transmettre.",
      page_type: "solidaire",
      icon_color: "var (--secondary)",
      tag_bg: "rgba(124,58,237,.1)",
      tag_color: "var (--secondary)",
      gradient: "linear-gradient(135deg, #EDE9FE,#DDD6FE)",
      is_published: true,
      sort_order: 0
    },
    {
      id: 5,
      icon: "fas fa-handshake",
      title: "Merci pour votre générosité",
      category: "Générosité",
      description: "Merci à Mme DOGAN et à tous nos donateurs pour leurs généreux dons. Votre soutien nous aide à continuer notre mission !",
      page_type: "solidaire",
      icon_color: "#DC2626",
      tag_bg: "rgba(239,68,68,.1)",
      tag_color: "#DC2626",
      gradient: "linear-gradient(135deg, #FEE2E2,#FECACA)",
      is_published: true,
      sort_order: 0
    },
    {
      id: 6,
      icon: "fas fa-users",
      title: "Rencontres & Échanges",
      category: "Rencontres",
      description: "Des moments réguliers de rencontre entre membres pour faire connaissance, partager des expériences et renforcer la cohésion du groupe.",
      page_type: "solidaire",
      icon_color: "var (--primary)",
      tag_bg: "rgba(47,93,255,.1)",
      tag_color: "var (--primary)",
      gradient: "linear-gradient(135deg, #DBEAFE,#BAE6FD)",
      is_published: true,
      sort_order: 0
    }
  ];
  for (const action of actionsSolidaires) await db.Action.create(action);

  // ── Contenu Accueil ─────────────────────────────────────────────────────────
  const accueilData = {
    hero_badge: 'ASSOCIATION À BUT NON LUCRATIF · RENNES',
    hero_title: 'Unis pour aider, <span class="text-primary">ensemble</span> pour avancer',
    hero_text: 'Nous accompagnons les étudiants, les salariés et les personnes en situation de précarité dans leurs démarches administratives, leur insertion professionnelle et leur vie quotidienne en France.',
    hero_features: [
      { bg: 'rgba(47,93,255,.1)', icon: 'fas fa-file-invoice', title: 'Aide administrative', text: 'CAF, titre de séjour, logement, carte vitale... Nous vous accompagnons étape par étape.' },
      { bg: 'rgba(124,58,237,.1)', icon: 'fas fa-briefcase', title: 'Emploi & Formation', text: 'CV, entretiens, alternance, formations certifiantes — nous ouvrons des portes.' },
      { bg: 'rgba(34,197,94,.1)', icon: 'fas fa-hand-holding-heart', title: 'Réseau d\'entraide', text: 'Une communauté soudée où chacun peut trouver écoute, conseil et soutien concret.' }
    ],
    stats_members: '100+',
    stats_domains: '5'
  };
  await db.Accueil.create({ id: 1, ...accueilData });

  // ── Modes de don ────────────────────────────────────────────────────────────
  const donModes = [
    { icon: 'fas fa-credit-card', title: 'Don financier ponctuel', border_color: '#2F5DFF', sort_order: 0, btn_text: 'Je fais un don ponctuel →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don ponctuel RSF',
      description: 'Un geste unique qui finance directement nos actions : repas solidaires, vêtements, ateliers d\'orientation.' },
    { icon: 'fas fa-sync-alt', title: 'Don mensuel régulier',   border_color: '#7C3AED', sort_order: 1, btn_text: 'Je m\'engage chaque mois →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don mensuel RSF',
      description: 'Un soutien régulier qui nous permet de planifier nos programmes sur le long terme.' },
    { icon: 'fas fa-box-open', title: 'Don matériel',           border_color: '#22C55E', sort_order: 2, btn_text: 'Nous contacter →',
      link_href: 'contact.html',
      description: 'Vêtements, nourriture, fournitures scolaires, produits d\'hygiène — tout est utile.' },
    { icon: 'fas fa-building', title: 'Devenir partenaire',     border_color: '#FF8C00', sort_order: 3, btn_text: 'Proposer un partenariat →',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Partenariat RSF',
      description: 'Entreprises ou particuliers, vous pouvez collaborer avec nous pour soutenir nos projets.' },
  ];
  for (const d of donModes) await db.DonMode.create(d);

  console.log('  ✅ Seed terminé — toutes les données par défaut insérées.');
};

// Exécution directe
if (require.main === module) {
  require('../config/database');
  const db2 = require('../models');
  db2.sequelize.sync({ force: false }).then(() => run()).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

module.exports = { run };
