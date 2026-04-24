import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ButtonStyle = 'primary' | 'accent' | 'support' | 'outline';
type StatColor = 'blue' | 'orange' | 'green';

interface HeroForm {
  badge: string;
  title1: string;
  title2: string;
  title3: string;
  description: string;
}

interface CtaButton {
  text: string;
  href: string;
  style: ButtonStyle;
}

interface HeroStat {
  value: string;
  label: string;
  color: StatColor;
}

interface HeroCard {
  icon: string;
  title: string;
  description: string;
}

interface CtaBanner {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-admin-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-accueil.html',
  styleUrl: './admin-accueil.css',
})
export class AdminAccueil {
  readonly buttonStyles: { value: ButtonStyle; label: string }[] = [
    { value: 'primary', label: 'Bleu primaire' },
    { value: 'accent', label: 'Orange accent' },
    { value: 'support', label: 'Vert support' },
    { value: 'outline', label: 'Contour' },
  ];

  readonly statColors: { value: StatColor; label: string }[] = [
    { value: 'blue', label: 'Bleu' },
    { value: 'orange', label: 'Orange' },
    { value: 'green', label: 'Vert' },
  ];

  hero: HeroForm = {
    badge: 'Association a but non lucratif - Rennes',
    title1: 'Unis pour aider,',
    title2: 'ensemble',
    title3: 'pour avancer',
    description:
      'Nous accompagnons les etudiants, les salaries et les personnes en situation de precarite dans leurs demarches administratives, leur insertion professionnelle et leur vie quotidienne en France.',
  };

  buttons: CtaButton[] = [
    { text: 'Decouvrir nos missions', href: 'nos-missions.html', style: 'primary' },
    { text: 'Rejoindre le reseau', href: 'nous-rejoindre.html', style: 'outline' },
    { text: 'Faire un don', href: 'don.html', style: 'accent' },
  ];

  stats: HeroStat[] = [
    { value: '100+', label: 'Membres actifs', color: 'blue' },
    { value: '5', label: "Domaines d'action", color: 'orange' },
    { value: 'Infini', label: 'Solidarite', color: 'green' },
  ];

  cards: HeroCard[] = [
    {
      icon: 'fas fa-clipboard-list',
      title: 'Aide administrative',
      description: 'CAF, titre de sejour, logement, carte vitale - nous vous accompagnons.',
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Emploi et formation',
      description: 'CV, entretiens, alternance, formations certifiantes.',
    },
    {
      icon: 'fas fa-handshake-angle',
      title: "Reseau d'entraide",
      description: 'Une communaute soudee ou chacun peut trouver ecoute et soutien.',
    },
  ];

  cta: CtaBanner = {
    title: 'Ensemble, construisons une solidarite qui change des vies.',
    subtitle: 'Rejoignez Reseau Solidarite France en tant que benevole, membre ou donateur.',
  };

  isSaving = false;
  toastMessage = '';
  showToast = false;

  private toastTimer?: ReturnType<typeof setTimeout>;

  save(): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      this.isSaving = false;
      this.notify('Modifications enregistrees');
    }, 800);
  }

  private notify(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
