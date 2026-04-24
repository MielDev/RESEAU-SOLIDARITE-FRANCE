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
    { label: 'Pages admin', value: '14', sub: 'Ecrans relies au layout admin', icon: 'fas fa-layer-group' },
    { label: 'Pages publiques', value: '13', sub: 'Pages pilotables depuis le back-office', icon: 'fas fa-globe' },
    { label: 'Sections DB', value: '100%', sub: 'Contenus front relies au backend', icon: 'fas fa-database' },
    { label: 'Priorite', value: 'UI', sub: 'Structurer les formulaires d edition', icon: 'fas fa-wand-magic-sparkles' },
  ];

  readonly quickLinks = [
    { href: '/admin/accueil', label: 'Modifier la page Accueil', icon: 'fas fa-house' },
    { href: '/admin/missions', label: 'Gerer les missions', icon: 'fas fa-bullseye' },
    { href: '/admin/evenements', label: 'Gerer les evenements', icon: 'fas fa-calendar-days' },
    { href: '/admin/settings', label: 'Regler les parametres du site', icon: 'fas fa-gear' },
  ];
}
