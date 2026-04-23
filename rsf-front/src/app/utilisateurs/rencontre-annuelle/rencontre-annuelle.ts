import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rencontre-annuelle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rencontre-annuelle.html',
  styleUrl: './rencontre-annuelle.css',
})
export class RencontreAnnuelle implements OnInit {
  pageContent: any = null;
  annualEvent: any = null;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      const events = Array.isArray(data.events) ? data.events.map((event: any) => this.normalizeEvent(event)) : [];
      this.annualEvent = events.find((event: any) => event.is_featured) || events[0] || null;
      setTimeout(() => this.setupIntersectionObserver(), 50);
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

  formatTimeRange(start?: string, end?: string): string {
    if (start && end) {
      return `${start} a ${end}`;
    }

    return start || end || '';
  }

  isRouterLink(href?: string): boolean {
    return typeof href === 'string' && href.startsWith('/');
  }

  private normalizeEvent(event: any): any {
    return {
      ...event,
      program: Array.isArray(event?.program)
        ? [...event.program].sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
        : [],
    };
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

    setTimeout(() => {
      elements.forEach((el) => observer.observe(el));
    }, 100);
  }
}
