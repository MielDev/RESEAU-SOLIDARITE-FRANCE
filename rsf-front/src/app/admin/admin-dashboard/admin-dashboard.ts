import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../admin-api.service';

type DashboardGroupedStat = {
  label: string;
  total: number;
  percentage: number;
};

type DashboardRecentActivity = {
  type: 'registration' | 'join-request' | 'contact' | 'appointment';
  label: string;
  meta: string;
  date: string;
};

type DashboardStats = {
  generatedAt: string;
  registrations: {
    total: number;
    active: number;
    last30Days: number;
  };
  requests: {
    total: number;
    resolved: number;
    pending: number;
    unread: number;
    join: {
      total: number;
      resolved: number;
      open: number;
      unread: number;
    };
    contact: {
      total: number;
      resolved: number;
      unread: number;
    };
  };
  appointments: {
    confirmed: number;
    slotsTotal: number;
    slotsActive: number;
    slotsAvailable: number;
    occupancyRate: number;
  };
  countries: DashboardGroupedStat[];
  userStatuses: DashboardGroupedStat[];
  recentActivity: DashboardRecentActivity[];
};

const emptyDashboardStats: DashboardStats = {
  generatedAt: '',
  registrations: {
    total: 0,
    active: 0,
    last30Days: 0,
  },
  requests: {
    total: 0,
    resolved: 0,
    pending: 0,
    unread: 0,
    join: {
      total: 0,
      resolved: 0,
      open: 0,
      unread: 0,
    },
    contact: {
      total: 0,
      resolved: 0,
      unread: 0,
    },
  },
  appointments: {
    confirmed: 0,
    slotsTotal: 0,
    slotsActive: 0,
    slotsAvailable: 0,
    occupancyRate: 0,
  },
  countries: [],
  userStatuses: [],
  recentActivity: [],
};

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly dashboard = signal<DashboardStats>(emptyDashboardStats);
  readonly metricCards = computed(() => {
    const stats = this.dashboard();

    return [
      {
        label: 'Inscriptions',
        value: this.formatNumber(stats.registrations.total),
        sub: `${this.formatNumber(stats.registrations.last30Days)} sur 30 jours`,
        icon: 'fas fa-user-plus',
        tone: 'blue',
      },
      {
        label: 'Demandes effectuees',
        value: this.formatNumber(stats.requests.total),
        sub: `${this.formatNumber(stats.requests.pending)} en attente`,
        icon: 'fas fa-inbox',
        tone: 'orange',
      },
      {
        label: 'Demandes traitees',
        value: this.formatNumber(stats.requests.resolved),
        sub: `${this.resolutionRate()}% de resolution`,
        icon: 'fas fa-circle-check',
        tone: 'green',
      },
      {
        label: 'Rendez-vous',
        value: this.formatNumber(stats.appointments.confirmed),
        sub: `${this.formatNumber(stats.appointments.slotsAvailable)} creneaux libres`,
        icon: 'fas fa-calendar-check',
        tone: 'purple',
      },
      {
        label: 'A lire',
        value: this.formatNumber(stats.requests.unread),
        sub: 'Messages et adhesions non lus',
        icon: 'fas fa-bell',
        tone: 'gray',
      },
    ];
  });

  loadingStats = true;
  statsError = '';

  readonly primaryActions = [
    {
      href: '/admin/rejoindre',
      label: 'Traiter les demandes',
      description: 'Suivi des adhesions, notes internes et statut de traitement.',
      icon: 'fas fa-user-check',
      tone: 'blue',
    },
    {
      href: '/admin/rendez-vous',
      label: 'Voir les rendez-vous',
      description: 'Reservations confirmees et creneaux bloques par les utilisateurs.',
      icon: 'fas fa-calendar-check',
      tone: 'orange',
    },
    {
      href: '/admin/creneaux',
      label: 'Ouvrir des creneaux',
      description: 'Disponibilites d accompagnement, horaires, lieux et notes.',
      icon: 'fas fa-calendar-plus',
      tone: 'green',
    },
    {
      href: '/admin/contact',
      label: 'Lire les messages',
      description: 'Demandes envoyees depuis le formulaire de contact public.',
      icon: 'fas fa-envelope-open-text',
      tone: 'gray',
    },
  ];

  readonly workflow = [
    { label: 'Lire les nouvelles demandes', href: '/admin/rejoindre', icon: 'fas fa-user-check' },
    { label: 'Verifier les rendez-vous', href: '/admin/rendez-vous', icon: 'fas fa-calendar-check' },
    { label: 'Ajouter des disponibilites', href: '/admin/creneaux', icon: 'fas fa-calendar-plus' },
    { label: 'Publier les informations utiles', href: '/admin/actualites', icon: 'fas fa-newspaper' },
  ];

  readonly adminGroups = [
    {
      title: 'Association',
      items: [
        { href: '/admin/qui-sommes-nous', label: 'Qui sommes-nous', icon: 'fas fa-book-open' },
        { href: '/admin/organisation', label: 'Organisation', icon: 'fas fa-users' },
        { href: '/admin/temoignages', label: 'Temoignages', icon: 'fas fa-comments' },
      ],
    },
    {
      title: 'Actions',
      items: [
        { href: '/admin/missions', label: 'Missions', icon: 'fas fa-bullseye' },
        { href: '/admin/actions-solidaires', label: 'Actions solidaires', icon: 'fas fa-handshake-angle' },
        { href: '/admin/international', label: 'International', icon: 'fas fa-globe' },
        { href: '/admin/soutien', label: 'Soutien', icon: 'fas fa-heart' },
      ],
    },
    {
      title: 'Publication',
      items: [
        { href: '/admin/evenements', label: 'Evenements', icon: 'fas fa-calendar-days' },
        { href: '/admin/rencontre', label: 'Rencontre annuelle', icon: 'fas fa-cake-candles' },
        { href: '/admin/actualites', label: 'Actualites', icon: 'fas fa-newspaper' },
      ],
    },
    {
      title: 'Demandes',
      items: [
        { href: '/admin/rejoindre', label: 'Nous rejoindre', icon: 'fas fa-user-plus' },
        { href: '/admin/don', label: 'Don', icon: 'fas fa-hand-holding-heart' },
        { href: '/admin/contact', label: 'Contact', icon: 'fas fa-envelope' },
      ],
    },
    {
      title: 'Accompagnement',
      items: [
        { href: '/admin/creneaux', label: 'Creneaux', icon: 'fas fa-calendar-plus' },
        { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: 'fas fa-calendar-check' },
      ],
    },
  ];

  ngOnInit() {
    this.loadStats();
  }

  reloadStats() {
    this.loadStats();
  }

  get countries() {
    return this.dashboard().countries;
  }

  get userStatuses() {
    return this.dashboard().userStatuses;
  }

  get recentActivity() {
    return this.dashboard().recentActivity;
  }

  get requestCards() {
    const requests = this.dashboard().requests;

    return [
      {
        label: 'Demandes adhesion',
        value: requests.join.total,
        sub: `${requests.join.open} ouvertes`,
        icon: 'fas fa-user-group',
      },
      {
        label: 'Messages contact',
        value: requests.contact.total,
        sub: `${requests.contact.unread} non lus`,
        icon: 'fas fa-envelope',
      },
      {
        label: 'Suivi a faire',
        value: requests.pending,
        sub: 'Restent a traiter',
        icon: 'fas fa-hourglass-half',
      },
    ];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(Number(value) || 0);
  }

  formatDateTime(date: string): string {
    if (!date) return '-';

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  activityIcon(type: DashboardRecentActivity['type']): string {
    const icons = {
      registration: 'fas fa-user-plus',
      'join-request': 'fas fa-user-check',
      contact: 'fas fa-envelope',
      appointment: 'fas fa-calendar-check',
    };

    return icons[type] ?? 'fas fa-circle';
  }

  activityLabel(type: DashboardRecentActivity['type']): string {
    const labels = {
      registration: 'Inscription',
      'join-request': 'Demande',
      contact: 'Contact',
      appointment: 'Rendez-vous',
    };

    return labels[type] ?? 'Activite';
  }

  private loadStats() {
    this.loadingStats = true;
    this.statsError = '';

    this.api.getDashboardStats<DashboardStats>().subscribe({
      next: (stats) => {
        this.dashboard.set({
          ...emptyDashboardStats,
          ...(stats ?? {}),
          registrations: { ...emptyDashboardStats.registrations, ...(stats?.registrations ?? {}) },
          requests: {
            ...emptyDashboardStats.requests,
            ...(stats?.requests ?? {}),
            join: { ...emptyDashboardStats.requests.join, ...(stats?.requests?.join ?? {}) },
            contact: { ...emptyDashboardStats.requests.contact, ...(stats?.requests?.contact ?? {}) },
          },
          appointments: { ...emptyDashboardStats.appointments, ...(stats?.appointments ?? {}) },
          countries: Array.isArray(stats?.countries) ? stats.countries : [],
          userStatuses: Array.isArray(stats?.userStatuses) ? stats.userStatuses : [],
          recentActivity: Array.isArray(stats?.recentActivity) ? stats.recentActivity : [],
        });
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
        this.statsError = 'Les statistiques ne peuvent pas etre chargees pour le moment.';
      },
    });
  }

  private resolutionRate(): number {
    const requests = this.dashboard().requests;
    return requests.total > 0 ? Math.round((requests.resolved / requests.total) * 100) : 0;
  }
}
