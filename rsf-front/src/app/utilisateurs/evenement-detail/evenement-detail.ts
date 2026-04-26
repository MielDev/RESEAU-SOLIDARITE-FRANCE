import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-evenement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evenement-detail.html',
  styleUrl: './evenement-detail.css',
})
export class EvenementDetail implements OnInit {
  pageContent: any = null;
  event: any = null;
  relatedEvents: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      const eventId = Number(this.route.snapshot.paramMap.get('id'));
      const events = Array.isArray(data.events) ? data.events.map((event: any) => this.normalizeEvent(event)) : [];

      this.pageContent = data.pageContent ?? null;
      this.event = events.find((event: any) => Number(event.id) === eventId) || null;
      this.relatedEvents = this.sortEvents(events.filter((event: any) => Number(event.id) !== eventId)).slice(0, 3);

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

  getCoverPhoto(event: any): any | null {
    return Array.isArray(event?.photos) && event.photos.length ? event.photos[0] : null;
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
      photos: Array.isArray(event?.photos)
        ? [...event.photos]
            .sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
            .filter((photo: any) => photo?.image_url)
        : [],
    };
  }

  private sortEvents(events: any[]) {
    return [...events].sort((a, b) => this.getDateValue(b?.event_date) - this.getDateValue(a?.event_date));
  }

  private getDateValue(date: string) {
    const parsed = date ? new Date(date).getTime() : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
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
