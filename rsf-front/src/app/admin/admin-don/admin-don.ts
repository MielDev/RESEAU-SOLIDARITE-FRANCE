import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-don',
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-don.html',
  styleUrl: './admin-don.css',
})
export class AdminDon implements OnInit {
  data: any = {};
  saving = false;
  private pageData: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getPage('don').subscribe(data => {
      this.pageData = data || {};
      this.data = {
        don_title: this.pageData?.hero?.title ?? '',
        don_desc: this.pageData?.hero?.text ?? this.pageData?.intro?.text ?? '',
      };
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('don', {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        title: this.data.don_title,
        text: this.data.don_desc,
      },
      intro: {
        ...(this.pageData.intro ?? {}),
        text: this.data.don_desc,
      },
    }).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Don a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'La page Don n a pas pu etre sauvegardee.');
      },
    });
  }
}
