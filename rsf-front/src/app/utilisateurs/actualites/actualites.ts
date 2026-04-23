import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actualites.html',
  styleUrl: './actualites.css',
})
export class Actualites implements OnInit {
  pageContent: any = null;
  actualities: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      this.actualities = Array.isArray(data.actualities) ? data.actualities : [];
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);
  }

  isRouterLink(href?: string): boolean {
    return typeof href === 'string' && href.startsWith('/');
  }

  getLinkTarget(href?: string): string | null {
    return typeof href === 'string' && /^https?:/i.test(href) ? '_blank' : null;
  }

  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => this.renderer.addClass(el, 'visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }
}
