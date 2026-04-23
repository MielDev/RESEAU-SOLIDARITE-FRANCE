import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';

type NavItem = {
  href: string;
  icon?: string;
  is_cta?: boolean;
  label: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type FooterGroup = {
  title: string;
  items: NavItem[];
};

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout implements OnInit {
  isScrolled = false;
  showScrollTop = false;
  isMobileNavOpen = false;
  settings: any = null;
  homeItem: NavItem | null = null;
  navGroups: NavGroup[] = [];
  navSingleItems: NavItem[] = [];
  navCtaItem: NavItem | null = null;
  footerGroups: FooterGroup[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      const layoutData = data.data || {};
      this.settings = layoutData.settings ?? null;
      this.buildNavigation(Array.isArray(layoutData.nav) ? layoutData.nav : []);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
    this.showScrollTop = window.scrollY > 400;
  }

  isExactLink(href?: string): boolean {
    return href === '/';
  }

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private buildNavigation(rawItems: NavItem[]) {
    const items = Array.isArray(rawItems) ? rawItems : [];
    const regularItems = items.filter((item) => !item?.is_cta);
    const groupedHrefs = new Set([
      '/qui-sommes-nous',
      '/organisation',
      '/nos-missions',
      '/actions-solidaires',
      '/soutien-aux-membres',
      '/actions-internationales',
      '/evenements',
      '/rencontre-annuelle',
    ]);

    this.homeItem = regularItems.find((item) => item.href === '/') || null;
    this.navCtaItem = items.find((item) => item?.is_cta) || null;
    this.navGroups = [
      {
        label: 'A propos',
        items: regularItems.filter((item) => ['/qui-sommes-nous', '/organisation'].includes(item.href)),
      },
      {
        label: 'Nos actions',
        items: regularItems.filter((item) =>
          ['/nos-missions', '/actions-solidaires', '/soutien-aux-membres', '/actions-internationales'].includes(item.href)
        ),
      },
      {
        label: 'Evenements',
        items: regularItems.filter((item) => ['/evenements', '/rencontre-annuelle'].includes(item.href)),
      },
    ].filter((group) => group.items.length > 0);

    this.navSingleItems = regularItems.filter((item) => item.href !== '/' && !groupedHrefs.has(item.href));
    this.footerGroups = [
      {
        title: "L'association",
        items: regularItems.filter((item) => ['/qui-sommes-nous', '/organisation', '/temoignages', '/actualites'].includes(item.href)),
      },
      {
        title: 'Nos actions',
        items: regularItems.filter((item) =>
          ['/nos-missions', '/actions-solidaires', '/soutien-aux-membres', '/actions-internationales'].includes(item.href)
        ),
      },
      {
        title: 'Nous rejoindre',
        items: regularItems.filter((item) => ['/nous-rejoindre', '/don', '/evenements', '/contact'].includes(item.href)),
      },
    ].filter((group) => group.items.length > 0);
  }
}
