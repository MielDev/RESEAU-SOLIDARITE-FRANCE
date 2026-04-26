import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-temoignages',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-temoignages.html',
  styleUrl: './admin-temoignages.css',
})
export class AdminTemoignages implements OnInit {
  data: any = {};
  saving = false;
  showForm = false;
  editingTestimonial = false;
  testimonials = [
    { initials: 'S', name: 'Sarah', profile: 'Etudiante', text: "A mon arrivee a Rennes, j'etais perdue. L'association m'a aidee pour les premieres demarches." },
    { initials: 'F', name: 'Franck', profile: 'Salarie', text: "J'ai ete oriente par le Reseau vers une formation en alternance." },
    { initials: 'L', name: 'Lucie', profile: 'Benevole', text: "Rejoindre l'association a ete l'une de mes meilleures decisions." },
    { initials: 'J', name: 'Judith', profile: 'Etudiante', text: "J'ai pu renouveler mon titre de sejour avec un vrai accompagnement." },
    { initials: 'H', name: 'Helene', profile: 'Etudiante', text: "L'association m'a apporte une ecoute et un soutien concret." },
    { initials: 'C', name: 'Capello', profile: 'Etudiant', text: "J'ai pu ameliorer mon CV et me preparer aux entretiens." },
    { initials: 'E', name: 'Erwan', profile: 'Etudiant', text: "Les rencontres organisees m'ont aide a sortir de l'isolement." },
    { initials: 'J', name: 'Josue', profile: 'Etudiant', text: "J'apprecie le serieux et la disponibilite de l'equipe." },
    { initials: 'S', name: 'Sandree', profile: 'Etudiante', text: "J'ai ete guidee dans la constitution de mon dossier." },
    { initials: 'T', name: 'Teddy', profile: 'Etudiant', text: "Je ne comprenais rien aux demarches administratives avant d'etre aide." },
    { initials: 'A', name: 'Ariane', profile: 'Etudiante', text: "Au-dela de l'aide concrete, j'ai trouve une vraie ecoute." },
    { initials: 'P', name: 'Parfait', profile: 'Etudiant', text: "Integrer le groupe m'a permis de rencontrer des personnes formidables." },
  ];
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

  addNew() {
    this.editingTestimonial = false;
    this.data.new_prenom = '';
    this.data.new_profil = 'etudiant(e)';
    this.data.new_initiales = '';
    this.data.new_temoignage = '';
    this.showForm = true;
  }

  editTestimonial(testimonial: any) {
    this.editingTestimonial = true;
    this.data.new_prenom = testimonial.name || '';
    this.data.new_profil = testimonial.profile || 'etudiant(e)';
    this.data.new_initiales = testimonial.initials || '';
    this.data.new_temoignage = testimonial.text || '';
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  publishTestimonial() {
    this.showForm = false;
    void this.alerts.success('Temoignage prepare', 'Le formulaire est pret a etre branche sur la collection temoignages.');
  }
}
