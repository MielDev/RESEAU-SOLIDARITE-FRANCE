const missionPage = {
  hero: {
    badge: 'Nos missions',
    title: 'Accompagner, orienter et soutenir durablement',
    text: "Nous agissons au quotidien pour faciliter les démarches administratives, l'insertion professionnelle, le logement et la solidarité de proximité.",
  },
  cta: {
    href: '/nous-rejoindre',
    label: "J'ai besoin d'un accompagnement",
  },
};

const soutienPage = {
  hero: {
    badge: 'Soutien aux membres',
    title: 'Un accompagnement concret pour avancer',
    text: "Chaque membre peut trouver une écoute, une orientation et une aide adaptée à sa situation personnelle, administrative ou professionnelle.",
  },
  services: {
    label: 'Nos appuis',
    title: 'Des solutions pratiques et humaines',
    items: [
      {
        icon: 'fas fa-file-signature',
        boxClass: 'icon-primary',
        title: 'Démarches administratives',
        description: 'Aide a la constitution de dossiers, aux demandes sociales et au suivi des formalites importantes.',
      },
      {
        icon: 'fas fa-briefcase',
        boxClass: 'icon-secondary',
        title: 'Insertion professionnelle',
        description: 'Conseils pour le CV, les entretiens, la recherche de stage, alternance, formation ou emploi.',
      },
      {
        icon: 'fas fa-house-user',
        boxClass: 'icon-accent',
        title: 'Orientation logement',
        description: "Appui dans les recherches et orientation vers les dispositifs ou partenaires les plus adaptés.",
      },
      {
        icon: 'fas fa-hands-helping',
        boxClass: 'icon-support',
        title: 'Écoute et solidarité',
        description: "Un réseau bienveillant pour rompre l'isolement et trouver des relais en cas de difficulté.",
      },
    ],
  },
  help: {
    title: 'Besoin de soutien ?',
    description: "Expliquez-nous votre situation : nous vous recontacterons pour identifier les prochaines étapes.",
    ctaHref: '/contact',
    ctaLabel: 'Contacter l association',
  },
  process: {
    title: 'Comment ça se passe ?',
    steps: [
      'Vous prenez contact avec nous.',
      'Nous analysons votre demande avec discrétion.',
      'Nous vous orientons vers les bonnes démarches ou les bons interlocuteurs.',
    ],
  },
};

const pageDefaults = {
  accueil: {
    heroActions: [
      { label: 'Nous rejoindre', href: '/nous-rejoindre', icon: 'fas fa-user-plus', variant: 'primary' },
      { label: 'Faire un don', href: '/don', icon: 'fas fa-heart', variant: 'accent' },
    ],
    statsCards: [
      { key: 'members', label: 'membres accompagnés', borderColor: '#2F5DFF' },
      { key: 'domains', label: "domaines d'action", borderColor: '#22C55E' },
    ],
    navigation: {
      label: 'Explorer',
      title: "Tout le réseau en quelques portes d'entrée",
      items: [
        {
          href: '/qui-sommes-nous',
          icon: 'fas fa-book-open',
          iconBackground: 'rgba(47,93,255,.1)',
          iconColor: '#2F5DFF',
          title: 'Qui sommes-nous ?',
          description: "Découvrir l'histoire, les valeurs et les objectifs de l'association.",
        },
        {
          href: '/nos-missions',
          icon: 'fas fa-bullseye',
          iconBackground: 'rgba(34,197,94,.1)',
          iconColor: '#22C55E',
          title: 'Nos missions',
          description: 'Comprendre nos actions principales et les publics accompagnés.',
        },
        {
          href: '/actions-solidaires',
          icon: 'fas fa-handshake-angle',
          iconBackground: 'rgba(255,140,0,.12)',
          iconColor: '#FF8C00',
          title: 'Actions solidaires',
          description: 'Voir les initiatives concrètes menées avec les membres et partenaires.',
        },
        {
          href: '/contact',
          icon: 'fas fa-envelope',
          iconBackground: 'rgba(124,58,237,.1)',
          iconColor: '#7C3AED',
          title: 'Contact',
          description: 'Nous écrire pour une demande, une aide ou une proposition de partenariat.',
        },
      ],
    },
    values: {
      label: 'Valeurs',
      title: 'Ce qui guide nos actions',
      items: [
        { icon: 'fas fa-hands-holding-circle', title: 'Solidarité', description: "Avancer ensemble et ne laisser personne seul face aux difficultés.", color: '#2F5DFF' },
        { icon: 'fas fa-scale-balanced', title: 'Dignité', description: 'Accompagner chaque personne avec respect, confidentialité et humanité.', color: '#22C55E' },
        { icon: 'fas fa-people-group', title: 'Entraide', description: "Mobiliser le collectif, les compétences et les expériences de chacun.", color: '#FF8C00' },
        { icon: 'fas fa-route', title: 'Insertion', description: "Ouvrir des chemins vers l'autonomie administrative et professionnelle.", color: '#7C3AED' },
      ],
    },
    cta: {
      title: 'Vous souhaitez agir avec nous ?',
      text: "Rejoignez le réseau, proposez une aide ou soutenez nos actions de terrain.",
      primaryHref: '/nous-rejoindre',
      primaryLabel: 'Devenir membre',
      secondaryHref: '/don',
      secondaryLabel: 'Faire un don',
    },
  },

  'qui-sommes-nous': {
    hero: {
      badge: 'Notre association',
      title: 'Qui sommes-nous ?',
      text: "Réseau Solidarité France est une association à but non lucratif fondée pour accompagner les personnes dans leurs démarches et leur insertion en France.",
    },
    story: {
      label: 'Notre histoire',
      title: 'Une communauté qui transforme l\'entraide en actions',
      paragraphs: [
        "L'association est née d'une conviction simple : les difficultés administratives, sociales ou professionnelles se surmontent mieux avec un réseau solide.",
        "Nous accompagnons les étudiants, salariés, nouveaux arrivants et personnes en situation de précarité avec une approche pratique, humaine et confidentielle.",
      ],
      primaryCtaHref: '/nos-missions',
      primaryCtaLabel: 'Voir nos missions',
      secondaryCtaHref: '/organisation',
      secondaryCtaLabel: 'Découvrir l équipe',
    },
    values: {
      title: 'Nos valeurs',
      items: [
        { icon: 'fas fa-heart', itemClass: 'value-primary', title: 'Solidarité', description: 'Agir ensemble pour apporter une aide concrète.' },
        { icon: 'fas fa-user-shield', itemClass: 'value-support', title: 'Respect', description: 'Accueillir chaque parcours avec dignité et discrétion.' },
        { icon: 'fas fa-handshake', itemClass: 'value-accent', title: 'Engagement', description: 'Construire des reponses utiles, durables et responsables.' },
      ],
    },
    goals: {
      label: 'Objectifs',
      title: 'Ce que nous voulons rendre possible',
      items: [
        { icon: 'fas fa-file-circle-check', boxClass: 'icon-primary', title: 'Simplifier les démarches', description: 'Rendre les formalités plus compréhensibles et accessibles.' },
        { icon: 'fas fa-briefcase', boxClass: 'icon-secondary', title: 'Favoriser l insertion', description: "Aider chacun a trouver sa place dans la formation, l'emploi et la vie locale." },
        { icon: 'fas fa-people-arrows', boxClass: 'icon-support', title: 'Créer du lien', description: "Renforcer la solidarité entre membres, bénévoles et partenaires." },
      ],
    },
  },

  organisation: {
    hero: {
      badge: 'Équipe',
      title: 'Organisation',
      text: "Une équipe engagée coordonne les actions, l'accompagnement des membres et les partenariats de l'association.",
    },
    leadership: {
      label: 'Présidence',
      title: 'Une direction fondee sur l engagement',
    },
    teamSection: {
      label: 'Bureau et responsables',
      title: 'Les personnes qui font vivre le réseau',
      description: "Chaque responsable contribue a l'accueil, a l'organisation des actions et au suivi des membres.",
    },
  },

  missions: missionPage,
  'nos-missions': missionPage,

  'actions-solidaires': {
    hero: {
      badge: 'Actions de terrain',
      title: 'Actions solidaires',
      text: "Collectes, distributions, soutien individuel et moments d'entraide : nos actions répondent à des besoins concrets.",
    },
    cta: {
      title: 'Vous voulez participer a une action ?',
      text: "Chaque aide compte, qu'il s'agisse de temps, de matériel, de compétences ou de soutien financier.",
      primaryHref: '/nous-rejoindre',
      primaryLabel: 'Devenir bénévole',
      secondaryHref: '/don',
      secondaryLabel: 'Soutenir les actions',
    },
  },

  soutien: soutienPage,
  'soutien-aux-membres': soutienPage,

  'actions-internationales': {
    hero: {
      badge: 'Solidarité sans frontières',
      title: 'Actions internationales',
      text: "Notre solidarité dépasse les frontières lorsque des besoins essentiels appellent une mobilisation collective.",
    },
    content: {
      label: 'Ouverture',
      title: 'Agir ici, soutenir ailleurs',
      paragraphs: [
        "Nous encourageons les initiatives responsables en lien avec les besoins prioritaires : alimentation, vêtements, éducation et aide de première nécessité.",
        "Chaque action internationale est construite avec prudence, transparence et respect des réalités locales.",
      ],
      ctaHref: '/contact',
      ctaLabel: 'Proposer un partenariat',
    },
    highlight: {
      icon: 'fas fa-globe-africa',
      title: 'Une solidarité active',
      text: "Les membres peuvent se mobiliser autour de collectes ciblées et d'actions utiles aux populations vulnérables.",
    },
    engagements: {
      title: 'Nos engagements',
      items: [
        { icon: 'fas fa-box-heart', title: 'Collecter utile', description: 'Prioriser les dons adaptés aux besoins réels.' },
        { icon: 'fas fa-hand-holding-heart', title: 'Agir avec respect', description: 'Préserver la dignité des personnes accompagnées.' },
        { icon: 'fas fa-clipboard-check', title: 'Rester transparent', description: 'Suivre les actions et informer les donateurs.' },
      ],
    },
  },

  evenements: {
    hero: {
      badge: 'Informations',
      title: 'Actualites',
      text: "Les actualites du reseau mettent en avant les rencontres, annonces et informations utiles.",
    },
    regular: {
      label: 'Publications',
      title: 'Toutes les actualites du reseau',
    },
    cta: {
      title: 'Une information a partager ?',
      text: "Nous sommes ouverts aux propositions utiles pour renforcer l'entraide et la cohesion.",
      href: '/contact',
      label: 'Nous contacter',
    },
  },

  'rencontre-annuelle': {
    content: {
      aboutLabel: 'Rencontre annuelle',
      aboutTitle: 'Une journée de cohésion et de partage',
      aboutIntro: "La rencontre annuelle rassemble les membres autour d'activites conviviales, de discussions et d'animations collectives.",
      aboutBody: "C'est un temps fort pour renforcer les liens, accueillir les nouveaux membres et célébrer les actions menées ensemble.",
      programTitle: 'Programme de la journée',
      ctaText: "Pour participer ou obtenir plus d'informations, contactez-nous ou rejoignez le réseau.",
    },
  },

  temoignages: {
    hero: {
      badge: 'Paroles de membres',
      title: 'Témoignages',
      text: "Des parcours et expériences qui montrent l'impact concret de l'entraide.",
    },
    cta: {
      title: 'Vous souhaitez partager votre expérience ?',
      text: "Votre temoignage peut encourager d'autres personnes a demander de l'aide ou a s'engager.",
      href: '/contact',
      label: 'Nous écrire',
    },
  },

  'nous-rejoindre': {
    hero: {
      badge: 'Adhésion et bénévolat',
      title: 'Nous rejoindre',
      text: "Rejoignez une communauté solidaire pour recevoir un accompagnement, aider à votre tour ou participer aux actions.",
    },
    volunteer: {
      label: 'Participer',
      title: 'Plusieurs manières de s\'engager',
      description: "Que vous ayez besoin d'aide ou envie de contribuer, votre place existe dans le réseau.",
      benefits: [
        { icon: 'fas fa-hands-helping', boxClass: 'icon-primary', title: 'Aider sur le terrain', description: 'Participer aux collectes, distributions et actualites du reseau.' },
        { icon: 'fas fa-comments', boxClass: 'icon-secondary', title: 'Partager son expérience', description: 'Orienter les nouveaux membres et transmettre des conseils utiles.' },
        { icon: 'fas fa-network-wired', boxClass: 'icon-support', title: 'Renforcer le réseau', description: 'Mobiliser des contacts, partenaires ou ressources locales.' },
      ],
    },
    form: {
      title: 'Envoyer une demande',
      statusOptions: ['Étudiant(e)', 'Salarié(e)', 'Demandeur d\'emploi', 'Bénévole', 'Partenaire', 'Autre'],
      intentOptions: ['Recevoir une aide', 'Devenir bénévole', 'Proposer un partenariat', 'Adhérer à l\'association'],
      interestOptions: ['Administratif', 'Emploi / formation', 'Logement', 'Actualites', 'Actions solidaires', 'Communication'],
      submitIdle: 'Envoyer ma demande',
      submitPending: 'Envoi en cours...',
    },
  },

  actualites: {
    hero: {
      badge: 'Informations',
      title: 'Actualités',
      text: "Retrouvez les nouvelles de l'association, les actions récentes et les prochains temps forts.",
    },
    cta: {
      text: 'Vous avez une information ou une action à partager avec le réseau ?',
      href: '/contact',
      label: 'Proposer une actualité',
    },
  },

  don: {
    hero: {
      badge: 'Soutenir',
      title: 'Faire un don',
      text: "Votre soutien aide à financer les actions solidaires, l'accompagnement des membres et les besoins de première nécessité.",
    },
    intro: {
      text: "Chaque contribution, même modeste, renforce notre capacité à agir vite et utilement.",
    },
    impact: {
      title: 'Votre don a un impact concret',
      items: [
        { icon: 'fas fa-utensils', title: 'Repas', subtitle: 'aide alimentaire' },
        { icon: 'fas fa-shirt', title: 'Vêtements', subtitle: 'dons matériels' },
        { icon: 'fas fa-file-lines', title: 'Dossiers', subtitle: 'aide administrative' },
      ],
      quote: 'Merci de faire vivre la solidarité avec nous.',
    },
  },

  contact: {
    hero: {
      badge: 'Nous écrire',
      title: 'Contact',
      text: "Une question, une demande d'aide, une proposition de partenariat ? Nous vous répondons avec attention.",
    },
    details: {
      sectionTitle: 'Coordonnées',
      formTitle: 'Envoyer un message',
      engagementText: "Nous traitons chaque demande avec discrétion et revenons vers vous dès que possible.",
      subjectOptions: ['Demande d\'aide', 'Adhésion / bénévolat', 'Partenariat', 'Don', 'Autre demande'],
      submitIdle: 'Envoyer le message',
      submitPending: 'Envoi en cours...',
    },
  },
};

module.exports = { pageDefaults };
