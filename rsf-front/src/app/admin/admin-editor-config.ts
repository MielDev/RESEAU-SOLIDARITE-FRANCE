export type AdminCollectionFieldType =
  | 'text'
  | 'textarea'
  | 'boolean'
  | 'number'
  | 'date'
  | 'string-list'
  | 'object-list';

export type AdminCollectionObjectFieldConfig = {
  key: string;
  label: string;
  type?: Exclude<AdminCollectionFieldType, 'string-list' | 'object-list'>;
  placeholder?: string;
  rows?: number;
};

export type AdminCollectionFieldConfig = {
  key: string;
  label: string;
  type?: AdminCollectionFieldType;
  placeholder?: string;
  rows?: number;
  listItemKey?: string;
  objectFields?: AdminCollectionObjectFieldConfig[];
};

export type AdminCollectionConfig = {
  resource: string;
  title: string;
  itemLabel?: string;
  description: string;
  emptyMessage: string;
  fields: AdminCollectionFieldConfig[];
  defaults?: Record<string, unknown>;
  fixedValues?: Record<string, unknown>;
  filterBy?: { key: string; value: unknown };
  allowReorder?: boolean;
};

export type AdminEditorConfig = {
  pageKey?: string;
  pageDescription?: string;
  pageFieldOrder?: string[];
  pageDefaults?: Record<string, unknown>;
  collection?: AdminCollectionConfig;
  showContactMessages?: boolean;
};

const heroDefaults = (title: string) => ({
  hero: {
    badge: '',
    title,
    text: '',
  },
});

const dualCtaDefaults = {
  cta: {
    title: '',
    text: '',
    primaryLabel: '',
    primaryHref: '',
    secondaryLabel: '',
    secondaryHref: '',
  },
};

const pageDefaults = {
  accueil: {
    ...heroDefaults('Accueil'),
    heroActions: [
      { label: '', href: '', variant: 'primary', icon: 'fas fa-arrow-right' },
    ],
    stats: {
      members: '',
      domains: '',
    },
    statsCards: [
      { key: 'members', value: '', label: '', borderColor: '#2F5DFF' },
    ],
    navigation: {
      label: '',
      title: '',
      items: [
        {
          href: '',
          icon: 'fas fa-arrow-right',
          title: '',
          description: '',
          iconColor: '#2F5DFF',
          iconBackground: 'rgba(47, 93, 255, 0.1)',
        },
      ],
    },
    values: {
      label: '',
      title: '',
      items: [
        { icon: 'fas fa-heart', title: '', description: '', color: '#2F5DFF', itemClass: '' },
      ],
    },
    ...dualCtaDefaults,
  },
  quiSommesNous: {
    ...heroDefaults('Qui sommes-nous ?'),
    story: {
      label: '',
      title: '',
      paragraphs: [''],
      primaryCtaLabel: '',
      primaryCtaHref: '',
      secondaryCtaLabel: '',
      secondaryCtaHref: '',
    },
    values: {
      title: '',
      items: [
        { icon: 'fas fa-heart', title: '', description: '', color: '#2F5DFF', itemClass: '' },
      ],
    },
    goals: {
      label: '',
      title: '',
      items: [
        { icon: 'fas fa-bullseye', title: '', description: '', boxClass: 'box-primary' },
      ],
    },
  },
  organisation: {
    ...heroDefaults('Organisation'),
    leadership: {
      label: '',
      title: '',
    },
    teamSection: {
      label: '',
      title: '',
      description: '',
    },
  },
  missions: {
    ...heroDefaults('Nos missions'),
    cta: {
      label: '',
      href: '',
    },
  },
  actionsSolidaires: {
    ...heroDefaults('Actions solidaires'),
    ...dualCtaDefaults,
  },
  soutien: {
    ...heroDefaults('Soutien aux membres'),
    services: {
      label: '',
      title: '',
      items: [
        { icon: 'fas fa-hands-helping', title: '', description: '', boxClass: 'box-primary' },
      ],
    },
    help: {
      title: '',
      description: '',
      ctaLabel: '',
      ctaHref: '',
    },
    process: {
      title: '',
      steps: [''],
    },
  },
  international: {
    ...heroDefaults('Actions internationales'),
    content: {
      label: '',
      title: '',
      paragraphs: [''],
      ctaLabel: '',
      ctaHref: '',
    },
    highlight: {
      icon: 'fas fa-globe-africa',
      title: '',
      text: '',
    },
    engagements: {
      title: '',
      items: [
        { icon: 'fas fa-handshake', title: '', description: '' },
      ],
    },
  },
  evenements: {
    ...heroDefaults('Actualites'),
    featured: {
      buttonLabel: '',
      buttonHref: '',
    },
    regular: {
      label: '',
      title: '',
    },
    cta: {
      title: '',
      text: '',
      label: '',
      href: '',
    },
  },
  rencontre: {
    content: {
      aboutLabel: '',
      aboutTitle: '',
      aboutIntro: '',
      aboutBody: '',
      programTitle: '',
      ctaText: '',
    },
  },
  temoignages: {
    ...heroDefaults('Temoignages'),
    cta: {
      title: '',
      text: '',
      label: '',
      href: '',
    },
  },
  actualites: {
    ...heroDefaults('Actualites'),
    cta: {
      text: '',
      label: '',
      href: '',
    },
  },
  contact: {
    ...heroDefaults('Contact'),
    details: {
      sectionTitle: '',
      formTitle: '',
      engagementText: '',
      subjectOptions: [''],
      submitIdle: 'Envoyer',
      submitPending: 'Envoi...',
    },
  },
  don: {
    ...heroDefaults('Faire un don'),
    intro: {
      text: '',
    },
    impact: {
      title: '',
      items: [
        { icon: 'fas fa-heart', title: '', subtitle: '' },
      ],
      quote: '',
    },
  },
  rejoindre: {
    ...heroDefaults('Nous rejoindre'),
    volunteer: {
      label: '',
      title: '',
      description: '',
      benefits: [
        { icon: 'fas fa-user-plus', title: '', description: '', boxClass: 'box-primary' },
      ],
    },
    form: {
      title: '',
      statusOptions: [''],
      intentOptions: [''],
      interestOptions: [''],
      submitIdle: 'Envoyer',
      submitPending: 'Envoi...',
    },
  },
};

const teamFields: AdminCollectionFieldConfig[] = [
  { key: 'name', label: 'Nom' },
  { key: 'initials', label: 'Initiales' },
  { key: 'role', label: 'Role' },
  { key: 'bio', label: 'Biographie', type: 'textarea', rows: 4 },
  { key: 'diplomas', label: 'Diplomes (une ligne par element)', type: 'string-list' },
  { key: 'photo_url', label: 'Photo URL' },
  { key: 'color1', label: 'Couleur 1' },
  { key: 'color2', label: 'Couleur 2' },
  { key: 'is_president', label: 'President', type: 'boolean' },
  { key: 'is_active', label: 'Actif', type: 'boolean' },
];

const missionFields: AdminCollectionFieldConfig[] = [
  { key: 'icon', label: 'Icone' },
  { key: 'title', label: 'Titre' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { key: 'items', label: 'Elements de mission (une ligne par element)', type: 'string-list', listItemKey: 'text' },
  { key: 'color_name', label: 'Nom de couleur' },
  { key: 'is_active', label: 'Active', type: 'boolean' },
];

const actionFields: AdminCollectionFieldConfig[] = [
  { key: 'icon', label: 'Icone' },
  { key: 'image', label: 'Image URL' },
  { key: 'title', label: 'Titre' },
  { key: 'category', label: 'Categorie' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { key: 'icon_color', label: 'Couleur icone' },
  { key: 'tag_bg', label: 'Fond du tag' },
  { key: 'tag_color', label: 'Couleur du tag' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'is_published', label: 'Publiee', type: 'boolean' },
];

const eventFields: AdminCollectionFieldConfig[] = [
  { key: 'title', label: 'Titre' },
  { key: 'edition', label: 'Edition' },
  { key: 'event_date', label: 'Date', type: 'date' },
  { key: 'time_start', label: 'Heure de debut' },
  { key: 'time_end', label: 'Heure de fin' },
  { key: 'location', label: 'Lieu' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { key: 'badge_label', label: 'Badge' },
  { key: 'contact_email', label: 'Email de contact' },
  { key: 'contact_website', label: 'Site de contact' },
  { key: 'cta_text', label: 'Texte du bouton' },
  { key: 'cta_href', label: 'Lien du bouton' },
  {
    key: 'program',
    label: 'Programme de la journee',
    type: 'object-list',
    objectFields: [
      { key: 'icon', label: 'Icone' },
      { key: 'title', label: 'Titre' },
      { key: 'subtitle', label: 'Sous-titre' },
    ],
  },
  { key: 'is_featured', label: 'Mis en avant', type: 'boolean' },
  { key: 'is_published', label: 'Publie', type: 'boolean' },
];

const testimonialFields: AdminCollectionFieldConfig[] = [
  { key: 'first_name', label: 'Prenom' },
  { key: 'initials', label: 'Initiales' },
  { key: 'profile', label: 'Profil' },
  { key: 'quote', label: 'Citation', type: 'textarea', rows: 4 },
  { key: 'color1', label: 'Couleur 1' },
  { key: 'color2', label: 'Couleur 2' },
  { key: 'is_published', label: 'Publie', type: 'boolean' },
];

const actualityFields: AdminCollectionFieldConfig[] = [
  { key: 'icon', label: 'Icone' },
  { key: 'title', label: 'Titre' },
  { key: 'category', label: 'Categorie' },
  { key: 'summary', label: 'Resume', type: 'textarea', rows: 4 },
  { key: 'link_href', label: 'Lien' },
  { key: 'published_at', label: 'Date de publication', type: 'date' },
  { key: 'is_published', label: 'Publiee', type: 'boolean' },
];

const donFields: AdminCollectionFieldConfig[] = [
  { key: 'icon', label: 'Icone' },
  { key: 'title', label: 'Titre' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { key: 'link_href', label: 'Lien' },
  { key: 'btn_text', label: 'Texte du bouton' },
  { key: 'border_color', label: 'Couleur de bordure' },
  { key: 'is_active', label: 'Actif', type: 'boolean' },
];

export const adminEditorConfigs = {
  accueil: {
    pageKey: 'accueil',
    pageDescription: "Modifie les blocs de contenu de la page d'accueil stockes en base.",
    pageDefaults: pageDefaults.accueil,
    pageFieldOrder: ['hero', 'heroActions', 'stats', 'statsCards', 'navigation', 'values', 'cta'],
  },
  quiSommesNous: {
    pageKey: 'qui-sommes-nous',
    pageDescription: 'Contenu editorial de la page Qui sommes-nous.',
    pageDefaults: pageDefaults.quiSommesNous,
    pageFieldOrder: ['hero', 'story', 'values', 'goals'],
  },
  organisation: {
    pageKey: 'organisation',
    pageDescription: "Contenu de page et membres de l'organisation.",
    pageDefaults: pageDefaults.organisation,
    pageFieldOrder: ['hero', 'leadership', 'teamSection'],
    collection: {
      resource: 'team',
      title: 'Equipe et organisation',
      itemLabel: 'Membre',
      description: 'Ajoute, modifie, reordonne et supprime les membres affiches sur le site.',
      emptyMessage: "Aucun membre n'est encore enregistre.",
      fields: teamFields,
      defaults: {
        initials: 'RS',
        color1: '#2F5DFF',
        color2: '#1E3A8A',
        is_president: false,
        is_active: true,
      },
    },
  },
  missions: {
    pageKey: 'nos-missions',
    pageDescription: 'Contenu de page et liste des missions.',
    pageDefaults: pageDefaults.missions,
    pageFieldOrder: ['hero', 'cta'],
    collection: {
      resource: 'missions',
      title: 'Missions du reseau',
      itemLabel: 'Mission',
      description: 'Les cartes de mission et leurs elements detaillees viennent du backend.',
      emptyMessage: "Aucune mission n'est encore enregistre.",
      fields: missionFields,
      defaults: {
        icon: 'fas fa-bullseye',
        color_name: 'primary',
        is_active: true,
      },
    },
  },
  actionsSolidaires: {
    pageKey: 'actions-solidaires',
    pageDescription: 'Page et cartes des actions solidaires.',
    pageDefaults: pageDefaults.actionsSolidaires,
    pageFieldOrder: ['hero', 'cta'],
    collection: {
      resource: 'actions',
      title: 'Actions solidaires',
      itemLabel: 'Action solidaire',
      description: 'Edition des cartes de la page Actions solidaires.',
      emptyMessage: "Aucune action solidaire n'est encore enregistre.",
      fields: actionFields,
      defaults: {
        icon: 'fas fa-handshake-angle',
        is_published: true,
      },
      fixedValues: {
        page_type: 'solidaire',
      },
      filterBy: {
        key: 'page_type',
        value: 'solidaire',
      },
    },
  },
  soutien: {
    pageKey: 'soutien-aux-membres',
    pageDescription: 'Contenu editorial de la page Soutien aux membres.',
    pageDefaults: pageDefaults.soutien,
    pageFieldOrder: ['hero', 'services', 'help', 'process'],
  },
  international: {
    pageKey: 'actions-internationales',
    pageDescription: 'Page et cartes des actions internationales.',
    pageDefaults: pageDefaults.international,
    pageFieldOrder: ['hero', 'content', 'highlight', 'engagements'],
    collection: {
      resource: 'actions',
      title: 'Actions internationales',
      itemLabel: 'Action internationale',
      description: 'Edition des cartes de la page internationale.',
      emptyMessage: "Aucune action internationale n'est encore enregistre.",
      fields: actionFields,
      defaults: {
        icon: 'fas fa-globe',
        is_published: true,
      },
      fixedValues: {
        page_type: 'international',
      },
      filterBy: {
        key: 'page_type',
        value: 'international',
      },
    },
  },
  evenements: {
    pageKey: 'evenements',
    pageDescription: 'Page et liste des actualites du reseau.',
    pageDefaults: pageDefaults.evenements,
    pageFieldOrder: ['hero', 'featured', 'regular', 'cta'],
    collection: {
      resource: 'events',
      title: 'Actualites',
      itemLabel: 'Actualite',
      description: 'Les actualites publiques sont gerees ici.',
      emptyMessage: "Aucune actualite n'est encore enregistree.",
      fields: eventFields,
      defaults: {
        time_start: '10:00',
        time_end: '22:00',
        cta_text: 'Je participe',
        cta_href: '/nous-rejoindre',
        is_featured: false,
        is_published: true,
      },
    },
  },
  rencontre: {
    pageKey: 'rencontre-annuelle',
    pageDescription: 'Contenu de la rencontre annuelle et agenda associe.',
    pageDefaults: pageDefaults.rencontre,
    pageFieldOrder: ['content'],
    collection: {
      resource: 'events',
      title: 'Programme de la rencontre',
      itemLabel: 'Actualite',
      description: "Utilise les memes donnees d'actualites que la page publique.",
      emptyMessage: "Aucune actualite n'est encore enregistree.",
      fields: eventFields,
      defaults: {
        time_start: '10:00',
        time_end: '22:00',
        cta_text: 'Je participe',
        cta_href: '/nous-rejoindre',
        is_featured: false,
        is_published: true,
      },
    },
  },
  temoignages: {
    pageKey: 'temoignages',
    pageDescription: 'Contenu de page et temoignages publies.',
    pageDefaults: pageDefaults.temoignages,
    pageFieldOrder: ['hero', 'cta'],
    collection: {
      resource: 'testimonials',
      title: 'Temoignages',
      itemLabel: 'Temoignage',
      description: 'Ajoute, modifie et trie les temoignages.',
      emptyMessage: "Aucun temoignage n'est encore enregistre.",
      fields: testimonialFields,
      defaults: {
        initials: 'RS',
        color1: '#2F5DFF',
        color2: '#1E3A8A',
        is_published: true,
      },
    },
  },
  actualites: {
    pageKey: 'actualites',
    pageDescription: "Contenu de page et liste d'actualites.",
    pageDefaults: pageDefaults.actualites,
    pageFieldOrder: ['hero', 'cta'],
    collection: {
      resource: 'actualities',
      title: 'Actualites',
      itemLabel: 'Actualite',
      description: "Chaque carte d'actualite est geree depuis le backend.",
      emptyMessage: "Aucune actualite n'est encore enregistre.",
      fields: actualityFields,
      defaults: {
        icon: 'fas fa-newspaper',
        is_published: true,
      },
    },
  },
  contact: {
    pageKey: 'contact',
    pageDescription: 'Contenu de la page de contact et messages recus.',
    pageDefaults: pageDefaults.contact,
    pageFieldOrder: ['hero', 'details'],
    showContactMessages: true,
  },
  don: {
    pageKey: 'don',
    pageDescription: 'Contenu de page et modes de don disponibles.',
    pageDefaults: pageDefaults.don,
    pageFieldOrder: ['hero', 'intro', 'impact'],
    collection: {
      resource: 'don',
      title: 'Modes de don',
      itemLabel: 'Mode de don',
      description: 'Les cartes de don sont gerees ici.',
      emptyMessage: "Aucun mode de don n'est encore enregistre.",
      fields: donFields,
      defaults: {
        icon: 'fas fa-heart',
        btn_text: 'En savoir plus',
        border_color: '#2F5DFF',
        is_active: true,
      },
    },
  },
  rejoindre: {
    pageKey: 'nous-rejoindre',
    pageDescription: 'Contenu editorial de la page Nous rejoindre.',
    pageDefaults: pageDefaults.rejoindre,
    pageFieldOrder: ['hero', 'volunteer', 'form'],
  },
} satisfies Record<string, AdminEditorConfig>;
