import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  pageContent: any = null;
  testimonials: any[] = [];
  actualities: any[] = [];
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      if (data.data) {
        this.pageContent = data.data.pageContent;
        this.testimonials = data.data.testimonials?.slice(0, 3) || [];
        this.actualities = data.data.actualities?.slice(0, 3) || [];
        
        setTimeout(() => this.setupIntersectionObserver(), 100);
      }
    });
  }

  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');
    
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => this.renderer.addClass(el, 'visible'));
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

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
