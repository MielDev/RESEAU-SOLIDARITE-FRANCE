const missionPage = {
  hero: {
    badge: 'Nos missions',
    title: 'Accompagner, orienter et soutenir durablement',
    text: "Nous agissons au quotidien pour faciliter les demarches administratives, l'insertion professionnelle, le logement et la solidarite de proximite.",
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
    text: "Chaque membre peut trouver une ecoute, une orientation et une aide adaptee a sa situation personnelle, administrative ou professionnelle.",
  },
  services: {
    label: 'Nos appuis',
    title: 'Des solutions pratiques et humaines',
    items: [
      {
        icon: 'fas fa-file-signature',
        boxClass: 'icon-primary',
        title: 'Demarches administratives',
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
        description: "Appui dans les recherches et orientation vers les dispositifs ou partenaires les plus adaptes.",
      },
      {
        icon: 'fas fa-hands-helping',
        boxClass: 'icon-support',
        title: 'Ecoute et solidarite',
        description: "Un reseau bienveillant pour rompre l'isolement et trouver des relais en cas de difficulte.",
      },
    ],
  },
  help: {
    title: 'Besoin de soutien ?',
    description: "Expliquez-nous votre situation : nous vous recontacterons pour identifier les prochaines etapes.",
    ctaHref: '/contact',
    ctaLabel: 'Contacter l association',
  },
  process: {
    title: 'Comment ca se passe ?',
    steps: [
      'Vous prenez contact avec nous.',
      'Nous analysons votre demande avec discretion.',
      'Nous vous orientons vers les bonnes demarches ou les bons interlocuteurs.',
    ],
  },
};

const pageContents = {
  accueil: {
    heroActions: [
      { label: 'Nous rejoindre', href: '/nous-rejoindre', icon: 'fas fa-user-plus', variant: 'primary' },
      { label: 'Faire un don', href: '/don', icon: 'fas fa-heart', variant: 'accent' },
    ],
    statsCards: [
      { key: 'members', label: 'membres accompagnes', borderColor: '#2F5DFF' },
      { key: 'domains', label: "domaines d'action", borderColor: '#22C55E' },
    ],
    navigation: {
      label: 'Explorer',
      title: 'Tout le reseau en quelques portes d entree',
      items: [
        {
          href: '/qui-sommes-nous',
          icon: 'fas fa-book-open',
          iconBackground: 'rgba(47,93,255,.1)',
          iconColor: '#2F5DFF',
          title: 'Qui sommes-nous ?',
          description: "Decouvrir l'histoire, les valeurs et les objectifs de l'association.",
        },
        {
          href: '/nos-missions',
          icon: 'fas fa-bullseye',
          iconBackground: 'rgba(34,197,94,.1)',
          iconColor: '#22C55E',
          title: 'Nos missions',
          description: 'Comprendre nos actions principales et les publics accompagnes.',
        },
        {
          href: '/actions-solidaires',
          icon: 'fas fa-handshake-angle',
          iconBackground: 'rgba(255,140,0,.12)',
          iconColor: '#FF8C00',
          title: 'Actions solidaires',
          description: 'Voir les initiatives concretes menees avec les membres et partenaires.',
        },
        {
          href: '/contact',
          icon: 'fas fa-envelope',
          iconBackground: 'rgba(124,58,237,.1)',
          iconColor: '#7C3AED',
          title: 'Contact',
          description: 'Nous ecrire pour une demande, une aide ou une proposition de partenariat.',
        },
      ],
    },
    values: {
      label: 'Valeurs',
      title: 'Ce qui guide nos actions',
      items: [
        { icon: 'fas fa-hands-holding-circle', title: 'Solidarite', description: "Avancer ensemble et ne laisser personne seul face aux difficultes.", color: '#2F5DFF' },
        { icon: 'fas fa-scale-balanced', title: 'Dignite', description: 'Accompagner chaque personne avec respect, confidentialite et humanite.', color: '#22C55E' },
        { icon: 'fas fa-people-group', title: 'Entraide', description: "Mobiliser le collectif, les competences et les experiences de chacun.", color: '#FF8C00' },
        { icon: 'fas fa-route', title: 'Insertion', description: "Ouvrir des chemins vers l'autonomie administrative et professionnelle.", color: '#7C3AED' },
      ],
    },
    cta: {
      title: 'Vous souhaitez agir avec nous ?',
      text: "Rejoignez le reseau, proposez une aide ou soutenez nos actions de terrain.",
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
      text: "Reseau Solidarite France est une association a but non lucratif fondee pour accompagner les personnes dans leurs demarches et leur insertion en France.",
    },
    story: {
      label: 'Notre histoire',
      title: 'Une communaute qui transforme l entraide en actions',
      paragraphs: [
        "L'association est nee d'une conviction simple : les difficultes administratives, sociales ou professionnelles se surmontent mieux avec un reseau solide.",
        "Nous accompagnons les etudiants, salaries, nouveaux arrivants et personnes en situation de precarite avec une approche pratique, humaine et confidentielle.",
      ],
      primaryCtaHref: '/nos-missions',
      primaryCtaLabel: 'Voir nos missions',
      secondaryCtaHref: '/organisation',
      secondaryCtaLabel: 'Decouvrir l equipe',
    },
    values: {
      title: 'Nos valeurs',
      items: [
        { icon: 'fas fa-heart', itemClass: 'value-primary', title: 'Solidarite', description: 'Agir ensemble pour apporter une aide concrete.' },
        { icon: 'fas fa-user-shield', itemClass: 'value-support', title: 'Respect', description: 'Accueillir chaque parcours avec dignite et discretion.' },
        { icon: 'fas fa-handshake', itemClass: 'value-accent', title: 'Engagement', description: 'Construire des reponses utiles, durables et responsables.' },
      ],
    },
    goals: {
      label: 'Objectifs',
      title: 'Ce que nous voulons rendre possible',
      items: [
        { icon: 'fas fa-file-circle-check', boxClass: 'icon-primary', title: 'Simplifier les demarches', description: 'Rendre les formalites plus comprehensibles et accessibles.' },
        { icon: 'fas fa-briefcase', boxClass: 'icon-secondary', title: 'Favoriser l insertion', description: "Aider chacun a trouver sa place dans la formation, l'emploi et la vie locale." },
        { icon: 'fas fa-people-arrows', boxClass: 'icon-support', title: 'Creer du lien', description: "Renforcer la solidarite entre membres, benevoles et partenaires." },
      ],
    },
  },

  organisation: {
    hero: {
      badge: 'Equipe',
      title: 'Organisation',
      text: "Une equipe engagee coordonne les actions, l'accompagnement des membres et les partenariats de l'association.",
    },
    leadership: {
      label: 'Presidence',
      title: 'Une direction fondee sur l engagement',
    },
    teamSection: {
      label: 'Bureau et responsables',
      title: 'Les personnes qui font vivre le reseau',
      description: "Chaque responsable contribue a l'accueil, a l'organisation des actions et au suivi des membres.",
    },
  },

  missions: missionPage,
  'nos-missions': missionPage,

  'actions-solidaires': {
    hero: {
      badge: 'Actions de terrain',
      title: 'Actions solidaires',
      text: "Collectes, distributions, soutien individuel et moments d'entraide : nos actions repondent a des besoins concrets.",
    },
    cta: {
      title: 'Vous voulez participer a une action ?',
      text: "Chaque aide compte, qu'il s'agisse de temps, de materiel, de competences ou de soutien financier.",
      primaryHref: '/nous-rejoindre',
      primaryLabel: 'Devenir benevole',
      secondaryHref: '/don',
      secondaryLabel: 'Soutenir les actions',
    },
  },

  soutien: soutienPage,
  'soutien-aux-membres': soutienPage,

  'actions-internationales': {
    hero: {
      badge: 'Solidarite sans frontieres',
      title: 'Actions internationales',
      text: "Notre solidarite depasse les frontieres lorsque des besoins essentiels appellent une mobilisation collective.",
    },
    content: {
      label: 'Ouverture',
      title: 'Agir ici, soutenir ailleurs',
      paragraphs: [
        "Nous encourageons les initiatives responsables en lien avec les besoins prioritaires : alimentation, vetements, education et aide de premiere necessite.",
        "Chaque action internationale est construite avec prudence, transparence et respect des realites locales.",
      ],
      ctaHref: '/contact',
      ctaLabel: 'Proposer un partenariat',
    },
    highlight: {
      icon: 'fas fa-globe-africa',
      title: 'Une solidarite active',
      text: "Les membres peuvent se mobiliser autour de collectes ciblees et d'actions utiles aux populations vulnerables.",
    },
    engagements: {
      title: 'Nos engagements',
      items: [
        { icon: 'fas fa-box-heart', title: 'Collecter utile', description: 'Prioriser les dons adaptes aux besoins reels.' },
        { icon: 'fas fa-hand-holding-heart', title: 'Agir avec respect', description: 'Preserver la dignite des personnes accompagnees.' },
        { icon: 'fas fa-clipboard-check', title: 'Rester transparent', description: 'Suivre les actions et informer les donateurs.' },
      ],
    },
  },

  evenements: {
    hero: {
      badge: 'Rencontres',
      title: 'Evenements',
      text: "Nos evenements creent du lien entre membres, benevoles, partenaires et personnes accompagnees.",
    },
    regular: {
      label: 'Editions',
      title: 'Toutes les rencontres du reseau',
    },
    cta: {
      title: 'Une idee d evenement solidaire ?',
      text: "Nous sommes ouverts aux propositions utiles pour renforcer l'entraide et la cohesion.",
      href: '/contact',
      label: 'Nous contacter',
    },
  },

  'rencontre-annuelle': {
    content: {
      aboutLabel: 'Rencontre annuelle',
      aboutTitle: 'Une journee de cohesion et de partage',
      aboutIntro: "La rencontre annuelle rassemble les membres autour d'activites conviviales, de discussions et d'animations collectives.",
      aboutBody: "C'est un temps fort pour renforcer les liens, accueillir les nouveaux membres et celebrer les actions menees ensemble.",
      programTitle: 'Programme de la journee',
      ctaText: "Pour participer ou obtenir plus d'informations, contactez-nous ou rejoignez le reseau.",
    },
  },

  temoignages: {
    hero: {
      badge: 'Paroles de membres',
      title: 'Temoignages',
      text: "Des parcours et experiences qui montrent l'impact concret de l'entraide.",
    },
    cta: {
      title: 'Vous souhaitez partager votre experience ?',
      text: "Votre temoignage peut encourager d'autres personnes a demander de l'aide ou a s'engager.",
      href: '/contact',
      label: 'Nous ecrire',
    },
  },

  'nous-rejoindre': {
    hero: {
      badge: 'Adhesion et benevolat',
      title: 'Nous rejoindre',
      text: "Rejoignez une communaute solidaire pour recevoir un accompagnement, aider a votre tour ou participer aux actions.",
    },
    volunteer: {
      label: 'Participer',
      title: 'Plusieurs manieres de s engager',
      description: "Que vous ayez besoin d'aide ou envie de contribuer, votre place existe dans le reseau.",
      benefits: [
        { icon: 'fas fa-hands-helping', boxClass: 'icon-primary', title: 'Aider sur le terrain', description: 'Participer aux collectes, distributions et evenements.' },
        { icon: 'fas fa-comments', boxClass: 'icon-secondary', title: 'Partager son experience', description: 'Orienter les nouveaux membres et transmettre des conseils utiles.' },
        { icon: 'fas fa-network-wired', boxClass: 'icon-support', title: 'Renforcer le reseau', description: 'Mobiliser des contacts, partenaires ou ressources locales.' },
      ],
    },
    form: {
      title: 'Envoyer une demande',
      statusOptions: ['Etudiant(e)', 'Salarie(e)', 'Demandeur d emploi', 'Benevole', 'Partenaire', 'Autre'],
      intentOptions: ['Recevoir une aide', 'Devenir benevole', 'Proposer un partenariat', 'Adherer a l association'],
      interestOptions: ['Administratif', 'Emploi / formation', 'Logement', 'Evenements', 'Actions solidaires', 'Communication'],
      submitIdle: 'Envoyer ma demande',
      submitPending: 'Envoi en cours...',
    },
  },

  actualites: {
    hero: {
      badge: 'Informations',
      title: 'Actualites',
      text: "Retrouvez les nouvelles de l'association, les actions recentes et les prochains temps forts.",
    },
    cta: {
      text: 'Vous avez une information ou une action a partager avec le reseau ?',
      href: '/contact',
      label: 'Proposer une actualite',
    },
  },

  don: {
    hero: {
      badge: 'Soutenir',
      title: 'Faire un don',
      text: "Votre soutien aide a financer les actions solidaires, l'accompagnement des membres et les besoins de premiere necessite.",
    },
    intro: {
      text: "Chaque contribution, meme modeste, renforce notre capacite a agir vite et utilement.",
    },
    impact: {
      title: 'Votre don a un impact concret',
      items: [
        { icon: 'fas fa-utensils', title: 'Repas', subtitle: 'aide alimentaire' },
        { icon: 'fas fa-shirt', title: 'Vetements', subtitle: 'dons materiels' },
        { icon: 'fas fa-file-lines', title: 'Dossiers', subtitle: 'aide administrative' },
      ],
      quote: 'Merci de faire vivre la solidarite avec nous.',
    },
  },

  contact: {
    hero: {
      badge: 'Nous ecrire',
      title: 'Contact',
      text: "Une question, une demande d'aide, une proposition de partenariat ? Nous vous repondons avec attention.",
    },
    details: {
      sectionTitle: 'Coordonnees',
      formTitle: 'Envoyer un message',
      engagementText: "Nous traitons chaque demande avec discretion et revenons vers vous des que possible.",
      subjectOptions: ['Demande d aide', 'Adhesion / benevolat', 'Partenariat', 'Don', 'Autre demande'],
      submitIdle: 'Envoyer le message',
      submitPending: 'Envoi en cours...',
    },
  },
};

module.exports = { pageContents };
