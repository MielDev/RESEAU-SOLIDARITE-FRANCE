import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  pageContent: any = null;
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  getButtonClass(action: any): string {
    switch (action?.variant) {
      case 'outline':
        return 'btn btn-outline';
      case 'accent':
        return 'btn btn-accent';
      case 'secondary':
        return 'btn btn-secondary';
      case 'support':
        return 'btn btn-support';
      default:
        return 'btn btn-primary';
    }
  }

  getStatValue(stat: any): string {
    if (!stat) {
      return '';
    }

    if (stat.value !== undefined && stat.value !== null) {
      return String(stat.value);
    }

    const key = stat.key;
    return key ? String(this.pageContent?.stats?.[key] ?? '') : '';
  }

  setupIntersectionObserver() {
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
