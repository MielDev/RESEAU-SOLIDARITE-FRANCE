import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-qui-sommes-nous',
  imports: [CommonModule, FormsModule, RouterModule, AdminIconPicker],
  templateUrl: './admin-qui-sommes-nous.html',
  styleUrl: './admin-qui-sommes-nous.css',
})
export class AdminQuiSommesNous implements OnInit {
  data: any = {};
  saving = false;
  readonly storySlots = [1, 2, 3];
  readonly valueSlots = [
    { index: 1, label: 'Valeur 1', fallbackIcon: 'fas fa-handshake-angle' },
    { index: 2, label: 'Valeur 2', fallbackIcon: 'fas fa-scale-balanced' },
    { index: 3, label: 'Valeur 3', fallbackIcon: 'fas fa-hand-fist' },
    { index: 4, label: 'Valeur 4', fallbackIcon: 'fas fa-heart' },
    { index: 5, label: 'Valeur 5', fallbackIcon: 'fas fa-users' },
  ];
  readonly goalSlots = [
    { index: 1, label: 'Objectif 1', fallbackIcon: 'fas fa-bullseye' },
    { index: 2, label: 'Objectif 2', fallbackIcon: 'fas fa-hand-holding-heart' },
    { index: 3, label: 'Objectif 3', fallbackIcon: 'fas fa-briefcase' },
    { index: 4, label: 'Objectif 4', fallbackIcon: 'fas fa-house-chimney' },
    { index: 5, label: 'Objectif 5', fallbackIcon: 'fas fa-graduation-cap' },
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
    this.api.getPage('qui-sommes-nous').subscribe(data => {
      this.pageData = data || {};
      this.data = this.toFormData(this.pageData);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('qui-sommes-nous', this.toPageData()).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Qui sommes-nous a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Les donnees de la page n ont pas pu etre sauvegardees.');
      },
    });
  }

  valuePreview(index: number) {
    return {
      icon: this.data[`val${index}_icon`] || this.valueSlots[index - 1]?.fallbackIcon || 'fas fa-gem',
      title: this.data[`val${index}_title`] || `Valeur ${index}`,
      description: this.data[`val${index}_desc`] || '',
    };
  }

  goalPreview(index: number) {
    return {
      icon: this.data[`obj${index}_icon`] || this.goalSlots[index - 1]?.fallbackIcon || 'fas fa-bullseye',
      title: this.data[`obj${index}_title`] || `Objectif ${index}`,
      description: this.data[`obj${index}_desc`] || '',
    };
  }

  private toFormData(page: any) {
    const paragraphs = Array.isArray(page?.story?.paragraphs) ? page.story.paragraphs : [];
    const values = Array.isArray(page?.values?.items) ? page.values.items : [];
    const goals = Array.isArray(page?.goals?.items) ? page.goals.items : [];
    const form: any = {
      ph_title: page?.hero?.title ?? '',
      ph_desc: page?.hero?.text ?? '',
      hist_title: page?.story?.title ?? '',
      hist_p1: paragraphs[0] ?? '',
      hist_p2: paragraphs[1] ?? '',
      hist_p3: paragraphs[2] ?? '',
    };

    for (let index = 1; index <= 5; index += 1) {
      const value = values[index - 1] ?? {};
      const goal = goals[index - 1] ?? {};
      form[`val${index}_icon`] = value.icon ?? '';
      form[`val${index}_title`] = value.title ?? '';
      form[`val${index}_desc`] = value.description ?? '';
      form[`obj${index}_icon`] = goal.icon ?? '';
      form[`obj${index}_title`] = goal.title ?? '';
      form[`obj${index}_desc`] = goal.description ?? '';
    }

    return form;
  }

  private toPageData() {
    return {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        title: this.data.ph_title,
        text: this.data.ph_desc,
      },
      story: {
        ...(this.pageData.story ?? {}),
        title: this.data.hist_title,
        paragraphs: [this.data.hist_p1, this.data.hist_p2, this.data.hist_p3].filter((value) => value !== undefined),
      },
      values: {
        ...(this.pageData.values ?? {}),
        items: this.buildItems('val', this.pageData.values?.items),
      },
      goals: {
        ...(this.pageData.goals ?? {}),
        items: this.buildItems('obj', this.pageData.goals?.items),
      },
    };
  }

  private buildItems(prefix: string, existingItems: any[] = []) {
    return [1, 2, 3, 4, 5].map((index) => ({
      ...(existingItems[index - 1] ?? {}),
      icon: this.data[`${prefix}${index}_icon`],
      title: this.data[`${prefix}${index}_title`],
      description: this.data[`${prefix}${index}_desc`],
    }));
  }
}
