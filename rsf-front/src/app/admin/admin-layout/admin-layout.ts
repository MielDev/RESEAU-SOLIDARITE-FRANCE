import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AdminAuthService } from '../admin-auth.service';

type AdminNavItem = {
  href: string;
  icon: string;
  label: string;
};

type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit, OnDestroy {
  currentTitle = 'Tableau de bord';
  currentSection = 'General';
  isSidebarOpen = false;

  readonly mainLink: AdminNavItem = {
    href: '/admin/dashboard',
    label: 'Tableau de bord',
    icon: 'fas fa-gauge-high',
  };

  readonly navGroups: AdminNavGroup[] = [
    {
      title: 'Association',
      items: [
        { href: '/admin/accueil', label: 'Accueil', icon: 'fas fa-house' },
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

  private routerEvents?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly auth: AdminAuthService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  ngOnInit() {
    this.document.body.classList.add('admin-mode');
    this.updateRouteContext();
    this.routerEvents = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidebar();
        this.updateRouteContext();
      });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('admin-mode');
    this.routerEvents?.unsubscribe();
  }

  get userName() {
    return this.auth.user()?.name || 'Administrateur';
  }

  get userInitials() {
    return this.auth.getUserInitials();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  private updateRouteContext() {
    let activeRoute: ActivatedRoute | null = this.route;

    while (activeRoute?.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    const data = activeRoute?.snapshot.data ?? {};
    this.currentTitle = data['title'] || 'Back-office';
    this.currentSection = data['section'] || 'General';
  }
}
