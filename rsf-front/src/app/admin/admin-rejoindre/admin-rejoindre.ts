import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-rejoindre',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-rejoindre.html',
  styleUrl: './admin-rejoindre.css',
})
export class AdminRejoindre implements OnInit {
  data: any = {};
  joinRequests: any[] = [];
  loadingRequests = false;
  saving = false;
  private pageData: any = {};
  readonly requestStatusOptions = [
    { value: 'new', label: 'Nouvelle' },
    { value: 'in_progress', label: 'En traitement' },
    { value: 'contacted', label: 'Contacte' },
    { value: 'accepted', label: 'Accepte' },
    { value: 'refused', label: 'Refuse' },
    { value: 'done', label: 'Traite' },
  ];

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadJoinRequests();
  }

  loadData() {
    this.api.getPage('nous-rejoindre').subscribe(data => {
      this.pageData = data || {};
      this.data = this.toFormData(this.pageData);
    });
  }

  loadJoinRequests() {
    this.loadingRequests = true;
    this.api.listResource<any>('join-requests').subscribe({
      next: (requests) => {
        this.joinRequests = requests.map((request) => this.toJoinRequestView(request));
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
        void this.alerts.error('Chargement impossible', 'Les demandes Nous rejoindre n ont pas pu etre chargees.');
      },
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.api.updatePage('nous-rejoindre', this.toPageData()).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La page Nous rejoindre a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'La page Nous rejoindre n a pas pu etre sauvegardee.');
      },
    });
  }

  saveJoinRequest(request: any) {
    if (request.saving) return;

    request.saving = true;
    this.api.updateResource('join-requests', request.id, {
      processing_status: request.processing_status,
      admin_notes: request.admin_notes,
      is_read: true,
    }).subscribe({
      next: (updated) => {
        request.saving = false;
        Object.assign(request, this.toJoinRequestView({ ...request, ...updated }));
        void this.alerts.success('Demande mise a jour', 'Le suivi de cette demande a ete enregistre.');
      },
      error: () => {
        request.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Cette demande n a pas pu etre mise a jour.');
      },
    });
  }

  markJoinRequestAsRead(request: any) {
    this.api.updateResource('join-requests', request.id, { is_read: true }).subscribe({
      next: () => {
        request.is_read = true;
      },
    });
  }

  async deleteJoinRequest(request: any) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer cette demande ?',
      text: 'Cette demande Nous rejoindre sera supprimee du back-office.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) return;

    this.api.deleteResource('join-requests', request.id).subscribe({
      next: () => {
        this.joinRequests = this.joinRequests.filter((item) => item.id !== request.id);
        void this.alerts.success('Demande supprimee', 'La liste des demandes a ete mise a jour.');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', 'Cette demande n a pas pu etre supprimee.');
      },
    });
  }

  statusLabel(value: string) {
    return this.requestStatusOptions.find((status) => status.value === value)?.label ?? value;
  }

  fullName(request: any) {
    return [request.first_name, request.last_name].filter(Boolean).join(' ');
  }

  private toJoinRequestView(request: any) {
    return {
      ...request,
      processing_status: request.processing_status ?? 'new',
      interestsList: this.toInterestsList(request.interests),
      admin_notes: request.admin_notes ?? '',
      saving: false,
    };
  }

  private toInterestsList(value: unknown) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        return value.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }
    return [];
  }

  private toFormData(page: any) {
    const benefits = Array.isArray(page?.volunteer?.benefits) ? page.volunteer.benefits : [];
    const options = Array.isArray(page?.form?.intentOptions) ? page.form.intentOptions : [];
    const form: any = {
      nr_title: page?.hero?.title ?? page?.volunteer?.title ?? '',
      nr_desc: page?.hero?.text ?? page?.volunteer?.description ?? '',
      nr_sub: page?.volunteer?.label ?? '',
      field_name: true,
      field_email: true,
      field_phone: true,
      field_select: true,
      field_message: true,
      opt1: options[0] ?? '',
      opt2: options[1] ?? '',
      opt3: options[2] ?? '',
      opt4: options[3] ?? '',
    };

    for (let index = 1; index <= 5; index += 1) {
      const benefit = benefits[index - 1] ?? {};
      form[`role${index}_title`] = benefit.title ?? '';
      form[`role${index}_desc`] = benefit.description ?? '';
    }

    return form;
  }

  private toPageData() {
    return {
      ...this.pageData,
      hero: {
        ...(this.pageData.hero ?? {}),
        title: this.data.nr_title,
        text: this.data.nr_desc,
      },
      volunteer: {
        ...(this.pageData.volunteer ?? {}),
        label: this.data.nr_sub,
        title: this.data.nr_title,
        description: this.data.nr_desc,
        benefits: [1, 2, 3, 4, 5].map((index) => ({
          ...(this.pageData.volunteer?.benefits?.[index - 1] ?? {}),
          title: this.data[`role${index}_title`],
          description: this.data[`role${index}_desc`],
        })),
      },
      form: {
        ...(this.pageData.form ?? {}),
        intentOptions: [this.data.opt1, this.data.opt2, this.data.opt3, this.data.opt4].filter(Boolean),
      },
    };
  }
}
