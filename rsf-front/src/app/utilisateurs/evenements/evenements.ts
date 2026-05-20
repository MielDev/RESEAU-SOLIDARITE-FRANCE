import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evenements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evenements.html',
  styleUrl: './evenements.css',
})
export class Evenements implements OnInit {
  pageContent: any = null;
  events: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      const events = Array.isArray(data.events) ? data.events.map((event: any) => this.normalizeEvent(event)) : [];
      this.events = this.sortEvents(events);

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

  formatTimeRange(start?: string, end?: string): string {
    if (start && end) {
      return `${start} - ${end}`;
    }

    return start || end || '';
  }

  getEventTitle(event: any): string {
    const edition = event?.edition ? `${event.edition} - ` : '';
    return `${edition}${event?.title || ''}`.trim();
  }

  getEventUrl(event: any): string {
    return `/actualites/${event?.id}`;
  }

  getCoverPhoto(event: any): any | null {
    return Array.isArray(event?.photos) && event.photos.length ? event.photos[0] : null;
  }

  private normalizeEvent(event: any): any {
    return {
      ...event,
      program: Array.isArray(event?.program)
        ? [...event.program].sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
        : [],
      photos: Array.isArray(event?.photos)
        ? [...event.photos]
            .sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
            .filter((photo: any) => photo?.image_url)
        : [],
    };
  }

  private sortEvents(events: any[]) {
    return [...events].sort((a, b) => {
      const dateA = this.getDateValue(a?.event_date);
      const dateB = this.getDateValue(b?.event_date);

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return this.getEditionNumber(b?.edition) - this.getEditionNumber(a?.edition);
    });
  }

  private getDateValue(date: string) {
    const parsed = date ? new Date(date).getTime() : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private getEditionNumber(edition: string) {
    const match = String(edition || '').match(/\d+/);
    return match ? Number(match[0]) : 0;
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
