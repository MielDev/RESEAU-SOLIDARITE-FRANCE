import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-international',
  imports: [FormsModule, RouterModule, CommonModule, AdminIconPicker],
  templateUrl: './admin-international.html',
  styleUrl: './admin-international.css',
})
export class AdminInternational implements OnInit {
  actions: any[] = [];
  showForm = false;
  editing = false;
  saving = false;
  currentAction: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadActions();
  }

  loadActions() {
    this.api.listResource('actions', { page_type: 'international' }).subscribe(actions => {
      this.actions = actions;
    });
  }

  addNew() {
    this.currentAction = { page_type: 'international', icon: 'fas fa-globe', is_published: true };
    this.editing = false;
    this.showForm = true;
  }

  edit(action: any) {
    this.currentAction = { ...action };
    this.editing = true;
    this.showForm = true;
  }

  saveAction() {
    if (this.saving) return;

    this.saving = true;
    const request = this.editing
      ? this.api.updateResource('actions', this.currentAction.id, this.toPayload())
      : this.api.createResource('actions', this.toPayload());

    request.subscribe({
      next: () => {
        this.saving = false;
        this.loadActions();
        this.showForm = false;
        void this.alerts.success('Action enregistree', 'La liste des actions internationales a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Cette action internationale n a pas pu etre sauvegardee.');
      },
    });
  }

  async delete(action: any) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer cette action ?',
      text: 'Cette action ne sera plus affichee apres suppression.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) return;

    this.api.deleteResource('actions', action.id).subscribe({
      next: () => {
        this.loadActions();
        void this.alerts.success('Action supprimee', 'La liste a ete mise a jour.');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', 'Cette action n a pas pu etre supprimee.');
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
    // If needed, save all
  }

  private toPayload() {
    return {
      ...this.currentAction,
      page_type: 'international',
      is_published: this.currentAction.is_published ?? true,
    };
  }
}
