import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-don',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './don.html',
  styleUrl: './don.css',
})
export class Don implements OnInit {
  pageContent: any = null;
  donModes: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      this.donModes = Array.isArray(data.donModes) ? data.donModes : [];
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  isRouterLink(href?: string): boolean {
    return typeof href === 'string' && href.startsWith('/');
  }

  getButtonClass(index: number): string {
    const classes = ['btn btn-primary btn-sm', 'btn btn-secondary btn-sm', 'btn btn-support btn-sm', 'btn btn-accent btn-sm'];
    return classes[index % classes.length];
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
