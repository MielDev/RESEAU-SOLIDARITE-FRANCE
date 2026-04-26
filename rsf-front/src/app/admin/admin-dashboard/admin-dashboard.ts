import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  readonly stats = [
    { label: 'Pages publiques', value: '14', sub: 'Textes et blocs modifiables', icon: 'fas fa-layer-group' },
    { label: 'Collections', value: '7', sub: 'Ajout, edition, suppression', icon: 'fas fa-table-list' },
    { label: 'Navigation', value: 'OK', sub: 'Menu et liens du site', icon: 'fas fa-compass' },
    { label: 'Messages', value: 'Live', sub: 'Demandes depuis les formulaires', icon: 'fas fa-inbox' },
  ];

  readonly quickLinks = [
    {
      href: '/admin/accueil',
      label: 'Page Accueil',
      description: 'Hero, boutons, statistiques, navigation et CTA.',
      icon: 'fas fa-house',
    },
    {
      href: '/admin/missions',
      label: 'Missions',
      description: 'Cartes de missions et points associes.',
      icon: 'fas fa-bullseye',
    },
    {
      href: '/admin/evenements',
      label: 'Evenements',
      description: 'Programme, dates, lieux et mise en avant.',
      icon: 'fas fa-calendar-days',
    },
    {
      href: '/admin/settings',
      label: 'Parametres',
      description: 'Identite, coordonnees et navigation.',
      icon: 'fas fa-gear',
    },
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
      title: 'Conversion',
      items: [
        { href: '/admin/rejoindre', label: 'Nous rejoindre', icon: 'fas fa-user-plus' },
        { href: '/admin/don', label: 'Don', icon: 'fas fa-hand-holding-heart' },
        { href: '/admin/contact', label: 'Contact', icon: 'fas fa-envelope' },
      ],
    },
  ];
}
