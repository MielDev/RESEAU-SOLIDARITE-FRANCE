import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-temoignages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './temoignages.html',
  styleUrl: './temoignages.css',
})
export class Temoignages implements OnInit {
  pageContent: any = null;
  testimonials: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      this.testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  getQuoteColor(testimonial: any): string {
    return testimonial?.color1 || '#2F5DFF';
  }

  getAvatarBackground(testimonial: any): string {
    const color1 = testimonial?.color1 || '#2F5DFF';
    const color2 = testimonial?.color2 || '#1E3A8A';
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }

  getInitials(testimonial: any): string {
    if (testimonial?.initials) {
      return testimonial.initials;
    }

    if (testimonial?.first_name) {
      return testimonial.first_name.charAt(0).toUpperCase();
    }

    return '?';
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
