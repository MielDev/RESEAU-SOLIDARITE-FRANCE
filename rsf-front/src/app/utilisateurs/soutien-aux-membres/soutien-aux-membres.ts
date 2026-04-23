import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-soutien-aux-membres',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './soutien-aux-membres.html',
  styleUrl: './soutien-aux-membres.css',
})
export class SoutienAuxMembres implements OnInit {
  pageContent: any = null;

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
