import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-nos-missions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nos-missions.html',
  styleUrl: './nos-missions.css',
})
export class NosMissions implements OnInit {
  missions: any[] = [];

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      if (data.missions) {
        this.missions = data.missions.map((m: any) => ({
          ...m,
          cardClass: m.cardClass || `card-${m.color_name || 'primary'}`,
          iconBoxClass: m.iconBoxClass || `box-${m.color_name || 'primary'}`,
          points: m.points || (m.items ? m.items.map((i: any) => i.text) : [])
        }));
        
        // On attend que le DOM soit mis à jour par Angular
        setTimeout(() => this.setupIntersectionObserver(), 100);
      }
    });
  }

  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');
    
    // Si l'IntersectionObserver n'est pas supporté, on affiche tout
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => this.renderer.addClass(el, 'visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            observer.unobserve(entry.target); // On arrête d'observer une fois visible
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }
}
