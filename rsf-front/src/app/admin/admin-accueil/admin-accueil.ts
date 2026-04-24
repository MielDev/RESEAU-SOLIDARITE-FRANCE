import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

type AdminField = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  type?: 'text' | 'textarea';
};

type AdminActionButton = {
  text: string;
  href: string;
  style: string;
};

type AdminStat = {
  value: string;
  label: string;
  color: string;
};

type AdminServiceCard = {
  icon: string;
  title: string;
  description: string;
};

@Component({
  selector: 'app-admin-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-accueil.html',
  styleUrl: './admin-accueil.css',
})
export class AdminAccueil implements OnDestroy {
  saveState: 'idle' | 'saving' | 'saved' = 'idle';

  readonly buttonStyles = ['Bleu primaire', 'Orange accent', 'Vert support', 'Contour'];
  readonly statColors = ['Bleu', 'Orange', 'Vert'];

  heroFields: AdminField[] = [
    {
      id: 'hero_badge',
      label: 'Badge / Etiquette',
      value: 'Association a but non lucratif - Rennes',
      hint: 'Petit texte au-dessus du titre principal.',
    },
    { id: 'hero_title1', label: 'Titre principal - ligne 1', value: 'Unis pour aider,' },
    { id: 'hero_title2', label: 'Titre principal - ligne 2', value: 'ensemble' },
    { id: 'hero_title3', label: 'Titre principal - ligne 3', value: 'pour avancer' },
    {
      id: 'hero_desc',
      label: 'Description',
      value:
        'Nous accompagnons les etudiants, les salaries et les personnes en situation de precarite dans leurs demarches administratives, leur insertion professionnelle et leur vie quotidienne en France.',
      type: 'textarea',
    },
  ];

  actionButtons: AdminActionButton[] = [
    { text: 'Decouvrir nos missions', href: '/nos-missions', style: 'Bleu primaire' },
    { text: 'Rejoindre le reseau', href: '/nous-rejoindre', style: 'Contour' },
    { text: 'Faire un don', href: '/don', style: 'Orange accent' },
  ];

  stats: AdminStat[] = [
    { value: '100+', label: 'Membres actifs', color: 'Bleu' },
    { value: '5', label: "Domaines d'action", color: 'Orange' },
    { value: 'Infini', label: 'Solidarite', color: 'Vert' },
  ];

  serviceCards: AdminServiceCard[] = [
    {
      icon: '📋',
      title: 'Aide administrative',
      description: 'CAF, titre de sejour, logement, carte vitale et accompagnement administratif.',
    },
    {
      icon: '💼',
      title: 'Emploi et formation',
      description: 'CV, entretiens, alternance et orientation vers les parcours utiles.',
    },
    {
      icon: '🤝',
      title: "Reseau d'entraide",
      description: 'Une communaute solidaire pour ecouter, orienter et soutenir durablement.',
    },
  ];

  ctaFields: AdminField[] = [
    {
      id: 'cta_title',
      label: "Titre d'appel a l'action",
      value: 'Ensemble, construisons une solidarite qui change des vies.',
    },
    {
      id: 'cta_sub',
      label: 'Sous-titre',
      value: 'Rejoignez Reseau Solidarite France en tant que benevole, membre ou donateur.',
    },
  ];

  private saveTimeoutId?: number;

  get saveLabel() {
    if (this.saveState === 'saving') {
      return 'Enregistrement...';
    }

    if (this.saveState === 'saved') {
      return 'Enregistre';
    }

    return 'Brouillon';
  }

  simulateSave() {
    if (this.saveTimeoutId) {
      window.clearTimeout(this.saveTimeoutId);
    }

    this.saveState = 'saving';

    this.saveTimeoutId = window.setTimeout(() => {
      this.saveState = 'saved';

      this.saveTimeoutId = window.setTimeout(() => {
        this.saveState = 'idle';
        this.saveTimeoutId = undefined;
      }, 2200);
    }, 800);
  }

  ngOnDestroy() {
    if (this.saveTimeoutId) {
      window.clearTimeout(this.saveTimeoutId);
    }
  }
}
