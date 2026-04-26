import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type AdminIconOption = {
  label: string;
  className: string;
  category: string;
  keywords: string;
};

const ADMIN_ICON_OPTIONS: AdminIconOption[] = [
  { label: 'Accueil', className: 'fas fa-house', category: 'Navigation', keywords: 'maison accueil home' },
  { label: 'Tableau de bord', className: 'fas fa-gauge-high', category: 'Navigation', keywords: 'dashboard admin statistiques' },
  { label: 'Parametres', className: 'fas fa-gear', category: 'Navigation', keywords: 'reglage configuration' },
  { label: 'Boussole', className: 'fas fa-compass', category: 'Navigation', keywords: 'navigation orientation menu' },
  { label: 'Lien', className: 'fas fa-link', category: 'Navigation', keywords: 'url bouton' },
  { label: 'Fleche droite', className: 'fas fa-arrow-right', category: 'Navigation', keywords: 'suivant bouton action' },
  { label: 'Ouvrir', className: 'fas fa-arrow-up-right-from-square', category: 'Navigation', keywords: 'externe ouvrir lien' },
  { label: 'Modifier', className: 'fas fa-pen-to-square', category: 'Navigation', keywords: 'edition modifier crayon' },
  { label: 'Plus', className: 'fas fa-plus', category: 'Navigation', keywords: 'ajouter nouveau' },
  { label: 'Corbeille', className: 'fas fa-trash', category: 'Navigation', keywords: 'supprimer retirer' },
  { label: 'Voir', className: 'fas fa-eye', category: 'Navigation', keywords: 'aperçu lecture visibilite' },
  { label: 'Recherche', className: 'fas fa-magnifying-glass', category: 'Navigation', keywords: 'chercher filtre' },

  { label: 'Coeur', className: 'fas fa-heart', category: 'Solidarite', keywords: 'don amour aide' },
  { label: 'Main et coeur', className: 'fas fa-hand-holding-heart', category: 'Solidarite', keywords: 'soutien benevolat don' },
  { label: 'Poignee de main', className: 'fas fa-handshake', category: 'Solidarite', keywords: 'accord aide partenariat' },
  { label: 'Main solidaire', className: 'fas fa-handshake-angle', category: 'Solidarite', keywords: 'entraide accompagnement' },
  { label: 'Mains', className: 'fas fa-hands-holding', category: 'Solidarite', keywords: 'soutien communaute' },
  { label: 'Personnes', className: 'fas fa-users', category: 'Solidarite', keywords: 'membres groupe equipe' },
  { label: 'Groupe', className: 'fas fa-people-group', category: 'Solidarite', keywords: 'communaute collectif' },
  { label: 'Utilisateur plus', className: 'fas fa-user-plus', category: 'Solidarite', keywords: 'rejoindre inscription membre' },
  { label: 'Utilisateur diplome', className: 'fas fa-user-graduate', category: 'Solidarite', keywords: 'etudiant formation' },
  { label: 'Utilisateur pro', className: 'fas fa-user-tie', category: 'Solidarite', keywords: 'emploi professionnel' },
  { label: 'Balance', className: 'fas fa-scale-balanced', category: 'Solidarite', keywords: 'justice respect droit' },
  { label: 'Objectif', className: 'fas fa-bullseye', category: 'Solidarite', keywords: 'mission cible objectifs' },
  { label: 'Main forte', className: 'fas fa-hand-fist', category: 'Solidarite', keywords: 'engagement force action' },
  { label: 'Ruban', className: 'fas fa-ribbon', category: 'Solidarite', keywords: 'cause soutien engagement' },
  { label: 'Medaille', className: 'fas fa-medal', category: 'Solidarite', keywords: 'reussite distinction' },
  { label: 'Trophee', className: 'fas fa-trophy', category: 'Solidarite', keywords: 'victoire succes' },
  { label: 'Etoile', className: 'fas fa-star', category: 'Solidarite', keywords: 'important favoris phare' },
  { label: 'Cercle check', className: 'fas fa-circle-check', category: 'Solidarite', keywords: 'ok valide publie' },
  { label: 'Bouclier', className: 'fas fa-shield-halved', category: 'Solidarite', keywords: 'securite protection' },

  { label: 'Document', className: 'fas fa-file-lines', category: 'Administratif', keywords: 'papier dossier texte' },
  { label: 'Facture', className: 'fas fa-file-invoice', category: 'Administratif', keywords: 'caf facture formulaire' },
  { label: 'Dossier', className: 'fas fa-folder-open', category: 'Administratif', keywords: 'archives documents' },
  { label: 'Liste', className: 'fas fa-list-check', category: 'Administratif', keywords: 'taches points checklist' },
  { label: 'Clipboard', className: 'fas fa-clipboard-list', category: 'Administratif', keywords: 'liste programme' },
  { label: 'Tableau', className: 'fas fa-table-list', category: 'Administratif', keywords: 'collection liste' },
  { label: 'Carte identite', className: 'fas fa-id-card', category: 'Administratif', keywords: 'identite titre sejour' },
  { label: 'Passeport', className: 'fas fa-passport', category: 'Administratif', keywords: 'voyage document' },
  { label: 'Adresse', className: 'fas fa-address-card', category: 'Administratif', keywords: 'contact fiche' },
  { label: 'Banque', className: 'fas fa-building-columns', category: 'Administratif', keywords: 'institution prefecture' },
  { label: 'Graphique', className: 'fas fa-chart-column', category: 'Administratif', keywords: 'statistiques chiffre' },
  { label: 'Courbe', className: 'fas fa-chart-line', category: 'Administratif', keywords: 'evolution progression' },
  { label: 'Inbox', className: 'fas fa-inbox', category: 'Administratif', keywords: 'messages demandes' },

  { label: 'Briefcase', className: 'fas fa-briefcase', category: 'Emploi', keywords: 'emploi travail job' },
  { label: 'Business time', className: 'fas fa-business-time', category: 'Emploi', keywords: 'travail horaires pro' },
  { label: 'Diplome', className: 'fas fa-graduation-cap', category: 'Emploi', keywords: 'formation etudes' },
  { label: 'Ecole', className: 'fas fa-school', category: 'Emploi', keywords: 'education apprentissage' },
  { label: 'Tableau formation', className: 'fas fa-chalkboard-user', category: 'Emploi', keywords: 'prof formation cours' },
  { label: 'Ampoule', className: 'fas fa-lightbulb', category: 'Emploi', keywords: 'idee conseil' },
  { label: 'Livre', className: 'fas fa-book-open', category: 'Emploi', keywords: 'histoire savoir lecture' },

  { label: 'Logement', className: 'fas fa-house-chimney', category: 'Vie quotidienne', keywords: 'maison logement' },
  { label: 'Immeuble', className: 'fas fa-building', category: 'Vie quotidienne', keywords: 'ville bureau logement' },
  { label: 'Cle', className: 'fas fa-key', category: 'Vie quotidienne', keywords: 'logement acces' },
  { label: 'Sante', className: 'fas fa-kit-medical', category: 'Vie quotidienne', keywords: 'medical soin urgence' },
  { label: 'Hopital', className: 'fas fa-hospital', category: 'Vie quotidienne', keywords: 'sante medical' },
  { label: 'Panier', className: 'fas fa-basket-shopping', category: 'Vie quotidienne', keywords: 'courses alimentaire' },
  { label: 'Boite ouverte', className: 'fas fa-box-open', category: 'Vie quotidienne', keywords: 'collecte colis don' },
  { label: 'Transport', className: 'fas fa-bus', category: 'Vie quotidienne', keywords: 'mobilite bus' },
  { label: 'Voiture', className: 'fas fa-car', category: 'Vie quotidienne', keywords: 'transport deplacement' },

  { label: 'Calendrier', className: 'fas fa-calendar-days', category: 'Evenements', keywords: 'date evenement' },
  { label: 'Gateau', className: 'fas fa-cake-candles', category: 'Evenements', keywords: 'rencontre anniversaire' },
  { label: 'Micro', className: 'fas fa-microphone', category: 'Evenements', keywords: 'prise parole' },
  { label: 'Tasse', className: 'fas fa-mug-saucer', category: 'Evenements', keywords: 'cafe accueil' },
  { label: 'Repas', className: 'fas fa-utensils', category: 'Evenements', keywords: 'dejeuner nourriture' },
  { label: 'Jeu', className: 'fas fa-dice', category: 'Evenements', keywords: 'animation ludique' },
  { label: 'Musique', className: 'fas fa-music', category: 'Evenements', keywords: 'concert ambiance' },
  { label: 'Ticket', className: 'fas fa-ticket', category: 'Evenements', keywords: 'participation entree' },

  { label: 'Globe', className: 'fas fa-globe', category: 'International', keywords: 'monde international' },
  { label: 'Afrique', className: 'fas fa-earth-africa', category: 'International', keywords: 'afrique monde' },
  { label: 'Avion', className: 'fas fa-plane', category: 'International', keywords: 'voyage pays' },
  { label: 'Carte', className: 'fas fa-map-location-dot', category: 'International', keywords: 'localisation pays' },
  { label: 'Drapeau', className: 'fas fa-flag', category: 'International', keywords: 'pays signal' },
  { label: 'Reseau', className: 'fas fa-network-wired', category: 'International', keywords: 'reseau connexion' },

  { label: 'Message', className: 'fas fa-comments', category: 'Communication', keywords: 'temoignage discussion' },
  { label: 'Commentaire', className: 'fas fa-comment-dots', category: 'Communication', keywords: 'message avis' },
  { label: 'Email', className: 'fas fa-envelope', category: 'Communication', keywords: 'mail contact' },
  { label: 'Telephone', className: 'fas fa-phone', category: 'Communication', keywords: 'appel contact' },
  { label: 'Mobile', className: 'fas fa-mobile-screen', category: 'Communication', keywords: 'telephone portable' },
  { label: 'Localisation', className: 'fas fa-location-dot', category: 'Communication', keywords: 'adresse lieu' },
  { label: 'Envoyer', className: 'fas fa-paper-plane', category: 'Communication', keywords: 'message envoyer' },
  { label: 'Annonce', className: 'fas fa-bullhorn', category: 'Communication', keywords: 'communication cta' },
  { label: 'Journal', className: 'fas fa-newspaper', category: 'Communication', keywords: 'actualite article' },

  { label: 'Don', className: 'fas fa-circle-dollar-to-slot', category: 'Dons', keywords: 'argent donation' },
  { label: 'Carte bancaire', className: 'fas fa-credit-card', category: 'Dons', keywords: 'paiement' },
  { label: 'Portefeuille', className: 'fas fa-wallet', category: 'Dons', keywords: 'argent finance' },
  { label: 'Cadeau', className: 'fas fa-gift', category: 'Dons', keywords: 'don cadeau' },
  { label: 'Piggy bank', className: 'fas fa-piggy-bank', category: 'Dons', keywords: 'economies soutien' },
];

@Component({
  selector: 'app-admin-icon-picker',
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminIconPicker),
      multi: true,
    },
  ],
  template: `
    <div class="icon-picker-field">
      <label *ngIf="label" class="icon-picker-label">{{ label }}</label>

      <div class="icon-picker-row">
        <span class="icon-preview" aria-hidden="true">
          <i [class]="value || fallbackIcon"></i>
        </span>

        <select class="select icon-select" [ngModel]="value" (ngModelChange)="selectByClass($event)" [disabled]="disabled">
          <option value="">Choisir une icone</option>
          <option *ngIf="value && !selectedIcon" [value]="value">Icone actuelle - {{ value }}</option>
          <option *ngFor="let icon of filteredIcons; trackBy: trackByClass" [value]="icon.className">
            {{ icon.category }} - {{ icon.label }}
          </option>
        </select>
      </div>

      <details class="icon-browser">
        <summary>Parcourir les icones</summary>
        <input
          class="input icon-search"
          type="search"
          [(ngModel)]="query"
          placeholder="Rechercher : logement, don, emploi..."
          [disabled]="disabled"
        />
        <div class="icon-grid">
          <button
            *ngFor="let icon of filteredIcons; trackBy: trackByClass"
            type="button"
            class="icon-option"
            [class.is-selected]="icon.className === value"
            (click)="selectIcon(icon)"
            [disabled]="disabled"
          >
            <i [class]="icon.className"></i>
            <span>{{ icon.label }}</span>
          </button>
        </div>
      </details>

      <div class="hint icon-value">{{ value || 'Aucune icone selectionnee' }}</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 0;
    }

    .icon-picker-field {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .icon-picker-label {
      color: #273248;
      font-size: 12.5px;
      font-weight: 760;
    }

    .icon-picker-row {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 8px;
      align-items: center;
    }

    .icon-preview,
    .icon-option i {
      display: inline-grid;
      place-items: center;
      border-radius: 8px;
      background: #eaf1ff;
      color: #2563eb;
    }

    .icon-preview {
      width: 42px;
      height: 42px;
      border: 1px solid #ccd6e6;
      font-size: 16px;
    }

    .icon-select {
      min-width: 0;
    }

    .icon-browser {
      border: 1px solid #e4eaf5;
      border-radius: 8px;
      background: #f9fbff;
    }

    .icon-browser summary {
      padding: 9px 11px;
      color: #334155;
      font-size: 12.5px;
      font-weight: 760;
      cursor: pointer;
    }

    .icon-search {
      margin: 0 10px 10px;
      width: calc(100% - 20px);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
      gap: 8px;
      max-height: 214px;
      overflow: auto;
      padding: 0 10px 10px;
    }

    .icon-option {
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr);
      gap: 7px;
      align-items: center;
      min-height: 38px;
      padding: 6px;
      border: 1px solid #d9e2f2;
      border-radius: 8px;
      background: #ffffff;
      color: #334155;
      font: inherit;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
    }

    .icon-option:hover,
    .icon-option.is-selected {
      border-color: #2563eb;
      background: #eff5ff;
      color: #1d4ed8;
    }

    .icon-option i {
      width: 30px;
      height: 30px;
    }

    .icon-option span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-value {
      overflow-wrap: anywhere;
    }
  `],
})
export class AdminIconPicker implements ControlValueAccessor {
  @Input() label = '';
  @Input() fallbackIcon = 'fas fa-icons';

  query = '';
  value = '';
  disabled = false;

  readonly iconOptions = ADMIN_ICON_OPTIONS;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get filteredIcons() {
    const search = this.normalize(this.query);
    if (!search) return this.iconOptions;

    return this.iconOptions.filter((icon) =>
      this.normalize(`${icon.label} ${icon.className} ${icon.category} ${icon.keywords}`).includes(search)
    );
  }

  get selectedIcon() {
    return this.iconOptions.find((icon) => icon.className === this.value);
  }

  writeValue(value: unknown): void {
    this.value = typeof value === 'string' ? value : '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectByClass(className: string) {
    this.setValue(className);
  }

  selectIcon(icon: AdminIconOption) {
    this.setValue(icon.className);
  }

  trackByClass(_index: number, icon: AdminIconOption) {
    return icon.className;
  }

  private setValue(value: string) {
    if (this.disabled) return;

    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  private normalize(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
