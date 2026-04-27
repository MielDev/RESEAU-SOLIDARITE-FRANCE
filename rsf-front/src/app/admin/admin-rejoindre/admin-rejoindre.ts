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
  currentRequest: any = {};
  loadingRequests = false;
  saving = false;
  savingRequest = false;
  showRequestModal = false;
  editingRequest = false;

  readonly roleSlots = [1, 2, 3, 4, 5];
  readonly optionSlots = [1, 2, 3, 4];
  readonly statusSlots = [1, 2, 3, 4];
  readonly interestSlots = [1, 2, 3, 4, 5, 6];
  readonly requestStatusOptions = [
    { value: 'new', label: 'Nouvelle' },
    { value: 'in_progress', label: 'En traitement' },
    { value: 'contacted', label: 'Contacte' },
    { value: 'accepted', label: 'Accepte' },
    { value: 'refused', label: 'Refuse' },
    { value: 'done', label: 'Traite' },
  ];

  private pageData: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadJoinRequests();
  }

  get configuredIntentOptions() {
    return this.optionSlots.map((index) => this.data[`opt${index}`]).filter(Boolean);
  }

  get totalRequests() {
    return this.joinRequests.length;
  }

  get unreadRequests() {
    return this.joinRequests.filter((request) => !request.is_read).length;
  }

  get activeRequests() {
    return this.joinRequests.filter((request) => ['new', 'in_progress', 'contacted'].includes(request.processing_status)).length;
  }

  get closedRequests() {
    return this.joinRequests.filter((request) => ['accepted', 'refused', 'done'].includes(request.processing_status)).length;
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

  openCreateRequest() {
    this.currentRequest = this.createEmptyRequest();
    this.editingRequest = false;
    this.showRequestModal = true;
  }

  openEditRequest(request: any) {
    this.currentRequest = this.toJoinRequestView(request);
    this.editingRequest = true;
    this.showRequestModal = true;
  }

  closeRequestModal() {
    if (this.savingRequest) return;
    this.showRequestModal = false;
  }

  saveRequestFromModal() {
    if (this.savingRequest || !this.validateRequest(this.currentRequest)) return;

    const payload = this.toJoinRequestPayload(this.currentRequest);
    this.savingRequest = true;

    if (this.editingRequest) {
      this.api.updateResource('join-requests', this.currentRequest.id, payload).subscribe({
        next: () => this.finishRequestSave('Demande mise a jour', 'Les informations de cette personne ont ete enregistrees.'),
        error: () => this.failRequestSave('Cette demande n a pas pu etre mise a jour.'),
      });
      return;
    }

    this.api.createResource<any>('join-requests', payload).subscribe({
      next: (created) => {
        const id = created?.id;
        if (!id) {
          this.finishRequestSave('Demande ajoutee', 'La nouvelle personne a ete ajoutee a la liste.');
          return;
        }

        this.api.updateResource('join-requests', id, {
          processing_status: payload.processing_status,
          admin_notes: payload.admin_notes,
          is_read: payload.is_read,
        }).subscribe({
          next: () => this.finishRequestSave('Demande ajoutee', 'La nouvelle personne a ete ajoutee a la liste.'),
          error: () => this.finishRequestSave('Demande ajoutee', 'La personne a ete ajoutee. Le suivi interne pourra etre modifie ensuite.'),
        });
      },
      error: () => this.failRequestSave('Cette demande n a pas pu etre creee.'),
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

  statusBadgeClass(value: string) {
    if (['accepted', 'done'].includes(value)) return 'badge-success';
    if (value === 'refused') return 'badge-danger';
    if (['in_progress', 'contacted'].includes(value)) return 'badge-primary';
    return 'badge-gray';
  }

  fullName(request: any) {
    return [request.first_name, request.last_name].filter(Boolean).join(' ');
  }

  initials(request: any) {
    const letters = [request.first_name, request.last_name]
      .filter(Boolean)
      .map((value: string) => value.trim().charAt(0).toUpperCase())
      .join('');

    return letters || 'NR';
  }

  requestDate(request: any) {
    return request.createdAt || request.created_at || null;
  }

  shortText(value: unknown, maxLength = 80) {
    const text = String(value ?? '').trim();
    if (text.length <= maxLength) return text || '-';
    return `${text.slice(0, maxLength).trim()}...`;
  }

  trackByRequestId(_index: number, request: any) {
    return request.id;
  }

  private createEmptyRequest() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      city: '',
      status: '',
      intent: this.configuredIntentOptions[0] || '',
      interests: [],
      interestsList: [],
      interestsText: '',
      message: '',
      processing_status: 'new',
      admin_notes: '',
      is_read: true,
      saving: false,
    };
  }

  private toJoinRequestView(request: any) {
    const interestsList = this.toInterestsList(request?.interests ?? request?.interestsList ?? request?.interestsText);

    return {
      ...request,
      first_name: request?.first_name ?? request?.firstName ?? '',
      last_name: request?.last_name ?? request?.lastName ?? '',
      email: request?.email ?? '',
      phone: request?.phone ?? '',
      city: request?.city ?? '',
      status: request?.status ?? '',
      intent: request?.intent ?? '',
      message: request?.message ?? '',
      processing_status: request?.processing_status ?? 'new',
      interestsList,
      interestsText: interestsList.join(', '),
      admin_notes: request?.admin_notes ?? '',
      is_read: Boolean(request?.is_read),
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

  private toJoinRequestPayload(request: any) {
    return {
      first_name: String(request.first_name ?? '').trim(),
      last_name: String(request.last_name ?? '').trim(),
      email: String(request.email ?? '').trim(),
      phone: String(request.phone ?? '').trim(),
      city: String(request.city ?? '').trim(),
      status: String(request.status ?? '').trim(),
      intent: String(request.intent ?? '').trim(),
      interests: this.toInterestsList(request.interestsText ?? request.interests),
      message: String(request.message ?? '').trim(),
      processing_status: request.processing_status || 'new',
      admin_notes: String(request.admin_notes ?? '').trim(),
      is_read: Boolean(request.is_read),
    };
  }

  private validateRequest(request: any) {
    const payload = this.toJoinRequestPayload(request);
    if (!payload.first_name || !payload.last_name || !payload.email || !payload.intent || !payload.message) {
      void this.alerts.error('Informations manquantes', 'Prenom, nom, email, intention et message sont obligatoires.');
      return false;
    }

    if (payload.message.length < 10) {
      void this.alerts.error('Message trop court', 'Le message doit contenir au moins 10 caracteres.');
      return false;
    }

    return true;
  }

  private finishRequestSave(title: string, text: string) {
    this.savingRequest = false;
    this.showRequestModal = false;
    this.loadJoinRequests();
    void this.alerts.success(title, text);
  }

  private failRequestSave(text: string) {
    this.savingRequest = false;
    void this.alerts.error('Enregistrement impossible', text);
  }

  private toFormData(page: any) {
    const benefits = Array.isArray(page?.volunteer?.benefits) ? page.volunteer.benefits : [];
    const options = Array.isArray(page?.form?.intentOptions) ? page.form.intentOptions : [];
    const statuses = Array.isArray(page?.form?.statusOptions) ? page.form.statusOptions : [];
    const interests = Array.isArray(page?.form?.interestOptions) ? page.form.interestOptions : [];
    const form: any = {
      nr_title: page?.hero?.title ?? page?.volunteer?.title ?? '',
      nr_desc: page?.hero?.text ?? page?.volunteer?.description ?? '',
      nr_sub: page?.volunteer?.label ?? '',
    };

    this.optionSlots.forEach((index) => {
      form[`opt${index}`] = options[index - 1] ?? '';
    });

    this.statusSlots.forEach((index) => {
      form[`status${index}`] = statuses[index - 1] ?? '';
    });

    this.interestSlots.forEach((index) => {
      form[`interest${index}`] = interests[index - 1] ?? '';
    });

    this.roleSlots.forEach((index) => {
      const benefit = benefits[index - 1] ?? {};
      form[`role${index}_title`] = benefit.title ?? '';
      form[`role${index}_desc`] = benefit.description ?? '';
    });

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
        benefits: this.roleSlots.map((index) => ({
          ...(this.pageData.volunteer?.benefits?.[index - 1] ?? {}),
          title: this.data[`role${index}_title`],
          description: this.data[`role${index}_desc`],
        })),
      },
      form: {
        ...(this.pageData.form ?? {}),
        intentOptions: this.optionSlots.map((index) => this.data[`opt${index}`]).filter(Boolean),
        statusOptions: this.statusSlots.map((index) => this.data[`status${index}`]).filter(Boolean),
        interestOptions: this.interestSlots.map((index) => this.data[`interest${index}`]).filter(Boolean),
      },
    };
  }
}
