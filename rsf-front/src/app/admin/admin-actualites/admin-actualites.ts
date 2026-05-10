import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminPageDetailsEditor } from '../shared/admin-page-details-editor/admin-page-details-editor';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-actualites',
  imports: [FormsModule, RouterModule, CommonModule, AdminIconPicker, AdminPageDetailsEditor],
  templateUrl: './admin-actualites.html',
  styleUrl: './admin-actualites.css',
})
export class AdminActualites implements OnInit {
  actualites: any[] = [];
  showForm = false;
  editing = false;
  saving = false;
  currentActu: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadActualites();
  }

  loadActualites() {
    this.api.listResource('actualities').subscribe((actualites) => {
      this.actualites = actualites.map((actu) => this.toViewModel(actu));
    });
  }

  addNew() {
    this.currentActu = { icon: 'fas fa-newspaper', is_published: true };
    this.editing = false;
    this.showForm = true;
  }

  edit(actu: any) {
    this.currentActu = { ...this.toViewModel(actu) };
    this.editing = true;
    this.showForm = true;
  }

  saveActu() {
    if (this.saving) return;

    this.saving = true;
    const request = this.editing
      ? this.api.updateResource('actualities', this.currentActu.id, this.toPayload())
      : this.api.createResource('actualities', this.toPayload());

    request.subscribe({
      next: () => {
        this.saving = false;
        this.loadActualites();
        this.showForm = false;
        void this.alerts.success('Actualite enregistree', 'La liste des actualites a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Cette actualite n a pas pu etre sauvegardee.');
      },
    });
  }

  async delete(actu: any) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer cette actualite ?',
      text: 'Cette actualite ne sera plus affichee apres suppression.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) return;

    this.api.deleteResource('actualities', actu.id).subscribe({
      next: () => {
        this.loadActualites();
        void this.alerts.success('Actualite supprimee', 'La liste a ete mise a jour.');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', 'Cette actualite n a pas pu etre supprimee.');
      },
    });
  }

  cancel() {
    this.showForm = false;
  }

  iconClass(icon: unknown, fallback: string) {
    const value = typeof icon === 'string' ? icon.trim() : '';
    return value.includes('fa-') ? value : fallback;
  }

  save() {
    // If needed
  }

  private toViewModel(actu: any) {
    return {
      ...actu,
      date: actu?.published_at ?? actu?.date ?? '',
      description: actu?.summary ?? actu?.description ?? '',
      link: actu?.link_href ?? actu?.link ?? '',
      status: actu?.is_published === false ? 'Brouillon' : 'Publiee',
    };
  }

  private toPayload() {
    return {
      ...this.currentActu,
      published_at: this.currentActu.date,
      summary: this.currentActu.description,
      link_href: this.currentActu.link,
      is_published: this.currentActu.is_published ?? true,
    };
  }
}
