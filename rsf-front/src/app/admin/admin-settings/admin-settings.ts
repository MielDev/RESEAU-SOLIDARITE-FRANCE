import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminApiService } from '../admin-api.service';
import { AdminAlertService } from '../admin-alert.service';
import { AdminAuthService } from '../admin-auth.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

type SettingRow = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'json';
  group: string;
  value: string | number | boolean;
};

type NavItemEditor = {
  id: number | null;
  label: string;
  href: string;
  icon: string;
  is_visible: boolean;
  is_cta: boolean;
  isNew: boolean;
};

type SettingGroupView = {
  key: string;
  title: string;
  description: string;
  icon: string;
  rows: SettingRow[];
};

@Component({
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule, RouterModule, AdminIconPicker],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings implements OnInit {
  settingsRows: SettingRow[] = [];
  navItems: NavItemEditor[] = [];

  loadingSettings = false;
  loadingNav = false;
  savingSettings = false;
  passwordSaving = false;

  settingsNotice = '';
  settingsError = '';
  navNotice = '';
  navError = '';
  passwordNotice = '';
  passwordError = '';

  newSettingKey = '';
  newSettingType: SettingRow['type'] = 'text';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private readonly adminApi: AdminApiService,
    private readonly alerts: AdminAlertService,
    private readonly auth: AdminAuthService,
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.loadNav();
  }

  get groupedSettings(): SettingGroupView[] {
    const groups = new Map<string, SettingRow[]>();

    this.settingsRows.forEach((row) => {
      const groupKey = row.group || 'general';
      groups.set(groupKey, [...(groups.get(groupKey) ?? []), row]);
    });

    return Array.from(groups.entries())
      .map(([key, rows]) => ({ ...this.groupMeta(key), key, rows }))
      .sort((a, b) => this.groupOrder(a.key) - this.groupOrder(b.key) || a.title.localeCompare(b.title));
  }

  get hasUnsavedNavItems() {
    return this.navItems.some((item) => item.isNew);
  }

  get visibleNavItemsCount() {
    return this.navItems.filter((item) => item.is_visible).length;
  }

  get ctaNavItemsCount() {
    return this.navItems.filter((item) => item.is_cta).length;
  }

  addSettingRow() {
    const key = this.newSettingKey.trim();
    if (!key) {
      this.settingsError = 'Renseigne une cle pour ajouter un parametre.';
      return;
    }

    if (this.settingsRows.some((row) => row.key === key)) {
      this.settingsError = 'Cette cle existe deja.';
      return;
    }

    this.settingsRows = [
      ...this.settingsRows,
      {
        key,
        label: this.toHumanLabel(key),
        type: this.newSettingType,
        group: 'general',
        value: this.newSettingType === 'boolean' ? false : '',
      },
    ];
    this.newSettingKey = '';
    this.newSettingType = 'text';
    this.settingsError = '';
  }

  saveSettings() {
    const payload: Record<string, unknown> = {};

    try {
      this.settingsRows.forEach((row) => {
        payload[row.key] = this.toSettingApiValue(row);
      });
    } catch (error) {
      this.settingsError = error instanceof Error ? error.message : 'Impossible de preparer les parametres.';
      return;
    }

    this.savingSettings = true;
    this.settingsNotice = '';
    this.settingsError = '';

    this.adminApi
      .updateSettings(payload)
      .pipe(finalize(() => (this.savingSettings = false)))
      .subscribe({
        next: () => {
          this.settingsNotice = 'Les parametres ont ete enregistres.';
          void this.alerts.toastSuccess('Parametres enregistres');
          this.loadSettings();
        },
        error: (error) => {
          this.settingsError = error?.error?.message || "Les parametres n'ont pas pu etre enregistres.";
          void this.alerts.error('Sauvegarde impossible', this.settingsError);
        },
      });
  }

  addNavItem() {
    this.navItems = [
      {
        id: null,
        label: '',
        href: '/',
        icon: '',
        is_visible: true,
        is_cta: false,
        isNew: true,
      },
      ...this.navItems,
    ];
  }

  saveNavItem(item: NavItemEditor, index: number) {
    this.navError = '';
    this.navNotice = '';

    const payload = {
      label: item.label,
      href: item.href,
      icon: item.icon,
      is_visible: item.is_visible,
      is_cta: item.is_cta,
      sort_order: index,
    };

    const request = item.isNew
      ? this.adminApi.createResource('nav', payload)
      : this.adminApi.updateResource('nav', item.id as number, payload);

    request.subscribe({
      next: () => {
        this.navNotice = item.isNew ? 'Le lien a ete ajoute.' : 'Le lien a ete mis a jour.';
        void this.alerts.toastSuccess(item.isNew ? 'Lien ajoute' : 'Lien mis a jour');
        this.loadNav();
      },
      error: (error) => {
        this.navError = error?.error?.message || "Le lien n'a pas pu etre enregistre.";
        void this.alerts.error('Enregistrement impossible', this.navError);
      },
    });
  }

  async deleteNavItem(item: NavItemEditor) {
    if (item.isNew) {
      this.navItems = this.navItems.filter((entry) => entry !== item);
      return;
    }

    if (!item.id) {
      return;
    }

    const confirmed = await this.alerts.confirm({
      title: 'Supprimer ce lien ?',
      text: 'Cette action retirera ce lien de navigation du site.',
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler',
    });

    if (!confirmed) {
      return;
    }

    this.adminApi.deleteResource('nav', item.id).subscribe({
      next: () => {
        this.navNotice = 'Le lien a ete supprime.';
        void this.alerts.toastSuccess('Lien supprime');
        this.loadNav();
      },
      error: (error) => {
        this.navError = error?.error?.message || "Le lien n'a pas pu etre supprime.";
        void this.alerts.error('Suppression impossible', this.navError);
      },
    });
  }

  moveNavItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= this.navItems.length || this.navItems.some((item) => item.isNew)) {
      return;
    }

    const reordered = [...this.navItems];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, movedItem);
    this.navItems = reordered;

    const order = this.navItems
      .filter((item) => item.id !== null)
      .map((item, orderIndex) => ({
        id: item.id as number,
        sort_order: orderIndex,
      }));

    this.adminApi.reorderResource('nav', order).subscribe({
      next: () => {
        this.navNotice = "L'ordre de navigation a ete mis a jour.";
        void this.alerts.toastSuccess('Ordre de navigation mis a jour');
        this.loadNav();
      },
      error: (error) => {
        this.navError = error?.error?.message || "L'ordre n'a pas pu etre mis a jour.";
        void this.alerts.error('Reordonnancement impossible', this.navError);
      },
    });
  }

  changePassword() {
    this.passwordError = '';
    this.passwordNotice = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Remplis les trois champs avant de valider.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'La confirmation ne correspond pas au nouveau mot de passe.';
      return;
    }

    this.passwordSaving = true;

    this.auth
      .changePassword(this.currentPassword, this.newPassword)
      .pipe(finalize(() => (this.passwordSaving = false)))
      .subscribe({
        next: () => {
          this.passwordNotice = 'Le mot de passe a ete mis a jour.';
          void this.alerts.success('Mot de passe mis a jour');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (error) => {
          this.passwordError = error?.error?.message || 'Impossible de changer le mot de passe.';
          void this.alerts.error('Mise a jour impossible', this.passwordError);
        },
      });
  }

  trackBySetting = (_index: number, row: SettingRow) => row.key;
  trackBySettingGroup = (_index: number, group: SettingGroupView) => group.key;
  trackByNav = (_index: number, item: NavItemEditor) => item.id ?? `nav-${_index}`;

  settingTypeLabel(type: SettingRow['type']) {
    switch (type) {
      case 'boolean':
        return 'Oui / Non';
      case 'number':
        return 'Nombre';
      case 'json':
        return 'JSON';
      default:
        return 'Texte';
    }
  }

  navStateLabel(item: NavItemEditor) {
    if (!item.is_visible) return 'Masque';
    return item.is_cta ? 'Visible - CTA' : 'Visible';
  }

  private loadSettings() {
    this.loadingSettings = true;

    this.adminApi
      .getSettings()
      .pipe(finalize(() => (this.loadingSettings = false)))
      .subscribe({
        next: ({ data, raw }) => {
          if (raw.length) {
            this.settingsRows = raw.map((entry: any) => ({
              key: entry.key,
              label: entry.label || this.toHumanLabel(entry.key),
              type: (entry.type || 'text') as SettingRow['type'],
              group: entry.group || 'general',
              value: this.toSettingEditorValue(entry.value, entry.type),
            }));
            return;
          }

          this.settingsRows = Object.entries(data).map(([key, value]) => ({
            key,
            label: this.toHumanLabel(key),
            type: typeof value === 'boolean' ? 'boolean' : 'text',
            group: 'general',
            value: typeof value === 'boolean' ? value : String(value ?? ''),
          }));
        },
        error: (error) => {
          this.settingsRows = [];
          this.settingsError = error?.error?.message || 'Impossible de charger les parametres.';
        },
      });
  }

  private loadNav() {
    this.loadingNav = true;

    this.adminApi
      .listResource<any>('nav')
      .pipe(finalize(() => (this.loadingNav = false)))
      .subscribe({
        next: (items) => {
          this.navItems = items.map((item) => ({
            id: item.id,
            label: item.label || '',
            href: item.href || '/',
            icon: item.icon || '',
            is_visible: Boolean(item.is_visible),
            is_cta: Boolean(item.is_cta),
            isNew: false,
          }));
        },
        error: (error) => {
          this.navItems = [];
          this.navError = error?.error?.message || 'Impossible de charger la navigation.';
        },
      });
  }

  private toSettingEditorValue(value: unknown, type: string) {
    if (type === 'boolean') {
      return value === true || value === 'true';
    }

    if (type === 'number') {
      return Number(value ?? 0);
    }

    if (type === 'json') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return JSON.stringify(parsed, null, 2);
      } catch {
        return String(value ?? '');
      }
    }

    return String(value ?? '');
  }

  private toSettingApiValue(row: SettingRow) {
    if (row.type === 'boolean') {
      return row.value ? 'true' : 'false';
    }

    if (row.type === 'number') {
      return String(row.value ?? '');
    }

    if (row.type === 'json') {
      if (typeof row.value !== 'string' || !row.value.trim()) {
        return '{}';
      }

      try {
        return JSON.stringify(JSON.parse(row.value));
      } catch {
        throw new Error(`Le parametre ${row.label} contient un JSON invalide.`);
      }
    }

    return row.value;
  }

  private toHumanLabel(key: string) {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^\w/, (letter) => letter.toUpperCase());
  }

  private groupOrder(group: string) {
    const order = ['general', 'appearance', 'contact', 'footer', 'nav'];
    const index = order.indexOf(group);
    return index === -1 ? order.length + 1 : index;
  }

  private groupMeta(group: string) {
    switch (group) {
      case 'appearance':
        return {
          title: 'Apparence',
          description: 'Identite visuelle et affichage global du site.',
          icon: 'fas fa-palette',
        };
      case 'contact':
        return {
          title: 'Coordonnees',
          description: 'Adresse, email, telephone et informations de contact.',
          icon: 'fas fa-address-card',
        };
      case 'footer':
        return {
          title: 'Pied de page',
          description: 'Informations affichees en bas du site public.',
          icon: 'fas fa-window-minimize',
        };
      case 'nav':
        return {
          title: 'Navigation',
          description: 'Parametres relies au menu public.',
          icon: 'fas fa-compass',
        };
      case 'general':
        return {
          title: 'General',
          description: 'Parametres principaux de l association et du site.',
          icon: 'fas fa-sliders',
        };
      default:
        return {
          title: this.toHumanLabel(group),
          description: 'Autres parametres disponibles dans le backend.',
          icon: 'fas fa-gear',
        };
    }
  }
}
