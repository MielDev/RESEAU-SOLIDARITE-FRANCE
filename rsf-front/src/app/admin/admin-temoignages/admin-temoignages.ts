import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-temoignages',
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-temoignages.html',
  styleUrl: './admin-temoignages.css',
})
export class AdminTemoignages implements OnInit {
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
    this.api.getPage('temoignages').subscribe(data => {
      this.pageData = data || {};
      this.data = {
        ta_title: this.pageData?.cta?.title ?? '',
        ta_desc: this.pageData?.cta?.text ?? '',
        ta_btn: this.pageData?.cta?.label ?? '',
        new_prenom: '',
        new_profil: 'etudiant(e)',
        new_initiales: '',
        new_temoignage: '',
      };
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('temoignages', {
      ...this.pageData,
      cta: {
        ...(this.pageData.cta ?? {}),
        title: this.data.ta_title,
        text: this.data.ta_desc,
        label: this.data.ta_btn,
      },
    }).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Temoignages a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'La page Temoignages n a pas pu etre sauvegardee.');
      },
    });
  }
}
