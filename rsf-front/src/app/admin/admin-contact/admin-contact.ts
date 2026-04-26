import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-contact',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.css',
})
export class AdminContact implements OnInit {
  data: any = {};
  saving = false;
  private pageData: any = {};
  private settingsData: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      page: this.api.getPage('contact'),
      settings: this.api.getSettings(),
    }).subscribe(({ page, settings }) => {
      this.pageData = page || {};
      this.settingsData = settings?.data ?? {};
      this.data = this.toFormData(this.pageData, this.settingsData);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    forkJoin([
      this.api.updatePage('contact', this.toPageData()),
      this.api.updateSettings(this.toSettingsData()),
    ]).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Contact et les coordonnees ont bien ete mises a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Les informations de contact n ont pas pu etre sauvegardees.');
      },
    });
  }

  private toFormData(page: any, settings: any) {
    const options = Array.isArray(page?.details?.subjectOptions) ? page.details.subjectOptions : [];

    return {
      addr_street: settings.addr_street ?? '',
      addr_city: settings.addr_city ?? '',
      addr_country: settings.addr_country ?? '',
      contact_phone: settings.contact_phone ?? '',
      contact_hours: settings.contact_hours ?? '',
      contact_email: settings.contact_email ?? '',
      contact_delay: settings.contact_delay ?? '',
      contact_web: settings.contact_web ?? '',
      c_title: page?.hero?.title ?? '',
      c_desc: page?.hero?.text ?? '',
      c_engage: page?.details?.engagementText ?? '',
      f_name: true,
      f_email: true,
      f_objet: true,
      f_msg: true,
      obj1: options[0] ?? '',
      obj2: options[1] ?? '',
      obj3: options[2] ?? '',
      obj4: options[3] ?? '',
      obj5: options[4] ?? '',
      obj6: options[5] ?? '',
    };
  }

  private toPageData() {
    return {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        title: this.data.c_title,
        text: this.data.c_desc,
      },
      details: {
        ...(this.pageData.details ?? {}),
        engagementText: this.data.c_engage,
        subjectOptions: [this.data.obj1, this.data.obj2, this.data.obj3, this.data.obj4, this.data.obj5, this.data.obj6].filter(Boolean),
      },
    };
  }

  private toSettingsData() {
    return {
      ...this.settingsData,
      addr_street: this.data.addr_street,
      addr_city: this.data.addr_city,
      addr_country: this.data.addr_country,
      contact_phone: this.data.contact_phone,
      contact_hours: this.data.contact_hours,
      contact_email: this.data.contact_email,
      contact_delay: this.data.contact_delay,
      contact_web: this.data.contact_web,
    };
  }
}
