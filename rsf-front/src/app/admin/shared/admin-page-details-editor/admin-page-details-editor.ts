import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAlertService } from '../../admin-alert.service';
import { AdminApiService } from '../../admin-api.service';
import { adminEditorConfigs } from '../../admin-editor-config';

type PageSectionDraft = {
  key: string;
  label: string;
  mode: 'json' | 'text';
  value: string;
  rows: number;
  error: string;
};

@Component({
  selector: 'app-admin-page-details-editor',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel page-details-panel" *ngIf="config">
      <div class="panel-header">
        <div>
          <div class="panel-title">
            <i class="pi fas fa-layer-group"></i>
            Contenu de page
          </div>
          <div class="panel-desc">{{ config.pageDescription || 'Champs editoriaux de la page publique.' }}</div>
        </div>
        <button type="button" class="btn btn-primary" (click)="save()" [disabled]="loading || saving">
          <i class="fas fa-save"></i>
          <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
        </button>
      </div>

      <div class="panel-body">
        <div class="page-details-grid">
          <article class="page-details-card" *ngFor="let section of sections; trackBy: trackByKey">
            <label class="page-details-label" [for]="fieldId(section.key)">{{ section.label }}</label>
            <textarea
              class="input page-details-textarea"
              [class.is-invalid]="section.error"
              [id]="fieldId(section.key)"
              [rows]="section.rows"
              [(ngModel)]="section.value"
              (ngModelChange)="section.error = ''"
            ></textarea>
            <small class="page-details-error" *ngIf="section.error">{{ section.error }}</small>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-details-panel {
      margin-bottom: 22px;
    }

    .page-details-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .page-details-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      background: #fff;
    }

    .page-details-label {
      display: block;
      color: var(--dark);
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .page-details-textarea {
      width: 100%;
      min-height: 92px;
      resize: vertical;
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 12.5px;
      line-height: 1.55;
    }

    .page-details-textarea.is-invalid {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, .1);
    }

    .page-details-error {
      display: block;
      margin-top: 6px;
      color: #dc2626;
      font-size: 12px;
    }

    @media (max-width: 900px) {
      .page-details-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminPageDetailsEditor implements OnInit, OnChanges {
  @Input() configKey = '';

  config: any = null;
  sections: PageSectionDraft[] = [];
  loading = false;
  saving = false;

  constructor(
    private readonly api: AdminApiService,
    private readonly alerts: AdminAlertService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['configKey'] && !changes['configKey'].firstChange) {
      this.load();
    }
  }

  load() {
    this.config = (adminEditorConfigs as Record<string, any>)[this.configKey] ?? null;
    if (!this.config?.pageKey) return;

    this.loading = true;
    this.api.getPage(this.config.pageKey).subscribe({
      next: (data) => {
        this.loading = false;
        this.sections = this.toSections({
          ...(this.deepClone(this.config.pageDefaults ?? {})),
          ...(data ?? {}),
        });
      },
      error: () => {
        this.loading = false;
        this.sections = this.toSections(this.deepClone(this.config.pageDefaults ?? {}));
        void this.alerts.error('Chargement impossible', 'Le contenu de cette page n a pas pu etre charge.');
      },
    });
  }

  save() {
    if (!this.config?.pageKey || this.saving) return;

    const payload: Record<string, unknown> = {};
    let hasError = false;

    this.sections.forEach((section) => {
      section.error = '';

      if (section.mode === 'json') {
        try {
          payload[section.key] = JSON.parse(section.value || 'null');
        } catch {
          section.error = 'JSON invalide';
          hasError = true;
        }
      } else {
        payload[section.key] = section.value;
      }
    });

    if (hasError) {
      void this.alerts.error('Correction necessaire', 'Un ou plusieurs blocs contiennent un JSON invalide.');
      return;
    }

    this.saving = true;
    this.api.updatePage(this.config.pageKey, payload).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Contenu enregistre', 'Le contenu de la page a bien ete mis a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Le contenu de la page n a pas pu etre sauvegarde.');
      },
    });
  }

  fieldId(key: string) {
    return `page-details-${this.configKey}-${key}`;
  }

  trackByKey(_index: number, section: PageSectionDraft) {
    return section.key;
  }

  private toSections(data: Record<string, unknown>): PageSectionDraft[] {
    const keys = [
      ...(this.config.pageFieldOrder ?? []),
      ...Object.keys(data).filter((key) => !(this.config.pageFieldOrder ?? []).includes(key)),
    ];

    return keys
      .filter((key) => Object.prototype.hasOwnProperty.call(data, key))
      .map((key) => {
        const value = data[key];
        const mode = value !== null && typeof value === 'object' ? 'json' : 'text';
        const textValue = mode === 'json'
          ? JSON.stringify(value, null, 2)
          : String(value ?? '');

        return {
          key,
          label: this.labelFor(key),
          mode,
          value: textValue,
          rows: mode === 'json' ? Math.min(18, Math.max(6, textValue.split('\n').length + 1)) : 4,
          error: '',
        };
      });
  }

  private labelFor(key: string) {
    const labels: Record<string, string> = {
      hero: 'Hero',
      heroActions: 'Boutons du hero',
      stats: 'Statistiques',
      statsCards: 'Cartes statistiques',
      navigation: 'Navigation',
      values: 'Valeurs',
      cta: 'Appel a l action',
      story: 'Histoire',
      goals: 'Objectifs',
      leadership: 'Direction',
      teamSection: 'Section equipe',
      services: 'Services',
      help: 'Aide',
      process: 'Processus',
      content: 'Contenu',
      highlight: 'Mise en avant',
      engagements: 'Engagements',
      featured: 'Bloc mis en avant',
      regular: 'Bloc regulier',
      volunteer: 'Benevolat',
      form: 'Formulaire',
      intro: 'Introduction',
      impact: 'Impact',
      details: 'Details',
    };

    return labels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
  }

  private deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value ?? {}));
  }
}
