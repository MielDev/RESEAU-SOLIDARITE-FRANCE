import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminPageDetailsEditor } from '../shared/admin-page-details-editor/admin-page-details-editor';

type TeamMemberRecord = {
  id?: number | string;
  name?: string;
  role?: string;
  initials?: string;
  photo_url?: string;
  bio?: string;
  diplomas?: unknown;
  sort_order?: number;
  is_president?: boolean;
  is_active?: boolean;
  [key: string]: unknown;
};

@Component({
  selector: 'app-admin-organisation',
  imports: [CommonModule, FormsModule, RouterModule, AdminPageDetailsEditor],
  templateUrl: './admin-organisation.html',
  styleUrl: './admin-organisation.css',
})
export class AdminOrganisation implements OnInit {
  data: any = {};
  saving = false;
  savingMember = false;
  showMemberModal = false;
  editingMember = false;
  uploadingPresidentPhoto = false;
  uploadingMemberPhoto = false;
  currentMember: TeamMemberRecord = {};
  teamMembers: TeamMemberRecord[] = [];
  readonly acceptedPhotoTypes = 'image/jpeg,image/png,image/webp,image/gif';
  private readonly maxPhotoSize = 8 * 1024 * 1024;
  private president: TeamMemberRecord = {};
  private readonly fallbackTeamMembers: TeamMemberRecord[] = [
    { name: 'AGBOCOU Belkis', role: 'Comptable', initials: 'AB', is_active: true },
    { name: 'NOUAZE Alexandre', role: 'Responsable Appui Evenements', initials: 'NA', is_active: true },
    { name: 'DOSSOU Oluwakemi', role: 'Secretaire Generale', initials: 'DO', is_active: true },
    { name: 'AGONDANOU Constant', role: 'Coordinateur', initials: 'AC', is_active: true },
  ];

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      page: this.api.getPage('organisation'),
      team: this.api.listResource<TeamMemberRecord>('team'),
    }).subscribe({
      next: ({ team }) => {
        const members = Array.isArray(team) ? team : [];
        this.president = members.find((member) => member.is_president) ?? members[0] ?? {};
        const apiMembers = members
          .filter((member) => !member?.is_president && member?.id !== this.president.id)
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));

        this.teamMembers = apiMembers.length ? apiMembers : [...this.fallbackTeamMembers];
        this.data = this.toFormData(this.president);
      },
      error: () => {
        this.president = {};
        this.teamMembers = [...this.fallbackTeamMembers];
        this.data = this.toFormData({});
      },
    });
  }

  addMember() {
    this.editingMember = false;
    this.currentMember = this.createEmptyMember();
    this.showMemberModal = true;
  }

  editMember(member: TeamMemberRecord) {
    this.editingMember = true;
    this.currentMember = {
      ...member,
      is_active: member.is_active !== false,
      initials: member.initials || this.buildInitials(member.name || ''),
    };
    this.showMemberModal = true;
  }

  closeMemberModal() {
    if (this.savingMember || this.uploadingMemberPhoto) return;

    this.showMemberModal = false;
    this.currentMember = {};
    this.editingMember = false;
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    const payload = this.toPresidentData();
    const request = payload.id
      ? this.api.updateResource<TeamMemberRecord>('team', payload.id, payload)
      : this.api.createResource<TeamMemberRecord>('team', payload);

    request.subscribe({
      next: (saved) => {
        this.saving = false;
        this.president = saved || payload;
        this.data = this.toFormData(this.president);
        void this.alerts.success('Modifications enregistrees', 'Les informations du president ont bien ete mises a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Les informations du president n ont pas pu etre sauvegardees.');
      },
    });
  }

  saveMember() {
    if (this.savingMember) return;

    const payload = this.toMemberData(this.currentMember);
    if (!payload.name || !payload.role) {
      void this.alerts.error('Champs obligatoires', 'Le nom complet et la fonction sont obligatoires.');
      return;
    }

    this.savingMember = true;
    const request = this.currentMember.id
      ? this.api.updateResource<TeamMemberRecord>('team', this.currentMember.id, payload)
      : this.api.createResource<TeamMemberRecord>('team', payload);

    request.subscribe({
      next: (saved) => {
        this.savingMember = false;
        this.upsertMember(saved || payload);
        this.showMemberModal = false;
        this.currentMember = {};
        void this.alerts.toastSuccess(this.editingMember ? 'Membre mis a jour' : 'Membre ajoute');
        this.editingMember = false;
      },
      error: () => {
        this.savingMember = false;
        void this.alerts.error('Enregistrement impossible', "Le membre n'a pas pu etre sauvegarde.");
      },
    });
  }

  async deleteMember(member: TeamMemberRecord) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer ce membre ?',
      text: 'Cette action retirera le membre de la page Organisation.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
    });

    if (!confirmed) return;

    if (!member.id) {
      this.teamMembers = this.teamMembers.filter((item) => item !== member);
      return;
    }

    this.api.deleteResource('team', member.id).subscribe({
      next: () => {
        this.teamMembers = this.teamMembers.filter((item) => item.id !== member.id);
        void this.alerts.toastSuccess('Membre supprime');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', "Le membre n'a pas pu etre supprime.");
      },
    });
  }

  async onPresidentPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || !this.validatePhotoFile(file)) return;

    this.uploadingPresidentPhoto = true;
    try {
      this.data.pres_photo_url = await this.uploadPhotoFile(file);
      if (!this.data.pres_initials) {
        this.data.pres_initials = this.buildInitials(this.data.pres_name || '');
      }
    } catch {
      void this.alerts.error('Upload impossible', "La photo du president n'a pas pu etre envoyee.");
    } finally {
      this.uploadingPresidentPhoto = false;
    }
  }

  async onMemberPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || !this.validatePhotoFile(file)) return;

    this.uploadingMemberPhoto = true;
    try {
      this.currentMember = {
        ...this.currentMember,
        photo_url: await this.uploadPhotoFile(file),
        initials: this.currentMember.initials || this.buildInitials(this.currentMember.name || ''),
      };
    } catch {
      void this.alerts.error('Upload impossible', "La photo du membre n'a pas pu etre envoyee.");
    } finally {
      this.uploadingMemberPhoto = false;
    }
  }

  removePresidentPhoto() {
    this.data.pres_photo_url = '';
  }

  removeMemberPhoto() {
    this.currentMember = { ...this.currentMember, photo_url: '' };
  }

  memberInitials(member: TeamMemberRecord) {
    return member.initials || this.buildInitials(member.name || '') || 'RS';
  }

  trackByMember(index: number, member: TeamMemberRecord) {
    return member.id ?? member.name ?? index;
  }

  private createEmptyMember(): TeamMemberRecord {
    return {
      name: '',
      role: '',
      initials: '',
      photo_url: '',
      bio: '',
      diplomas: [],
      sort_order: this.teamMembers.length,
      is_president: false,
      is_active: true,
    };
  }

  private toFormData(member: TeamMemberRecord) {
    const diplomas = this.toDiplomaArray(member?.diplomas);
    return {
      pres_name: member?.name ?? '',
      pres_role: member?.role ?? '',
      pres_initials: member?.initials ?? '',
      pres_photo_url: member?.photo_url ?? '',
      pres_bio: member?.bio ?? '',
      dip1: diplomas[0] ?? '',
      dip2: diplomas[1] ?? '',
      dip3: diplomas[2] ?? '',
      dip4: diplomas[3] ?? '',
      dip5: diplomas[4] ?? '',
    };
  }

  private toPresidentData(): TeamMemberRecord {
    const name = String(this.data.pres_name || '').trim();

    return {
      ...this.president,
      name,
      role: String(this.data.pres_role || '').trim(),
      initials: String(this.data.pres_initials || this.buildInitials(name)).trim(),
      photo_url: String(this.data.pres_photo_url || '').trim(),
      bio: String(this.data.pres_bio || '').trim(),
      diplomas: [this.data.dip1, this.data.dip2, this.data.dip3, this.data.dip4, this.data.dip5]
        .map((item) => String(item || '').trim())
        .filter(Boolean),
      is_president: true,
      is_active: this.president.is_active ?? true,
    };
  }

  private toMemberData(member: TeamMemberRecord): TeamMemberRecord {
    const name = String(member.name || '').trim();
    const role = String(member.role || '').trim();

    return {
      ...member,
      name,
      role,
      initials: String(member.initials || this.buildInitials(name)).trim(),
      photo_url: String(member.photo_url || '').trim(),
      bio: String(member.bio || '').trim(),
      diplomas: [],
      is_president: false,
      is_active: member.is_active !== false,
      sort_order: Number(member.sort_order ?? this.teamMembers.length),
    };
  }

  private upsertMember(member: TeamMemberRecord) {
    const normalized = {
      ...member,
      initials: member.initials || this.buildInitials(member.name || ''),
      is_president: false,
    };

    if (this.editingMember) {
      this.teamMembers = this.teamMembers.map((item) =>
        item.id === normalized.id ? normalized : item,
      );
      return;
    }

    this.teamMembers = [normalized, ...this.teamMembers];
  }

  private validatePhotoFile(file: File) {
    if (!file.type.startsWith('image/')) {
      void this.alerts.error('Format invalide', 'Selectionne un fichier image.');
      return false;
    }

    if (file.size > this.maxPhotoSize) {
      void this.alerts.error('Image trop lourde', 'La taille maximale autorisee est de 8 Mo.');
      return false;
    }

    return true;
  }

  private async uploadPhotoFile(file: File) {
    const dataUrl = await this.readFileAsDataUrl(file);
    const upload = await firstValueFrom(
      this.api.uploadTeamPhoto({
        fileName: file.name,
        mimeType: file.type,
        dataUrl,
      }),
    );

    if (!upload.image_url) {
      throw new Error('Upload sans URL');
    }

    return upload.image_url;
  }

  private readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private toDiplomaArray(value: unknown) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item || '').trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map((item) => String(item || '').trim()).filter(Boolean) : [];
      } catch {
        return value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  }

  private buildInitials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 4);
  }
}
