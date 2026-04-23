import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { PublicService } from '../../services/public.service';

type ActionSolidaire = {
  title: string;
  description: string;
  tag: string;
  gradient: string;
  icon: string;
  iconType: 'fa' | 'emoji';
  iconColor: string;
  tagBg: string;
  tagColor: string;
  image?: string | null;
};

const DEFAULT_ACTIONS_SOLIDAIRES: ActionSolidaire[] = [
  {
    title: 'Distribution alimentaire',
    description: 'Nous organisons des distributions de repas et de denrées pour répondre aux besoins les plus urgents.',
    tag: 'Aide directe',
    gradient: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
    icon: 'fas fa-utensils',
    iconType: 'fa',
    iconColor: '#166534',
    tagBg: 'rgba(34, 197, 94, 0.14)',
    tagColor: '#166534',
  },
  {
    title: 'Accompagnement des familles',
    description: 'Nos bénévoles orientent, écoutent et accompagnent les personnes dans leurs démarches du quotidien.',
    tag: 'Soutien',
    gradient: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
    icon: 'fas fa-hands-helping',
    iconType: 'fa',
    iconColor: '#1D4ED8',
    tagBg: 'rgba(59, 130, 246, 0.14)',
    tagColor: '#1D4ED8',
  },
  {
    title: 'Collectes solidaires',
    description: 'Nous mobilisons notre réseau pour collecter vêtements, produits d’hygiène et matériel de première nécessité.',
    tag: 'Mobilisation',
    gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
    icon: 'fas fa-box-open',
    iconType: 'fa',
    iconColor: '#B45309',
    tagBg: 'rgba(245, 158, 11, 0.16)',
    tagColor: '#B45309',
  },
];

@Component({
  selector: 'app-actions-solidaires',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actions-solidaires.html',
  styleUrl: './actions-solidaires.css',
})
export class ActionsSolidaires implements OnInit, OnDestroy {
  actionsSolidaires$!: Observable<ActionSolidaire[]>;
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
  ) {}

  ngOnInit() {
    this.actionsSolidaires$ = this.publicService.getActionsSolidaires().pipe(
      map((actions) =>
        actions
          .filter((action) => action.page_type === 'solidaire')
          .map((action) => this.mapAction(action))
      ),
      map((actions) => actions.length ? actions : DEFAULT_ACTIONS_SOLIDAIRES),
      tap(() => setTimeout(() => this.setupIntersectionObserver(), 100)),
      catchError(() => {
        setTimeout(() => this.setupIntersectionObserver(), 100);
        return of(DEFAULT_ACTIONS_SOLIDAIRES);
      })
    );
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private mapAction(action: any): ActionSolidaire {
    const rawIcon = action?.icon || 'fas fa-handshake-angle';
    const isFontAwesomeIcon = typeof rawIcon === 'string' && rawIcon.includes('fa-');

    return {
      title: action?.title || 'Action solidaire',
      description: action?.description || 'Une action concrète menée par notre réseau sur le terrain.',
      tag: action?.category || 'Action solidaire',
      gradient: action?.gradient || 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
      icon: rawIcon,
      iconType: isFontAwesomeIcon ? 'fa' : 'emoji',
      iconColor: action?.icon_color || '#166534',
      tagBg: action?.tag_bg || 'rgba(34, 197, 94, 0.14)',
      tagColor: action?.tag_color || '#166534',
      image: action?.image || null,
    };
  }

  private setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => this.renderer.addClass(el, 'visible'));
      return;
    }

    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => this.observer?.observe(el));
  }
}
