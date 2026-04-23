require('dotenv').config();
const db = require('../models');
const { pageContents } = require('./page-contents.data');

const serializeValue = (value) => (
  value !== null && typeof value === 'object'
    ? JSON.stringify(value)
    : value
);

const createPageContents = async () => {
  let sortOrder = 0;

  for (const [pageKey, fields] of Object.entries(pageContents)) {
    for (const [fieldKey, value] of Object.entries(fields)) {
      await db.PageContent.create({
        page_key: pageKey,
        field_key: fieldKey,
        value: serializeValue(value),
        sort_order: sortOrder++,
      });
    }
  }
};

const run = async () => {
  console.log('  Nettoyage de la base de donnees...');

  await db.MissionItem.destroy({ where: {} });
  await db.Mission.destroy({ where: {} });
  await db.EventProgram.destroy({ where: {} });
  await db.Event.destroy({ where: {} });

  await db.Setting.destroy({ where: {} });
  await db.NavItem.destroy({ where: {} });
  await db.TeamMember.destroy({ where: {} });
  await db.Testimonial.destroy({ where: {} });
  await db.Actuality.destroy({ where: {} });
  await db.Accueil.destroy({ where: {} });
  await db.DonMode.destroy({ where: {} });
  await db.Action.destroy({ where: {} });
  await db.PageContent.destroy({ where: {} });

  console.log('  Insertion des donnees par defaut...');

  const settings = [
    { key: 'assoc_name', value: 'Réseau Solidarité France', group: 'general', label: "Nom de l'association" },
    { key: 'siteName', value: 'Réseau Solidarité France', group: 'general', label: 'Nom du site' },
    { key: 'assoc_short', value: 'RSF', group: 'general', label: 'Sigle' },
    { key: 'assoc_slogan', value: 'Unis pour aider, ensemble pour avancer', group: 'general', label: 'Slogan' },
    { key: 'footerDescription', value: 'Réseau Solidarité France accompagne les personnes en situation de précarité pour une insertion digne et durable.', group: 'general', label: 'Description footer' },
    { key: 'contact_phone', value: '+33 6 51 91 07 73', group: 'contact', label: 'Téléphone' },
    { key: 'contact_email', value: 'contact@reseau-solidarite-france.fr', group: 'contact', label: 'Email' },
    { key: 'contact_hours', value: 'Du lundi au samedi, de 8h à 18h', group: 'contact', label: 'Horaires' },
    { key: 'contact_delay', value: 'Réponse sous 48h', group: 'contact', label: 'Délai de réponse' },
    { key: 'addr_street', value: '7 Rue Maréchal Lyautey', group: 'contact', label: 'Adresse' },
    { key: 'addr_city', value: '35000 Rennes', group: 'contact', label: 'Ville' },
    { key: 'address', value: '7 Rue Maréchal Lyautey, 35000 Rennes', group: 'contact', label: 'Adresse complète' },
    { key: 'addr_country', value: 'France', group: 'contact', label: 'Pays' },
    { key: 'contact_web', value: 'https://www.reseau-solidarite-france.fr', group: 'contact', label: 'Site web' },
    {
      key: 'socialLinks',
      value: JSON.stringify({
        facebook: 'https://facebook.com/rsf',
        twitter: 'https://twitter.com/rsf',
        instagram: 'https://instagram.com/rsf',
        linkedin: 'https://linkedin.com/company/rsf',
      }),
      group: 'social',
      label: 'Réseaux sociaux',
      type: 'json',
    },
    { key: 'footer_copy', value: '© 2025 – 2026 Réseau Solidarité France · Tous droits réservés', group: 'footer', label: 'Copyright' },
    { key: 'footer_signature', value: 'Made with love for solidarity · Rennes, France', group: 'footer', label: 'Signature footer' },
    { key: 'color_primary', value: '#2F5DFF', group: 'appearance', label: 'Couleur primaire', type: 'color' },
    { key: 'color_accent', value: '#FF8C00', group: 'appearance', label: 'Couleur accent', type: 'color' },
    { key: 'color_support', value: '#22C55E', group: 'appearance', label: 'Couleur support', type: 'color' },
  ];
  for (const setting of settings) {
    await db.Setting.create(setting);
  }

  const navItems = [
    { label: 'Accueil', href: '/', icon: 'fas fa-home', sort_order: 0 },
    { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous', icon: 'fas fa-book-open', sort_order: 1 },
    { label: 'Organisation', href: '/organisation', icon: 'fas fa-users', sort_order: 2 },
    { label: 'Nos missions', href: '/nos-missions', icon: 'fas fa-bullseye', sort_order: 3 },
    { label: 'Actions solidaires', href: '/actions-solidaires', icon: 'fas fa-handshake-angle', sort_order: 4 },
    { label: 'Soutien aux membres', href: '/soutien-aux-membres', icon: 'fas fa-heart', sort_order: 5 },
    { label: 'Actions internationales', href: '/actions-internationales', icon: 'fas fa-globe', sort_order: 6 },
    { label: 'Événements', href: '/evenements', icon: 'fas fa-calendar-alt', sort_order: 7 },
    { label: 'Témoignages', href: '/temoignages', icon: 'fas fa-comments', sort_order: 8 },
    { label: 'Nous rejoindre', href: '/nous-rejoindre', icon: 'fas fa-hands-holding', sort_order: 9 },
    { label: 'Actualités', href: '/actualites', icon: 'fas fa-newspaper', sort_order: 10 },
    { label: 'Contact', href: '/contact', icon: 'fas fa-envelope', sort_order: 11 },
    { label: 'Faire un don', href: '/don', icon: 'fas fa-heart', sort_order: 12, is_cta: true },
  ];
  for (const navItem of navItems) {
    await db.NavItem.create({ ...navItem, is_visible: true });
  }

  const members = [
    {
      name: 'TODEDJRAPOU Aimé',
      initials: 'TA',
      role: 'Président, fondateur',
      is_president: true,
      color1: '#2F5DFF',
      color2: '#7C3AED',
      sort_order: 0,
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
      bio: "Titulaire de plusieurs diplômes en communication, relations internationales et management, il met ses compétences au service de l'accompagnement des étudiants et des salariés. À travers RÉSEAU SOLIDARITÉ FRANCE, il œuvre activement pour faciliter les démarches administratives, l'orientation et l'insertion professionnelle en France.",
      diplomas: [
        "Licence en communication d'entreprise et relations internationales",
        "Licence en chargé d'affaires",
        'Master en communication et marketing international',
        'Master en management des affaires',
        'MBA Expert en stratégie digitale',
      ],
    },
    {
      name: 'AGBOCOU Belkis',
      initials: 'AB',
      role: 'Comptable',
      color1: '#2F5DFF',
      color2: '#1E3A8A',
      sort_order: 1,
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
    },
    { name: 'NOUAZE Alexandre', initials: 'NA', role: 'Responsable Appui Événements', color1: '#7C3AED', color2: '#6366F1', sort_order: 2 },
    { name: 'DOSSOU Oluwakèmi', initials: 'DO', role: 'Secrétaire Générale', color1: '#FF8C00', color2: '#e07000', sort_order: 3 },
    { name: 'AGONDANOU Constant', initials: 'AC', role: 'Coordinateur', color1: '#22C55E', color2: '#16A34A', sort_order: 4 },
    { name: 'NOUAZE Helticia', initials: 'NH', role: 'Responsable Événements', color1: '#4F7CFF', color2: '#7C3AED', sort_order: 5 },
    { name: 'SEHLIN Samson', initials: 'SS', role: 'Responsable Partenariats', color1: '#1E3A8A', color2: '#2F5DFF', sort_order: 6 },
    { name: 'BASSALE Abiyé', initials: 'BA', role: 'Responsable Accompagnement Administratif', color1: '#FF8C00', color2: '#7C3AED', sort_order: 7 },
    { name: 'KOSSOKO Herwick', initials: 'KH', role: 'Responsable Solidarité', color1: '#22C55E', color2: '#2F5DFF', sort_order: 8 },
  ];
  for (const member of members) {
    await db.TeamMember.create(member);
  }

  const missions = [
    {
      icon: 'fas fa-file-invoice',
      title: 'Aide aux démarches administratives',
      color_name: 'primary',
      sort_order: 0,
      description: 'Nous accompagnons les personnes à chaque étape de leurs démarches administratives :',
      items: [
        'Dossiers CAF, APL et autres aides sociales essentielles',
        'Demandes de titre de séjour, changement de statut légal ou administratif',
        'Inscription dans les établissements scolaires, universitaires ou de formation',
        'Aide et soutien pour les dossiers de logement',
        'Suivi personnalisé pour la carte vitale, la mutuelle santé, la banque et autres formalités',
      ],
    },
    {
      icon: 'fas fa-briefcase',
      title: "Accompagnement à la formation et à l'emploi",
      color_name: 'secondary',
      sort_order: 1,
      description: 'Nous aidons nos bénéficiaires à trouver leur voie professionnelle et à s’épanouir sur le marché du travail :',
      items: [
        "Aide à la recherche de stage, d'alternance ou d'emploi stable",
        'Assistance pour la rédaction de CV et lettres de motivation',
        "Préparation ciblée pour réussir les entretiens d'embauche",
        'Orientation vers des formations certifiantes ou diplômantes',
        'Mise en relation avec nos partenaires professionnels et entreprises locales',
      ],
    },
    {
      icon: 'fas fa-home',
      title: 'Soutien aux personnes sans-abri',
      color_name: 'accent',
      sort_order: 2,
      description: 'Parce que personne ne devrait dormir dehors, nous offrons un soutien indispensable :',
      items: [
        'Distribution de repas chauds, vêtements adaptés, couvertures et produits de première nécessité',
        'Écoute et accompagnement humain, avec une approche bienveillante',
        'Aide à la réinsertion administrative, sociale et professionnelle',
        "Partenariats actifs avec des centres d'accueil, structures d'urgence et associations locales",
      ],
    },
    {
      icon: 'fas fa-handshake-angle',
      title: 'Entraide communautaire et réseau de solidarité',
      color_name: 'support',
      sort_order: 3,
      description: 'Notre force réside dans la mutualisation des efforts et dans le collectif :',
      items: [
        'Groupes d’entraide solidaires entre anciens et nouveaux arrivants',
        "Partage d'expériences enrichissantes, d'adresses utiles et de bons plans",
        'Orientation vers des structures partenaires pour des solutions adaptées',
      ],
    },
    {
      icon: 'fas fa-flag',
      title: 'Sensibilisation au respect des lois et à la citoyenneté',
      color_name: 'indigo',
      sort_order: 4,
      description: 'Nous encourageons nos membres et bénéficiaires à adopter un comportement citoyen exemplaire :',
      items: [
        'Connaître, respecter et appliquer les droits et devoirs en France',
        'S’insérer activement et avec dignité dans la vie citoyenne et quotidienne',
        'Participer de manière engagée à des projets solidaires et collectifs',
      ],
    },
    {
      icon: 'fas fa-users',
      title: 'Activités de cohésion et de solidarité',
      color_name: 'pink',
      sort_order: 5,
      description: 'Nous croyons fermement que la solidarité passe également par la convivialité et les échanges :',
      items: [
        'Journées de rencontres chaleureuses comme la journée annuelle au Parc des Gayeulles',
        'Activités variées : jeux, pique-niques, karaokés, concours, sorties culturelles',
        'Groupes de parole pour briser l’isolement et renforcer les liens humains',
        'Soutien moral pour accompagner les personnes en détresse ou en situation de solitude',
      ],
    },
  ];
  for (const { items, ...missionData } of missions) {
    const mission = await db.Mission.create(missionData);
    await db.MissionItem.bulkCreate(
      items.map((text, index) => ({
        mission_id: mission.id,
        text,
        sort_order: index,
      }))
    );
  }

  const testimonials = [
    {
      first_name: 'Sarah',
      initials: 'S',
      profile: 'étudiant(e)',
      color1: '#2F5DFF',
      color2: '#1E3A8A',
      sort_order: 0,
      quote: "À mon arrivée à Rennes, j'étais perdue. L'association m'a aidée pour le logement, les papiers CAF et même pour mon inscription à l'université.",
    },
    {
      first_name: 'Franck',
      initials: 'F',
      profile: 'salarié(e)',
      color1: '#7C3AED',
      color2: '#6366F1',
      sort_order: 1,
      quote: "J'ai été orienté vers une formation en alternance et accompagné pour mon CV et mes entretiens. Grâce au réseau, j'ai décroché un contrat.",
    },
    {
      first_name: 'Lucie',
      initials: 'L',
      profile: 'bénévole',
      color1: '#FF8C00',
      color2: '#e07000',
      sort_order: 2,
      quote: "Rejoindre l'association a été l'une de mes meilleures décisions. Donner un peu de son temps pour aider quelqu'un, c'est précieux.",
    },
  ];
  for (const testimonial of testimonials) {
    await db.Testimonial.create(testimonial);
  }

  const event = await db.Event.create({
    title: 'Rencontre Annuelle — Journée de Cohésion',
    edition: '2ᵉ Édition',
    event_date: '2025-07-26',
    time_start: '10:00',
    time_end: '22:00',
    location: 'Parc des Gayeulles, Rennes',
    description: 'Une journée placée sous le signe de la solidarité, de la convivialité et du partage.',
    badge_label: 'ÉVÉNEMENT PHARE 2025',
    contact_email: 'contact@reseau-solidarite-france.fr',
    contact_website: 'www.reseau-solidarite-france.fr',
    cta_text: 'Je participe →',
    cta_href: '/nous-rejoindre',
    is_featured: true,
    is_published: true,
    sort_order: 0,
  });
  await db.EventProgram.bulkCreate([
    { event_id: event.id, icon: 'fas fa-coffee', title: 'Petit déjeuner convivial', subtitle: 'Dès 10h00', sort_order: 0 },
    { event_id: event.id, icon: 'fas fa-futbol', title: 'Football & sports collectifs', subtitle: 'Activités sportives', sort_order: 1 },
    { event_id: event.id, icon: 'fas fa-bullseye', title: "Tir à l'arc, laser game, Action Games", subtitle: 'Animations et jeux', sort_order: 2 },
    { event_id: event.id, icon: 'fas fa-dice', title: 'Puissance 4 géant, jeux de stratégie', subtitle: 'Concours et défis', sort_order: 3 },
    { event_id: event.id, icon: 'fas fa-utensils', title: 'Pique-nique, barbecue & spécialités maison', subtitle: 'Déjeuner et après-midi', sort_order: 4 },
    { event_id: event.id, icon: 'fas fa-microphone-lines', title: 'Karaoké, musique et soirée festive', subtitle: 'À partir de 18h', sort_order: 5 },
  ]);

  const actualities = [
    {
      icon: 'fas fa-star',
      title: '2ᵉ Édition — Journée annuelle au Parc des Gayeulles',
      category: 'Événement',
      summary: 'Notre journée annuelle de cohésion revient le 26 juillet 2025 pour une 2ᵉ édition encore plus festive.',
      link_href: '/rencontre-annuelle',
      published_at: '2025-06-01',
      sort_order: 0,
    },
    {
      icon: 'fas fa-globe',
      title: "Distribution de nourriture à l'international",
      category: 'International',
      summary: 'Nos actions solidaires dépassent les frontières — distribution de nourriture aux populations vulnérables.',
      link_href: '/actions-internationales',
      published_at: '2025-05-01',
      sort_order: 1,
    },
    {
      icon: 'fas fa-tshirt',
      title: 'Distribution de vêtements au Parc de la Touche',
      category: 'Action solidaire',
      summary: 'Distribution de vêtements aux personnes sans abri : un geste concret et humain au cœur de Rennes.',
      link_href: '/actions-solidaires',
      published_at: '2025-04-01',
      sort_order: 2,
    },
  ];
  for (const actuality of actualities) {
    await db.Actuality.create(actuality);
  }

  const actions = [
    {
      icon: 'fas fa-tshirt',
      image: 'http://localhost:3001/images/actions/action-1.jpg',
      title: 'Distribution au Parc de la Touche',
      category: 'Distribution vêtements',
      description: "Distribution de vêtements au profit des personnes sans abri, apportant un soutien concret et un moment d'échange humain précieux.",
      page_type: 'solidaire',
      icon_color: 'var(--primary)',
      tag_bg: 'rgba(47,93,255,.1)',
      tag_color: 'var(--primary)',
      gradient: 'linear-gradient(135deg, #DBEAFE,#EDE9FE)',
      is_published: true,
      sort_order: 0,
    },
    {
      icon: 'fas fa-home',
      image: 'http://localhost:3001/images/actions/action-2.jpg',
      title: 'Un geste qui change une vie',
      category: 'Aide au logement',
      description: "Grâce à notre association, la toiture d'une femme vivant dans des conditions précaires a été refaite. Elle peut enfin dormir à l'abri.",
      page_type: 'solidaire',
      icon_color: 'var(--accent)',
      tag_bg: 'rgba(255,140,0,.1)',
      tag_color: 'var(--accent)',
      gradient: 'linear-gradient(135deg, #FEF3C7,#FDE8D8)',
      is_published: true,
      sort_order: 1,
    },
    {
      icon: 'fas fa-handshake',
      title: 'Un petit geste, un grand impact',
      category: 'Collecte solidaire',
      description: "Grâce à la générosité du groupe, nous avons collecté les fonds nécessaires pour soutenir l'un de nos membres dans sa période difficile.",
      page_type: 'solidaire',
      icon_color: 'var(--support)',
      tag_bg: 'rgba(34,197,94,.1)',
      tag_color: 'var(--support)',
      gradient: 'linear-gradient(135deg, #DCFCE7,#BBF7D0)',
      is_published: true,
      sort_order: 2,
    },
    {
      icon: 'fas fa-heart',
      title: 'Action solidaire individuelle',
      category: 'Soutien individuel',
      description: "Au-delà de l'aide matérielle, c'est un message de solidarité, de fraternité et d'espoir que nous souhaitons transmettre.",
      page_type: 'solidaire',
      icon_color: 'var(--secondary)',
      tag_bg: 'rgba(124,58,237,.1)',
      tag_color: 'var(--secondary)',
      gradient: 'linear-gradient(135deg, #EDE9FE,#DDD6FE)',
      is_published: true,
      sort_order: 3,
    },
    {
      icon: 'fas fa-handshake',
      title: 'Merci pour votre générosité',
      category: 'Générosité',
      description: 'Merci à Mme DOGAN et à tous nos donateurs pour leurs généreux dons. Votre soutien nous aide à continuer notre mission.',
      page_type: 'solidaire',
      icon_color: '#DC2626',
      tag_bg: 'rgba(239,68,68,.1)',
      tag_color: '#DC2626',
      gradient: 'linear-gradient(135deg, #FEE2E2,#FECACA)',
      is_published: true,
      sort_order: 4,
    },
    {
      icon: 'fas fa-users',
      title: 'Rencontres & échanges',
      category: 'Rencontres',
      description: 'Des moments réguliers de rencontre entre membres pour faire connaissance, partager des expériences et renforcer la cohésion du groupe.',
      page_type: 'solidaire',
      icon_color: 'var(--primary)',
      tag_bg: 'rgba(47,93,255,.1)',
      tag_color: 'var(--primary)',
      gradient: 'linear-gradient(135deg, #DBEAFE,#BAE6FD)',
      is_published: true,
      sort_order: 5,
    },
  ];
  for (const action of actions) {
    await db.Action.create(action);
  }

  await db.Accueil.create({
    id: 1,
    hero_badge: 'ASSOCIATION À BUT NON LUCRATIF · RENNES',
    hero_title: 'Unis pour aider, <span class="text-primary">ensemble</span> pour avancer',
    hero_text: "Nous accompagnons les étudiants, les salariés et les personnes en situation de précarité dans leurs démarches administratives, leur insertion professionnelle et leur vie quotidienne en France.",
    hero_features: [
      { bg: 'rgba(47,93,255,.1)', icon: 'fas fa-file-invoice', title: 'Aide administrative', text: 'CAF, titre de séjour, logement, carte vitale... Nous vous accompagnons étape par étape.' },
      { bg: 'rgba(124,58,237,.1)', icon: 'fas fa-briefcase', title: 'Emploi & Formation', text: 'CV, entretiens, alternance, formations certifiantes — nous ouvrons des portes.' },
      { bg: 'rgba(34,197,94,.1)', icon: 'fas fa-hand-holding-heart', title: "Réseau d'entraide", text: 'Une communauté soudée où chacun peut trouver écoute, conseil et soutien concret.' },
    ],
    stats_members: '100+',
    stats_domains: '5',
  });

  await createPageContents();

  const donModes = [
    {
      icon: 'fas fa-credit-card',
      title: 'Don financier ponctuel',
      description: "Un geste unique qui finance directement nos actions : repas solidaires, vêtements, ateliers d'orientation et aide administrative.",
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don ponctuel RSF',
      btn_text: 'Je fais un don ponctuel →',
      border_color: '#2F5DFF',
      sort_order: 0,
      is_active: true,
    },
    {
      icon: 'fas fa-sync-alt',
      title: 'Don mensuel régulier',
      description: 'Un soutien régulier qui nous permet de planifier nos programmes sur le long terme et d’avoir plus d’impact.',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Don mensuel RSF',
      btn_text: "Je m'engage chaque mois →",
      border_color: '#7C3AED',
      sort_order: 1,
      is_active: true,
    },
    {
      icon: 'fas fa-box-open',
      title: 'Don matériel',
      description: "Nous acceptons les dons en nature : vêtements, nourriture, fournitures scolaires et produits d'hygiène.",
      link_href: '/contact',
      btn_text: 'Nous contacter →',
      border_color: '#22C55E',
      sort_order: 2,
      is_active: true,
    },
    {
      icon: 'fas fa-building-user',
      title: 'Devenir partenaire',
      description: 'Entreprises ou particuliers, vous pouvez collaborer avec nous pour soutenir nos projets et contribuer à une solidarité active.',
      link_href: 'mailto:contact@reseau-solidarite-france.fr?subject=Partenariat RSF',
      btn_text: 'Proposer un partenariat →',
      border_color: '#FF8C00',
      sort_order: 3,
      is_active: true,
    },
  ];
  for (const donMode of donModes) {
    await db.DonMode.create(donMode);
  }

  console.log('  Seed termine — toutes les donnees par defaut ont ete inserees.');
};

if (require.main === module) {
  require('../config/database');
  const db2 = require('../models');
  db2.sequelize
    .sync({ force: false })
    .then(() => run())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { run };
