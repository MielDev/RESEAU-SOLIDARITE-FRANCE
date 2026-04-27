import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CookieConsentService } from '../../services/cookie-consent.service';

type LegalPageKey = 'mentions' | 'privacy' | 'cookies';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export class Legal implements OnInit {
  pageKey: LegalPageKey = 'mentions';
  settings: any = null;
  readonly lastUpdated = '27 avril 2026';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cookieConsent: CookieConsentService,
  ) {}

  ngOnInit() {
    this.settings = this.route.parent?.snapshot.data['data']?.settings ?? null;

    this.route.data.subscribe((data) => {
      const requestedPage = data['legalPage'];
      this.pageKey = requestedPage === 'privacy' || requestedPage === 'cookies' ? requestedPage : 'mentions';
    });
  }

  get pageTitle(): string {
    switch (this.pageKey) {
      case 'privacy':
        return 'Politique de confidentialite';
      case 'cookies':
        return 'Politique relative aux cookies';
      default:
        return 'Mentions legales';
    }
  }

  get pageIntro(): string {
    switch (this.pageKey) {
      case 'privacy':
        return 'Cette page explique quelles donnees personnelles sont traitees via le site, pourquoi elles le sont, pendant combien de temps et comment exercer vos droits.';
      case 'cookies':
        return 'Cette page presente les traceurs utilises par le site et vous permet de modifier vos choix a tout moment.';
      default:
        return "Informations obligatoires sur l'editeur du site, l'hebergement, la responsabilite editoriale et les droits applicables.";
    }
  }

  get pageIcon(): string {
    switch (this.pageKey) {
      case 'privacy':
        return 'fas fa-shield-halved';
      case 'cookies':
        return 'fas fa-cookie-bite';
      default:
        return 'fas fa-scale-balanced';
    }
  }

  get siteName(): string {
    return this.setting('siteName', 'assoc_name') || 'Reseau Solidarite France';
  }

  get associationName(): string {
    return this.setting('assoc_name', 'siteName') || 'Reseau Solidarite France';
  }

  get contactEmail(): string {
    return this.setting('contact_email', 'email') || '';
  }

  get contactPhone(): string {
    return this.setting('contact_phone', 'phone') || '';
  }

  get legalDirector(): string {
    return this.setting('legal_director', 'publication_director', 'assoc_president');
  }

  get legalIdentifier(): string {
    return this.setting('legal_identifier', 'rna', 'legal_rna', 'siren', 'legal_siren');
  }

  get hostName(): string {
    return this.setting('legal_host_name', 'host_name', 'hebergeur_nom');
  }

  get hostAddress(): string {
    return this.setting('legal_host_address', 'host_address', 'hebergeur_adresse');
  }

  get hostPhone(): string {
    return this.setting('legal_host_phone', 'host_phone', 'hebergeur_telephone');
  }

  get addressLines(): string[] {
    const structuredLines = [
      this.setting('addr_street'),
      [this.setting('addr_postal_code'), this.setting('addr_city')].filter(Boolean).join(' '),
      this.setting('addr_country'),
    ].filter(Boolean);

    if (structuredLines.length > 0) {
      return structuredLines;
    }

    const address = this.setting('address');
    return address ? [address] : [];
  }

  mailto(email: string): string {
    return `mailto:${email}`;
  }

  display(value: string, fallback = 'A completer dans les parametres du site'): string {
    return value || fallback;
  }

  openCookiePreferences() {
    this.cookieConsent.openPreferences();
  }

  private setting(...keys: string[]): string {
    for (const key of keys) {
      const value = this.settings?.[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return '';
  }
}
