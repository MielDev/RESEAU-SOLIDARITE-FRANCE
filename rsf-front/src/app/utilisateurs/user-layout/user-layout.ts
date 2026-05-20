import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CookieConsentPreferences, CookieConsentService } from '../../services/cookie-consent.service';
import { UserAuthService } from '../../services/user-auth.service';

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
export class UserLayout implements OnInit, OnDestroy {
  isScrolled = false;
  showScrollTop = false;
  isMobileNavOpen = false;
  isCookieBannerVisible = false;
  isCookiePreferencesOpen = false;
  cookiePreferences: CookieConsentPreferences = {
    necessary: true,
    audience: false,
    externalServices: false,
  };
  settings: any = null;
  homeItem: NavItem | null = null;
  navGroups: NavGroup[] = [];
  navSingleItems: NavItem[] = [];
  navCtaItem: NavItem | null = null;
  footerGroups: FooterGroup[] = [];
  readonly legalLinks: NavItem[] = [
    { href: '/mentions-legales', label: 'Mentions legales' },
    { href: '/politique-confidentialite', label: 'Confidentialite' },
    { href: '/cookies', label: 'Cookies' },
  ];

  private readonly openCookiePreferencesHandler = () => this.openCookiePreferences();

  constructor(
    private route: ActivatedRoute,
    private cookieConsent: CookieConsentService,
    public readonly auth: UserAuthService,
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      const layoutData = data.data || {};
      this.settings = layoutData.settings ?? null;
      this.buildNavigation(Array.isArray(layoutData.nav) ? layoutData.nav : []);
    });

    this.isCookieBannerVisible = !this.cookieConsent.hasChoice();
    this.cookiePreferences = this.cookieConsent.getPreferences();

    if (typeof window !== 'undefined') {
      window.addEventListener('rsf-cookie-preferences-open', this.openCookiePreferencesHandler);
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('rsf-cookie-preferences-open', this.openCookiePreferencesHandler);
    }
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

  acceptCookies() {
    this.cookieConsent.acceptAll();
    this.closeCookiePanels();
  }

  rejectCookies() {
    this.cookieConsent.rejectAll();
    this.closeCookiePanels();
  }

  openCookiePreferences() {
    this.cookiePreferences = this.cookieConsent.getPreferences();
    this.isCookiePreferencesOpen = true;
    this.isCookieBannerVisible = false;
  }

  saveCookiePreferences() {
    this.cookieConsent.savePreferences(this.cookiePreferences);
    this.closeCookiePanels();
  }

  closeCookiePreferences() {
    this.isCookiePreferencesOpen = false;
    this.isCookieBannerVisible = !this.cookieConsent.hasChoice();
  }

  setCookiePreference(key: 'audience' | 'externalServices', event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.cookiePreferences = {
      ...this.cookiePreferences,
      necessary: true,
      [key]: Boolean(target?.checked),
    };
  }

  private closeCookiePanels() {
    this.isCookieBannerVisible = false;
    this.isCookiePreferencesOpen = false;
  }

  private buildNavigation(rawItems: NavItem[]) {
    const sourceItems = Array.isArray(rawItems) ? rawItems : [];
    const hasLegacyEventItem = sourceItems.some((item) => item?.href === '/evenements');
    const items = sourceItems
      .filter((item) => !(hasLegacyEventItem && item?.href === '/actualites'))
      .map((item) =>
        item?.href === '/evenements'
          ? { ...item, href: '/actualites', label: 'Actualites', icon: 'fas fa-newspaper' }
          : item
      );
    const regularItems = items.filter((item) => !item?.is_cta);
    const groupedHrefs = new Set([
      '/qui-sommes-nous',
      '/organisation',
      '/nos-missions',
      '/actions-solidaires',
      '/soutien-aux-membres',
      '/actions-internationales',
      '/actualites',
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
        label: 'Actualites',
        items: regularItems.filter((item) => ['/actualites', '/rencontre-annuelle'].includes(item.href)),
      },
    ].filter((group) => group.items.length > 0);

    this.navSingleItems = regularItems.filter((item) => item.href !== '/' && !groupedHrefs.has(item.href));
    this.footerGroups = [
      {
        title: "L'association",
        items: regularItems.filter((item) => ['/qui-sommes-nous', '/organisation', '/temoignages'].includes(item.href)),
      },
      {
        title: 'Nos actions',
        items: regularItems.filter((item) =>
          ['/nos-missions', '/actions-solidaires', '/soutien-aux-membres', '/actions-internationales'].includes(item.href)
        ),
      },
      {
        title: 'Nous rejoindre',
        items: regularItems.filter((item) => ['/nous-rejoindre', '/don', '/actualites', '/contact'].includes(item.href)),
      },
      {
        title: 'Informations legales',
        items: this.legalLinks,
      },
    ].filter((group) => group.items.length > 0);
  }
}
