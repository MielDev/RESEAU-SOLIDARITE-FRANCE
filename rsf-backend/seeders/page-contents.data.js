const pageContents = {
  accueil: {
    heroActions: [
      { label: 'Decouvrir nos missions ->', href: '/nos-missions', variant: 'primary' },
      { label: 'Rejoindre le reseau', href: '/nous-rejoindre', variant: 'outline' },
      { label: 'Faire un don', href: '/don', variant: 'accent', icon: 'fas fa-heart' },
    ],
    statsCards: [
      { key: 'members', label: 'Membres actifs', borderColor: 'var(--primary)' },
      { key: 'domains', label: "Domaines d'action", borderColor: 'var(--accent)' },
      { value: '∞', label: 'Solidarite', borderColor: 'var(--support)' },
    ],
    navigation: {
      label: 'Naviguer',
      title: 'Tout ce que nous faisons',
      items: [
        {
          href: '/qui-sommes-nous',
          icon: 'fas fa-book-open',
          title: 'Qui sommes-nous ?',
          description: 'Notre histoire, nos valeurs et notre engagement au quotidien.',
          iconColor: 'var(--primary)',
          iconBackground: 'rgba(47,93,255,.1)',
        },
        {
          href: '/organisation',
          icon: 'fas fa-users',
          title: 'Organisation',
          description: 'President fondateur et equipe structuree et engagee.',
          iconColor: 'var(--secondary)',
          iconBackground: 'rgba(124,58,237,.1)',
        },
        {
          href: '/nos-missions',
          icon: 'fas fa-bullseye',
          title: 'Nos missions',
          description: "Demarches administratives, emploi, logement et insertion sociale.",
          iconColor: 'var(--accent)',
          iconBackground: 'rgba(255,140,0,.1)',
        },
        {
          href: '/actions-solidaires',
          icon: 'fas fa-handshake-angle',
          title: 'Actions solidaires',
          description: 'Nos actions concretes sur le terrain, pour et avec la communaute.',
          iconColor: 'var(--support)',
          iconBackground: 'rgba(34,197,94,.1)',
        },
        {
          href: '/evenements',
          icon: 'fas fa-calendar-alt',
          title: 'Evenements',
          description: 'Rencontres, journees de cohesion et activites pour tous.',
          iconColor: 'var(--primary)',
          iconBackground: 'rgba(47,93,255,.1)',
        },
        {
          href: '/temoignages',
          icon: 'fas fa-comments',
          title: 'Temoignages',
          description: 'Les mots de celles et ceux que nous avons accompagnes.',
          iconColor: 'var(--secondary)',
          iconBackground: 'rgba(124,58,237,.1)',
        },
        {
          href: '/nous-rejoindre',
          icon: 'fas fa-hands-holding',
          title: 'Nous rejoindre',
          description: 'Devenir benevole ou integrer le reseau comme membre.',
          iconColor: 'var(--accent)',
          iconBackground: 'rgba(255,140,0,.1)',
        },
        {
          href: '/don',
          icon: 'fas fa-heart',
          title: 'Faire un don',
          description: 'Soutenir nos actions financierement ou en nature.',
          iconColor: 'var(--accent)',
          iconBackground: 'rgba(255,140,0,.1)',
        },
      ],
    },
    values: {
      label: 'Notre engagement',
      title: 'Nos valeurs fondatrices',
      items: [
        { icon: 'fas fa-handshake-angle', title: 'Solidarite', description: 'Personne ne doit etre oublie', color: 'var(--support)' },
        { icon: 'fas fa-scale-balanced', title: 'Respect', description: 'De chacun, de la loi et des parcours de vie', color: 'var(--secondary)' },
        { icon: 'fas fa-hand-fist', title: 'Engagement', description: 'Dans nos actions, au quotidien', color: 'var(--accent)' },
        { icon: 'fas fa-heart', title: 'Humanite', description: "L'ecoute et l'empathie guident tout", color: 'var(--primary)' },
      ],
    },
    cta: {
      title: 'Ensemble, construisons une solidarite qui change des vies.',
      text: 'Rejoignez Reseau Solidarite France, en tant que benevole, membre ou donateur.',
      primaryLabel: 'Nous rejoindre',
      primaryHref: '/nous-rejoindre',
      secondaryLabel: 'Faire un don',
      secondaryHref: '/don',
    },
  },
  'qui-sommes-nous': {
    hero: {
      badge: 'Notre histoire',
      title: 'Qui sommes-nous ?',
      text: "RÉSEAU SOLIDARITÉ FRANCE est né de la volonté de citoyens engagés, ayant connu eux-mêmes les difficultés liées à l'intégration en France.",
    },
    story: {
      label: 'Notre histoire',
      title: "Une association née de l'engagement",
      paragraphs: [
        "Créée à Rennes, l'association répond à un besoin simple mais crucial : ne laisser personne seul face à la précarité, à l'isolement ou aux démarches complexes.",
        "Notre engagement est concret, humain et solidaire. Depuis notre création, nous accompagnons des étudiants, des salariés et des personnes en situation de précarité, dont des sans-abri, pour les aider à mieux vivre en France, à s'insérer et à construire un avenir digne.",
        "Nous œuvrons chaque jour dans un esprit de solidarité, d'entraide et de responsabilité, en promouvant le respect des lois et des valeurs de la République.",
      ],
      primaryCtaLabel: "Voir l'équipe →",
      primaryCtaHref: '/organisation',
      secondaryCtaLabel: 'Nous rejoindre',
      secondaryCtaHref: '/nous-rejoindre',
    },
    values: {
      title: 'Nos valeurs',
      items: [
        { icon: 'fas fa-handshake-angle', title: 'Solidarité', description: 'Personne ne doit être oublié. Nous sommes là pour tous.', itemClass: 'value-solidarity' },
        { icon: 'fas fa-scale-balanced', title: 'Respect', description: 'De chacun, de la loi française et des parcours de vie.', itemClass: 'value-respect' },
        { icon: 'fas fa-hand-fist', title: 'Engagement', description: 'Dans nos actions, au quotidien, sur le terrain.', itemClass: 'value-engagement' },
        { icon: 'fas fa-heart', title: 'Humanité', description: "L'écoute et l'empathie guident tout ce que nous faisons.", itemClass: 'value-humanity' },
        { icon: 'fas fa-seedling', title: 'Autonomie', description: 'Nous accompagnons sans assister. Chacun avance à son rythme.', itemClass: 'value-autonomy' },
      ],
    },
    goals: {
      label: 'Ce que nous poursuivons',
      title: 'Nos objectifs',
      items: [
        { icon: 'fas fa-clipboard-list', title: 'Démarches administratives', description: 'Faciliter les démarches en préfecture, logement, CAF et toutes les formalités administratives.', boxClass: 'box-admin' },
        { icon: 'fas fa-graduation-cap', title: 'Formation & emploi', description: "Favoriser l'accès à la formation, aux diplômes et à l'emploi pour tous nos bénéficiaires.", boxClass: 'box-edu' },
        { icon: 'fas fa-house-chimney', title: "Lutte contre l'exclusion", description: "Soutenir les personnes sans abri et lutter contre l'exclusion sociale avec dignité.", boxClass: 'box-housing' },
        { icon: 'fas fa-flag', title: 'Engagement citoyen', description: 'Promouvoir le respect des lois françaises et encourager un engagement citoyen actif.', boxClass: 'box-citizen' },
        { icon: 'fas fa-bridge', title: 'Vivre-ensemble', description: "Créer des ponts entre les communautés et encourager l'entraide et le vivre-ensemble.", boxClass: 'box-together' },
      ],
    },
  },
  organisation: {
    hero: {
      badge: 'Notre équipe',
      title: 'Organisation',
      text: "Une équipe structurée et engagée, où chaque membre joue un rôle essentiel dans la réalisation de nos actions.",
    },
    leadership: {
      label: 'Leadership',
      title: 'Président fondateur',
    },
    teamSection: {
      label: 'Notre équipe',
      title: "Les membres de l'équipe",
      description: "Chaque membre de l'équipe contribue avec ses compétences et son cœur à la réalisation de notre mission.",
    },
  },
  'nos-missions': {
    hero: {
      badge: 'Nos missions',
      title: 'Nos missions',
      text: 'RÉSEAU SOLIDARITÉ FRANCE agit sur plusieurs fronts pour apporter des solutions concrètes aux personnes en difficulté.',
    },
    cta: {
      label: 'Rejoindre notre réseau →',
      href: '/nous-rejoindre',
    },
  },
  'actions-solidaires': {
    hero: {
      badge: 'Sur le terrain',
      title: 'Actions solidaires',
      text: 'Nos bénévoles agissent concrètement au quotidien pour apporter aide, soutien et dignité à ceux qui en ont besoin.',
    },
    cta: {
      title: 'Vous aussi, participez à nos actions',
      text: 'Que ce soit comme bénévole ou donateur, votre contribution fait une vraie différence.',
      primaryLabel: 'Devenir bénévole',
      primaryHref: '/nous-rejoindre',
      secondaryLabel: 'Faire un don',
      secondaryHref: '/don',
    },
  },
  'actions-internationales': {
    hero: {
      badge: 'Au-delà des frontières',
      title: 'Actions internationales',
      text: 'Parce que la solidarité ne connaît pas de frontières, nous œuvrons pour un monde plus humain et plus solidaire.',
    },
    content: {
      label: 'Notre engagement international',
      title: 'Solidarité sans frontières',
      paragraphs: [
        "Dans le cadre de ses actions solidaires internationales, RÉSEAU SOLIDARITÉ FRANCE a organisé une distribution de nourriture au profit des personnes en situation de précarité.",
        "Cette initiative s'inscrit dans notre engagement à apporter un soutien concret aux populations les plus vulnérables, au-delà des frontières.",
        "À travers cette action, nous avons souhaité partager un moment de solidarité, d'écoute et de respect, en contribuant, à notre échelle, à améliorer le quotidien de ces personnes.",
      ],
      ctaLabel: 'Soutenir nos actions →',
      ctaHref: '/don',
    },
    highlight: {
      icon: 'fas fa-hand-holding-heart',
      title: 'Distribution de nourriture',
      text: 'Nous avons organisé une distribution de nourriture au profit des personnes en situation de précarité, au-delà des frontières de la France.',
    },
    engagements: {
      title: 'Nos engagements internationaux',
      items: [
        { icon: 'fas fa-utensils', title: 'Distribution alimentaire', description: "Aide aux populations vulnérables dans l'accès à la nourriture." },
        { icon: 'fas fa-handshake-angle', title: 'Solidarité active', description: 'Des actions concrètes et humaines pour améliorer le quotidien.' },
        { icon: 'fas fa-seedling', title: 'Engagement durable', description: 'Un engagement sur le long terme pour un impact réel et durable.' },
      ],
    },
  },
  'soutien-aux-membres': {
    hero: {
      badge: 'Pour nos membres',
      title: 'Soutien aux membres',
      text: "Un réseau d'entraide solide où chaque membre peut compter sur la communauté dans les moments difficiles.",
    },
    services: {
      label: 'Ce que nous offrons',
      title: 'Services aux membres',
      items: [
        { icon: 'fas fa-clipboard-check', title: 'Accompagnement administratif personnalisé', description: 'Suivi individualisé pour toutes vos démarches, de A à Z.', boxClass: 'box-blue' },
        { icon: 'fas fa-comments', title: 'Écoute et soutien moral', description: 'Des membres disponibles pour vous écouter et vous soutenir.', boxClass: 'box-purple' },
        { icon: 'fas fa-hand-holding-dollar', title: "Aide financière d'urgence", description: "Un soutien de la communauté en cas de difficultés financières ponctuelles.", boxClass: 'box-orange' },
        { icon: 'fas fa-network-wired', title: 'Réseau & opportunités', description: "Accès au réseau de contacts, partage d'opportunités professionnelles.", boxClass: 'box-green' },
        { icon: 'fas fa-house-chimney-user', title: 'Aide au logement', description: 'Accompagnement dans la constitution de dossiers, orientation vers des solutions adaptées.', boxClass: 'box-indigo' },
      ],
    },
    help: {
      title: "Vous avez besoin d'aide ?",
      description: "N'hésitez pas à nous contacter. Notre équipe est disponible du lundi au samedi de 8h à 18h pour répondre à toutes vos questions.",
      ctaLabel: 'Nous contacter →',
      ctaHref: '/contact',
    },
    process: {
      title: 'Comment ça fonctionne',
      steps: [
        'Prenez contact via le formulaire ou par téléphone',
        "Un membre de l'équipe vous répond sous 48h",
        'Nous évaluons votre situation ensemble',
        'Nous vous accompagnons avec les solutions adaptées',
      ],
    },
  },
  evenements: {
    hero: {
      badge: 'Agenda',
      title: 'Événements',
      text: "Des moments de rassemblement, d'échange et de cohésion pour renforcer les liens entre tous nos membres.",
    },
    featured: {
      buttonLabel: 'Voir le programme complet ->',
      buttonHref: '/rencontre-annuelle',
    },
    regular: {
      label: 'Activités régulières',
      title: 'Nos rendez-vous',
    },
    cta: {
      title: 'Vous souhaitez être informé des prochains événements ?',
      text: "Rejoignez notre réseau et ne ratez aucune de nos activités.",
      label: 'Rejoindre le réseau →',
      href: '/nous-rejoindre',
    },
  },
  'rencontre-annuelle': {
    content: {
      aboutLabel: "À propos de l'événement",
      aboutTitle: 'Une journée inoubliable',
      aboutIntro: "Nous avons le plaisir de vous partager le programme officiel de notre événement annuel qui se tiendra le samedi 26 juillet 2025 de 10h à 22h au Parc des Gayeulles à Rennes.",
      aboutBody: "Une journée placée sous le signe de la solidarité, de la convivialité et du partage, rythmée par des activités sportives, des temps d'échange, un déjeuner barbecue, des jeux, de la musique et une ambiance festive pour petits et grands !",
      programTitle: 'Programme de la journée',
      ctaText: "Nous comptons sur votre présence, votre bonne humeur et votre esprit d'équipe !",
    },
  },
  temoignages: {
    hero: {
      badge: 'Paroles de bénéficiaires',
      title: 'Témoignages',
      text: 'Ils ont bénéficié de notre soutien. Voici ce qu’ils ont à dire.',
    },
    cta: {
      title: 'Et toi ? Tu veux témoigner ?',
      text: "Raconte-nous ton expérience avec RÉSEAU SOLIDARITÉ FRANCE. Ton témoignage peut inspirer et donner espoir à d'autres.",
      label: 'Partager mon témoignage →',
      href: '/contact',
    },
  },
  actualites: {
    hero: {
      badge: 'Nos actualités',
      title: 'Nos actualités',
      text: 'Suivez les dernières nouvelles et actions de Réseau Solidarité France.',
    },
    cta: {
      text: 'De nouvelles actualités sont publiées régulièrement. Rejoignez notre réseau pour ne rien manquer.',
      label: 'Rejoindre le réseau →',
      href: '/nous-rejoindre',
    },
  },
  don: {
    hero: {
      badge: 'Nous soutenir',
      title: 'Faire un don',
      text: 'Chaque don compte et contribue à changer des vies. Merci pour votre générosité.',
    },
    intro: {
      text: "Faire un don, c'est nous aider à accompagner les étudiants, les salariés en difficulté, les sans-abri et les personnes isolées. C'est aussi soutenir celles et ceux qui ont besoin d'aide pour s'intégrer, trouver un logement, accéder à l'emploi ou reprendre confiance.",
    },
    impact: {
      title: 'Grâce à votre générosité, nous pouvons :',
      items: [
        { icon: 'fas fa-utensils', title: 'Financer des', subtitle: 'repas solidaires' },
        { icon: 'fas fa-tshirt', title: 'Offrir vêtements', subtitle: '& kits d’hygiène' },
        { icon: 'fas fa-graduation-cap', title: 'Organiser ateliers', subtitle: '& formations' },
        { icon: 'fas fa-house-chimney', title: 'Faciliter l’accès', subtitle: 'au logement' },
      ],
      quote: 'Ensemble, construisons une solidarité qui change des vies.',
    },
  },
  contact: {
    hero: {
      badge: 'Nous écrire',
      title: 'Contactez-nous',
      text: "Une question ? Besoin d'aide ? Envie de rejoindre le réseau ? Nous sommes à votre écoute !",
    },
    details: {
      sectionTitle: 'Nos coordonnées',
      engagementText: 'Toute demande reçoit une réponse personnalisée. Nous traitons chaque situation avec confidentialité, bienveillance et professionnalisme.',
      subjectOptions: [
        "Demande d'aide administrative",
        "Rejoindre l'association",
        'Faire un don',
        'Devenir partenaire',
        'Témoignage',
        'Autre',
      ],
      formTitle: 'Envoyer un message',
      submitIdle: 'Envoyer le message →',
      submitPending: 'Envoi en cours...',
    },
  },
  'nous-rejoindre': {
    hero: {
      badge: 'Engagement',
      title: 'Nous rejoindre',
      text: "Tu veux faire une différence ? Tu crois en la solidarité, au respect et à l'entraide ? Rejoins-nous !",
    },
    volunteer: {
      label: 'Devenir bénévole',
      title: 'Tu peux faire la différence',
      description: "Tu peux t'engager à ton rythme, selon tes disponibilités. Pas besoin d'être expert : il suffit d'avoir du cœur et de la volonté.",
      benefits: [
        { icon: 'fas fa-clipboard-list', title: 'Accompagnement administratif', description: 'Aider les membres dans leurs démarches administratives.', boxClass: 'box-blue' },
        { icon: 'fas fa-utensils', title: 'Distribution de repas et vêtements', description: 'Participer aux actions solidaires sur le terrain.', boxClass: 'box-orange' },
        { icon: 'fas fa-masks-theater', title: "Animation d'événements", description: 'Organiser et animer nos journées de cohésion.', boxClass: 'box-green' },
        { icon: 'fas fa-laptop-code', title: 'Communication & digital', description: 'Contribuer à la communication et à la présence en ligne.', boxClass: 'box-purple' },
        { icon: 'fas fa-bullseye', title: 'Coaching professionnel', description: "CV, orientation, recherche d'emploi ou de logement.", boxClass: 'box-indigo' },
      ],
    },
    form: {
      title: 'Remplir le formulaire',
      statusOptions: ['Étudiant', 'Salarié', "Recherche d'emploi", 'Auto-entrepreneur', 'Retraité', 'Autre'],
      intentOptions: ['Devenir bénévole', "Bénéficier d'un accompagnement", 'Devenir partenaire', 'En savoir plus'],
      interestOptions: ['Distribution', 'Administratif', 'Communication', 'Événementiel'],
      submitIdle: 'Envoyer ma demande',
      submitPending: 'Envoi en cours...',
    },
  },
};

module.exports = { pageContents };
