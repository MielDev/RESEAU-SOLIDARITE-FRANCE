import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-soutien',
  imports: [CommonModule, FormsModule, RouterModule, AdminIconPicker],
  templateUrl: './admin-soutien.html',
  styleUrl: './admin-soutien.css',
})
export class AdminSoutien implements OnInit {
  data: any = {};
  saving = false;
  readonly serviceSlots = [
    { index: 1, label: 'Service 1', fallbackIcon: 'fas fa-heart' },
    { index: 2, label: 'Service 2', fallbackIcon: 'fas fa-file-lines' },
    { index: 3, label: 'Service 3', fallbackIcon: 'fas fa-briefcase' },
    { index: 4, label: 'Service 4', fallbackIcon: 'fas fa-house-chimney' },
    { index: 5, label: 'Service 5', fallbackIcon: 'fas fa-users' },
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
    this.api.getPage('soutien-aux-membres').subscribe(data => {
      this.pageData = data || {};
      this.data = this.toFormData(this.pageData);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('soutien-aux-membres', this.toPageData()).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Soutien aux membres a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'La page Soutien aux membres n a pas pu etre sauvegardee.');
      },
    });
  }

  servicePreview(index: number) {
    return {
      icon: this.data[`srv${index}_icon`] || this.serviceSlots[index - 1]?.fallbackIcon || 'fas fa-heart',
      title: this.data[`srv${index}_title`] || `Service ${index}`,
      description: this.data[`srv${index}_desc`] || '',
    };
  }

  private toFormData(page: any) {
    const services = Array.isArray(page?.services?.items) ? page.services.items : [];
    const form: any = {
      s_title: page?.hero?.title ?? page?.services?.title ?? '',
      s_desc: page?.hero?.text ?? '',
      cta_title: page?.help?.title ?? '',
      cta_body: page?.help?.description ?? '',
      cta_btn: page?.help?.ctaLabel ?? '',
      cta_href: page?.help?.ctaHref ?? '',
    };

    for (let index = 1; index <= 5; index += 1) {
      const service = services[index - 1] ?? {};
      form[`srv${index}_icon`] = service.icon ?? '';
      form[`srv${index}_title`] = service.title ?? '';
      form[`srv${index}_desc`] = service.description ?? '';
    }

    return form;
  }

  private toPageData() {
    return {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        title: this.data.s_title,
        text: this.data.s_desc,
      },
      services: {
        ...(this.pageData.services ?? {}),
        title: this.pageData.services?.title ?? this.data.s_title,
        items: [1, 2, 3, 4, 5].map((index) => ({
          ...(this.pageData.services?.items?.[index - 1] ?? {}),
          icon: this.data[`srv${index}_icon`],
          title: this.data[`srv${index}_title`],
          description: this.data[`srv${index}_desc`],
        })),
      },
      help: {
        ...(this.pageData.help ?? {}),
        title: this.data.cta_title,
        description: this.data.cta_body,
        ctaLabel: this.data.cta_btn,
        ctaHref: this.data.cta_href,
      },
    };
  }
}
