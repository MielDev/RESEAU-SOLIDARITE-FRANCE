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
    { label: 'Pages publiques', value: '14', sub: 'Contenus editoriaux', icon: 'fas fa-layer-group', tone: 'blue' },
    { label: 'Collections', value: '7', sub: 'Listes administrables', icon: 'fas fa-table-list', tone: 'green' },
    { label: 'Publication', value: 'OK', sub: 'Evenements et actualites', icon: 'fas fa-newspaper', tone: 'orange' },
    { label: 'Demandes', value: 'Live', sub: 'Contact, rejoindre, don', icon: 'fas fa-inbox', tone: 'gray' },
  ];

  readonly primaryActions = [
    {
      href: '/admin/accueil',
      label: 'Modifier la page Accueil',
      description: 'Hero, boutons, statistiques, cartes et CTA principal.',
      icon: 'fas fa-house',
      tone: 'blue',
    },
    {
      href: '/admin/rencontre',
      label: 'Gerer la rencontre annuelle',
      description: 'Editions, programme, galerie photos et publication.',
      icon: 'fas fa-cake-candles',
      tone: 'orange',
    },
    {
      href: '/admin/evenements',
      label: 'Publier un evenement',
      description: 'Dates, lieux, photos, programme et ordre d affichage.',
      icon: 'fas fa-calendar-days',
      tone: 'green',
    },
    {
      href: '/admin/contact',
      label: 'Lire les messages',
      description: 'Suivi des demandes recues depuis le front office.',
      icon: 'fas fa-envelope-open-text',
      tone: 'gray',
    },
  ];

  readonly workflow = [
    { label: 'Verifier la page Accueil', href: '/admin/accueil', icon: 'fas fa-house' },
    { label: 'Mettre a jour les actions', href: '/admin/actions-solidaires', icon: 'fas fa-handshake-angle' },
    { label: 'Publier les evenements', href: '/admin/evenements', icon: 'fas fa-calendar-days' },
    { label: 'Controler les parametres', href: '/admin/settings', icon: 'fas fa-sliders' },
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
