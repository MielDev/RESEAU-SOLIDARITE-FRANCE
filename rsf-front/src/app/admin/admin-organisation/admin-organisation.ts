import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-organisation',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-organisation.html',
  styleUrl: './admin-organisation.css',
})
export class AdminOrganisation implements OnInit {
  data: any = {};
  saving = false;
  teamMembers: Array<{ name: string; role: string; [key: string]: unknown }> = [
    { name: 'AGBOCOU Belkis', role: 'Comptable' },
    { name: 'NOUAZE Alexandre', role: 'Responsable Appui Evenements' },
    { name: 'DOSSOU Oluwakemi', role: 'Secretaire Generale' },
    { name: 'AGONDANOU Constant', role: 'Coordinateur' },
  ];
  private president: any = {};

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
      team: this.api.listResource<any>('team'),
    }).subscribe(({ team }) => {
      this.president = team.find((member) => member.is_president) ?? team[0] ?? {};
      const apiMembers = team.filter((member) => !member?.is_president);
      if (apiMembers.length > 0) {
        this.teamMembers = apiMembers;
      }
      this.data = this.toFormData(this.president);
    });
  }

  async addMember() {
    const result = await Swal.fire({
      title: 'Ajouter un membre',
      html:
        '<input id="swal-member-name" class="swal2-input" placeholder="Nom complet">' +
        '<input id="swal-member-role" class="swal2-input" placeholder="Role / Fonction">',
      confirmButtonText: 'Ajouter',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        const nameInput = document.getElementById('swal-member-name') as HTMLInputElement | null;
        const roleInput = document.getElementById('swal-member-role') as HTMLInputElement | null;
        const name = nameInput?.value?.trim() ?? '';
        const role = roleInput?.value?.trim() ?? '';

        if (!name || !role) {
          Swal.showValidationMessage('Le nom et le role sont obligatoires.');
          return;
        }

        return { name, role };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const payload = {
      name: result.value.name,
      role: result.value.role,
      initials: this.buildInitials(result.value.name),
      bio: '',
      diplomas: [],
      is_president: false,
      is_active: true,
    };

    this.api.createResource<any>('team', payload).subscribe({
      next: (created) => {
        this.teamMembers = [created, ...this.teamMembers];
        void this.alerts.success('Membre ajoute', 'Le nouveau membre a bien ete ajoute.');
      },
      error: () => {
        void this.alerts.error('Ajout impossible', "Le membre n'a pas pu etre ajoute.");
      },
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    const payload = this.toPresidentData();
    const request = payload.id
      ? this.api.updateResource('team', payload.id, payload)
      : this.api.createResource('team', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'Les informations du president ont bien ete mises a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Les informations du president n ont pas pu etre sauvegardees.');
      },
    });
  }

  private toFormData(member: any) {
    const diplomas = Array.isArray(member?.diplomas) ? member.diplomas : [];
    return {
      pres_name: member?.name ?? '',
      pres_role: member?.role ?? '',
      pres_initials: member?.initials ?? '',
      pres_bio: member?.bio ?? '',
      dip1: diplomas[0] ?? '',
      dip2: diplomas[1] ?? '',
      dip3: diplomas[2] ?? '',
      dip4: diplomas[3] ?? '',
      dip5: diplomas[4] ?? '',
    };
  }

  private toPresidentData() {
    return {
      ...this.president,
      name: this.data.pres_name,
      role: this.data.pres_role,
      initials: this.data.pres_initials,
      bio: this.data.pres_bio,
      diplomas: [this.data.dip1, this.data.dip2, this.data.dip3, this.data.dip4, this.data.dip5].filter(Boolean),
      is_president: true,
      is_active: this.president.is_active ?? true,
    };
  }

  private buildInitials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
