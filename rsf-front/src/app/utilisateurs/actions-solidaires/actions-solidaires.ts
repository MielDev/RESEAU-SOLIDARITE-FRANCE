import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'app-actions-solidaires',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actions-solidaires.html',
  styleUrl: './actions-solidaires.css',
})
export class ActionsSolidaires implements OnInit, OnDestroy {
  pageContent: any = null;
  actionsSolidaires: ActionSolidaire[] = [];
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      const actions = Array.isArray(data.actions) ? data.actions : [];
      this.actionsSolidaires = actions.map((action: any) => this.mapAction(action));
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private mapAction(action: any): ActionSolidaire {
    const rawIcon = action?.icon || '';
    const isFontAwesomeIcon = typeof rawIcon === 'string' && rawIcon.includes('fa-');

    return {
      title: action?.title || '',
      description: action?.description || '',
      tag: action?.category || '',
      gradient: action?.gradient || '',
      icon: rawIcon,
      iconType: isFontAwesomeIcon ? 'fa' : 'emoji',
      iconColor: action?.icon_color || '',
      tagBg: action?.tag_bg || '',
      tagColor: action?.tag_color || '',
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
