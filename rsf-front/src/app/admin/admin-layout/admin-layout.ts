import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

type AdminNavItem = {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
  badge?: string;
};

type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AdminLayout implements OnInit {
  isMobileSidebarOpen = false;
  currentPageTitle = 'Administration';
  currentSectionLabel = 'Administration';

  readonly navSections: AdminNavSection[] = [
    {
      label: 'General',
      items: [
        { href: '/admin/dashboard', icon: 'fas fa-chart-line', label: 'Tableau de bord', exact: true },
        { href: '/admin/settings', icon: 'fas fa-gear', label: 'Parametres' },
      ],
    },
    {
      label: 'Pages publiques',
      items: [
        { href: '/admin/accueil', icon: 'fas fa-house', label: 'Accueil' },
        { href: '/admin/qui-sommes-nous', icon: 'fas fa-book-open', label: 'Qui sommes-nous' },
        { href: '/admin/organisation', icon: 'fas fa-users', label: 'Organisation' },
        { href: '/admin/missions', icon: 'fas fa-bullseye', label: 'Missions' },
        { href: '/admin/actions-solidaires', icon: 'fas fa-handshake-angle', label: 'Actions solidaires' },
        { href: '/admin/soutien', icon: 'fas fa-heart', label: 'Soutien aux membres' },
        { href: '/admin/international', icon: 'fas fa-globe', label: 'International' },
        { href: '/admin/evenements', icon: 'fas fa-calendar-days', label: 'Evenements' },
        { href: '/admin/rencontre', icon: 'fas fa-cake-candles', label: 'Rencontre annuelle' },
        { href: '/admin/temoignages', icon: 'fas fa-comments', label: 'Temoignages' },
        { href: '/admin/actualites', icon: 'fas fa-newspaper', label: 'Actualites' },
        { href: '/admin/contact', icon: 'fas fa-envelope', label: 'Contact' },
        { href: '/admin/don', icon: 'fas fa-hand-holding-heart', label: 'Don' },
        { href: '/admin/rejoindre', icon: 'fas fa-user-plus', label: 'Nous rejoindre', badge: 'NEW' },
      ],
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.syncRouteMeta();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncRouteMeta();
        this.closeSidebar();
      });
  }

  toggleSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeSidebar() {
    this.isMobileSidebarOpen = false;
  }

  private syncRouteMeta() {
    let activeRoute = this.route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    this.currentPageTitle = activeRoute.snapshot.data['title'] || 'Administration';
    this.currentSectionLabel = activeRoute.snapshot.data['section'] || this.currentPageTitle;
  }
}
