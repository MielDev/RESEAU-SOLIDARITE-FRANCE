import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminPageDetailsEditor } from '../shared/admin-page-details-editor/admin-page-details-editor';

@Component({
  selector: 'app-admin-temoignages',
  imports: [CommonModule, FormsModule, RouterModule, AdminPageDetailsEditor],
  templateUrl: './admin-temoignages.html',
  styleUrl: './admin-temoignages.css',
})
export class AdminTemoignages implements OnInit {
  data: any = {};
  saving = false;
  savingTestimonial = false;
  showForm = false;
  editingTestimonial = false;
  testimonials: any[] = [];
  private editingTestimonialId: number | string | null = null;
  private pageData: any = {};

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      page: this.api.getPage('temoignages'),
      testimonials: this.api.listResource('testimonials'),
    }).subscribe(({ page, testimonials }) => {
      this.pageData = page || {};
      this.testimonials = (testimonials || []).map((testimonial) => this.toViewModel(testimonial));
      this.resetFormData();
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

  addNew() {
    this.editingTestimonial = false;
    this.editingTestimonialId = null;
    this.resetNewTestimonialFields();
    this.showForm = true;
  }

  editTestimonial(testimonial: any) {
    this.editingTestimonial = true;
    this.editingTestimonialId = testimonial.id;
    this.data.new_prenom = testimonial.name || '';
    this.data.new_profil = testimonial.profile || 'étudiant(e)';
    this.data.new_initiales = testimonial.initials || '';
    this.data.new_temoignage = testimonial.text || '';
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  publishTestimonial() {
    if (this.savingTestimonial) return;

    const payload = this.toTestimonialPayload();
    if (!payload.first_name || !payload.quote) {
      void this.alerts.error('Champs obligatoires', 'Le prenom et le temoignage sont obligatoires.');
      return;
    }

    this.savingTestimonial = true;
    const request = this.editingTestimonial && this.editingTestimonialId
      ? this.api.updateResource('testimonials', this.editingTestimonialId, payload)
      : this.api.createResource('testimonials', payload);

    request.subscribe({
      next: () => {
        this.savingTestimonial = false;
        this.showForm = false;
        this.editingTestimonial = false;
        this.editingTestimonialId = null;
        this.loadData();
        void this.alerts.success('Temoignage enregistre', 'La liste des temoignages a bien ete mise a jour.');
      },
      error: () => {
        this.savingTestimonial = false;
        void this.alerts.error('Enregistrement impossible', 'Ce temoignage n a pas pu etre sauvegarde.');
      },
    });
  }

  async deleteTestimonial(testimonial: any) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer ce temoignage ?',
      text: 'Ce temoignage ne sera plus affiche apres suppression.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) return;

    this.api.deleteResource('testimonials', testimonial.id).subscribe({
      next: () => {
        this.loadData();
        void this.alerts.success('Temoignage supprime', 'La liste a ete mise a jour.');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', 'Ce temoignage n a pas pu etre supprime.');
      },
    });
  }

  private resetFormData() {
    this.data = {
      ta_title: this.pageData?.cta?.title ?? '',
      ta_desc: this.pageData?.cta?.text ?? '',
      ta_btn: this.pageData?.cta?.label ?? '',
      new_prenom: '',
      new_profil: 'étudiant(e)',
      new_initiales: '',
      new_temoignage: '',
    };
  }

  private resetNewTestimonialFields() {
    this.data.new_prenom = '';
    this.data.new_profil = 'étudiant(e)';
    this.data.new_initiales = '';
    this.data.new_temoignage = '';
  }

  private toViewModel(testimonial: any) {
    return {
      ...testimonial,
      name: testimonial.first_name ?? testimonial.name ?? '',
      text: testimonial.quote ?? testimonial.text ?? '',
      status: testimonial.is_published === false ? 'Brouillon' : 'Publie',
    };
  }

  private toTestimonialPayload() {
    const firstName = String(this.data.new_prenom || '').trim();
    return {
      first_name: firstName,
      initials: String(this.data.new_initiales || this.buildInitials(firstName)).trim().slice(0, 4),
      profile: this.data.new_profil || 'étudiant(e)',
      quote: String(this.data.new_temoignage || '').trim(),
      is_published: true,
      sort_order: this.testimonials.length,
    };
  }

  private buildInitials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
