import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { AdminUiService } from '../shared/admin-ui.service';

interface AdminNavItem {
  label: string;
  icon: string;
  route: string;
}

interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly ui = inject(AdminUiService);

  readonly sections: AdminNavSection[] = [
    {
      label: 'Tableau de bord',
      items: [{ label: 'Dashboard', icon: '🏠', route: '/admin/dashboard' }],
    },
    {
      label: 'Pages du site',
      items: [
        { label: 'Accueil', icon: '🏠', route: '/admin/accueil' },
        { label: 'Qui sommes-nous ?', icon: '📖', route: '/admin/qui-sommes-nous' },
        { label: 'Organisation', icon: '👥', route: '/admin/organisation' },
        { label: 'Nos missions', icon: '🎯', route: '/admin/missions' },
        { label: 'Actions solidaires', icon: '🤝', route: '/admin/actions-solidaires' },
        { label: 'Soutien aux membres', icon: '💙', route: '/admin/soutien' },
        { label: 'Événements', icon: '📅', route: '/admin/evenements' },
        { label: 'Rencontre annuelle', icon: '🎉', route: '/admin/rencontre' },
        { label: 'Actions internationales', icon: '🌍', route: '/admin/international' },
        { label: 'Témoignages', icon: '💬', route: '/admin/temoignages' },
        { label: 'Nous rejoindre', icon: '🙌', route: '/admin/rejoindre' },
        { label: 'Actualités', icon: '📰', route: '/admin/actualites' },
        { label: 'Faire un don', icon: '❤️', route: '/admin/don' },
        { label: 'Contact', icon: '✉️', route: '/admin/contact' },
      ],
    },
    {
      label: 'Paramètres',
      items: [
        { label: 'Paramètres généraux', icon: '⚙️', route: '/admin/settings' },
      ],
    },
  ];

  private readRouteData(): {
    title: string;
    breadcrumb: string;
    preview: string | undefined;
  } {
    let route: ActivatedRoute | null = this.route;
    while (route?.firstChild) route = route.firstChild;
    const data = route?.snapshot?.data ?? {};
    return {
      title: (data['title'] as string) || 'Admin',
      breadcrumb: (data['breadcrumb'] as string) || 'Admin',
      preview: data['preview'] as string | undefined,
    };
  }

  readonly pageInfo = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.readRouteData()),
    ),
    { initialValue: this.readRouteData() },
  );

  onSidebarLinkClick(): void {
    this.ui.closeSidebar();
  }

  onOverlayClick(): void {
    this.ui.closeSidebar();
  }
}
