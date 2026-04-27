import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-accueil',
  imports: [CommonModule, FormsModule, RouterModule, AdminIconPicker],
  templateUrl: './admin-accueil.html',
  styleUrl: './admin-accueil.css',
})
export class AdminAccueil implements OnInit {
  data: any = {};
  saving = false;
  readonly actionSlots = [
    { index: 1, label: 'Bouton principal' },
    { index: 2, label: 'Bouton secondaire' },
    { index: 3, label: 'Bouton complementaire' },
  ];
  readonly statSlots = [
    { index: 1, label: 'Statistique 1' },
    { index: 2, label: 'Statistique 2' },
    { index: 3, label: 'Statistique 3' },
  ];
  readonly featureSlots = [
    { index: 1, label: 'Carte 1', fallbackIcon: 'fas fa-file-invoice' },
    { index: 2, label: 'Carte 2', fallbackIcon: 'fas fa-briefcase' },
    { index: 3, label: 'Carte 3', fallbackIcon: 'fas fa-hand-holding-heart' },
  ];
  private pageData: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getPage('accueil').subscribe(data => {
      this.pageData = data || {};
      this.data = this.toFormData(this.pageData);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('accueil', this.toPageData()).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', "La page d'accueil a bien ete mise a jour.");
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Une erreur est survenue. Reessaie dans quelques secondes.');
      },
    });
  }

  heroPreviewTitle() {
    return [this.data.hero_title1, this.data.hero_title2, this.data.hero_title3]
      .map((part) => String(part || '').trim())
      .filter(Boolean)
      .join(' ');
  }

  actionPreview(index: number) {
    return {
      label: this.data[`btn${index}_text`] || `Bouton ${index}`,
      href: this.data[`btn${index}_href`] || '/accueil',
      style: this.data[`btn${index}_style`] || 'Bleu primaire',
    };
  }

  statPreview(index: number) {
    return {
      value: this.data[`stat${index}_val`] || '-',
      label: this.data[`stat${index}_label`] || `Statistique ${index}`,
      color: this.data[`stat${index}_color`] || 'Bleu',
    };
  }

  featurePreview(index: number) {
    return {
      icon: this.data[`c${index}_icon`] || this.featureSlots[index - 1]?.fallbackIcon || 'fas fa-circle',
      title: this.data[`c${index}_title`] || `Carte ${index}`,
      text: this.data[`c${index}_desc`] || '',
    };
  }

  private toFormData(page: any) {
    const titleParts = this.splitHeroTitle(page?.hero?.title);
    const actions = Array.isArray(page?.heroActions) ? page.heroActions : [];
    const cards = Array.isArray(page?.statsCards) ? page.statsCards : [];
    const features = Array.isArray(page?.hero?.features) ? page.hero.features : [];

    return {
      hero_badge: page?.hero?.badge ?? '',
      hero_title1: titleParts.before,
      hero_title2: titleParts.highlight,
      hero_title3: titleParts.after,
      hero_desc: page?.hero?.text ?? '',
      btn1_text: actions[0]?.label ?? '',
      btn1_href: actions[0]?.href ?? '',
      btn1_style: this.variantToLabel(actions[0]?.variant),
      btn2_text: actions[1]?.label ?? '',
      btn2_href: actions[1]?.href ?? '',
      btn2_style: this.variantToLabel(actions[1]?.variant),
      btn3_text: actions[2]?.label ?? '',
      btn3_href: actions[2]?.href ?? '',
      btn3_style: this.variantToLabel(actions[2]?.variant),
      stat1_val: cards[0]?.value ?? page?.stats?.[cards[0]?.key] ?? page?.stats?.members ?? '',
      stat1_label: cards[0]?.label ?? '',
      stat1_color: this.colorToLabel(cards[0]?.borderColor),
      stat2_val: cards[1]?.value ?? page?.stats?.[cards[1]?.key] ?? page?.stats?.domains ?? '',
      stat2_label: cards[1]?.label ?? '',
      stat2_color: this.colorToLabel(cards[1]?.borderColor),
      stat3_val: cards[2]?.value ?? '',
      stat3_label: cards[2]?.label ?? '',
      stat3_color: this.colorToLabel(cards[2]?.borderColor),
      c1_icon: features[0]?.icon ?? '',
      c1_title: features[0]?.title ?? '',
      c1_desc: features[0]?.text ?? '',
      c2_icon: features[1]?.icon ?? '',
      c2_title: features[1]?.title ?? '',
      c2_desc: features[1]?.text ?? '',
      c3_icon: features[2]?.icon ?? '',
      c3_title: features[2]?.title ?? '',
      c3_desc: features[2]?.text ?? '',
      cta_title: page?.cta?.title ?? '',
      cta_sub: page?.cta?.text ?? '',
    };
  }

  private toPageData() {
    return {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        badge: this.data.hero_badge,
        title: this.buildHeroTitle(),
        text: this.data.hero_desc,
        features: [1, 2, 3].map((index) => ({
          ...(this.pageData.hero?.features?.[index - 1] ?? {}),
          icon: this.data[`c${index}_icon`],
          title: this.data[`c${index}_title`],
          text: this.data[`c${index}_desc`],
        })),
      },
      heroActions: [1, 2, 3].map((index) => ({
        ...(this.pageData.heroActions?.[index - 1] ?? {}),
        label: this.data[`btn${index}_text`],
        href: this.data[`btn${index}_href`],
        variant: this.labelToVariant(this.data[`btn${index}_style`]),
      })),
      stats: {
        ...(this.pageData.stats ?? {}),
        members: this.data.stat1_val,
        domains: this.data.stat2_val,
      },
      statsCards: [
        { ...(this.pageData.statsCards?.[0] ?? {}), key: 'members', label: this.data.stat1_label, borderColor: this.labelToColor(this.data.stat1_color) },
        { ...(this.pageData.statsCards?.[1] ?? {}), key: 'domains', label: this.data.stat2_label, borderColor: this.labelToColor(this.data.stat2_color) },
        { ...(this.pageData.statsCards?.[2] ?? {}), value: this.data.stat3_val, label: this.data.stat3_label, borderColor: this.labelToColor(this.data.stat3_color) },
      ],
      cta: {
        ...(this.pageData.cta ?? {}),
        title: this.data.cta_title,
        text: this.data.cta_sub,
      },
    };
  }

  private splitHeroTitle(title: unknown) {
    const value = typeof title === 'string' ? title : '';
    const match = value.match(/^(.*?)<span[^>]*>(.*?)<\/span>(.*)$/i);

    if (!match) {
      return { before: value, highlight: '', after: '' };
    }

    return {
      before: match[1].trim(),
      highlight: match[2].trim(),
      after: match[3].trim(),
    };
  }

  private buildHeroTitle() {
    const before = this.data.hero_title1 || '';
    const highlight = this.data.hero_title2 || '';
    const after = this.data.hero_title3 || '';

    if (!highlight) {
      return [before, after].filter(Boolean).join(' ');
    }

    return [before, `<span class="text-primary">${highlight}</span>`, after].filter(Boolean).join(' ');
  }

  private variantToLabel(variant: unknown) {
    switch (variant) {
      case 'accent':
        return 'Orange accent';
      case 'support':
        return 'Vert support';
      case 'outline':
        return 'Contour';
      default:
        return 'Bleu primaire';
    }
  }

  private labelToVariant(label: unknown) {
    switch (label) {
      case 'Orange accent':
        return 'accent';
      case 'Vert support':
        return 'support';
      case 'Contour':
        return 'outline';
      default:
        return 'primary';
    }
  }

  private colorToLabel(color: unknown) {
    const value = String(color ?? '').toLowerCase();
    if (value.includes('accent') || value.includes('ff8c00')) return 'Orange';
    if (value.includes('support') || value.includes('22c55e')) return 'Vert';
    return 'Bleu';
  }

  private labelToColor(label: unknown) {
    switch (label) {
      case 'Orange':
        return 'var(--accent)';
      case 'Vert':
        return 'var(--support)';
      default:
        return 'var(--primary)';
    }
  }
}
