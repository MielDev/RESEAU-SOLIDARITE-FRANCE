import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-evenements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evenements.html',
  styleUrl: './evenements.css',
})
export class Evenements implements OnInit {
  events: any[] = [];

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      if (data.events) {
        this.events = data.events;
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
